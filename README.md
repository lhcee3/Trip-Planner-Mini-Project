<h1 align="center" style="font-weight: bold;">AI Trip Planner</h1>

<p align="center">
<a href="#tech">Technologies</a> |
<a href="#features">Features</a> |
<a href="#pre">Prerequisites</a> |
<a href="#setup">Setup</a>
</p>

<p align="center">A full-stack web app that generates AI-powered travel itineraries with hotel recommendations and daily plans. Built with React, powered by Groq LLaMA AI, and backed by Firebase.</p>

<h3 align="center">
<a href="https://github.com/lhcee3/Trip-Planner-Mini-Project" target="_blank">Live Demo</a>
</h3>

<br>

<h2 id="tech">Technologies</h2>

**Frontend:**
- React 18 + Vite
- TailwindCSS
- React Router DOM
- Lucide React / React Icons

**Backend & Services:**
- Groq LLaMA API — AI-powered itinerary generation
- Firebase Firestore — trip data storage
- Firebase Authentication — Google OAuth login
- Nominatim API — location search (OpenStreetMap)
- Google Maps — hotel & place links

<br>

<h2 id="features">Features</h2>

- AI-generated travel itineraries tailored to budget, duration, and group type
- Hotel recommendations with ratings and pricing
- Day-by-day place suggestions with timings and ticket info
- Google OAuth authentication
- Save and revisit past trips
- Responsive UI with smooth animations

<br>

<h2 id="pre">Prerequisites</h2>

- Node.js & npm
- Firebase project with Firestore and Authentication enabled
- Groq API key (get one at [console.groq.com](https://console.groq.com))

<br>

<h2 id="setup">Setup</h2>

1. Clone the repo and install dependencies:
```bash
npm install
```

2. Create a `.env.local` file in the root:
```env
VITE_GROK_API_KEY=your_groq_api_key

VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

3. Run locally:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

5. Deploy to Firebase:
```bash
firebase deploy
```
