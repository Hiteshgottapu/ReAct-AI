
# 🔍 ReAct-AI: Autonomous Research Assistant

A full-stack, AI-powered research assistant built using **Next.js**, **Firebase**, **Tailwind CSS**, and **Gemini** (or OpenAI). The app allows users to sign up, log in, submit a research question or link, and receive a concise AI-generated summary using the **ReAct (Reasoning + Acting)** paradigm.

---

## 🚀 Features

- ✅ User Authentication (Firebase Auth)
- ✅ Firestore Database to store research history
- ✅ Gemini/OpenAI integration for LLM-powered responses
- ✅ ReAct-style reasoning & summarization
- ✅ YouTube & Website link analysis support
- ✅ Fully responsive UI with TailwindCSS
- ✅ Firebase Hosting & deployment ready


## 📁 Tech Stack

| Tech         | Usage                        |
|--------------|------------------------------|
| Next.js      | React-based frontend framework |
| Firebase     | Auth, Firestore, Hosting      |
| Tailwind CSS | Styling                       |
| Gemini API   | LLM (alternatively GPT-4)     |
| TypeScript   | Static typing support         |

---

## 📦 Folder Structure

```

/
├── .env                   # Environment variables
├── src/                  # Source files
│   ├── components/       # Reusable UI components
│   ├── pages/            # Next.js routes
│   ├── utils/            # Helper functions (e.g., Gemini API)
│   └── styles/           # Tailwind & global styles
├── public/               # Static assets
├── firebase.json         # Firebase hosting config
├── tailwind.config.ts    # Tailwind setup
└── README.md             # You’re reading it now!

````

---

## ⚙️ Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/Hiteshgottapu/react-research-agent.git
cd react-research-agent
````

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Firebase

* Create a Firebase project
* Enable Authentication and Firestore
* Get your Firebase config and paste it into `.env`

### 4. Add environment variables

Create a `.env` file in the root:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
GEMINI_API_KEY=your_google_ai_key
```

### 5. Run the app locally

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## 🌐 Deploy to Firebase

```bash
npm run build
firebase deploy
```

Make sure Firebase CLI is configured (`firebase login`, `firebase init`)

---

## ✨ Screenshots

> Add screenshots of login page, dashboard, and research results.

---

## 🤖 AI Agent (ReAct)

The AI agent uses the ReAct framework:

1. **Reason**: Should a search or link analysis be performed?
2. **Act**: Fetches info from YouTube/website or past research
3. **Generate**: Summarizes with Gemini using retrieved knowledge

Prompt is structured as:

```txt
Context:
[retrieved data or transcript]

User Question:
[question or topic]

Generate a summary including:
- Title
- Introduction
- Key Insights
- Conclusion
```

---

---

## 👨‍💻 Author

**Gottapu Hitesh**
📧 [hiteshgottapu@gmail.com](mailto:hiteshgottapu@gmail.com)
🌐 [Portfolio](https://hiteshgottapuprotfolio.netlify.app)
🔗 [LinkedIn](https://linkedin.com/in/hitesh-data-scientist)
💻 [GitHub](https://github.com/Hiteshgottapu)

---
