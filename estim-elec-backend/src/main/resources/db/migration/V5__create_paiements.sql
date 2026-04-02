CREATE TABLE paiements (
       id BIGSERIAL PRIMARY KEY,
       facture_id BIGINT NOT NULL,
       montant NUMERIC(12,2) NOT NULL,
       date_paiement DATE NOT NULL,
       mode_paiement VARCHAR(50) NOT NULL,
       reference VARCHAR(100),
       commentaire VARCHAR(500),
       created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
       updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

       CONSTRAINT fk_paiements_facture
           FOREIGN KEY (facture_id) REFERENCES factures(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_paiements_facture_id ON paiements(facture_id);
CREATE INDEX IF NOT EXISTS idx_paiements_date_paiement ON paiements(date_paiement);