export type AuthUser = {
  id: number;
  email: string;
  prenom: string;
  nom: string;
  role: string;
};

export type LoginResponse = {
  accessToken: string;
  tokenType: string;
  user: AuthUser;
};
