import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface SchoolProfile {
  schoolName: string;
  city: string;
  educationLevel: string;
  studentCount: string;
  targetParents: string;
  tuitionRange: string;
  uniquePrograms: string;
  competitors?: string;
  currentEnrollment?: string;
  targetAudience?: string;
  keyThemes?: string;
}

interface SchoolProfileFormProps {
  title: string;
  description: string;
  onSubmit: (data: SchoolProfile) => void;
  isLoading?: boolean;
  extraFields?: Array<"competitors" | "currentEnrollment" | "targetAudience" | "keyThemes">;
}

export function SchoolProfileForm({ title, description, onSubmit, isLoading, extraFields = [] }: SchoolProfileFormProps) {
  const [form, setForm] = useState<SchoolProfile>({
    schoolName: "",
    city: "",
    educationLevel: "",
    studentCount: "",
    targetParents: "",
    tuitionRange: "",
    uniquePrograms: "",
    competitors: "",
    currentEnrollment: "",
    targetAudience: "",
    keyThemes: "",
  });

  const update = (key: keyof SchoolProfile, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>School Name</Label>
              <Input value={form.schoolName} onChange={(e) => update("schoolName", e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>City</Label>
              <Input value={form.city} onChange={(e) => update("city", e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Education Level</Label>
              <Select value={form.educationLevel} onValueChange={(v) => update("educationLevel", v)}>
                <SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="TK">TK (Kindergarten)</SelectItem>
                  <SelectItem value="SD">SD (Elementary)</SelectItem>
                  <SelectItem value="SMP">SMP (Middle School)</SelectItem>
                  <SelectItem value="SMA">SMA (High School)</SelectItem>
                  <SelectItem value="Multiple">Multiple Levels</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Number of Students</Label>
              <Input type="number" value={form.studentCount} onChange={(e) => update("studentCount", e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Target Parents</Label>
              <Input value={form.targetParents} onChange={(e) => update("targetParents", e.target.value)} placeholder="e.g., Middle-class professionals" required />
            </div>
            <div className="space-y-2">
              <Label>Tuition Fee Range</Label>
              <Input value={form.tuitionRange} onChange={(e) => update("tuitionRange", e.target.value)} placeholder="e.g., Rp 5-10 juta/year" required />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Unique Programs</Label>
            <Textarea value={form.uniquePrograms} onChange={(e) => update("uniquePrograms", e.target.value)} placeholder="e.g., Bilingual program, STEM focus, Islamic values..." required />
          </div>
          {extraFields.includes("competitors") && (
            <div className="space-y-2">
              <Label>Known Competitors</Label>
              <Textarea value={form.competitors} onChange={(e) => update("competitors", e.target.value)} placeholder="List competitor schools and what you know about them..." />
            </div>
          )}
          {extraFields.includes("currentEnrollment") && (
            <div className="space-y-2">
              <Label>Current Enrollment Challenges</Label>
              <Textarea value={form.currentEnrollment} onChange={(e) => update("currentEnrollment", e.target.value)} placeholder="Describe current enrollment situation..." />
            </div>
          )}
          {extraFields.includes("targetAudience") && (
            <div className="space-y-2">
              <Label>Target Audience Details</Label>
              <Textarea value={form.targetAudience} onChange={(e) => update("targetAudience", e.target.value)} placeholder="Describe your ideal parent audience..." />
            </div>
          )}
          {extraFields.includes("keyThemes") && (
            <div className="space-y-2">
              <Label>Key Content Themes</Label>
              <Textarea value={form.keyThemes} onChange={(e) => update("keyThemes", e.target.value)} placeholder="e.g., Academic excellence, student activities, parent tips..." />
            </div>
          )}
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Generating..." : "Generate AI Report"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
