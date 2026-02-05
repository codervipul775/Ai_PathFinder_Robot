# 🤖 AI Pathfinding Robot - Premium Edition

A high-performance, aesthetically stunning pathfinding visualizer built with React, Vite, Framer Motion, and Zustand.

---

## ✨ Features

- **5 Advanced Algorithms**: A*, Dijkstra, BFS, DFS, and Greedy Best-First Search.
- **Premium Cyber-Glass UI**: Modern dark-theme dashboard with glowing neon accents and glassmorphism.
- **Interactive Terrain**: Draw 3D-styled walls and weighted terrains (Grass, Water, Mountain).
- **Aesthetic Visualization**: Liquid-like "Sky Blue" node animations and golden path flows.
- **3D Robot Design**: A custom CSS-based 3D robot with animations that navigates the optimal path.
- **Instant Stats**: Real-time analytics on node visits, path length, and execution time.

---

## 🚀 One-Click Deployment

This project is optimized for deployment on **Vercel**.

### Deployment Settings:
- **Framework Preset**: `Vite`
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

---

## 🛠️ Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/codervipul775/Ai_PathFinder_Robot.git
   ```
2. **Navigate to the frontend directory**:
   ```bash
   cd Ai_PathFinder_Robot/frontend
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Run the dev server**:
   ```bash
   npm run dev
   ```

---

## 🏗️ Tech Stack

- **Frontend**: React 19, Vite, TypeScript
- **Styling**: Vanilla CSS (Cyber-Glass Design System)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **State Management**: Zustand

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
