## PracticeGerman

PracticeGerman is a web app that helps you improve your German language skills.

Unlike other language apps with fixed course content, we believe language learning should have no limits. That’s why we use state-of-the-art AI models to teach you German at  your own level and pace.

We noticed that many learners finish structured courses but still struggle to communicate outside the textbook. **PracticeGerman** is built to complement your course and focus on what matters most:  *practice* .

💡 Inspired by a [YouTube video](https://www.youtube.com/watch?v=Mg9sF6JC5lk), we recommend using the app to  **describe your daily routine in German every evening** . Just write as much as you can, even if you’re unsure. The app will give you corrections, feedback, and native German alternatives.

👉 Try the web app [here](https://practicegerman.vercel.app/)

## Tech Stack

* **Next.js 15.5.3**
* **Tailwind CSS**
* **shadcn/ui + Radix UI**
* **OpenAI API**
* **Vercel** – hosting and deployment
* **PostgreSQL (planned)** – database for storing resources and user progress
* **Supabase (planned)** – backend and authentication

## Running the app locally

1. Install dependencies using:
   ```
   npm install
   ```
2. Create .env.local
3. Get an API Key from openai
4. Add your API Key to .env.local as:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```
5. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## Implemented

* [X] Homepage
* [X] Sentence practice
* [X] Backend supports multiple languages and can teach in multiple languages
* [X] Feedback tuned for A1 users
* [X] Extend UI to support multiple languages and dynamic language levels
* [X] Add audio playback and word highlighting to practice feedback

## TODO

* [ ] Add unimplemented pages such as: about, contact, privacy, terms
* [ ] Replace hardcoded strings with i18n
* [ ] Add Authentication
* [ ] Connect database (probably PostgreSQL from Supabase)
* [ ] Add video lessons and resources
