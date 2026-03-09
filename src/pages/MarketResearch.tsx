import { SchoolProfileForm, SchoolProfile } from "@/components/SchoolProfileForm";
import { ReportDisplay } from "@/components/ReportDisplay";
import { useAIReport } from "@/hooks/useAIReport";

export default function MarketResearch() {
  const { report, isLoading, generate } = useAIReport();

  const handleSubmit = (data: SchoolProfile) => {
    generate(
      `You are an expert education market researcher specializing in the Indonesian education market. Provide detailed, data-informed analysis. Write in professional English with markdown formatting.`,
      `Analyze the market for this school:\n\nSchool: ${data.schoolName}\nCity: ${data.city}\nLevel: ${data.educationLevel}\nStudents: ${data.studentCount}\nTarget Parents: ${data.targetParents}\nTuition: ${data.tuitionRange}\nUnique Programs: ${data.uniquePrograms}\n\nProvide:\n1. **Local Market Opportunity** - Market size, growth potential in ${data.city}\n2. **Parent Demand Insights** - What parents want, priorities, decision factors\n3. **Education Trends** - Relevant trends in Indonesian education\n4. **Growth Potential** - Specific opportunities for enrollment growth\n5. **Strategic Recommendations** - Actionable next steps`
    );
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Market Research</h1>
        <p className="text-muted-foreground mt-1">Analyze your local education market and parent demand</p>
      </div>
      <SchoolProfileForm
        title="School Profile"
        description="Enter your school details to generate market research"
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
      <ReportDisplay title="Market Research Report" content={report} isLoading={isLoading} />
    </div>
  );
}
