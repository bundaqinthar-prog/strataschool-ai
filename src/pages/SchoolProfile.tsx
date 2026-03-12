import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Building2, Mail, User, Briefcase, Pencil } from "lucide-react";

const jabatanOptions = [
  "Kepala Sekolah",
  "Ketua Yayasan",
  "Ketua Tim PPDB",
  "Staf Marketing",
  "Guru",
  "Lainnya",
];

export default function SchoolProfile() {
  const { profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    full_name: profile?.full_name || "",
    jabatan: profile?.jabatan || "",
    school_name: profile?.school_name || "",
  });

  const handleOpen = () => {
    setForm({
      full_name: profile?.full_name || "",
      jabatan: profile?.jabatan || "",
      school_name: profile?.school_name || "",
    });
    setOpen(true);
  };

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: form.full_name,
        jabatan: form.jabatan,
        school_name: form.school_name,
        updated_at: new Date().toISOString(),
      })
      .eq("id", profile.id);

    if (error) {
      toast({ title: "Gagal menyimpan", description: error.message, variant: "destructive" });
    } else {
      await refreshProfile();
      toast({ title: "Profil diperbarui!", description: "Data profil sekolah Anda berhasil disimpan." });
      setOpen(false);
    }
    setSaving(false);
  };

  if (!profile) return null;

  const infoItems = [
    { icon: User, label: "Nama Lengkap", value: profile.full_name },
    { icon: Mail, label: "Email", value: profile.email },
    { icon: Briefcase, label: "Jabatan", value: profile.jabatan },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Profil Sekolah</h1>
          <p className="text-muted-foreground mt-1">Kelola informasi akun dan data institusi Anda</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleOpen}>
              <Pencil className="h-4 w-4 mr-2" /> Edit Profil
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Profil</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nama Lengkap</Label>
                <Input id="edit-name" value={form.full_name} onChange={(e) => setForm((p) => ({ ...p, full_name: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-jabatan">Jabatan</Label>
                <Select value={form.jabatan} onValueChange={(v) => setForm((p) => ({ ...p, jabatan: v }))}>
                  <SelectTrigger><SelectValue placeholder="Pilih jabatan" /></SelectTrigger>
                  <SelectContent>
                    {jabatanOptions.map((j) => (
                      <SelectItem key={j} value={j}>{j}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-school">Nama Sekolah</Label>
                <Input id="edit-school" value={form.school_name} onChange={(e) => setForm((p) => ({ ...p, school_name: e.target.value }))} />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Batal</Button>
              </DialogClose>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? "Menyimpan..." : "Simpan"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Account Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="h-5 w-5 text-primary" /> Informasi Akun
          </CardTitle>
          <CardDescription>Data pribadi yang terhubung dengan akun Anda</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            {infoItems.map((item) => (
              <div key={item.label} className="rounded-lg border bg-muted/30 p-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <item.icon className="h-3.5 w-3.5" /> {item.label}
                </div>
                <p className="font-semibold truncate">{item.value || "—"}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Institution Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" /> Data Institusi
          </CardTitle>
          <CardDescription>Informasi sekolah yang digunakan dalam laporan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border bg-muted/30 p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <Building2 className="h-3.5 w-3.5" /> Nama Sekolah
            </div>
            <p className="text-xl font-bold">{profile.school_name || "—"}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
