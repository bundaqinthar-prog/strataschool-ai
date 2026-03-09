import { SchoolProfileForm, SchoolProfile } from "@/components/SchoolProfileForm";
import { ReportDisplay } from "@/components/ReportDisplay";
import { useAIReport } from "@/hooks/useAIReport";

export default function ContentPlanner() {
  const { report, isLoading, generate } = useAIReport();

  const handleSubmit = (data: SchoolProfile) => {
    generate(
      `You are a social media content strategist for schools in Indonesia. Create engaging, practical content plans. Use markdown with tables where appropriate.`,
      `Create a 30-day social media content plan for:\n\nSchool: ${data.schoolName}\nCity: ${data.city}\nLevel: ${data.educationLevel}\nTarget Parents: ${data.targetParents}\nUnique Programs: ${data.uniquePrograms}\nTarget Audience: ${data.targetAudience || data.targetParents}\nKey Themes: ${data.keyThemes || "Academic excellence, school life, parent education"}\n\nProvide:\n1. **Content Strategy Overview** - Goals and themes\n2. **30-Day Content Calendar** - Day-by-day plan with post type, platform, caption ideas\n3. **Post Ideas** - 15+ creative post ideas\n4. **Video Content Ideas** - 10 video concepts (Reels/TikTok/YouTube)\n5. **Educational Content for Parents** - 10 informative content ideas\n6. **Best Practices** - Posting times, hashtags, engagement tips for Indonesian audience`
    );
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Social Media Content Planner</h1>
        <p className="text-muted-foreground mt-1">Generate a 30-day social media content plan</p>
      </div>
      <SchoolProfileForm title="Content Plan Details" description="Enter school info and content preferences" onSubmit={handleSubmit} isLoading={isLoading} extraFields={["targetAudience", "keyThemes"]} />
      <ReportDisplay title="30-Day Content Plan" content={report} isLoading={isLoading} />
    </div>
  );
}
