// Les factures sont créées exclusivement via POST /api/factures/from-devis/{devisId}
// Il n'existe pas de FactureRequest — l'écriture passe par DevisRequest.

export type FactureLineResponse = {
  id: number;
  factureId: number;
  designation: string;
  quantite: number;
  unite: string;
  totalLigneHt: number;
  ordreAffichage: number;
};

export type FactureResponse = {
  id: number;
  numero: string;
  devisId: number;
  customerId: number;
  customerNom: string;
  chantierNom: string;
  adresse?: string;
  ville?: string;
  codePostal?: string;
  statut: string; // BROUILLON | EMISE | PARTIELLEMENT_PAYEE | PAYEE | ANNULEE
  montantTotalHt: number;
  montantTva: number;
  montantTotalTtc: number;
  totalPaye: number;
  resteAPayer: number;
  createdAt: string;
  updatedAt: string;
  lines: FactureLineResponse[];
};
