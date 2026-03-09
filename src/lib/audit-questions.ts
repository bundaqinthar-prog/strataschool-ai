export interface AuditQuestion {
  id: number;
  text: string;
}

export interface AuditAspect {
  id: string;
  title: string;
  icon: string;
  questions: AuditQuestion[];
}

export const auditAspects: AuditAspect[] = [
  {
    id: "brand",
    title: "Brand & Positioning",
    icon: "🎯",
    questions: [
      { id: 1, text: "School has a clear and memorable brand identity (logo, colors, tagline)" },
      { id: 2, text: "Brand message clearly communicates the school's unique value" },
      { id: 3, text: "School positioning is distinct from competitors" },
      { id: 4, text: "Brand consistency across all marketing materials" },
      { id: 5, text: "School has a compelling brand story" },
      { id: 6, text: "Visual identity appeals to target parent demographics" },
      { id: 7, text: "Brand voice is consistent and professional" },
      { id: 8, text: "School reputation is actively managed online" },
      { id: 9, text: "Brand awareness in the local community" },
      { id: 10, text: "School values are clearly communicated to stakeholders" },
    ],
  },
  {
    id: "market",
    title: "Target Market & Segmentation",
    icon: "👥",
    questions: [
      { id: 11, text: "School has clearly defined target parent personas" },
      { id: 12, text: "Geographic target area is well-defined" },
      { id: 13, text: "Understanding of parent demographics and psychographics" },
      { id: 14, text: "Market research is conducted regularly" },
      { id: 15, text: "Competitive landscape is well understood" },
      { id: 16, text: "School tracks local population and demographic trends" },
      { id: 17, text: "Marketing messages are tailored to different parent segments" },
      { id: 18, text: "School understands why parents choose competitors" },
      { id: 19, text: "Feedback from prospective parents is collected" },
      { id: 20, text: "School monitors enrollment trends and patterns" },
    ],
  },
  {
    id: "product",
    title: "Education Product & Value Proposition",
    icon: "📚",
    questions: [
      { id: 21, text: "Curriculum differentiators are clearly articulated" },
      { id: 22, text: "Extracurricular programs are highlighted in marketing" },
      { id: 23, text: "Student achievement outcomes are communicated" },
      { id: 24, text: "Unique teaching methods are showcased" },
      { id: 25, text: "Facilities and infrastructure are used as marketing assets" },
      { id: 26, text: "Teacher quality and qualifications are promoted" },
      { id: 27, text: "School culture and values are evident to visitors" },
      { id: 28, text: "Technology integration is highlighted" },
      { id: 29, text: "Student well-being programs are communicated" },
      { id: 30, text: "Tuition pricing is competitive and well-justified" },
    ],
  },
  {
    id: "channels",
    title: "Marketing Channels",
    icon: "📢",
    questions: [
      { id: 31, text: "School website is modern, mobile-friendly, and informative" },
      { id: 32, text: "Social media presence is active and engaging" },
      { id: 33, text: "Google Business Profile is optimized and up-to-date" },
      { id: 34, text: "School uses digital advertising (Google Ads, social media ads)" },
      { id: 35, text: "Content marketing strategy exists (blog, videos, newsletters)" },
      { id: 36, text: "School participates in education fairs and events" },
      { id: 37, text: "Community partnerships and outreach programs exist" },
      { id: 38, text: "Email marketing is used for prospective parents" },
      { id: 39, text: "WhatsApp or messaging platforms are used for communication" },
      { id: 40, text: "School uses traditional marketing (banners, brochures, print)" },
    ],
  },
  {
    id: "conversion",
    title: "Conversion & Enrollment System",
    icon: "🔄",
    questions: [
      { id: 41, text: "Enrollment process is simple and user-friendly" },
      { id: 42, text: "School offers campus tours or open house events" },
      { id: 43, text: "Follow-up system for prospective parent inquiries" },
      { id: 44, text: "Online registration or inquiry forms are available" },
      { id: 45, text: "School tracks conversion rates from inquiry to enrollment" },
      { id: 46, text: "Trial classes or orientation programs are offered" },
      { id: 47, text: "Testimonials and success stories are displayed" },
      { id: 48, text: "Response time to parent inquiries is fast" },
      { id: 49, text: "Enrollment team is trained in consultative selling" },
      { id: 50, text: "Scholarship or financial aid information is accessible" },
    ],
  },
  {
    id: "retention",
    title: "Retention & Word of Mouth",
    icon: "💬",
    questions: [
      { id: 51, text: "Parent satisfaction is measured regularly" },
      { id: 52, text: "Referral program exists for current parents" },
      { id: 53, text: "School communicates achievements and milestones" },
      { id: 54, text: "Parent community events strengthen engagement" },
      { id: 55, text: "Alumni network is maintained and leveraged" },
      { id: 56, text: "School handles complaints and feedback effectively" },
      { id: 57, text: "Parent communication is frequent and transparent" },
      { id: 58, text: "Student retention rate is actively monitored" },
      { id: 59, text: "School encourages online reviews and testimonials" },
      { id: 60, text: "Word-of-mouth is a significant enrollment driver" },
    ],
  },
];

export const ratingLabels: Record<number, string> = {
  1: "Very Poor",
  2: "Poor",
  3: "Average",
  4: "Good",
  5: "Excellent",
};

export function calculateScores(answers: Record<number, number>) {
  const aspectScores = auditAspects.map((aspect) => {
    const total = aspect.questions.reduce((sum, q) => sum + (answers[q.id] || 0), 0);
    const max = aspect.questions.length * 5;
    const percentage = Math.round((total / max) * 100);
    return { id: aspect.id, title: aspect.title, score: total, max, percentage };
  });

  const totalScore = aspectScores.reduce((sum, a) => sum + a.score, 0);
  const totalMax = aspectScores.reduce((sum, a) => sum + a.max, 0);
  const totalPercentage = Math.round((totalScore / totalMax) * 100);

  let level: "Poor" | "Average" | "Strong";
  if (totalPercentage < 40) level = "Poor";
  else if (totalPercentage < 70) level = "Average";
  else level = "Strong";

  return { aspectScores, totalScore, totalMax, totalPercentage, level };
}
