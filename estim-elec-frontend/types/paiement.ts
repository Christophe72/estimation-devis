export type PaiementRequest = {
  factureId: number;
  montant: number;
  datePaiement: string; // ISO date (LocalDate) ex: "2026-04-02"
  modePaiement: string; // ESPECES | VIREMENT | CARTE | CHEQUE | AUTRE
  reference?: string;
  commentaire?: string;
};

export type PaiementResponse = {
  id: number;
  factureId: number;
  factureNumero: string;
  montant: number;
  datePaiement: string;
  modePaiement: string;
  reference?: string;
  commentaire?: string;
  createdAt: string;
  updatedAt: string;
  totalPayeFacture: number;
  resteAPayerFacture: number;
  statutFacture: string;
};
