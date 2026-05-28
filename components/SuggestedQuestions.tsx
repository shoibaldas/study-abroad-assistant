"use client";

const SUGGESTED_QUESTIONS = [
  "I want to study MS in Computer Science in Germany. My GPA is 3.2. Where should I apply?",
  "What scholarships are available for Bangladeshi students going to Germany?",
  "What is the APS certificate and how do I apply for it?",
  "I want to apply for Chevening Scholarship. What are the requirements?",
  "How do I write a strong Statement of Purpose for a UK university?",
  "What IELTS score do I need to study in Canada?",
  "What are the visa requirements for studying in the USA on an F-1 visa?",
  "What is the difference between DAAD and Erasmus Mundus scholarships?",
];

export default function SuggestedQuestions({
  onSelect,
}: {
  onSelect: (q: string) => void;
}) {
  return (
    <div className="space-y-2">
      {SUGGESTED_QUESTIONS.map((q, i) => (
        <button
          key={i}
          onClick={() => onSelect(q)}
          className="w-full text-left text-xs text-slate-600 bg-white hover:bg-blue-50 hover:text-blue-700 border border-slate-200 hover:border-blue-200 rounded-lg px-3 py-2 transition-colors duration-150 leading-snug"
        >
          {q}
        </button>
      ))}
    </div>
  );
}
