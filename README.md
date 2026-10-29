# Management Tool - Kanban Board

A modern web application for task management based on the **Kanban methodology**.
Users can create boards, columns, and tasks with intuitive **drag-and-drop functionality** for smooth organization.
The app features **dynamic live wallpapers** for a customizable visual experience and a **global search page** that allows quick navigation across all boards and tasks.
Boards are stored in Supabase and associated with the signed-in user.

---

## ✨ Features

* 📋 **Task Management** — Add, edit, and delete tasks
* 🗂️ **Kanban Columns** — Organize tasks by status (To Do, In Progress, Done)
* 🎯 **Drag & Drop** — Intuitive task movement between columns
* 🔍 **Global Search** — Quickly find boards and tasks across the app
* 🪄 **Live Wallpapers** — Animated backgrounds for better user experience
* 📱 **Responsive Design** — Fully functional on desktop and mobile

---

## 🛠️ Tech Stack

* **Next.js** + **React** + **TypeScript**
* **Tailwind CSS** — styling and responsive layout
* **Zustand** — theme selection state
* **React Context** — shared board state
* **Supabase** — PostgreSQL database and email/password authentication
* **@hello-pangea/dnd** — smooth drag-and-drop interactions
* **React Bits** — background
* **ESLint** and **Prettier** — code quality and formatting
* **Material UI** — icons and additional UI elements

## 📁 Project Structure

```text
src/
  app/
    App.tsx
    board/[id]/page.tsx
    search/page.tsx
    theme/page.tsx
    providers/
      SharedProvider.tsx
  features/
    boards/
      components/  BoardPage, BoardSwitcher, columns, and todos
      model/       Board types and Supabase persistence
    search/
      components/  SearchPage and SearchHistory
      model/       Search history types
    themes/
      components/  ThemeSelector
      model/       Theme state
  shared/
    components/  Reusable inputs and error page
    lib/         Supabase client
    styles/      Global styles
  backgrounds/  Animated background implementations
```

Feature-specific UI and model types live together under `features/`. The
`shared/` directory is reserved for elements and context used across features.

---

## 🧑🏻‍💻 Deployment

The original repository is available at [github.com/raul00100/Trello-analog](https://github.com/raul00100/Trello-analog).

---

## 🚀 Quick Start

### Prerequisites

* Node.js 18.18+
* npm or yarn

### Supabase setup

1. Create a Supabase project. Configure email/password authentication and set the site's URL/redirect URLs for local development and deployment. Anonymous sign-ins are not required.
2. Run [`supabase/migrations/20261029000000_create_boards.sql`](./supabase/migrations/20261029000000_create_boards.sql) in the Supabase SQL Editor. The table uses row-level security so a session can only access its own boards.
3. Copy `.env.example` to `.env.local` and set the project URL and publishable/anon key:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-public-anon-key
   ```

   The anon key is intended for browser apps; RLS policies enforce data access. Never put a `service_role` key in a `NEXT_PUBLIC_` variable.
4. Install dependencies and start the app as described below.

Registration creates an email/password account directly. Boards are created and stored only after the user signs in. Boards from previous anonymous sessions or legacy browser storage are not imported; any leftover anonymous session from an older app version is signed out. Google sign-in and account recovery are not configured yet.

For Vercel, add the same two public environment variables to the project's Environment Variables and redeploy. Configure the production site URL and redirect URL in Supabase before registering accounts from the deployed app.

### Installation & Running

1. **Clone the repository**

```bash
git clone https://github.com/raul00100/Trello-analog.git management-tool
cd management-tool
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
```

3. **Configure Supabase** by following the setup above.

4. **Start the development server**

```bash
npm run dev
# or
yarn dev
```

### Production Build

```bash
npm run build
# or
yarn build
```
