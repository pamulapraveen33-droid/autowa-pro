# AutoWA Pro 🚀
### WhatsApp CRM & Automation SaaS Platform

Built with **Next.js 14** + **Express** + **PostgreSQL (Supabase)** + **WhatsApp Cloud API**

---

## Project Structure

```
autowapro/
├── backend/                  ← Express API (deploy to Railway/Render)
│   ├── server.js             ← Entry point
│   ├── .env.example          ← Copy to .env
│   ├── db/
│   │   └── schema.sql        ← Run this in Supabase SQL Editor
│   ├── controllers/          ← Business logic
│   │   ├── authController.js
│   │   ├── leadsController.js
│   │   ├── templatesController.js
│   │   ├── automationsController.js
│   │   ├── messagesController.js
│   │   ├── webhookController.js
│   │   └── adminController.js
│   ├── routes/               ← Express routes
│   ├── services/
│   │   ├── whatsappService.js    ← WhatsApp Cloud API calls
│   │   ├── automationEngine.js  ← Keyword/first-msg triggers
│   │   └── followupScheduler.js ← node-cron scheduler
│   ├── middleware/
│   │   ├── auth.js           ← JWT middleware
│   │   └── admin.js          ← Admin check
│   └── utils/
│       └── db.js             ← PostgreSQL pool
│
└── frontend/                 ← Next.js 14 (deploy to Vercel)
    ├── app/
    │   ├── page.js           ← Marketing home
    │   ├── pricing/          ← Pricing page
    │   ├── services/         ← Services page
    │   ├── about/            ← About page
    │   ├── contact/          ← Contact page
    │   ├── login/            ← Auth pages
    │   ├── signup/
    │   └── dashboard/
    │       ├── page.js       ← Dashboard home (stats)
    │       ├── leads/        ← Lead management + CSV import
    │       ├── templates/    ← Message templates
    │       ├── automations/  ← Automation rules engine
    │       ├── messages/     ← Chat interface
    │       ├── settings/     ← WhatsApp connection
    │       └── admin/        ← Admin panel
    ├── lib/
    │   ├── api.js            ← Axios API client
    │   └── auth.js           ← Auth context / hooks
    └── components/
        └── marketing/
            ├── Navbar.js
            └── Footer.js
```

---

## 1. Setup: Database (Supabase)

1. Go to [supabase.com](https://supabase.com) → New Project
2. Open **SQL Editor**
3. Paste and run the contents of `backend/db/schema.sql`
4. Copy your **Connection String** from: Settings → Database → Connection string → URI

---

## 2. Setup: Backend

```bash
cd backend
cp .env.example .env
# Fill in all values in .env
npm install
npm run dev
```

Backend runs at: `http://localhost:4000`

### .env values explained:

| Key | Where to get it |
|-----|----------------|
| `DATABASE_URL` | Supabase → Settings → Database → URI |
| `JWT_SECRET` | Any random 32+ char string |
| `WHATSAPP_ACCESS_TOKEN` | Meta Business → System Users → Token |
| `WHATSAPP_PHONE_NUMBER_ID` | Meta App → WhatsApp → API Setup |
| `WHATSAPP_VERIFY_TOKEN` | Any string you choose |
| `ADMIN_EMAIL` | Your email — auto-assigned admin on signup |

---

## 3. Setup: Frontend

```bash
cd frontend
cp .env.local.example .env.local
# Set NEXT_PUBLIC_API_URL=http://localhost:4000/api
npm install
npm run dev
```

Frontend runs at: `http://localhost:3000`

---

## 4. Connect WhatsApp Webhook

### Step 1: Make your backend publicly accessible
- **Local dev**: Use [ngrok](https://ngrok.com): `ngrok http 4000`
- **Production**: Deploy to Railway/Render (get your URL)

### Step 2: Configure in Meta Developer Console
1. Go to [developers.facebook.com](https://developers.facebook.com)
2. Create/open your App → Add **WhatsApp** product
3. Go to: **WhatsApp → Configuration → Webhooks**
4. Set:
   - **Callback URL**: `https://your-backend-url.com/api/webhook`
   - **Verify Token**: Same value as `WHATSAPP_VERIFY_TOKEN` in your .env
5. Click **Verify and Save**
6. Subscribe to **messages** field

### Step 3: Set user's WhatsApp credentials
Each user sets their own credentials in: **Dashboard → Settings**

---

## 5. Automation Engine

The automation engine runs entirely in backend code (no n8n/external tools).

### How it works:

```
Inbound Message
      ↓
webhookController.js
      ↓
Save lead + message to DB
      ↓
automationEngine.processAutomation()
      ↓
Loop through user's active automation rules:
  ├── trigger_type: "keyword"      → Check if message contains keyword
  ├── trigger_type: "first_message" → Check if this is lead's first message
  └── trigger_type: "no_reply"     → Handled by scheduler (every 5 mins)
      ↓
If matched:
  ├── delay_minutes = 0  → Send reply immediately
  └── delay_minutes > 0  → Insert into followups table (scheduled)
```

### Follow-up Scheduler (node-cron):
- Runs **every minute**: sends any pending scheduled follow-ups
- Runs **every 5 minutes**: checks for leads with no reply and triggers no_reply automations

---

## 6. Deployment

### Frontend → Vercel
```bash
cd frontend
# Push to GitHub → Import on vercel.com
# Set env var: NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api
```

### Backend → Railway
```bash
# Push to GitHub → Import on railway.app
# Add all .env variables in Railway dashboard
# Railway auto-detects Node.js and runs npm start
```

---

## 7. API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Create account |
| POST | `/api/auth/login` | Login |
| GET  | `/api/auth/me` | Get current user |
| PUT  | `/api/auth/whatsapp-settings` | Update WA credentials |

### Leads
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/leads` | List leads (search, filter, paginate) |
| GET | `/api/leads/stats` | Dashboard stats |
| GET | `/api/leads/:id` | Lead detail |
| PUT | `/api/leads/:id` | Update lead |
| DELETE | `/api/leads/:id` | Delete lead |
| POST | `/api/leads/import/csv` | CSV import |

### Templates, Automations, Messages — full CRUD at:
`/api/templates`, `/api/automations`, `/api/messages`

### Webhook
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET  | `/api/webhook` | WhatsApp verification |
| POST | `/api/webhook` | Inbound message handler |

### Admin (admin users only)
`GET /api/admin/stats` `GET /api/admin/users` `PATCH /api/admin/users/:id/suspend` `DELETE /api/admin/users/:id`

---

## 8. CSV Import Format

| Column | Required |
|--------|----------|
| phone  | ✅ Yes |
| name   | Optional |
| email  | Optional |
| service | Optional |
| notes  | Optional |

---

## 9. Multi-Tenancy

Every table has `user_id`. All queries filter by `req.user.id` (set by JWT middleware). Users can never access other users' data.

Each user stores their OWN `whatsapp_phone_number_id` and `whatsapp_access_token`. The webhook identifies the right user by matching the incoming `phone_number_id` to the users table.

---

## 10. Next Steps / Roadmap

- [ ] Add Razorpay/Stripe payment integration
- [ ] WhatsApp template message support (approved templates)
- [ ] Message broadcast / bulk send
- [ ] Real-time messages with Socket.io
- [ ] Email notifications for new leads
- [ ] White-label support
