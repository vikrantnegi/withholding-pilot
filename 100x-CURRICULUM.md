# 100x curriculum: the parts that matter for the capstone

> **SUPERSEDED 1 Sep 2026 for its main purpose. Kept, not deleted.**
>
> This was read on 30 Aug to answer "where do participants come from", and it answered:
> the cohort's low-code path. **On 1 Sep, 100x ruled that out** — cohort members cannot be
> participants (`CAPSTONE-RULES.md` A1, `RECRUITMENT.md` section 1). The pool is workplace
> non-engineering colleagues instead.
>
> So three sections below argue for a pool that does not exist: *the two execution paths*
> (the recruitment finding), *contamination check*, and *why this pool strengthens the case
> study*. Read them as the plan that was replaced, not as guidance.
>
> **Two things here are still live.** The module map at the bottom is factual context on where
> C7 sits in the program. And the observation that the cohort institutionalises the exact
> tradeoff the study measures — people shipping without writing the code, output arriving while
> skill does not — still motivates *why the question is worth asking*, independent of who the
> participants turned out to be. That is write-up material.
>
> Kept because FAQ rule B4 applies to plans as well as hypotheses: the before and the after are
> the deliverable. The pool changing, and why, is part of the story.

Source: https://www.100xengineers.com/#6mojourney (read 30 Aug 2026)
Note: the public page shows the Cohort 9 (Dec 2026) layout. Week numbers may shift for C7.
The two-path structure and the tool lists are the same.

---

## The two execution paths (the recruitment finding)

The cohort splits every module into a code path and a low-code path. Same concepts, different
tooling. The stated admissions line: *"Know how to code? Awesome. Don't know how to code? No
problem."* Prerequisites are *"Six months commitment to learning, applied curiosity, & an
openness to build."* There is no programming requirement.

| | CODE PATH | LOW-CODE PATH |
|---|---|---|
| Stated audience | "Software engineers, data scientists, technical founders" | "Product managers, founders, marketers, business leaders, designers" |
| Language / workflow | Python | n8n |
| API | FastAPI, Pydantic | n8n |
| UI | Streamlit, Gradio, JS | Figma, Framer, Retool |
| Database | Supabase | Airtable, Supabase, Google Sheets |
| Build tools | Cursor, Claude Code, Playwright, CodeRabbit | Lovable, Bolt, Rork ("VibeCode") |
| Agents | OpenAI Agents SDK, Claude Agent SDK, Google ADK | n8n AI Agents, Langflow, OpenAI Agent Builder Kit, Gemini AI Studio |
| LLM inference | HF Transformers, Ollama, Groq Cloud | LM Studio, Groq Cloud |
| Shared by both | PgVector, Firecrawl, PostHog, Resend/Stripe/Razorpay, Shopify, Unsloth | same as CODE PATH |

Why this matters: the low-code path is a group of motivated non-programmers. They are already
in the building, already committed to a 6-month program, and already in the Discord. That is
the participant pool. They are peers, not strangers you have to recruit.

---

## Contamination check (the caveat that goes with it)

Both paths take "Intro to Database" in the Full Stack Foundations module (~Week 12 in the
public layout). Supabase is named in the low-code path's own database stack. C7 is past that
point, because teaching is in the Agents module now.

So low-code path members have *seen* Supabase. That cuts two ways.

Good for retention. The environment won't be alien. The brief's stated failure mode is
learners abandoning your tool for the chatbot in the next tab. Familiarity with Supabase
lowers that friction. Onboarding cost drops to near zero.

Bad for the clean floor. Some will have written a SELECT. Exposure is not ability. You do not
have to guess who is which, because the screener settles it per person in about a minute.
Q2 (write the two-table join) is the only question that decides anything.

Net: the screener matters more now, not less. Do not skip it because "they're low-code."

---

## Why this pool strengthens the case study, not just the logistics

The low-code path is built so that people ship without writing the code themselves: n8n
instead of Python, Lovable/Bolt instead of an editor. That is the population the Bastani
finding describes. Output arrives, skill does not.

So the capstone isn't "I recruited six people off Discord." It's "I tested assisted
independence on the population the program itself routes around code." The cohort has
institutionalised the exact tradeoff the Learning OS brief asks you to measure. Say that in
the write-up. It turns a recruitment convenience into a reason the experiment is worth running.

One honest caveat to hold: they are also unusually motivated, which is not the general
population. Note it as a limitation rather than letting a reviewer find it.

---

## Full module map (context, not action)

- Diffusion, Weeks 1-7: SDXL & ComfyUI, ControlNet/IP adapters, Flux models & LoRA
  training, Wan video, video inpainting/outpainting, InfiniteTalk & HuMo, deploying to Replicate
- Week 8: mid-capstone project + catchup
- LLM: Full Stack Foundations, Weeks 10-14: Intro to Python (code) / n8n (no-code),
  UI/UX, APIs, Database, LLMs & Prompt Engineering, VibeCode, Launch your MVP
- Week 15: MVP building + mini hackathon
- LLM: Deepdive, Weeks 16-18: Tool Calling & MCP, RAG, Advanced RAG, LLM Memory,
  LLM Apps, Fine-tuning with PEFT, Data Pre-Processing, LLM Evaluation
- AI Agents, Weeks 19-23: intro, first agent, multi-agent systems, SDK hands-on,
  guardrails/monitoring/eval, agentic workflows, deployment & production patterns
