# estim-elec-backend

API backend Spring Boot pour la gestion d'une activité d'électricité : clients, articles, ouvrages, devis, estimations, factures et paiements.

## Stack technique

- Java 21
- Spring Boot 3.5
- Spring Web, Spring Data JPA, Validation
- PostgreSQL
- Flyway (migrations SQL)
- SpringDoc OpenAPI (Swagger UI)
- Lombok
- Maven Wrapper (`mvnw`)

## Prérequis

- JDK 21
- PostgreSQL (base locale accessible)

## Configuration

Le profil actif par défaut est `dev` (`src/main/resources/application.yaml`).

Configuration principale (`src/main/resources/application-dev.yml`) :

- Port API : `9090`
- Base : `jdbc:postgresql://localhost:5432/estim_elec`
- Username : `postgres`
- Password : `postgres`
- Flyway activé sur `classpath:db/migration`
- Hibernate en `ddl-auto: validate`

## Démarrage

Depuis le dossier `estim-elec-backend` :

```bash
./mvnw spring-boot:run
```

Sur Windows PowerShell :

```powershell
.\mvnw spring-boot:run
```

L'API sera disponible sur : `http://localhost:9090`

## Build et tests

```bash
./mvnw clean test
./mvnw clean package
```

## Documentation API

- Swagger UI : `http://localhost:9090/swagger-ui/index.html`
- OpenAPI JSON : `http://localhost:9090/v3/api-docs`

## Endpoints REST principaux

- `/api/customers`
- `/api/articles`
- `/api/ouvrages`
- `/api/devis`
- `/api/estimations`
- `/api/factures`
- `/api/paiements`

## Structure du projet

Code source principal :

```text
src/main/java/com/estimelec
```

Modules métier :

- `customer`
- `article`
- `ouvrage`
- `devis`
- `estimation`
- `facture`
- `paiement`
- `common` (exceptions/config)

Migrations base de données :

```text
src/main/resources/db/migration
```

## Notes

- Les schémas sont gérés uniquement par Flyway (pas de génération auto Hibernate).
- Les validations de payload sont gérées côté API via Jakarta Validation.
