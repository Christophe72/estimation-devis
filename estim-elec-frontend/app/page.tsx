import Link from "next/link";
export default function Home() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Bienvenue sur l&apos;application de gestion de devis électriques</h1>
      <p className="text-lg mb-2">Utilisez le menu pour naviguer entre les clients, les ouvrages et les devis.</p>
      <p className="text-lg">Vous pouvez créer, modifier et supprimer des clients et des ouvrages, ainsi que générer des devis basés sur ces données.</p>
      <Link href="/customers" className="mt-4 inline-block rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
        Voir les clients
      </Link>
      <Link href="/ouvrages" className="mt-4 ml-4 inline-block rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700">
        Voir les ouvrages
      </Link>
      <Link href="/devis" className="mt-4 ml-4 inline-block rounded bg-purple-600 px-4 py-2 text-white hover:bg-purple-700">
        Voir les devis
      </Link>
      <Link href="/factures" className="mt-4 ml-4 inline-block rounded bg-orange-600 px-4 py-2 text-white hover:bg-orange-700">
        Voir les factures
      </Link>
      <Link href="/paiements" className="mt-4 ml-4 inline-block rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700">
        Voir les paiements
      </Link>
    </div>
  );
}
