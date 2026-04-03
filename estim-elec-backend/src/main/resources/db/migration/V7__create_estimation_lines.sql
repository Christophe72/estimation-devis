CREATE TABLE estimation_lines (
          id BIGSERIAL PRIMARY KEY,
          estimation_id BIGINT NOT NULL,
          type_ligne VARCHAR(50) NOT NULL,
          designation VARCHAR(255) NOT NULL,
          quantite NUMERIC(12,2) NOT NULL,
          unite VARCHAR(30),
          prix_unitaire_ht NUMERIC(12,2) NOT NULL,
          taux_tva NUMERIC(5,2) NOT NULL DEFAULT 21.00,
          total_ht NUMERIC(12,2) NOT NULL DEFAULT 0.00,
          total_tva NUMERIC(12,2) NOT NULL DEFAULT 0.00,
          total_ttc NUMERIC(12,2) NOT NULL DEFAULT 0.00,
          ordre INTEGER NOT NULL DEFAULT 0,
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT fk_estimation_lines_estimation
              FOREIGN KEY (estimation_id) REFERENCES estimations(id) ON DELETE CASCADE
);