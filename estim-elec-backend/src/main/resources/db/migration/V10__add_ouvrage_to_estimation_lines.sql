ALTER TABLE estimation_lines
    ADD COLUMN IF NOT EXISTS ouvrage_id BIGINT;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'fk_estimation_lines_ouvrage'
    ) THEN
        ALTER TABLE estimation_lines
            ADD CONSTRAINT fk_estimation_lines_ouvrage
                FOREIGN KEY (ouvrage_id) REFERENCES ouvrages(id);
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_estimation_lines_ouvrage_id
    ON estimation_lines(ouvrage_id);
