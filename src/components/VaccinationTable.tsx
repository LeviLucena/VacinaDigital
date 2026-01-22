import { useState } from "react";
import { Pencil, Trash2, Plus, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { VaccinationRecord } from "@/types/vaccination";

interface VaccinationTableProps {
  records: VaccinationRecord[];
  onUpdate: (records: VaccinationRecord[]) => void;
  editable?: boolean;
}

export function VaccinationTable({ records, onUpdate, editable = true }: VaccinationTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingRecord, setEditingRecord] = useState<VaccinationRecord | null>(null);

  const handleEdit = (record: VaccinationRecord) => {
    setEditingId(record.id);
    setEditingRecord({ ...record });
  };

  const handleSave = () => {
    if (editingRecord) {
      onUpdate(records.map(r => r.id === editingRecord.id ? editingRecord : r));
    }
    setEditingId(null);
    setEditingRecord(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditingRecord(null);
  };

  const handleDelete = (id: string) => {
    onUpdate(records.filter(r => r.id !== id));
  };

  const handleAdd = () => {
    const newRecord: VaccinationRecord = {
      id: crypto.randomUUID(),
      vaccine: "",
      date: "",
      batch: "",
      location: "",
      dose: "",
      notes: "",
    };
    onUpdate([...records, newRecord]);
    handleEdit(newRecord);
  };

  const updateField = (field: keyof VaccinationRecord, value: string) => {
    if (editingRecord) {
      setEditingRecord({ ...editingRecord, [field]: value });
    }
  };

  if (records.length === 0 && !editable) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhum registro de vacinação encontrado.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border overflow-hidden shadow-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">Vacina</TableHead>
              <TableHead className="font-semibold">Dose</TableHead>
              <TableHead className="font-semibold">Data</TableHead>
              <TableHead className="font-semibold">Lote</TableHead>
              <TableHead className="font-semibold">Local</TableHead>
              <TableHead className="font-semibold">Observações</TableHead>
              {editable && <TableHead className="w-24 no-print" />}
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((record) => (
              <TableRow key={record.id} className="animate-slide-up">
                {editingId === record.id ? (
                  <>
                    <TableCell>
                      <Input
                        value={editingRecord?.vaccine || ""}
                        onChange={(e) => updateField("vaccine", e.target.value)}
                        placeholder="Nome da vacina"
                        className="h-8"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={editingRecord?.dose || ""}
                        onChange={(e) => updateField("dose", e.target.value)}
                        placeholder="1ª, 2ª, Reforço..."
                        className="h-8 w-20"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={editingRecord?.date || ""}
                        onChange={(e) => updateField("date", e.target.value)}
                        placeholder="DD/MM/AAAA"
                        className="h-8 w-28"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={editingRecord?.batch || ""}
                        onChange={(e) => updateField("batch", e.target.value)}
                        placeholder="Lote"
                        className="h-8 w-24"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={editingRecord?.location || ""}
                        onChange={(e) => updateField("location", e.target.value)}
                        placeholder="Local de aplicação"
                        className="h-8"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={editingRecord?.notes || ""}
                        onChange={(e) => updateField("notes", e.target.value)}
                        placeholder="Observações"
                        className="h-8"
                      />
                    </TableCell>
                    <TableCell className="no-print">
                      <div className="flex gap-1">
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-secondary" onClick={handleSave}>
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={handleCancel}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </>
                ) : (
                  <>
                    <TableCell className="font-medium">{record.vaccine || "-"}</TableCell>
                    <TableCell>{record.dose || "-"}</TableCell>
                    <TableCell>{record.date || "-"}</TableCell>
                    <TableCell className="font-mono text-sm">{record.batch || "-"}</TableCell>
                    <TableCell>{record.location || "-"}</TableCell>
                    <TableCell className="text-muted-foreground">{record.notes || "-"}</TableCell>
                    {editable && (
                      <TableCell className="no-print">
                        <div className="flex gap-1">
                          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleEdit(record)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => handleDelete(record.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {editable && (
        <Button variant="outline" onClick={handleAdd} className="gap-2 no-print">
          <Plus className="h-4 w-4" />
          Adicionar Vacina
        </Button>
      )}
    </div>
  );
}
