import { SchoolProfileForm, SchoolProfile } from "@/components/SchoolProfileForm";
import { ReportDisplay } from "@/components/ReportDisplay";
import { useAIReport } from "@/hooks/useAIReport";

export default function GrowthStrategy() {
  const { report, isLoading, generate } = useAIReport();

  const handleSubmit = (data: SchoolProfile) => {
    generate(
      `You are a school enrollment growth strategist specializing in Indonesian schools. Provide creative, practical growth strategies. Use markdown.`,
      `Generate enrollment growth strategies for:\n\nSchool: ${data.schoolName}\nCity: ${data.city}\nLevel: ${data.educationLevel}\nStudents: ${data.studentCount}\nTarget Parents: ${data.targetParents}\nTuition: ${data.tuitionRange}\nUnique Programs: ${data.uniquePrograms}\nCurrent Challenges: ${data.currentEnrollment || "Not specified"}\n\nProvide:\n1. **Promotional Strategies** - Marketing campaigns and tactics\n2. **Community Engagement** - Local community involvement ideas\n3. **School Events** - Events that attract prospective parents\n4. **Partnerships** - Strategic partnership opportunities\n5. **Referral Strategies** - Word-of-mouth and referral programs\n6. **Implementation Timeline** - 90-day action plan`
    );
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Growth Strategy Generator</h1>
        <p className="text-muted-foreground mt-1">Generate strategies to increase student enrollment</p>
      </div>
      <SchoolProfileForm title="School Profile" description="Enter details to generate growth strategies" onSubmit={handleSubmit} isLoading={isLoading} extraFields={["currentEnrollment"]} />
      <ReportDisplay title="Growth Strategy Report" content={report} isLoading={isLoading} />
    </div>
  );
}
