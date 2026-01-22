import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64 } = await req.json();

    if (!imageBase64) {
      return new Response(
        JSON.stringify({ error: "Imagem não fornecida" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Use OPENAI_API_KEY environment variable instead of LOVABLE_API_KEY
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Serviço de IA não configurado" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const systemPrompt = `Você é um especialista em análise de cadernetas de vacinação brasileiras. Sua tarefa é extrair todas as informações de vacinação visíveis na imagem.

IMPORTANTE: As cadernetas antigas podem ter formatos variados. Procure por:
- Nomes de vacinas (BCG, DPT, Tríplice, Sabin, Hepatite B, etc.)
- Datas de aplicação (formato DD/MM/AA ou DD/MM/AAAA)
- Números de lote
- Locais de aplicação (siglas de estados, nomes de postos de saúde)
- Rubricas ou assinaturas de profissionais
- Informações do paciente (nome, data de nascimento)

Analise cuidadosamente a letra manuscrita e os carimbos.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analise esta caderneta de vacinação e extraia todas as informações visíveis. Retorne um JSON com a estrutura exata abaixo. Se não conseguir identificar algum campo, deixe como string vazia."
              },
              {
                type: "image_url",
                image_url: { url: imageBase64 }
              }
            ]
          }
        ],
        functions: [
          {
            name: "extract_vaccination_data",
            description: "Extrai dados estruturados de uma caderneta de vacinação",
            parameters: {
              type: "object",
              properties: {
                patient: {
                  type: "object",
                  properties: {
                    name: { type: "string", description: "Nome completo do paciente" },
                    birthDate: { type: "string", description: "Data de nascimento (DD/MM/AAAA)" },
                    cpf: { type: "string", description: "CPF se visível" },
                    motherName: { type: "string", description: "Nome da mãe se visível" }
                  },
                  required: ["name", "birthDate", "cpf", "motherName"]
                },
                records: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      vaccine: { type: "string", description: "Nome da vacina" },
                      date: { type: "string", description: "Data de aplicação (DD/MM/AAAA)" },
                      batch: { type: "string", description: "Número do lote" },
                      location: { type: "string", description: "Local de aplicação" },
                      dose: { type: "string", description: "Dose (1ª, 2ª, 3ª, Reforço)" },
                      notes: { type: "string", description: "Observações adicionais" }
                    },
                    required: ["vaccine", "date", "batch", "location", "dose", "notes"]
                  }
                }
              },
              required: ["patient", "records"]
            }
          }
        ],
        function_call: { name: "extract_vaccination_data" }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Limite de requisições excedido. Tente novamente em alguns minutos." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Erro ao processar imagem" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiResponse = await response.json();
    console.log("AI Response:", JSON.stringify(aiResponse, null, 2));

    const functionCall = aiResponse.choices?.[0]?.message?.function_call;
    if (!functionCall?.arguments) {
      console.error("No function call in response");
      return new Response(
        JSON.stringify({ error: "Não foi possível extrair dados da imagem" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const extractedData = JSON.parse(functionCall.arguments);
    
    // Add unique IDs to records
    const records = extractedData.records.map((record: any, index: number) => ({
      ...record,
      id: crypto.randomUUID()
    }));

    return new Response(
      JSON.stringify({
        patient: extractedData.patient,
        records,
        extractedAt: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ error: "Erro interno ao processar a solicitação" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
