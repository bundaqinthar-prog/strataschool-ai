import { SchoolProfileForm, SchoolProfile } from "@/components/SchoolProfileForm";
import { ReportDisplay } from "@/components/ReportDisplay";
import { useAIReport } from "@/hooks/useAIReport";

export default function CompetitorAnalysis() {
  const { report, isLoading, generate } = useAIReport();

  const handleSubmit = (data: SchoolProfile) => {
    generate(
      `You are a competitive analysis expert for the Indonesian education sector. Provide thorough, strategic competitive analysis. Use markdown formatting.`,
      `Analyze the competitive landscape for:\n\nSchool: ${data.schoolName}\nCity: ${data.city}\nLevel: ${data.educationLevel}\nStudents: ${data.studentCount}\nTarget Parents: ${data.targetParents}\nTuition: ${data.tuitionRange}\nUnique Programs: ${data.uniquePrograms}\nKnown Competitors: ${data.competitors || "Not specified"}\n\nProvide:\n1. **Competitor Strengths** - Typical strengths of competitors\n2. **Competitor Weaknesses** - Common weaknesses to exploit\n3. **Positioning Opportunities** - Gaps in the market\n4. **Strategic Recommendations** - How to gain competitive advantage\n5. **Action Plan** - Prioritized steps`
    );
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Competitor Analysis</h1>
        <p className="text-muted-foreground mt-1">Analyze your competitive landscape</p>
      </div>
      <SchoolProfileForm title="School & Competitor Info" description="Enter your school and competitor details" onSubmit={handleSubmit} isLoading={isLoading} extraFields={["competitors"]} />
      <ReportDisplay title="Competitor Analysis Report" content={report} isLoading={isLoading} />
    </div>
  );
}
