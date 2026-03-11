import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface AcademicYearSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const defaultYears = ["2024/2025", "2025/2026", "2026/2027"];

export function AcademicYearSelector({ value, onChange }: AcademicYearSelectorProps) {
  const [custom, setCustom] = useState(false);

  return (
    <div className="space-y-2">
      <Label>Tahun Ajaran</Label>
      {custom ? (
        <div className="flex gap-2">
          <Input
            placeholder="cth: 2027/2028"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
          <button
            type="button"
            onClick={() => { setCustom(false); onChange(""); }}
            className="text-xs text-muted-foreground underline whitespace-nowrap"
          >
            Pilih dari daftar
          </button>
        </div>
      ) : (
        <Select value={value} onValueChange={(v) => {
          if (v === "__custom") { setCustom(true); onChange(""); }
          else onChange(v);
        }}>
          <SelectTrigger>
            <SelectValue placeholder="Pilih tahun ajaran" />
          </SelectTrigger>
          <SelectContent>
            {defaultYears.map((y) => (
              <SelectItem key={y} value={y}>{y}</SelectItem>
            ))}
            <SelectItem value="__custom">Lainnya (ketik manual)</SelectItem>
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
