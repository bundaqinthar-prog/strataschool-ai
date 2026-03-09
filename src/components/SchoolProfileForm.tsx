import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface SchoolProfile {
  schoolName: string;
  city: string;
  educationLevel: string;
  studentCount: string;
  targetParents: string;
  tuitionRange: string;
  uniquePrograms: string;
  competitors?: string;
  currentEnrollment?: string;
  targetAudience?: string;
  keyThemes?: string;
}

interface SchoolProfileFormProps {
  title: string;
  description: string;
  onSubmit: (data: SchoolProfile) => void;
  isLoading?: boolean;
  extraFields?: Array<"competitors" | "currentEnrollment" | "targetAudience" | "keyThemes">;
}

export function SchoolProfileForm({ title, description, onSubmit, isLoading, extraFields = [] }: SchoolProfileFormProps) {
  const [form, setForm] = useState<SchoolProfile>({
    schoolName: "",
    city: "",
    educationLevel: "",
    studentCount: "",
    targetParents: "",
    tuitionRange: "",
    uniquePrograms: "",
    competitors: "",
    currentEnrollment: "",
    targetAudience: "",
    keyThemes: "",
  });

  const update = (key: keyof SchoolProfile, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Nama Sekolah</Label>
              <Input value={form.schoolName} onChange={(e) => update("schoolName", e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Kota</Label>
              <Input value={form.city} onChange={(e) => update("city", e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Jenjang Pendidikan</Label>
              <Select value={form.educationLevel} onValueChange={(v) => update("educationLevel", v)}>
                <SelectTrigger><SelectValue placeholder="Pilih jenjang" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="TK">TK (Taman Kanak-Kanak)</SelectItem>
                  <SelectItem value="SD">SD (Sekolah Dasar)</SelectItem>
                  <SelectItem value="SMP">SMP (Sekolah Menengah Pertama)</SelectItem>
                  <SelectItem value="SMA">SMA (Sekolah Menengah Atas)</SelectItem>
                  <SelectItem value="Multiple">Multi Jenjang</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Jumlah Siswa</Label>
              <Input type="number" value={form.studentCount} onChange={(e) => update("studentCount", e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Target Orang Tua</Label>
              <Input value={form.targetParents} onChange={(e) => update("targetParents", e.target.value)} placeholder="cth: Profesional kelas menengah" required />
            </div>
            <div className="space-y-2">
              <Label>Kisaran Biaya SPP</Label>
              <Input value={form.tuitionRange} onChange={(e) => update("tuitionRange", e.target.value)} placeholder="cth: Rp 5-10 juta/tahun" required />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Program Unggulan</Label>
            <Textarea value={form.uniquePrograms} onChange={(e) => update("uniquePrograms", e.target.value)} placeholder="cth: Program bilingual, fokus STEM, nilai-nilai Islami..." required />
          </div>
          {extraFields.includes("competitors") && (
            <div className="space-y-2">
              <Label>Kompetitor yang Diketahui</Label>
              <Textarea value={form.competitors} onChange={(e) => update("competitors", e.target.value)} placeholder="Sebutkan sekolah kompetitor dan informasi yang Anda ketahui..." />
            </div>
          )}
          {extraFields.includes("currentEnrollment") && (
            <div className="space-y-2">
              <Label>Tantangan Pendaftaran Saat Ini</Label>
              <Textarea value={form.currentEnrollment} onChange={(e) => update("currentEnrollment", e.target.value)} placeholder="Jelaskan situasi pendaftaran saat ini..." />
            </div>
          )}
          {extraFields.includes("targetAudience") && (
            <div className="space-y-2">
              <Label>Detail Target Audiens</Label>
              <Textarea value={form.targetAudience} onChange={(e) => update("targetAudience", e.target.value)} placeholder="Jelaskan profil orang tua yang ideal..." />
            </div>
          )}
          {extraFields.includes("keyThemes") && (
            <div className="space-y-2">
              <Label>Tema Konten Utama</Label>
              <Textarea value={form.keyThemes} onChange={(e) => update("keyThemes", e.target.value)} placeholder="cth: Keunggulan akademik, kegiatan siswa, tips parenting..." />
            </div>
          )}
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Sedang membuat..." : "Buat Laporan AI"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}