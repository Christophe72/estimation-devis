CREATE TABLE factures (
                          id BIGSERIAL PRIMARY KEY,
                          numero VARCHAR(50) NOT NULL UNIQUE,
                          devis_id BIGINT NOT NULL UNIQUE,
                          customer_id BIGINT NOT NULL,
                          chantier_nom VARCHAR(255) NOT NULL,
                          adresse VARCHAR(255),
                          ville VARCHAR(120),
                          code_postal VARCHAR(20),
                          statut VARCHAR(50) NOT NULL,
                          montant_total_ht NUMERIC(12,2) NOT NULL DEFAULT 0,
                          montant_tva NUMERIC(12,2) NOT NULL DEFAULT 0,
                          montant_total_ttc NUMERIC(12,2) NOT NULL DEFAULT 0,
                          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

                          CONSTRAINT fk_factures_devis
                              FOREIGN KEY (devis_id) REFERENCES devis(id),

                          CONSTRAINT fk_factures_customer
                              FOREIGN KEY (customer_id) REFERENCES customers(id)
);

CREATE TABLE facture_lines (
                               id BIGSERIAL PRIMARY KEY,
                               facture_id BIGINT NOT NULL,
                               designation VARCHAR(255) NOT NULL,
                               quantite NUMERIC(12,2) NOT NULL,
                               unite VARCHAR(20) NOT NULL,
                               total_ligne_ht NUMERIC(12,2) NOT NULL DEFAULT 0,
                               ordre_affichage INTEGER NOT NULL DEFAULT 0,

                               CONSTRAINT fk_facture_lines_facture
                                   FOREIGN KEY (facture_id) REFERENCES factures(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_factures_customer_id ON factures(customer_id);
CREATE INDEX IF NOT EXISTS idx_factures_devis_id ON factures(devis_id);
CREATE INDEX IF NOT EXISTS idx_factures_statut ON factures(statut);