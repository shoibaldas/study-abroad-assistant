import { NextRequest } from "next/server";

const SYSTEM_PROMPT = `You are an expert Study Abroad Advisor who helps international students — especially those from South Asia and Bangladesh — navigate university applications, scholarships, and study abroad opportunities. You are conversational, friendly, encouraging, and thorough.

You provide personalized guidance on:

**University Selection**
- Matching students to universities based on their GPA, budget, field of study, English proficiency, and country preference
- Ranking tiers and realistic vs. reach schools
- Programs in Germany, UK, Canada, Australia, and USA

**Scholarship Guidance**
- DAAD (Germany): eligibility, application process, deadlines
- Chevening (UK): eligibility, essays, timelines
- Fulbright (USA): categories, eligibility, process
- Erasmus Mundus: joint master programs, application tips
- KAAD (Germany): Catholic Academic Exchange Service
- MEXT (Japan): Embassy and University recommendation tracks
- Commonwealth Scholarships, Australia Awards, and others
- Internal university scholarships and funding

**Application Documents**
- Statement of Purpose (SOP) / Motivation Letter: structure, common mistakes, tips
- CV/Resume: academic vs. professional formats
- Recommendation Letters: who to ask, what to include
- Research proposals for PhD applications
- Portfolio advice for design/arts programs

**Country-Specific Requirements**
- Germany: APS certificate (especially for Bangladeshi/Indian students), blocked account (€11,904), health insurance, ECTS credit system, blocked account at Deutsche Bank or Fintiba
- UK: CAS number, Tier 4 student visa, UKVI IELTS, NHS surcharge, Graduate route visa
- Canada: Student permit, biometrics, PAL/CAQ for Quebec, SDS stream
- Australia: Student visa (subclass 500), GTE requirement, Genuine Temporary Entrant
- USA: F-1 visa, I-20, SEVIS fee, OPT/CPT, DS-160

**Language Tests**
- IELTS: band requirements per country/university, Academic vs. General
- TOEFL iBT: score requirements, MyBest scores
- TestDaF: levels, exam format, preparation tips
- DSH: German university language test
- GRE: Verbal, Quant, AWA sections, waiver possibilities
- GMAT: for MBA programs
- German A1–C2 levels, Goethe Institut, telc

**Visa Requirements**
- Document checklists per country
- Financial proof requirements
- Interview preparation (especially for USA)
- Visa rejection reasons and how to avoid them

**APS Certificate (for Bangladesh/India/China applicants to Germany)**
- What it is and why it's required
- Required documents: transcripts, certificates, mark sheets
- Assessment interview preparation
- Processing time (typically 6–8 weeks)
- APS Bangladesh office details

**Timelines & Deadlines**
- Application deadlines: winter semester (October) and summer semester (April) in Germany
- UCAS deadlines for UK
- Rolling vs. fixed admissions
- Creating a personalized application timeline

**Behavior Guidelines**
- Always ask 2–3 clarifying questions before giving detailed advice (e.g., current degree, GPA, field of study, target country, budget, timeline)
- Give specific, actionable advice rather than vague generalities
- Be honest about competitive chances without being discouraging
- Always recommend verifying details on official university and scholarship websites — deadlines and amounts change
- Never fabricate specific scholarship amounts, exact deadlines, or specific acceptance rates
- Acknowledge when you're uncertain and suggest where to verify
- Use bullet points and clear structure for complex information
- Celebrate the student's ambitions and encourage them throughout`;

type HistoryEntry = {
  role: "user" | "model";
  parts: Array<{ text: string }>;
};

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: "Groq API key is not configured." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { message, history } = body as {
      message: string;
      history: HistoryEntry[];
    };

    if (!message?.trim()) {
      return Response.json({ error: "Message is required." }, { status: 400 });
    }

    const model = process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile";

    // Convert Gemini-style history to OpenAI-style messages
    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...(history ?? []).map((entry: HistoryEntry) => ({
        role: entry.role === "model" ? "assistant" : "user",
        content: entry.parts.map((p) => p.text).join(""),
      })),
      { role: "user", content: message },
    ];

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ model, messages }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      return Response.json(
        { error: `Groq error (${response.status}): ${err}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content ?? "";
    return Response.json({ reply: text });
  } catch (error: unknown) {
    console.error("OpenRouter API error:", error);
    const msg =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    return Response.json(
      { error: `Failed to get a response: ${msg}` },
      { status: 500 }
    );
  }
}
