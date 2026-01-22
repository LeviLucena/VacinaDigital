export interface VaccinationRecord {
  id: string;
  vaccine: string;
  date: string;
  batch: string;
  location: string;
  dose: string;
  notes: string;
}

export interface PatientInfo {
  name: string;
  birthDate: string;
  cpf: string;
  motherName: string;
}

export interface VaccinationCard {
  patient: PatientInfo;
  records: VaccinationRecord[];
  extractedAt: string;
  imageUrl?: string;
}
