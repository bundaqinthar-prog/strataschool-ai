import {
  LayoutDashboard,
  ClipboardCheck,
  Search,
  Target,
  Users,
  TrendingUp,
  Calendar,
  UserCircle,
  Shield,
  GraduationCap,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";

const tools = [
  { title: "Dasbor", url: "/", icon: LayoutDashboard },
  { title: "Audit Marketing", url: "/audit", icon: ClipboardCheck },
  { title: "Riset Pasar", url: "/research", icon: Search },
  { title: "Positioning Sekolah", url: "/positioning", icon: Target },
  { title: "Analisis Kompetitor", url: "/competitors", icon: Users },
  { title: "Strategi Pertumbuhan", url: "/growth", icon: TrendingUp },
  { title: "Perencana Konten", url: "/content", icon: Calendar },
  { title: "Persona Orang Tua", url: "/persona", icon: UserCircle },
  { title: "Analisis SWOT", url: "/swot", icon: Shield },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary">
            <GraduationCap className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-bold text-sidebar-foreground">SchoolGrowth</span>
              <span className="text-xs text-sidebar-primary">AI</span>
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {tools.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="hover:bg-sidebar-accent"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-semibold"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}