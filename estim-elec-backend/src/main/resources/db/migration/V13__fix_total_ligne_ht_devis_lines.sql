-- Recalcule total_ligne_ht en excluant cout_main_oeuvre_unitaire_ht
-- Ancienne formule : quantite * (cout_materiel_unitaire_ht + cout_main_oeuvre_unitaire_ht)
-- Nouvelle formule : quantite * cout_materiel_unitaire_ht
UPDATE devis_lines
SET total_ligne_ht = quantite * cout_materiel_unitaire_ht
WHERE cout_main_oeuvre_unitaire_ht > 0;
