# Thai Reading App (thai-exercise)

A Next.js-based web application designed for practicing Thai reading and pronunciation, focusing on the Thai alphabet and basic words.

## Project Overview

*   **Main Technologies:**
    *   **Framework:** [Next.js](https://nextjs.org/) (App Router)
    *   **UI Library:** [React](https://react.dev/) 19, [Ant Design](https://ant.design/), [DaisyUI](https://daisyui.com/)
    *   **Styling:** [Tailwind CSS](https://tailwindcss.com/) (v4), [PostCSS](https://postcss.org/)
    *   **Voice Synthesis:** [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis) (implemented in `app/utils/voice.ts`)
    *   **Effects:** `canvas-confetti`, `@tsparticles/react`
*   **Architecture:**
    *   The project follows a standard Next.js App Router structure.
    *   `app/`: Contains the pages, layouts, and sub-directories for different exercises.
        *   `app/Home/`: Landing page content.
        *   `app/exercise/`: Alphabet practice (Exercise 1).
        *   `app/exercise_2/`: Word practice (Exercise 2).
        *   `app/character/`: Sprite-based animations (likely for the player character).
        *   `app/components/`: Reusable UI components (Score, PartyPopper, etc.).
        *   `app/utils/`: Utility functions, including voice synthesis logic.
    *   `public/`: Stores static assets and JSON data sources (`thai-alphabet.json`, `word.json`).

## Building and Running

Key commands for development and production:

*   **Development:**
    ```bash
    npm run dev
    ```
*   **Build:**
    ```bash
    npm run build
    ```
*   **Start Production Server:**
    ```bash
    npm run start
    ```
*   **Linting:**
    ```bash
    npm run lint
    ```

## Development Conventions

*   **Client Components:** Use `"use client";` at the top of files that utilize React hooks (state, effects, etc.) or interact with browser APIs.
*   **Voice Synthesis:** Use the `speak` utility from `app/utils/voice.ts` for consistent Thai pronunciation.
*   **Data Sources:** Exercise data is centrally managed in `public/thai-alphabet.json` and `public/word.json`.
*   **Styling:** Mixes Tailwind CSS (for layout and spacing) with Ant Design and DaisyUI for complex components.

## Key Files

*   `app/utils/voice.ts`: Core logic for Thai voice synthesis.
*   `app/exercise/ExerciseOne.tsx`: Main logic for the alphabet exercise, including scoring and randomization.
*   `public/thai-alphabet.json`: Data structure for Thai characters and their corresponding pronunciation cues.
