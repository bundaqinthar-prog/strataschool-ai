import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Building2, Mail, User, Briefcase, Pencil, MapPin, Navigation, ExternalLink, Loader2 } from "lucide-react";

const jabatanOptions = [
  "Kepala Sekolah",
  "Ketua Yayasan",
  "Ketua Tim PPDB",
  "Staf Marketing",
  "Guru",
  "Lainnya",
];

type ExtendedProfile = {
  id: string;
  full_name: string;
  email: string;
  jabatan: string;
  school_name: string;
  address?: string | null;
  city?: string | null;
  province?: string | null;
  postal_code?: string | null;
  latitude?: number | null;
  longitude?: number | null;
};

export default function SchoolProfile() {
  const { profile, refreshProfile } = useAuth();
  const ext = (profile ?? {}) as unknown as ExtendedProfile;
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [locating, setLocating] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    jabatan: "",
    school_name: "",
    address: "",
    city: "",
    province: "",
    postal_code: "",
    latitude: "" as string,
    longitude: "" as string,
  });

  const handleOpen = () => {
    setForm({
      full_name: ext.full_name || "",
      jabatan: ext.jabatan || "",
      school_name: ext.school_name || "",
      address: ext.address || "",
      city: ext.city || "",
      province: ext.province || "",
      postal_code: ext.postal_code || "",
      latitude: ext.latitude != null ? String(ext.latitude) : "",
      longitude: ext.longitude != null ? String(ext.longitude) : "",
    });
    setOpen(true);
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      toast({ title: "Browser tidak mendukung geolokasi", variant: "destructive" });
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((p) => ({
          ...p,
          latitude: pos.coords.latitude.toFixed(6),
          longitude: pos.coords.longitude.toFixed(6),
        }));
        toast({ title: "Lokasi terdeteksi", description: "Koordinat berhasil diisi otomatis." });
        setLocating(false);
      },
      (err) => {
        toast({ title: "Gagal mendeteksi lokasi", description: err.message, variant: "destructive" });
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    const lat = form.latitude.trim() === "" ? null : Number(form.latitude);
    const lng = form.longitude.trim() === "" ? null : Number(form.longitude);

    if (lat !== null && (isNaN(lat) || lat < -90 || lat > 90)) {
      toast({ title: "Latitude tidak valid", description: "Harus antara -90 dan 90.", variant: "destructive" });
      setSaving(false);
      return;
    }
    if (lng !== null && (isNaN(lng) || lng < -180 || lng > 180)) {
      toast({ title: "Longitude tidak valid", description: "Harus antara -180 dan 180.", variant: "destructive" });
      setSaving(false);
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: form.full_name,
        jabatan: form.jabatan,
        school_name: form.school_name,
        address: form.address,
        city: form.city,
        province: form.province,
        postal_code: form.postal_code,
        latitude: lat,
        longitude: lng,
        updated_at: new Date().toISOString(),
      } as never)
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

  const fullAddress = [ext.address, ext.city, ext.province, ext.postal_code].filter(Boolean).join(", ");
  const hasCoords = ext.latitude != null && ext.longitude != null;
  const mapsQuery = hasCoords
    ? `${ext.latitude},${ext.longitude}`
    : encodeURIComponent(fullAddress || ext.school_name || "");
  const mapEmbedSrc = hasCoords
    ? `https://www.google.com/maps?q=${ext.latitude},${ext.longitude}&z=16&output=embed`
    : fullAddress
      ? `https://www.google.com/maps?q=${encodeURIComponent(fullAddress)}&output=embed`
      : null;
  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

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
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Profil</DialogTitle>
            </DialogHeader>
            <div className="space-y-5 py-4">
              <div className="grid sm:grid-cols-2 gap-4">
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
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-school">Nama Sekolah</Label>
                <Input id="edit-school" value={form.school_name} onChange={(e) => setForm((p) => ({ ...p, school_name: e.target.value }))} />
              </div>

              <div className="border-t pt-4 space-y-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold">Alamat & Lokasi</h3>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-address">Alamat Lengkap</Label>
                  <Textarea
                    id="edit-address"
                    rows={2}
                    placeholder="cth: Jl. Pendidikan No. 12, RT 03/RW 05, Kel. Cempaka"
                    value={form.address}
                    onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
                  />
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-city">Kota / Kabupaten</Label>
                    <Input id="edit-city" value={form.city} onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-province">Provinsi</Label>
                    <Input id="edit-province" value={form.province} onChange={(e) => setForm((p) => ({ ...p, province: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-postal">Kode Pos</Label>
                    <Input id="edit-postal" value={form.postal_code} onChange={(e) => setForm((p) => ({ ...p, postal_code: e.target.value }))} />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-lat">Latitude</Label>
                    <Input id="edit-lat" placeholder="-6.200000" value={form.latitude} onChange={(e) => setForm((p) => ({ ...p, latitude: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-lng">Longitude</Label>
                    <Input id="edit-lng" placeholder="106.816666" value={form.longitude} onChange={(e) => setForm((p) => ({ ...p, longitude: e.target.value }))} />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={detectLocation} disabled={locating}>
                    {locating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Navigation className="h-4 w-4 mr-2" />}
                    Deteksi Lokasi Saat Ini
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <a
                      href="https://www.google.com/maps"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Cari di Google Maps
                    </a>
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Tip: di Google Maps, klik kanan titik lokasi sekolah → klik koordinat untuk menyalin (format: lat, lng), lalu tempel di kolom di atas.
                </p>
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
        <CardContent className="space-y-4">
          <div className="rounded-lg border bg-muted/30 p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <Building2 className="h-3.5 w-3.5" /> Nama Sekolah
            </div>
            <p className="text-xl font-bold">{profile.school_name || "—"}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border bg-muted/30 p-4 sm:col-span-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <MapPin className="h-3.5 w-3.5" /> Alamat
              </div>
              <p className="font-medium">{fullAddress || "—"}</p>
            </div>
            <div className="rounded-lg border bg-muted/30 p-4">
              <div className="text-xs text-muted-foreground mb-1">Latitude</div>
              <p className="font-mono text-sm">{ext.latitude ?? "—"}</p>
            </div>
            <div className="rounded-lg border bg-muted/30 p-4">
              <div className="text-xs text-muted-foreground mb-1">Longitude</div>
              <p className="font-mono text-sm">{ext.longitude ?? "—"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Map */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" /> Peta Lokasi
          </CardTitle>
          <CardDescription>
            {hasCoords
              ? "Berdasarkan titik koordinat sekolah"
              : fullAddress
                ? "Berdasarkan alamat sekolah"
                : "Lengkapi alamat atau koordinat untuk menampilkan peta"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {mapEmbedSrc ? (
            <div className="space-y-3">
              <div className="aspect-video w-full overflow-hidden rounded-lg border">
                <iframe
                  title="Peta Lokasi Sekolah"
                  src={mapEmbedSrc}
                  className="w-full h-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <Button asChild variant="outline" size="sm">
                <a href={mapsLink} target="_blank" rel="noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Buka di Google Maps
                </a>
              </Button>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
              Belum ada data lokasi. Klik <span className="font-medium text-foreground">Edit Profil</span> untuk menambahkan alamat atau koordinat.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
