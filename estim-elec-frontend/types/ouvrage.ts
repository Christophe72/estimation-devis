export type OuvrageRequest = {
  code: string;
  designation: string;
  categorie: string;
  unite: string;
  tempsPoseHeure: number;
  description?: string | null;
  actif?: boolean | null;
};

export type Ouvrage = {
  id: number;
  code: string;
  designation: string;
  categorie: string;
  unite: string;
  tempsPoseHeure: number;
  description: string | null;
  actif: boolean | null;
  createdAt: string;
  updatedAt: string;
};

export type OuvrageResponse = Ouvrage;
