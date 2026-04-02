export type CustomerRequest = {
  nom: string;
  email: string;
  telephone: string;
  adresse: string;
  ville: string;
  codePostal: string;
};

export type CustomerResponse = {
  id: number;
  nom: string;
  email: string;
  telephone: string;
  adresse: string;
  ville: string;
  codePostal: string;
  createdAt: string;
  updatedAt: string;
};
