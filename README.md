# BESTEAMHN AI Tutor

## English

BESTEAMHN AI Tutor is a bilingual education platform built for STEM learning in Honduras. The app combines AI tutoring, course management, mini games, student progress, certificates, workshops, leaderboards, and Solana-powered STEAM rewards.

The frontend is built with React, Vite, TypeScript, Tailwind CSS, Supabase, and Solana wallet tooling. The Solana program/token deployment is handled through Solana Playground.

### Main Features

- Student, educator, and admin authentication with Supabase Auth.
- Course catalog with editable courses, modules, presentations, videos, quizzes, and assigned games.
- Educator course dashboard to manage created courses.
- Mini games that can be played freely or attached to courses.
- AI tutor powered through a Supabase Edge Function.
- Leaderboard with a top-three podium.
- Notifications for course updates, progress, rewards, and games.
- Solana wallet connection using Phantom on Devnet.
- STEAM SPL token reward balance and minting through Supabase Edge Functions.

### Tech Stack

- React 18
- Vite
- TypeScript
- Tailwind CSS
- Supabase Auth, Database, and Edge Functions
- Solana Web3.js and Wallet Adapter
- Framer Motion
- Recharts
- Radix UI components

### Requirements

- Node.js 18 or newer
- npm
- A Supabase project
- A Solana Devnet wallet, such as Phantom
- A STEAM SPL token mint deployed on Solana Devnet

### Environment Setup

Create a local environment file:

```bash
cp .env.example .env
```

Then fill in:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_STEAM_MINT_ADDRESS=
```

The real `.env` file is ignored by Git and should not be committed.

### Running Locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL printed by Vite, usually:

```text
http://localhost:5173
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

Run linting:

```bash
npm run lint
```

### Supabase Notes

The frontend uses Supabase for authentication, profile/course data, certificates, and Edge Functions.

Important Edge Functions:

- `supabase/functions/ai-tutor`: calls Gemini for the AI tutor.
- `supabase/functions/mint-steam`: mints STEAM SPL tokens on Solana Devnet.

Supabase Edge Function secrets are configured in the Supabase dashboard or CLI, not in the frontend `.env`:

```env
GEMINI_API_KEY=
STEAM_MINT_ADDRESS=
STEAM_MINT_AUTHORITY=
```

`STEAM_MINT_AUTHORITY` should be a base64-encoded Solana keypair secret for the mint authority. Do not expose it in the frontend or commit it.

### Solana Notes

The app is configured for Solana Devnet. Users can connect a Phantom wallet, view STEAM token balance, and receive STEAM rewards after completing course activities.

The Solana deployment is handled in Solana Playground. The current frontend keeps the program connection/demo logic in:

```text
src/lib/solana/program.ts
```

The STEAM token mint address must be placed in:

```env
VITE_STEAM_MINT_ADDRESS=
```

The minting process itself runs server-side in Supabase Edge Functions to keep the mint authority private.

### Production Build

Recommended deployment setup for any static hosting provider:

1. Push the repository to GitHub.
2. Configure the environment variables from `.env.example`.
3. Build command:

```bash
npm run build
```

4. Output directory:

```text
dist
```

### Project Structure

```text
src/
  components/      Shared UI, layout, wallet sync, games
  hooks/           Toasts, STEAM balance, Solana helpers, game XP
  lib/             Auth, Supabase client, i18n, course state, notifications
  pages/           Main app pages and dashboards
  data/            Game mock data
  types/           Game types
supabase/
  functions/       Edge Functions for AI tutor, STEAM minting, auth helpers
```

### Security Notes

- Never commit `.env`.
- Never expose `STEAM_MINT_AUTHORITY` in browser code.
- Supabase anon keys are public by design, but database access must be protected with Row Level Security.
- Use Devnet wallets/tokens for testing.

---

## Español

BESTEAMHN AI Tutor es una plataforma educativa bilingüe para aprendizaje STEM en Honduras. La app combina tutoría con IA, gestión de cursos, mini juegos, progreso estudiantil, certificados, talleres, clasificaciones y recompensas STEAM impulsadas por Solana.

El frontend está construido con React, Vite, TypeScript, Tailwind CSS, Supabase y herramientas de Solana Wallet Adapter. El despliegue del programa/token de Solana se maneja desde Solana Playground.

### Funcionalidades Principales

- Autenticación de estudiantes, educadores y administradores con Supabase Auth.
- Catálogo de cursos con cursos editables, módulos, presentaciones, videos, pruebas y juegos asignados.
- Dashboard de educador para administrar cursos creados.
- Mini juegos que se pueden jugar libremente o asignar a cursos.
- Tutor IA por medio de Supabase Edge Function.
- Clasificación con podio de top 3.
- Notificaciones para cursos, progreso, recompensas y juegos.
- Conexión de wallet Solana con Phantom en Devnet.
- Balance y minteo de recompensas STEAM como token SPL.

### Tecnologías

- React 18
- Vite
- TypeScript
- Tailwind CSS
- Supabase Auth, Database y Edge Functions
- Solana Web3.js y Wallet Adapter
- Framer Motion
- Recharts
- Componentes Radix UI

### Requisitos

- Node.js 18 o superior
- npm
- Un proyecto de Supabase
- Una wallet de Solana Devnet, como Phantom
- Un token SPL STEAM desplegado en Solana Devnet

### Configuración de Variables

Crea el archivo local de entorno:

```bash
cp .env.example .env
```

Luego completa:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_STEAM_MINT_ADDRESS=
```

El archivo real `.env` está ignorado por Git y no debe subirse al repositorio.

### Correr el Proyecto Localmente

Instalar dependencias:

```bash
npm install
```

Iniciar el servidor de desarrollo:

```bash
npm run dev
```

Abrir la URL local que muestre Vite, normalmente:

```text
http://localhost:5173
```

Crear build de producción:

```bash
npm run build
```

Previsualizar el build:

```bash
npm run preview
```

Ejecutar lint:

```bash
npm run lint
```

### Notas de Supabase

El frontend usa Supabase para autenticación, perfiles, cursos, certificados y Edge Functions.

Funciones importantes:

- `supabase/functions/ai-tutor`: llama a Gemini para el tutor IA.
- `supabase/functions/mint-steam`: mintea tokens SPL STEAM en Solana Devnet.

Los secretos de Supabase Edge Functions se configuran en Supabase, no en el `.env` del frontend:

```env
GEMINI_API_KEY=
STEAM_MINT_ADDRESS=
STEAM_MINT_AUTHORITY=
```

`STEAM_MINT_AUTHORITY` debe ser el secret key de la autoridad de minteo codificado en base64. No debe exponerse en el frontend ni subirse al repositorio.

### Notas de Solana

La app está configurada para Solana Devnet. Los usuarios pueden conectar Phantom, ver su balance STEAM y recibir recompensas al completar actividades del curso.

El despliegue de Solana se maneja desde Solana Playground. La conexión/demo del programa está en:

```text
src/lib/solana/program.ts
```

La dirección del token STEAM debe colocarse en:

```env
VITE_STEAM_MINT_ADDRESS=
```

El minteo ocurre del lado servidor mediante Supabase Edge Functions para mantener privada la autoridad de minteo.

### Build de Producción

Configuración recomendada para cualquier proveedor de hosting estático:

1. Subir el repositorio a GitHub.
2. Configurar las variables de entorno de `.env.example`.
3. Build command:

```bash
npm run build
```

4. Output directory:

```text
dist
```

### Estructura del Proyecto

```text
src/
  components/      UI compartida, layout, wallet sync, juegos
  hooks/           Toasts, balance STEAM, helpers Solana, XP de juegos
  lib/             Auth, cliente Supabase, i18n, cursos, notificaciones
  pages/           Páginas principales y dashboards
  data/            Datos mock de juegos
  types/           Tipos de juegos
supabase/
  functions/       Edge Functions para tutor IA, minteo STEAM y auth
```

### Seguridad

- No subir `.env`.
- No exponer `STEAM_MINT_AUTHORITY` en código del navegador.
- Las anon keys de Supabase son públicas por diseño, pero la base de datos debe protegerse con Row Level Security.
- Usar wallets y tokens Devnet para pruebas.
