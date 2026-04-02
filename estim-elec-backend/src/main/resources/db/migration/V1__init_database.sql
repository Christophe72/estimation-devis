CREATE TABLE customers (
    id BIGSERIAL PRIMARY KEY,
    nom VARCHAR(150) NOT NULL,
    email VARCHAR(150),
    telephone VARCHAR(50),
    adresse VARCHAR(255),
    ville VARCHAR(120),
    code_postal VARCHAR(20),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE articles (
      id BIGSERIAL PRIMARY KEY,
      code VARCHAR(50) NOT NULL UNIQUE,
      designation VARCHAR(255) NOT NULL,
      categorie VARCHAR(100) NOT NULL,
      unite VARCHAR(20) NOT NULL,
      prix_achat_ht NUMERIC(12,2) NOT NULL,
      marge_par_defaut NUMERIC(5,2) NOT NULL DEFAULT 0,
      actif BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ouvrages (
      id BIGSERIAL PRIMARY KEY,
      code VARCHAR(50) NOT NULL UNIQUE,
      designation VARCHAR(255) NOT NULL,
      categorie VARCHAR(100) NOT NULL,
      unite VARCHAR(20) NOT NULL,
      temps_pose_heures NUMERIC(8,2) NOT NULL DEFAULT 0,
      description VARCHAR(1000),
      actif BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ouvrage_components (
        id BIGSERIAL PRIMARY KEY,
        ouvrage_id BIGINT NOT NULL,
        article_id BIGINT NOT NULL,
        quantite NUMERIC(12,3) NOT NULL,
        CONSTRAINT fk_ouvrage_components_ouvrage
            FOREIGN KEY (ouvrage_id) REFERENCES ouvrages(id) ON DELETE CASCADE,
        CONSTRAINT fk_ouvrage_components_article
            FOREIGN KEY (article_id) REFERENCES articles(id)
);

CREATE TABLE devis (
       id BIGSERIAL PRIMARY KEY,
       numero VARCHAR(50) NOT NULL UNIQUE,
       customer_id BIGINT NOT NULL,
       chantier_nom VARCHAR(255) NOT NULL,
       adresse VARCHAR(255),
       ville VARCHAR(120),
       code_postal VARCHAR(20),
       type_chantier VARCHAR(50) NOT NULL,
       statut VARCHAR(50) NOT NULL,
       taux_horaire NUMERIC(12,2) NOT NULL,
       coefficient_chantier NUMERIC(8,2) NOT NULL DEFAULT 1.00,
       taux_frais_generaux NUMERIC(5,2) NOT NULL DEFAULT 0,
       taux_marge NUMERIC(5,2) NOT NULL DEFAULT 0,
       taux_tva NUMERIC(5,2) NOT NULL DEFAULT 21.00,
       montant_materiel_ht NUMERIC(12,2) NOT NULL DEFAULT 0,
       montant_main_oeuvre_ht NUMERIC(12,2) NOT NULL DEFAULT 0,
       montant_frais_generaux_ht NUMERIC(12,2) NOT NULL DEFAULT 0,
       montant_marge_ht NUMERIC(12,2) NOT NULL DEFAULT 0,
       montant_total_ht NUMERIC(12,2) NOT NULL DEFAULT 0,
       montant_tva NUMERIC(12,2) NOT NULL DEFAULT 0,
       montant_total_ttc NUMERIC(12,2) NOT NULL DEFAULT 0,
       created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
       updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
       CONSTRAINT fk_devis_customer
           FOREIGN KEY (customer_id) REFERENCES customers(id)
);

CREATE TABLE devis_lines (
     id BIGSERIAL PRIMARY KEY,
     devis_id BIGINT NOT NULL,
     type_ligne VARCHAR(50) NOT NULL,
     ouvrage_id BIGINT,
     designation VARCHAR(255) NOT NULL,
     quantite NUMERIC(12,2) NOT NULL,
     unite VARCHAR(20) NOT NULL,
     temps_unitaire_heures NUMERIC(8,2) NOT NULL DEFAULT 0,
     cout_materiel_unitaire_ht NUMERIC(12,2) NOT NULL DEFAULT 0,
     cout_main_oeuvre_unitaire_ht NUMERIC(12,2) NOT NULL DEFAULT 0,
     total_ligne_ht NUMERIC(12,2) NOT NULL DEFAULT 0,
     ordre_affichage INTEGER NOT NULL DEFAULT 0,
     CONSTRAINT fk_devis_lines_devis
         FOREIGN KEY (devis_id) REFERENCES devis(id) ON DELETE CASCADE,
     CONSTRAINT fk_devis_lines_ouvrage
         FOREIGN KEY (ouvrage_id) REFERENCES ouvrages(id)
);