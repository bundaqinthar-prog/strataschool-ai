import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { GraduationCap, UserPlus, CheckCircle, Loader2 } from "lucide-react";

const JABATAN_OPTIONS = [
  "Kepala Sekolah",
  "Ketua Yayasan",
  "Ketua Tim PPDB",
  "Staf Marketing",
  "Guru",
  "Lainnya",
];

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [jabatan, setJabatan] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!jabatan) {
      toast({
        title: "Jabatan wajib dipilih",
        description: "Silakan pilih jabatan Anda di sekolah",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Kata sandi terlalu pendek",
        description: "Kata sandi minimal 6 karakter",
        variant: "destructive",
      });
      return;
    }

    // Sanitize inputs
    const sanitizedFullName = fullName.trim().slice(0, 100);
    const sanitizedSchoolName = schoolName.trim().slice(0, 200);
    const sanitizedEmail = email.trim().toLowerCase().slice(0, 255);

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email: sanitizedEmail,
      password,
      options: {
        data: {
          full_name: sanitizedFullName,
          school_name: sanitizedSchoolName,
          jabatan,
        },
        emailRedirectTo: window.location.origin,
      },
    });

    if (error) {
      toast({
        title: "Gagal mendaftar",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center space-y-3">
            <div className="mx-auto h-14 w-14 rounded-full bg-secondary/10 flex items-center justify-center">
              <CheckCircle className="h-7 w-7 text-secondary" />
            </div>
            <CardTitle className="text-2xl">Pendaftaran Berhasil!</CardTitle>
            <CardDescription className="text-base leading-relaxed">
              Silakan cek email Anda untuk verifikasi akun. Setelah verifikasi, akun Anda akan menunggu persetujuan admin sebelum dapat mengakses aplikasi.
            </CardDescription>
          </CardHeader>
          <CardFooter className="justify-center">
            <Link to="/login">
              <Button variant="outline">Kembali ke halaman masuk</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <GraduationCap className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Daftar Akun Baru</CardTitle>
          <CardDescription>Lengkapi profil sekolah Anda untuk memulai</CardDescription>
        </CardHeader>
        <form onSubmit={handleRegister}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Nama Lengkap <span className="text-destructive">*</span></Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Masukkan nama lengkap"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                maxLength={100}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="jabatan">Jabatan di Sekolah <span className="text-destructive">*</span></Label>
              <Select value={jabatan} onValueChange={setJabatan} required>
                <SelectTrigger id="jabatan">
                  <SelectValue placeholder="Pilih jabatan Anda" />
                </SelectTrigger>
                <SelectContent>
                  {JABATAN_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="schoolName">Nama Sekolah <span className="text-destructive">*</span></Label>
              <Input
                id="schoolName"
                type="text"
                placeholder="Contoh: SMA Nusantara Bangsa"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                required
                maxLength={200}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Sekolah / Pribadi <span className="text-destructive">*</span></Label>
              <Input
                id="email"
                type="email"
                placeholder="nama@sekolah.sch.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                maxLength={255}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password <span className="text-destructive">*</span></Label>
              <Input
                id="password"
                type="password"
                placeholder="Minimal 6 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <UserPlus className="mr-2 h-4 w-4" />
              )}
              {loading ? "Memproses..." : "Daftar Sekarang"}
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              Sudah punya akun?{" "}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Masuk
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
