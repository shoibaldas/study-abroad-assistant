# Study Abroad Assistant

An AI-powered chatbot that helps international students — especially from South Asia and Bangladesh — navigate university applications, scholarships, visa requirements, and study abroad opportunities.

## Features

- Personalized guidance on universities in Germany, UK, Canada, Australia, and the USA
- Scholarship information: DAAD, Chevening, Fulbright, Erasmus Mundus, MEXT, and more
- Country-specific visa and document requirements
- Language test guidance (IELTS, TOEFL, TestDaF, GRE, GMAT)
- APS certificate guidance for Bangladeshi/Indian applicants to Germany
- Application document tips: SOP, CV, recommendation letters
- Suggested questions sidebar for quick access to common topics
- Responsive design with mobile drawer navigation
- Animated typing indicator and auto-scrolling chat

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **AI:** OpenRouter API (configurable model)

## Getting Started

### Prerequisites

- Node.js 18+
- An [OpenRouter](https://openrouter.ai) API key

### Installation

```bash
git clone https://github.com/your-username/study-abroad-assistant.git
cd study-abroad-assistant
npm install
```

### Configuration

Create a `.env.local` file in the project root:

```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
OPENROUTER_MODEL=google/gemma-4-26b-a4b-it:free
```

You can swap `OPENROUTER_MODEL` for any model available at [openrouter.ai/models](https://openrouter.ai/models).

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
app/
  api/chat/route.ts   # OpenRouter API handler
  layout.tsx
  page.tsx
components/
  ChatWindow.tsx      # Main chat UI and state management
  MessageBubble.tsx   # Individual message rendering
  Sidebar.tsx         # Suggested questions and clear chat
  SuggestedQuestions.tsx
```

## Deployment

Deploy on [Vercel](https://vercel.com) by importing the repository and adding `OPENROUTER_API_KEY` and `OPENROUTER_MODEL` as environment variables in the project settings.
