# Accestique - Setup Instructions

## Prerequisites
It seems that **Node.js** and **npm** are missing from your environment.
Please install them to proceed with the Next.js application.
Recommended version: Node.js 18+

## What has been built?
I have generated the core components and logic requested:

1.  **Supabase Schema (`supabase/schema.sql`)**:
    - Includes tables for `articles`, `tutorials`, `categories`, and `commands`.
    - RLS policies and triggers are set up.
    - Run this SQL script in your Supabase SQL Editor.

2.  **Cheatsheet Component (`components/CheatsheetCard.tsx`)**:
    - A Cyberpunk-themed component to display commands with copy-paste functionality and syntax highlighting support.

3.  **Aggregation Logic (`lib/aggregator.ts`)**:
    - A TypeScript module to fetch RSS feeds, classify content (e.g., "Network Security", "Blue Team"), and prepare for translation.

## Next Steps

1.  **Initialize Next.js**:
    Since the directory was not empty (I created the folders above), `create-next-app` might complain.
    You can move the `supabase`, `components`, and `lib` folders to a safe place, run the initialization command, and then move them back.

    ```bash
    npx -y create-next-app@latest . --typescript --tailwind --eslint
    ```

2.  **Install Dependencies**:
    You will need to install the libraries used in the generated code:

    ```bash
    npm install lucide-react @splinetool/react-spline @supabase/supabase-js
    ```

3.  **Configure Tailwind CSS**:
    Update your `tailwind.config.ts` to include the Cyberpunk colors:

    ```typescript
    theme: {
      extend: {
        colors: {
          cyan: {
            400: '#00FFFF', // Cyberpunk Cyan
            500: '#00D9D9',
          },
          'neon-green': '#39FF14',
        },
      },
    },
    ```

4.  **Connect Supabase**:
    Create a `.env.local` file with your Supabase credentials:
    ```
    NEXT_PUBLIC_SUPABASE_URL=your-project-url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
    ```
