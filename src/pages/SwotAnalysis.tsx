import { SchoolProfileForm, SchoolProfile } from "@/components/SchoolProfileForm";
import { ReportDisplay } from "@/components/ReportDisplay";
import { useAIReport } from "@/hooks/useAIReport";

export default function SwotAnalysis() {
  const { report, isLoading, generate } = useAIReport();

  const handleSubmit = (data: SchoolProfile) => {
    generate(
      `You are a strategic planning consultant for Indonesian schools. Create thorough SWOT analyses. Use markdown with clear sections.`,
      `Generate a SWOT analysis for:\n\nSchool: ${data.schoolName}\nCity: ${data.city}\nLevel: ${data.educationLevel}\nStudents: ${data.studentCount}\nTarget Parents: ${data.targetParents}\nTuition: ${data.tuitionRange}\nUnique Programs: ${data.uniquePrograms}\n\nProvide:\n1. **Strengths** - Internal advantages (5-8 items with explanations)\n2. **Weaknesses** - Internal challenges (5-8 items with explanations)\n3. **Opportunities** - External possibilities (5-8 items with explanations)\n4. **Threats** - External risks (5-8 items with explanations)\n5. **Strategic Priorities** - Top 5 actions based on the SWOT\n6. **SWOT Matrix** - Cross-analysis (SO, WO, ST, WT strategies)`
    );
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">SWOT Analysis</h1>
        <p className="text-muted-foreground mt-1">Generate a comprehensive SWOT analysis for your school</p>
      </div>
      <SchoolProfileForm title="School Profile" description="Enter details to generate SWOT analysis" onSubmit={handleSubmit} isLoading={isLoading} />
      <ReportDisplay title="SWOT Analysis Report" content={report} isLoading={isLoading} />
    </div>
  );
}
