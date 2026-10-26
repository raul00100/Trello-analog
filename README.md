# Trello Analog - Kanban Board

A modern web application for task management based on the **Kanban methodology**.
Users can create boards, columns, and tasks with intuitive **drag-and-drop functionality** for smooth organization.
The app features **dynamic live wallpapers** for a customizable visual experience and a **global search page** that allows quick navigation across all boards and tasks.

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

* **React** + **TypeScript** + **Vite**
* **Tailwind CSS** — styling and responsive layout
* **Zustand** — theme selection state
* **React Context** — shared board state
* **React Router** — application routing
* **@hello-pangea/dnd** — smooth drag-and-drop interactions
* **React Bits** — background
* **ESLint** and **Prettier** — code quality and formatting
* **Material UI** — icons and additional UI elements

## 📁 Project Structure

```text
src/
  app/
    App.tsx
    router.tsx
    providers/
      SharedProvider.tsx
  features/
    boards/
      components/  BoardPage, BoardSwitcher, columns, and todos
      model/       Board types and local storage
    search/
      components/  SearchPage and SearchHistory
      model/       Search history types
    themes/
      components/  ThemeSelector
      model/       Theme state
  shared/
    components/  Reusable inputs and error page
    lib/         Shared utilities
    styles/      Global styles
  backgrounds/  Animated background implementations
```

Feature-specific UI and model types live together under `features/`. The
`shared/` directory is reserved for elements and context used across features.

---

## 🧑🏻‍💻 Deployment

**Vercel:** [https://trello-analog.vercel.app/](https://trello-analog.vercel.app/)

---

## 🚀 Quick Start

### Prerequisites

* Node.js 16+
* npm or yarn

### Installation & Running

1. **Clone the repository**

```bash
git clone https://github.com/raul00100/Trello-analog.git
cd Trello-analog
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
```

3. **Start the development server**

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
