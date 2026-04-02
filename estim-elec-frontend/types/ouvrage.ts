export type OuvrageRequest = {
  designation: string;
  prixUnitaire: number;
  unite: string;
};

export type OuvrageResponse = {
  id: number;
  designation: string;
  prixUnitaire: number;
  unite: string;
  createdAt: string;
  updatedAt: string;
};
