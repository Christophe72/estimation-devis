export type EstimationLineResponse = {
  id: number;
  ouvrageId: number;
  ouvrageCode: string;
  ouvrageDesignation: string;
  quantite: number;
  prixUnitaireHt: number;
  totalHt: number;
  ordre: number;
  createdAt: string;
  updatedAt: string;
};

export type EstimationResponse = {
  id: number;
  designation: string;
  customerId: number;
  description: string | null;
  totalHt: number;
  totalTva: number;
  totalTtc: number;
  createdAt: string;
  updatedAt: string;
  lines: EstimationLineResponse[];
};

export type EstimationLineRequest = {
  ouvrageId: number;
  quantite: number;
  prixUnitaireHt: number;
  ordre: number;
};

export type EstimationRequest = {
  designation: string;
  customerId: number;
  description: string | null;
  lines: EstimationLineRequest[];
};
