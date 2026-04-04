"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { user, logout } = useAuth();

  return (
    <div className="mx-auto w-full max-w-4xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Bienvenue sur l&apos;application de gestion de devis électriques</h1>
          {user && (
            <p className="mt-1 text-sm text-gray-500">
              Connecté en tant que{" "}
              <span className="font-medium text-gray-700">
                {user.prenom} {user.nom}
              </span>{" "}
              ({user.role})
            </p>
          )}
        </div>
        <button
          onClick={logout}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
        >
          Déconnexion
        </button>
      </div>

      <p className="mb-2 text-lg">Utilisez le menu pour naviguer entre les clients, les ouvrages et les devis.</p>
      <p className="mb-6 text-lg">Vous pouvez créer, modifier et supprimer des clients et des ouvrages, ainsi que générer des devis basés sur ces données.</p>

      <div className="flex flex-wrap gap-3">
        <Link href="/customers" className="inline-block rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          Voir les clients
        </Link>
        <Link href="/ouvrages" className="inline-block rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700">
          Voir les ouvrages
        </Link>
        <Link href="/devis" className="inline-block rounded bg-purple-600 px-4 py-2 text-white hover:bg-purple-700">
          Voir les devis
        </Link>
        <Link href="/factures" className="inline-block rounded bg-orange-600 px-4 py-2 text-white hover:bg-orange-700">
          Voir les factures
        </Link>
        <Link href="/paiements" className="inline-block rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700">
          Voir les paiements
        </Link>
      </div>
    </div>
  );
}
