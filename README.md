# Estimation Devis Électrique

Application full stack de gestion commerciale pour une activité d'électricité : suivi des clients, catalogue d'ouvrages, création de devis, génération de factures et enregistrement des paiements.

Le dépôt contient deux applications distinctes :

- un backend Spring Boot exposant une API REST
- un frontend Next.js consommant cette API

## Aperçu fonctionnel

L'application couvre le flux métier principal suivant :

1. création et gestion des clients
2. création et gestion des ouvrages
3. création de devis avec paramètres de chiffrage
4. conversion d'un devis accepté en facture
5. enregistrement de paiements sur facture

Fonctionnalités identifiées dans le code :

- gestion CRUD des clients
- gestion CRUD des ouvrages
- gestion CRUD des devis
- filtrage des devis par client et par statut côté API
- calcul de montants HT, TVA et TTC sur les devis
- génération de factures à partir d'un devis accepté
- suivi du reste à payer sur les factures
- gestion des paiements avec mode, date, référence et commentaire
- API articles côté backend pour gérer les composants métier liés aux ouvrages
- documentation OpenAPI via Springdoc

## Structure du dépôt

```text
.
├── estim-elec-backend/   # API Spring Boot + JPA + Flyway + PostgreSQL
└── estim-elec-frontend/  # Interface Next.js App Router + TypeScript
```

## Stack technique

### Backend

- Java 21
- Spring Boot 3.5
- Spring Web
- Spring Data JPA
- Validation Jakarta
- PostgreSQL
- Flyway pour les migrations SQL
- Springdoc OpenAPI
- Maven Wrapper

### Frontend

- Next.js 16
- React 19
- TypeScript
- App Router
- Tailwind CSS 4
- appels API via fetch vers le backend

## Domaines métier exposés

### Backend REST

Principales ressources exposées :

- /api/customers
- /api/ouvrages
- /api/devis
- /api/factures
- /api/paiements
- /api/articles

Exemples de capacités détectées :

- /api/devis accepte des filtres customerId et statut
- /api/factures permet la conversion depuis un devis via /api/factures/from-devis/{devisId}
- /api/paiements permet un filtrage par factureId

### Frontend

Pages détectées dans l'interface :

- accueil
- clients : liste, détail, création, modification
- ouvrages : liste, détail, création, modification
- devis : liste, détail, création, modification
- factures : liste et détail
- paiements : liste, détail, création, modification

## Prérequis

Avant de démarrer le projet en local :

- Java 21
- Node.js 20 ou plus récent
- PostgreSQL

## Configuration locale

### Base de données backend

Le profil de développement du backend utilise par défaut :

- base : estim_elec
- hôte : localhost
- port : 5432
- utilisateur : postgres
- mot de passe : postgres

Les migrations Flyway sont exécutées automatiquement au démarrage.

### Variable d'environnement frontend

Le frontend attend la variable suivante :

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:9090
```

Sans cette variable, les appels API du frontend échouent au runtime.

## Lancer le projet en local

### 1. Démarrer PostgreSQL

Créer une base nommée estim_elec et vérifier que les identifiants correspondent à la configuration du backend, ou adapter le fichier de profil de développement si nécessaire.

### 2. Démarrer le backend

Depuis le dossier estim-elec-backend :

```bash
./mvnw spring-boot:run
```

Sous Windows :

```bash
mvnw.cmd spring-boot:run
```

Le backend démarre par défaut sur :

```text
http://localhost:9090
```

### 3. Démarrer le frontend

Créer un fichier .env.local dans estim-elec-frontend avec :

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:9090
```

Puis lancer :

```bash
npm install
npm run dev
```

Le frontend démarre par défaut sur :

```text
http://localhost:3000
```

## Documentation API

Le backend embarque Springdoc OpenAPI. Une fois l'application démarrée, la documentation Swagger UI est généralement accessible sur :

```text
http://localhost:9090/swagger-ui/index.html
```

## Schéma fonctionnel simplifié

```text
Clients
	↓
Devis + lignes de devis + paramètres de chiffrage
	↓
Factures générées depuis les devis acceptés
	↓
Paiements enregistrés sur les factures
```

## État actuel du dépôt

Quelques constats utiles pour un contributeur :

- le README racine était vide avant cette documentation
- le frontend contient encore certains libellés techniques ou anglais dans l'interface
- l'API articles est présente côté backend mais n'a pas de page dédiée visible dans le frontend actuel
- le backend contient déjà des migrations SQL et une structure modulaire par domaine métier

## Pistes d'amélioration

- harmoniser tous les libellés frontend en français
- ajouter une page frontend de gestion des articles
- documenter les modèles de données et statuts métier plus en détail
- ajouter des captures d'écran ou une démonstration GIF pour la page GitHub
- compléter les tests automatisés métier côté backend et frontend
