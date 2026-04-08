# Plan de développement — EstimElec Frontend

## Stack actuelle

- **Next.js 16** (App Router) · **React 19** · **TypeScript** · **Tailwind CSS v4**
- Auth JWT via `localStorage` (AuthContext + `lib/auth.ts`)
- Fetch centralisé via `lib/api.ts` (`apiFetch`)
- Pas de librairie de composants UI (tout en Tailwind pur)

---

## État des lieux

### ✅ Existant (fonctionnel)

| Module | Pages présentes |
|---|---|
| Auth | `/login` |
| Customers | liste · détail · création · édition |
| Ouvrages | liste · détail · création · édition |
| Estimations | liste · détail · création · édition · conversion → devis |
| Devis | liste · détail · création · édition |
| Factures | liste · détail |
| Paiements | liste · détail · création · édition |

### ❌ Manquant / À faire

| Priorité | Élément | Description |
|---|---|---|
| 🔴 P1 | **Module Articles** | Aucune page `/articles` n'existe. CRUD complet à créer. |
| 🔴 P1 | **Layout avec navigation** | Pas de sidebar ni de nav globale. La navigation est uniquement sur la homepage. |
| 🔴 P1 | **Dashboard** | La homepage est juste une liste de liens. Pas de KPIs ni de vue synthétique. |
| 🟠 P2 | **Composants manquants** | Beaucoup de pages n'utilisent pas de composant dédié (ex. estimations, customers). |
| 🟠 P2 | **Affichage customerNom** | La liste estimations affiche `customerId` (number) au lieu du nom client. |
| 🟠 P2 | **Statut badges uniformes** | `StatutDevisBadge` et `StatutFactureBadge` existent mais pas pour les estimations. |
| 🟠 P2 | **Confirmation suppression** | `window.confirm()` partout → remplacer par une modale de confirmation. |
| 🟡 P3 | **Filtre / recherche** | Aucune recherche sur les listes (clients, articles, ouvrages…). |
| 🟡 P3 | **Pagination** | Les listes chargent tout d'un coup. À paginer côté frontend au minimum. |
| 🟡 P3 | **Gestion articles dans Ouvrage** | Le formulaire `OuvrageForm` doit permettre d'ajouter/retirer des `OuvrageComponent`. |
| 🟡 P3 | **Page facture depuis devis** | `POST /api/factures/from-devis/:devisId` n'est pas câblé dans l'UI (bouton manquant). |
| 🟡 P3 | **Notifications toast** | Pas de feedback visuel sur succès (create/update/delete). |

---

## Phases de développement

### Phase 1 — Fondations UX (P1)

#### 1.1 Layout global avec sidebar

Créer un layout authentifié partagé par toutes les pages protégées.

**Fichier :** `app/(app)/layout.tsx`

```
app/
  (app)/             ← route group : pages protégées
    layout.tsx       ← sidebar + header
    page.tsx         ← dashboard
    customers/
    articles/        ← nouveau
    ouvrages/
    estimations/
    devis/
    factures/
    paiements/
  login/
  layout.tsx         ← root layout (ThemeProvider, AuthProvider)
```

**Sidebar :** liens vers tous les modules + indicateur de section active + bouton déconnexion.

#### 1.2 Dashboard avec KPIs

Remplacer la homepage par un vrai tableau de bord.

- **Nombre** de clients · estimations · devis · factures
- **Montants** : total devis en cours, total factures non payées, total encaissé
- **Flux métier** : Estimation → Devis → Facture → Paiement (avec compteurs par statut)
- Liens rapides vers les actions courantes

---

### Phase 2 — Module Articles (P1)

**Nouveau module complet.**

#### Pages à créer

| Route | Description |
|---|---|
| `/articles` | Liste paginée avec filtre actif/inactif |
| `/articles/new` | Formulaire de création |
| `/articles/[id]` | Détail |
| `/articles/[id]/edit` | Formulaire d'édition |

#### Fichiers à créer

```
app/(app)/articles/
  page.tsx
  new/page.tsx
  [id]/page.tsx
  [id]/edit/page.tsx

components/articles/
  ArticleForm.tsx       ← code, désignation, catégorie, unité, prix, marge, actif
  ArticleTable.tsx      ← liste avec badge actif/inactif

types/article.ts        ← ArticleRequest, ArticleResponse (déjà partiellement dans types/)
lib/articles.ts         ← getArticles, getArticle, createArticle, updateArticle, deleteArticle
```

---

### Phase 3 — Composants manquants & harmonisation (P2)

#### 3.1 Composants de liste

Extraire la logique de tableau dans des composants réutilisables :

| Composant | Existant | Action |
|---|---|---|
| `CustomerTable.tsx` | ❌ | Créer |
| `EstimationTable.tsx` | ❌ | Créer |
| `PaiementTable.tsx` | ✅ | — |
| `DevisTable.tsx` | ✅ | — |
| `FactureTable.tsx` | ✅ | — |
| `OuvrageTable.tsx` | ✅ | — |
| `ArticleTable.tsx` | ❌ | Créer (Phase 2) |

#### 3.2 Badges de statut

| Badge | Existant | Action |
|---|---|---|
| `StatutDevisBadge` | ✅ | — |
| `StatutFactureBadge` | ✅ | — |
| `StatutEstimationBadge` | ❌ | Créer |

Valeurs : `BROUILLON` (gris) · `ENVOYEE` (bleu) · `ACCEPTEE` (vert) · `REFUSEE` (rouge) · `ANNULEE` (orange)

#### 3.3 Modale de confirmation

Remplacer tous les `window.confirm()` par un composant `<ConfirmModal>` :

```tsx
// components/ConfirmModal.tsx
// Props: isOpen, title, message, onConfirm, onCancel
```

#### 3.4 Composant Toast / notification

Ajouter un système de notifications légères (succès/erreur) :

```
context/ToastContext.tsx
components/Toast.tsx
```

---

### Phase 4 — Corrections fonctionnelles (P2)

#### 4.1 Afficher `customerNom` dans les listes

- **Estimations list** : remplacer la colonne `customerId` par `customerNom`
- **Devis list** : vérifier que `customerNom` est bien affiché

#### 4.2 Composants OuvrageComponents dans OuvrageForm

Le formulaire `OuvrageForm` ne permet pas de gérer les `OuvrageComponent` (articles composant l'ouvrage).

Ajouter une section **"Articles de l'ouvrage"** :
- Liste des composants existants avec suppression
- Formulaire d'ajout : sélecteur d'article + quantité
- Calcul du coût total HT affiché en temps réel

#### 4.3 Bouton "Convertir en facture" sur le détail devis

Sur la page `/devis/[id]`, si `statut === 'ACCEPTE'` et qu'aucune facture n'est liée :
- Afficher un bouton **"Créer la facture"**
- Appel `POST /api/factures/from-devis/:id`
- Rediriger vers `/factures/[newId]`

---

### Phase 5 — Améliorations UX (P3)

#### 5.1 Recherche et filtres

| Page | Filtres |
|---|---|
| `/customers` | Recherche par nom / email |
| `/articles` | Recherche par code / désignation · filtre actif |
| `/ouvrages` | Recherche par code / désignation · filtre actif |
| `/devis` | Filtre par statut · filtre par client |
| `/estimations` | Filtre par statut |
| `/factures` | Filtre par statut |
| `/paiements` | Filtre par facture |

#### 5.2 Pagination côté client

Composant `<Pagination>` générique à utiliser sur toutes les listes longues.

#### 5.3 États de chargement

Remplacer les `<p>Chargement...</p>` par des squelettes (skeleton loaders) cohérents.

---

## Structure de fichiers cible

```
app/
├── (app)/
│   ├── layout.tsx              ← sidebar + header auth
│   ├── page.tsx                ← dashboard KPIs
│   ├── articles/               ← nouveau module
│   │   ├── page.tsx
│   │   ├── new/page.tsx
│   │   └── [id]/
│   │       ├── page.tsx
│   │       └── edit/page.tsx
│   ├── customers/
│   ├── ouvrages/
│   ├── estimations/
│   ├── devis/
│   ├── factures/
│   └── paiements/
├── login/
│   └── page.tsx
└── layout.tsx                  ← root (ThemeProvider + AuthProvider)

components/
├── ConfirmModal.tsx             ← nouveau
├── Toast.tsx                   ← nouveau
├── Pagination.tsx               ← nouveau
├── NumericInput.tsx             ← existant
├── ThemeToggle.tsx              ← existant
├── articles/                   ← nouveau
│   ├── ArticleForm.tsx
│   └── ArticleTable.tsx
├── customers/
│   └── CustomerTable.tsx       ← nouveau
├── estimations/
│   ├── EstimationForm.tsx      ← existant
│   ├── EstimationTable.tsx     ← nouveau
│   └── StatutEstimationBadge.tsx ← nouveau
├── devis/
│   ├── DevisForm.tsx           ← existant
│   ├── DevisTable.tsx          ← existant
│   └── StatutDevisBadge.tsx    ← existant
├── factures/
│   ├── FactureForm.tsx         ← existant
│   ├── FactureTable.tsx        ← existant
│   └── StatutFactureBadge.tsx  ← existant
├── ouvrages/
│   ├── OuvrageForm.tsx         ← existant (à améliorer)
│   └── OuvrageTable.tsx        ← existant
└── paiements/
    ├── PaiementForm.tsx        ← existant
    └── PaiementTable.tsx       ← existant

lib/
├── api.ts                      ← existant
├── auth.ts                     ← existant
├── articles.ts                 ← nouveau
├── customers.ts                ← existant
├── devis.ts                    ← existant
├── estimations.ts              ← existant
├── factures.ts                 ← existant (à compléter)
├── ouvrages.ts                 ← existant
├── paiements.ts                ← existant
├── format.ts                   ← existant
└── utils.ts                    ← existant

context/
├── AuthContext.tsx              ← existant
├── ThemeContext.tsx             ← existant
└── ToastContext.tsx             ← nouveau

types/
├── auth.ts                     ← existant
├── article.ts                  ← existant (à vérifier/compléter)
├── customer.ts                 ← existant
├── devis.ts                    ← existant
├── estimation.ts               ← existant
├── facture.ts                  ← existant
├── ouvrage.ts                  ← existant
└── paiement.ts                 ← existant
```

---

## Flux métier à implémenter dans l'UI

```
[Estimation] ──(Convertir en devis)──► [Devis]
                                           │
                                    (statut ACCEPTE)
                                           │
                                           ▼
                                       [Facture]
                                           │
                                    (ajouter paiements)
                                           │
                                           ▼
                              PARTIELLEMENT_PAYEE → PAYEE
```

Chaque transition doit être accessible via un bouton contextuel sur la page détail.

---

## Conventions de code

- **`"use client"`** uniquement quand nécessaire (useState, useEffect, event handlers)
- **Nommage** : PascalCase composants, camelCase fonctions, kebab-case fichiers de route
- **`apiFetch`** pour tous les appels API (gestion d'erreur centralisée)
- **`formatCurrency()`** pour tous les montants · **`formatDate()`** pour les dates
- Validation des formulaires côté client cohérente avec les contraintes backend (voir annotations `@NotBlank`, `@NotNull`, `@Size`)
