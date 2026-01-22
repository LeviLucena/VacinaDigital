import { forwardRef } from "react";
import { Syringe, CheckCircle } from "lucide-react";
import type { VaccinationCard } from "@/types/vaccination";

interface DocumentPreviewProps {
  data: VaccinationCard;
}

export const DocumentPreview = forwardRef<HTMLDivElement, DocumentPreviewProps>(
  ({ data }, ref) => {
    const formatDate = (date: string) => {
      try {
        return new Date(date).toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      } catch {
        return date;
      }
    };

    return (
      <div ref={ref} className="bg-card p-8 rounded-lg shadow-card print:shadow-none print:p-0">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-primary pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
              <Syringe className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary">
                Registro de Vacinação Digital
              </h1>
              <p className="text-sm text-muted-foreground">
                Ministério da Saúde - Sistema de Digitalização
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 text-secondary">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Documento Digitalizado</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {formatDate(data.extractedAt)}
            </p>
          </div>
        </div>

        {/* Patient Info */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
            <div className="w-1 h-6 bg-primary rounded" />
            Dados do Paciente
          </h2>
          <div className="grid grid-cols-2 gap-4 bg-muted/30 p-4 rounded-lg">
            <div>
              <span className="text-sm text-muted-foreground">Nome:</span>
              <p className="font-medium">{data.patient.name || "Não informado"}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Data de Nascimento:</span>
              <p className="font-medium">{data.patient.birthDate || "Não informado"}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">CPF:</span>
              <p className="font-medium">{data.patient.cpf || "Não informado"}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Nome da Mãe:</span>
              <p className="font-medium">{data.patient.motherName || "Não informado"}</p>
            </div>
          </div>
        </div>

        {/* Vaccination Records */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
            <div className="w-1 h-6 bg-secondary rounded" />
            Histórico de Vacinação
          </h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-primary text-primary-foreground">
                <th className="p-2 text-left text-sm font-semibold">Vacina</th>
                <th className="p-2 text-left text-sm font-semibold">Dose</th>
                <th className="p-2 text-left text-sm font-semibold">Data</th>
                <th className="p-2 text-left text-sm font-semibold">Lote</th>
                <th className="p-2 text-left text-sm font-semibold">Local</th>
              </tr>
            </thead>
            <tbody>
              {data.records.map((record, index) => (
                <tr 
                  key={record.id} 
                  className={index % 2 === 0 ? "bg-muted/20" : "bg-card"}
                >
                  <td className="p-2 text-sm font-medium">{record.vaccine || "-"}</td>
                  <td className="p-2 text-sm">{record.dose || "-"}</td>
                  <td className="p-2 text-sm">{record.date || "-"}</td>
                  <td className="p-2 text-sm font-mono">{record.batch || "-"}</td>
                  <td className="p-2 text-sm">{record.location || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-border text-center text-xs text-muted-foreground">
          <p>
            Este documento foi gerado pelo Sistema de Digitalização de Cadernetas de Vacinação
          </p>
          <p className="mt-1">
            Ministério da Saúde - Governo Federal
          </p>
        </div>
      </div>
    );
  }
);

DocumentPreview.displayName = "DocumentPreview";
