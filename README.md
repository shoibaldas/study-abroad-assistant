# Study Abroad Assistant

A lot of students from Bangladesh and South Asia want to study abroad but don't know where to start. The process is genuinely overwhelming — different scholarship deadlines, country-specific visa rules, APS certificates, blocked accounts, SOPs. Most people either give up early or spend weeks piecing together information from a dozen different websites.

I built this to fix that. It's an AI chatbot that acts like a knowledgeable advisor — one that knows the DAAD process, understands what Chevening looks for in an essay, and can walk you through the F-1 visa requirements without making you feel lost. You ask questions in plain language and get clear, structured answers.

## What it covers

- University matching based on your GPA, budget, field, and target country
- Scholarships: DAAD, Chevening, Fulbright, Erasmus Mundus, MEXT, Australia Awards, and more
- Visa requirements and document checklists for Germany, UK, Canada, Australia, and the USA
- APS certificate process for Bangladeshi and Indian applicants
- Language tests: IELTS, TOEFL, TestDaF, GRE, GMAT
- SOP and CV writing tips, recommendation letter guidance
- Application timelines and deadline planning

## Built with

- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS v4**
- **OpenRouter API** — model-agnostic, swap any LLM via one env variable

## Running it locally

You'll need a free [OpenRouter](https://openrouter.ai) API key.

```bash
git clone https://github.com/your-username/study-abroad-assistant.git
cd study-abroad-assistant
npm install
```

Create a `.env.local` file:

```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
OPENROUTER_MODEL=google/gemma-4-26b-a4b-it:free
```

Any model from [openrouter.ai/models](https://openrouter.ai/models) works — just swap the model ID. Free models are available.

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
app/
  api/chat/route.ts     # OpenRouter API handler with full system prompt
  page.tsx
components/
  ChatWindow.tsx        # Chat UI, state, and message history
  MessageBubble.tsx     # Message rendering with markdown support
  Sidebar.tsx           # Suggested questions, clear chat
  SuggestedQuestions.tsx
```
