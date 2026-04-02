export type DevisLineRequest = {
  typeLigne: string;
  ouvrageId?: number;
  designation: string;
  quantite: number;
  unite: string;
  tempsUnitaireHeures?: number;
  coutMaterielUnitaireHt?: number;
  coutMainOeuvreUnitaireHt?: number;
  ordreAffichage?: number;
};

export type DevisLineResponse = {
  id: number;
  devisId: number;
  ouvrageId?: number;
  ouvrageDesignation?: string;
  typeLigne: string;
  designation: string;
  quantite: number;
  unite: string;
  tempsUnitaireHeures: number;
  coutMaterielUnitaireHt: number;
  coutMainOeuvreUnitaireHt: number;
  totalLigneHt: number;
  ordreAffichage: number;
};

export type DevisRequest = {
  numero: string;
  customerId: number;
  chantierNom: string;
  adresse?: string;
  ville?: string;
  codePostal?: string;
  typeChantier: string;
  statut: string;
  tauxHoraire: number;
  coefficientChantier?: number;
  tauxFraisGeneraux?: number;
  tauxMarge?: number;
  tauxTva?: number;
  lines?: DevisLineRequest[];
};

export type DevisResponse = {
  id: number;
  numero: string;
  customerId: number;
  customerNom: string;
  chantierNom: string;
  adresse?: string;
  ville?: string;
  codePostal?: string;
  typeChantier: string;
  statut: string;
  tauxHoraire: number;
  coefficientChantier: number;
  tauxFraisGeneraux: number;
  tauxMarge: number;
  tauxTva: number;
  montantMaterielHt: number;
  montantMainOeuvreHt: number;
  montantFraisGenerauxHt: number;
  montantMargeHt: number;
  montantTotalHt: number;
  montantTva: number;
  montantTotalTtc: number;
  createdAt: string;
  updatedAt: string;
  lines: DevisLineResponse[];
};
