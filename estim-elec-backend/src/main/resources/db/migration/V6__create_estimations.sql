CREATE TABLE estimations (
     id BIGSERIAL PRIMARY KEY,
     designation VARCHAR(255) NOT NULL,
     customer_id BIGINT NOT NULL,
     description VARCHAR(1000),
     total_ht NUMERIC(12,2) NOT NULL DEFAULT 0.00,
     total_tva NUMERIC(12,2) NOT NULL DEFAULT 0.00,
     total_ttc NUMERIC(12,2) NOT NULL DEFAULT 0.00,
     created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
     CONSTRAINT fk_estimations_customer
         FOREIGN KEY (customer_id) REFERENCES customers(id)
);