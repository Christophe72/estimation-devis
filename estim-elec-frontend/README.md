# EstimElec — Frontend

Application de gestion de devis électriques (clients, ouvrages, estimations, devis, factures, paiements).

## Stack

- **Next.js 16** (App Router, Turbopack)
- **TypeScript**
- **Tailwind CSS v4**
- **React 19**
- Backend : Spring Boot (API REST, auth JWT)

## Prérequis

- Node.js >= 18
- Backend Spring Boot démarré sur `http://localhost:9090`

## Démarrage

```bash
npm install
npm run dev
```

Application disponible sur http://localhost:3000.

## Variables d'environnement

Créer un fichier `.env.local` à la racine :

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

Les appels `/api/*` sont proxifiés vers `http://localhost:9090/api/*` via `next.config.ts`.

## Authentification

- Formulaire de connexion sur `/login`
- JWT stocké dans `localStorage` (clé `auth_token`)
- Header `Authorization: Bearer <token>` ajouté automatiquement sur chaque appel API via `lib/api.ts`
- Pas de NextAuth, pas de refresh token
- Redirection automatique vers `/login` si non connecté

## Modules

| Module | Route |
|---|---|
| Accueil | `/` |
| Clients | `/customers` |
| Ouvrages | `/ouvrages` |
| Estimations | `/estimations` |
| Devis | `/devis` |
| Factures | `/factures` |
| Paiements | `/paiements` |

Chaque module dispose des pages : liste, détail, création, édition.

## Arborescence principale

```
app/                  Pages (App Router)
components/           Composants réutilisables par module
context/
  AuthContext.tsx     État d'authentification (useSyncExternalStore)
  ThemeContext.tsx    Mode jour / nuit
components/
  ThemeToggle.tsx     Bouton bascule thème (fixe, coin supérieur droit)
lib/
  api.ts              Helper fetch + injection Bearer token
  auth.ts             Login, logout, helpers localStorage
  format.ts           formatDate, formatCurrency
  customers.ts        API clients
  ouvrages.ts         API ouvrages
  estimations.ts      API estimations
  devis.ts            API devis
  factures.ts         API factures
  paiements.ts        API paiements
types/                Types TypeScript par domaine
```

## Scripts

```bash
npm run dev      # Serveur de développement
npm run build    # Build de production
npm run lint     # ESLint
```
