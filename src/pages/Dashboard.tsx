import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import {
  ClipboardCheck,
  Search,
  Target,
  Users,
  TrendingUp,
  Calendar,
  UserCircle,
  Shield,
} from "lucide-react";

const tools = [
  { title: "Marketing Audit", description: "Evaluate your school's marketing strategy with 60 questions", icon: ClipboardCheck, url: "/audit", color: "bg-primary/10 text-primary" },
  { title: "Market Research", description: "Analyze local market opportunities and parent demand", icon: Search, url: "/research", color: "bg-secondary/10 text-secondary" },
  { title: "School Positioning", description: "Find your unique selling proposition and brand positioning", icon: Target, url: "/positioning", color: "bg-accent text-accent-foreground" },
  { title: "Competitor Analysis", description: "Analyze competitive landscape and find opportunities", icon: Users, url: "/competitors", color: "bg-primary/10 text-primary" },
  { title: "Growth Strategy", description: "Generate strategies to increase student enrollment", icon: TrendingUp, url: "/growth", color: "bg-secondary/10 text-secondary" },
  { title: "Content Planner", description: "Get a 30-day social media content plan", icon: Calendar, url: "/content", color: "bg-accent text-accent-foreground" },
  { title: "Parent Persona", description: "Create detailed target parent personas", icon: UserCircle, url: "/persona", color: "bg-primary/10 text-primary" },
  { title: "SWOT Analysis", description: "Generate a comprehensive SWOT analysis", icon: Shield, url: "/swot", color: "bg-secondary/10 text-secondary" },
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome to SchoolGrowth AI — your AI-powered marketing consultant
        </p>
      </div>

      {/* Marketing Score Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Marketing Score</CardDescription>
            <CardTitle className="text-4xl font-bold text-primary">—</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={0} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">Complete the Marketing Audit to see your score</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Performance Level</CardDescription>
            <CardTitle className="text-2xl">Not assessed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Run the audit to get your performance level</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Reports Generated</CardDescription>
            <CardTitle className="text-4xl font-bold">0</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Start using the tools below to generate reports</p>
          </CardContent>
        </Card>
      </div>

      {/* Tools Grid */}
      <div>
        <h2 className="text-xl font-semibold mb-4">AI Tools</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {tools.map((tool) => (
            <Card
              key={tool.title}
              className="cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5"
              onClick={() => navigate(tool.url)}
            >
              <CardHeader className="pb-3">
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${tool.color}`}>
                  <tool.icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-base mt-3">{tool.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{tool.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
