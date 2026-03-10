import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  UserCheck,
  Clock,
  UserX,
  LogOut,
  ShieldCheck,
  RefreshCw,
  Trash2,
} from "lucide-react";

interface UserProfile {
  id: string;
  full_name: string;
  school_name: string;
  email: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  updated_at: string;
}

interface Stats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const { signOut, session } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
  const baseUrl = `https://${projectId}.supabase.co/functions/v1/admin-api`;

  const headers = useCallback(() => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${session?.access_token}`,
  }), [session]);

  const fetchStats = useCallback(async () => {
    const res = await fetch(`${baseUrl}?action=stats`, { headers: headers() });
    if (res.ok) {
      const data = await res.json();
      setStats(data);
    }
  }, [baseUrl, headers]);

  const fetchUsers = useCallback(async () => {
    const res = await fetch(`${baseUrl}?action=users&status=${filter}`, { headers: headers() });
    if (res.ok) {
      const data = await res.json();
      setUsers(data.users || []);
    }
  }, [baseUrl, filter, headers]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await Promise.all([fetchStats(), fetchUsers()]);
      setLoading(false);
    };
    if (session) load();
  }, [session, filter, fetchStats, fetchUsers]);

  const updateUserStatus = async (userId: string, status: string) => {
    setActionLoading(userId);
    const res = await fetch(`${baseUrl}?action=update-status`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({ userId, status }),
    });
    if (res.ok) {
      toast({ title: "Berhasil", description: `Status pengguna berhasil diubah menjadi ${status === "approved" ? "disetujui" : status === "rejected" ? "ditolak" : "pending"}` });
      await Promise.all([fetchStats(), fetchUsers()]);
    } else {
      toast({ title: "Gagal", description: "Gagal mengubah status pengguna", variant: "destructive" });
    }
    setActionLoading(null);
  };

  const deleteUser = async (userId: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus pengguna ini? Tindakan ini tidak dapat dibatalkan.")) return;
    setActionLoading(userId);
    const res = await fetch(`${baseUrl}?action=delete-user`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({ userId }),
    });
    if (res.ok) {
      toast({ title: "Berhasil", description: "Pengguna berhasil dihapus" });
      await Promise.all([fetchStats(), fetchUsers()]);
    } else {
      toast({ title: "Gagal", description: "Gagal menghapus pengguna", variant: "destructive" });
    }
    setActionLoading(null);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin/login");
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-secondary text-secondary-foreground">Disetujui</Badge>;
      case "rejected":
        return <Badge variant="destructive">Ditolak</Badge>;
      default:
        return <Badge variant="outline" className="border-chart-3 text-chart-3">Menunggu</Badge>;
    }
  };

  const statCards = [
    { label: "Total Pengguna", value: stats.total, icon: Users, color: "text-primary" },
    { label: "Menunggu Persetujuan", value: stats.pending, icon: Clock, color: "text-chart-3" },
    { label: "Disetujui", value: stats.approved, icon: UserCheck, color: "text-secondary" },
    { label: "Ditolak", value: stats.rejected, icon: UserX, color: "text-destructive" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-destructive/10 flex items-center justify-center">
            <ShieldCheck className="h-5 w-5 text-destructive" />
          </div>
          <div>
            <h1 className="text-lg font-bold">Panel Admin</h1>
            <p className="text-xs text-muted-foreground">SchoolGrowth AI</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" /> Keluar
        </Button>
      </header>

      <main className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((s) => (
            <Card key={s.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardDescription>{s.label}</CardDescription>
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{loading ? "—" : s.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Kelola Pengguna</CardTitle>
              <CardDescription>Setujui, tolak, atau hapus akun pengguna</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua</SelectItem>
                  <SelectItem value="pending">Menunggu</SelectItem>
                  <SelectItem value="approved">Disetujui</SelectItem>
                  <SelectItem value="rejected">Ditolak</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" onClick={() => { fetchStats(); fetchUsers(); }}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Memuat data...</div>
            ) : users.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">Tidak ada pengguna ditemukan</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Sekolah</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Terdaftar</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((u) => (
                      <TableRow key={u.id}>
                        <TableCell className="font-medium">{u.full_name || "—"}</TableCell>
                        <TableCell>{u.email}</TableCell>
                        <TableCell>{u.school_name || "—"}</TableCell>
                        <TableCell>{statusBadge(u.status)}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(u.created_at).toLocaleDateString("id-ID")}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-1 justify-end">
                            {u.status !== "approved" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-secondary border-secondary hover:bg-secondary/10"
                                disabled={actionLoading === u.id}
                                onClick={() => updateUserStatus(u.id, "approved")}
                              >
                                <UserCheck className="h-3 w-3 mr-1" /> Setujui
                              </Button>
                            )}
                            {u.status !== "rejected" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-destructive border-destructive hover:bg-destructive/10"
                                disabled={actionLoading === u.id}
                                onClick={() => updateUserStatus(u.id, "rejected")}
                              >
                                <UserX className="h-3 w-3 mr-1" /> Tolak
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-destructive"
                              disabled={actionLoading === u.id}
                              onClick={() => deleteUser(u.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
