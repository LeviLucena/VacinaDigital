import { useState, useRef } from "react";
import { FileDown, Printer, RotateCcw, FileText } from "lucide-react";
import { Header } from "@/components/Header";
import { UploadArea } from "@/components/UploadArea";
import { VaccinationTable } from "@/components/VaccinationTable";
import { PatientForm } from "@/components/PatientForm";
import { DocumentPreview } from "@/components/DocumentPreview";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useVaccinationExtractor } from "@/hooks/useVaccinationExtractor";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("upload");
  const documentRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const {
    isProcessing,
    cardData,
    hasProcessed,
    extractFromImage,
    updatePatient,
    updateRecords,
    reset,
  } = useVaccinationExtractor();

  const handleImageUpload = async (_file: File, preview: string) => {
    setImagePreview(preview);
    await extractFromImage(preview);
    setActiveTab("edit");
  };

  const handleClear = () => {
    setImagePreview(null);
    reset();
    setActiveTab("upload");
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    if (!documentRef.current) return;

    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(documentRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
      });
      
      const link = document.createElement("a");
      link.download = `caderneta-vacinacao-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();

      toast({
        title: "Download iniciado",
        description: "O documento foi salvo como imagem.",
      });
    } catch (err) {
      console.error("Download error:", err);
      toast({
        title: "Erro ao baixar",
        description: "Não foi possível gerar o arquivo. Tente imprimir como PDF.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8">
        <div className="max-w-5xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Digitalize sua Caderneta de Vacinação
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Envie uma foto da sua caderneta de vacinação antiga e nosso sistema
              irá extrair automaticamente todas as informações de vacinas, datas e lotes.
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 no-print">
              <TabsTrigger value="upload" className="gap-2">
                <FileText className="h-4 w-4" />
                Enviar
              </TabsTrigger>
              <TabsTrigger value="edit" disabled={!hasProcessed}>
                Editar
              </TabsTrigger>
              <TabsTrigger value="preview" disabled={!hasProcessed}>
                Documento
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-1 h-6 bg-primary rounded" />
                    Enviar Foto da Caderneta
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <UploadArea
                    onImageUpload={handleImageUpload}
                    currentImage={imagePreview}
                    onClear={handleClear}
                    isProcessing={isProcessing}
                  />
                </CardContent>
              </Card>

              <div className="grid gap-4 sm:grid-cols-3">
                <Card className="bg-muted/30">
                  <CardContent className="pt-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl">📷</span>
                    </div>
                    <h3 className="font-medium mb-1">1. Fotografe</h3>
                    <p className="text-sm text-muted-foreground">
                      Tire uma foto clara da caderneta
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-muted/30">
                  <CardContent className="pt-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl">🤖</span>
                    </div>
                    <h3 className="font-medium mb-1">2. Processamento</h3>
                    <p className="text-sm text-muted-foreground">
                      IA extrai os dados automaticamente
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-muted/30">
                  <CardContent className="pt-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl">📄</span>
                    </div>
                    <h3 className="font-medium mb-1">3. Documento Digital</h3>
                    <p className="text-sm text-muted-foreground">
                      Salve ou imprima o registro
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="edit" className="space-y-6 no-print">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-1 h-6 bg-primary rounded" />
                    Dados do Paciente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <PatientForm
                    patient={cardData.patient}
                    onUpdate={updatePatient}
                  />
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-1 h-6 bg-secondary rounded" />
                    Registros de Vacinação
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <VaccinationTable
                    records={cardData.records}
                    onUpdate={updateRecords}
                  />
                </CardContent>
              </Card>

              <div className="flex justify-between">
                <Button variant="outline" onClick={handleClear} className="gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Recomeçar
                </Button>
                <Button onClick={() => setActiveTab("preview")} className="gap-2">
                  Ver Documento
                  <FileText className="h-4 w-4" />
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="preview" className="space-y-6">
              <div className="flex justify-end gap-3 no-print">
                <Button variant="outline" onClick={handleDownload} className="gap-2">
                  <FileDown className="h-4 w-4" />
                  Baixar PNG
                </Button>
                <Button onClick={handlePrint} className="gap-2">
                  <Printer className="h-4 w-4" />
                  Imprimir / PDF
                </Button>
              </div>

              <DocumentPreview ref={documentRef} data={cardData} />

              <div className="flex justify-center gap-3 no-print">
                <Button variant="outline" onClick={() => setActiveTab("edit")}>
                  Voltar e Editar
                </Button>
                <Button variant="outline" onClick={handleClear} className="gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Nova Digitalização
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 mt-auto no-print">
        <div className="container text-center text-sm text-muted-foreground">
          <p>Sistema de Digitalização de Cadernetas de Vacinação</p>
          <p className="mt-1">Ministério da Saúde - Governo Federal</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
