import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { PatientInfo } from "@/types/vaccination";

interface PatientFormProps {
  patient: PatientInfo;
  onUpdate: (patient: PatientInfo) => void;
  editable?: boolean;
}

export function PatientForm({ patient, onUpdate, editable = true }: PatientFormProps) {
  const handleChange = (field: keyof PatientInfo, value: string) => {
    onUpdate({ ...patient, [field]: value });
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="name">Nome Completo</Label>
        <Input
          id="name"
          value={patient.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="Nome do paciente"
          readOnly={!editable}
          className={!editable ? "bg-muted" : ""}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="birthDate">Data de Nascimento</Label>
        <Input
          id="birthDate"
          value={patient.birthDate}
          onChange={(e) => handleChange("birthDate", e.target.value)}
          placeholder="DD/MM/AAAA"
          readOnly={!editable}
          className={!editable ? "bg-muted" : ""}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="cpf">CPF</Label>
        <Input
          id="cpf"
          value={patient.cpf}
          onChange={(e) => handleChange("cpf", e.target.value)}
          placeholder="000.000.000-00"
          readOnly={!editable}
          className={!editable ? "bg-muted" : ""}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="motherName">Nome da Mãe</Label>
        <Input
          id="motherName"
          value={patient.motherName}
          onChange={(e) => handleChange("motherName", e.target.value)}
          placeholder="Nome completo da mãe"
          readOnly={!editable}
          className={!editable ? "bg-muted" : ""}
        />
      </div>
    </div>
  );
}
