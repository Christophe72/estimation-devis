export type ArticleRequest = {
  code: string;
  designation: string;
  categorie: string;
  unite: string;
  prixAchatHt: number;
  margeParDefaut: number;
  actif: boolean;
};

export type ArticleResponse = {
  id: number;
  code: string;
  designation: string;
  categorie: string;
  unite: string;
  prixAchatHt: number;
  margeParDefaut: number;
  actif: boolean;
  createdAt: string;
  updatedAt: string;
};
