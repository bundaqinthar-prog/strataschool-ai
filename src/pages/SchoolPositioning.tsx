import { SchoolProfileForm, SchoolProfile } from "@/components/SchoolProfileForm";
import { ReportDisplay } from "@/components/ReportDisplay";
import { useAIReport } from "@/hooks/useAIReport";

export default function SchoolPositioning() {
  const { report, isLoading, generate } = useAIReport();

  const handleSubmit = (data: SchoolProfile) => {
    generate(
      `You are a brand strategist specializing in school positioning in the Indonesian education market. Create compelling, differentiated positioning strategies. Use markdown.`,
      `Create a positioning strategy for:\n\nSchool: ${data.schoolName}\nCity: ${data.city}\nLevel: ${data.educationLevel}\nStudents: ${data.studentCount}\nTarget Parents: ${data.targetParents}\nTuition: ${data.tuitionRange}\nUnique Programs: ${data.uniquePrograms}\n\nProvide:\n1. **Unique Selling Proposition (USP)** - Clear, compelling USP\n2. **Brand Positioning Statement** - Formal positioning statement\n3. **Differentiation Strategy** - How to stand out from competitors\n4. **Brand Message for Parents** - Key messages that resonate with target parents\n5. **Implementation Recommendations**`
    );
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">School Positioning Finder</h1>
        <p className="text-muted-foreground mt-1">Discover your school's unique brand positioning</p>
      </div>
      <SchoolProfileForm title="School Profile" description="Enter details to find your positioning" onSubmit={handleSubmit} isLoading={isLoading} />
      <ReportDisplay title="Positioning Report" content={report} isLoading={isLoading} />
    </div>
  );
}
