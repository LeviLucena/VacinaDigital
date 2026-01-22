import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { VaccinationCard, PatientInfo, VaccinationRecord } from "@/types/vaccination";
import { useToast } from "@/hooks/use-toast";

const emptyPatient: PatientInfo = {
  name: "",
  birthDate: "",
  cpf: "",
  motherName: "",
};

const emptyCard: VaccinationCard = {
  patient: emptyPatient,
  records: [],
  extractedAt: new Date().toISOString(),
};

export function useVaccinationExtractor() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardData, setCardData] = useState<VaccinationCard>(emptyCard);
  const [hasProcessed, setHasProcessed] = useState(false);
  const { toast } = useToast();

  const extractFromImage = useCallback(async (imageBase64: string) => {
    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke("extract-vaccination", {
        body: { imageBase64 },
      });

      if (error) {
        console.error("Extraction error:", error);
        toast({
          title: "Erro ao processar imagem",
          description: error.message || "Não foi possível extrair os dados da caderneta.",
          variant: "destructive",
        });
        return;
      }

      if (data.error) {
        toast({
          title: "Erro",
          description: data.error,
          variant: "destructive",
        });
        return;
      }

      setCardData({
        patient: data.patient || emptyPatient,
        records: data.records || [],
        extractedAt: data.extractedAt,
        imageUrl: imageBase64,
      });
      setHasProcessed(true);

      toast({
        title: "Dados extraídos com sucesso!",
        description: `${data.records?.length || 0} registros de vacinação encontrados.`,
      });
    } catch (err) {
      console.error("Error:", err);
      toast({
        title: "Erro de conexão",
        description: "Não foi possível conectar ao serviço de processamento.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }, [toast]);

  const updatePatient = useCallback((patient: PatientInfo) => {
    setCardData((prev) => ({ ...prev, patient }));
  }, []);

  const updateRecords = useCallback((records: VaccinationRecord[]) => {
    setCardData((prev) => ({ ...prev, records }));
  }, []);

  const reset = useCallback(() => {
    setCardData(emptyCard);
    setHasProcessed(false);
  }, []);

  return {
    isProcessing,
    cardData,
    hasProcessed,
    extractFromImage,
    updatePatient,
    updateRecords,
    reset,
  };
}
