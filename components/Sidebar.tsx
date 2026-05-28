"use client";

import SuggestedQuestions from "./SuggestedQuestions";

const COUNTRIES = ["🇩🇪 Germany", "🇬🇧 UK", "🇨🇦 Canada", "🇦🇺 Australia", "🇺🇸 USA"];

export default function Sidebar({
  onSelectQuestion,
  onClearChat,
  messageCount,
}: {
  onSelectQuestion: (q: string) => void;
  onClearChat: () => void;
  messageCount: number;
}) {
  return (
    <aside className="w-72 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col h-full">
      {/* Header */}
      <div className="px-5 pt-6 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 14l9-5-9-5-9 5 9 5z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900 leading-tight">
              Study Abroad
            </h1>
            <h1 className="text-sm font-bold text-blue-600 leading-tight">
              Assistant
            </h1>
          </div>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">
          AI-powered guidance for international students on universities,
          scholarships, and visa applications.
        </p>
      </div>

      {/* Countries */}
      <div className="px-5 py-3 border-b border-slate-100">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Countries Covered
        </p>
        <div className="flex flex-wrap gap-1">
          {COUNTRIES.map((c) => (
            <span
              key={c}
              className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full"
            >
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* Suggested Questions */}
      <div className="px-5 py-3 flex-1 overflow-y-auto">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Try asking...
        </p>
        <SuggestedQuestions onSelect={onSelectQuestion} />
      </div>

      {/* Clear Chat */}
      <div className="px-5 py-4 border-t border-slate-100">
        <button
          onClick={onClearChat}
          disabled={messageCount === 0}
          className="w-full flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-red-600 hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-200 hover:border-red-200 rounded-lg px-4 py-2 transition-colors duration-150"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          Clear conversation
        </button>
      </div>
    </aside>
  );
}
