# AutoWA Pro 🚀

> **Multi-tenant WhatsApp AI Automation SaaS for Indian Businesses**

[![Live](https://img.shields.io/badge/Live-autowapro.com-brightgreen)](https://autowapro.com)
[![Stack](https://img.shields.io/badge/Stack-Next.js%20%7C%20Node.js%20%7C%20Supabase-blue)]()
[![Status](https://img.shields.io/badge/Status-Production-success)]()

---

## What is AutoWA Pro?

AutoWA Pro lets Indian small businesses run WhatsApp chatbots, bulk broadcasts, and automated customer conversations — without writing a single line of code.

A restaurant owner sets up an order enquiry bot. A coaching institute automates admissions replies. A real estate agent follows up with 500 leads overnight. All from one dashboard. All without a developer.

**Built entirely solo. Deployed to real users.**

---

## Features

- **Visual Flow Builder** — Drag-and-drop no-code chatbot builder powered by ReactFlow
- **AI-Powered Replies** — Groq AI fallback handles natural language when no keyword matches
- **Bulk Broadcasts** — Send templated messages to segmented contact lists with delivery analytics
- **Multi-Number Support** — Connect multiple WhatsApp numbers per account (plan-based limits)
- **Appointment Booking** — Slot-based booking node with 7-day lookahead and IST reset
- **Google Sheets Integration** — Log form responses and leads directly to spreadsheets via OAuth
- **Media Support** — Send images, audio, video, and documents through flows
- **Razorpay Billing** — Subscription plans with plan-gated features
- **Multi-Tenant** — Every user's data is fully isolated; platform supports unlimited businesses

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, React, Tailwind CSS, ReactFlow |
| Backend | Node.js, Express, REST API, JWT Auth |
| Database | PostgreSQL via Supabase (multi-tenant schema) |
| WhatsApp | WhatsApp Cloud API + Baileys |
| AI | Groq AI (LLM fallback for natural language) |
| Media Storage | Cloudinary (documents as `raw`, audio as `video`) |
| Payments | Razorpay Subscriptions |
| Integrations | Google Sheets & Drive (per-user OAuth) |
| Deployment | Vercel (frontend) + Railway (backend) |

---

## Architecture Overview

```
User Dashboard (Next.js / Vercel)
        │
        ▼
REST API (Node.js / Railway)
        │
   ┌────┴────┐
   │         │
Supabase   WhatsApp
PostgreSQL  Cloud API
             +
           Baileys
             │
        ┌────┴────┐
        │         │
   Automation   Groq AI
    Engine     (NLP fallback)
        │
   Google Sheets / Cloudinary
```

---

## How the Automation Engine Works

1. Incoming WhatsApp message hits the webhook
2. Engine checks if user has an active flow session
3. Matches message against flow node conditions (keywords, button clicks, input capture)
4. If no match → Groq AI generates a contextual reply
5. Advances session to next node, sends response
6. Dead-end / payment nodes trigger follow-up scheduler

---

## Key Engineering Decisions

- **`resource_type: raw`** for Cloudinary document uploads — `auto` misclassifies PDFs as images, breaking downloads
- **Upload-then-send-by-media-ID** pattern for Cloud API documents — avoids URL send failures
- **Baileys `@lid` JID deduplication** — prevents ghost conversations from WhatsApp's internal IDs
- **Soft-delete on WhatsApp numbers** — preserves message history when a number is removed
- **IST midnight reset** via UTC offset for appointment slot daily limits

---

## Live Demo

🌐 [autowapro.com](https://autowapro.com)

---

## About the Developer

Built by **P. Praveen** — self-taught full stack developer and founder based in Hyderabad, India.

- 📧 pamulapraveen3@gmail.com
- 🔗 [autowapro.com](https://autowapro.com)
- 💻 [github.com/pamulapraveen33-droid](https://github.com/pamulapraveen33-droid)

---

*Built with Node.js, Next.js, Supabase, WhatsApp Cloud API, Groq AI, and a lot of late nights.*
