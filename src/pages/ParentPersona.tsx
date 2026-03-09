import { SchoolProfileForm, SchoolProfile } from "@/components/SchoolProfileForm";
import { ReportDisplay } from "@/components/ReportDisplay";
import { useAIReport } from "@/hooks/useAIReport";

export default function ParentPersona() {
  const { report, isLoading, generate } = useAIReport();

  const handleSubmit = (data: SchoolProfile) => {
    generate(
      `You are an education marketing persona specialist for Indonesian schools. Create detailed, realistic parent personas. Use markdown.`,
      `Create target parent personas for:\n\nSchool: ${data.schoolName}\nCity: ${data.city}\nLevel: ${data.educationLevel}\nStudents: ${data.studentCount}\nTarget Parents: ${data.targetParents}\nTuition: ${data.tuitionRange}\nUnique Programs: ${data.uniquePrograms}\n\nCreate 3 detailed parent personas including:\n1. **Demographics** - Age, gender, location, family size\n2. **Profession & Income** - Career, income level\n3. **Education Priorities** - What they value most\n4. **Concerns About Schooling** - Fears, worries, objections\n5. **Preferred Communication Channels** - How they consume info\n6. **Decision-Making Process** - How they choose a school\n7. **Marketing Message That Resonates** - What would attract them\n\nMake personas realistic for the Indonesian context in ${data.city}.`
    );
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Parent Persona Generator</h1>
        <p className="text-muted-foreground mt-1">Create detailed target parent personas</p>
      </div>
      <SchoolProfileForm title="School Profile" description="Enter details to generate parent personas" onSubmit={handleSubmit} isLoading={isLoading} />
      <ReportDisplay title="Parent Personas" content={report} isLoading={isLoading} />
    </div>
  );
}
