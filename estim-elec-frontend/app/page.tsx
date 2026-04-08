"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCustomers } from "@/lib/customers";
import { getEstimations } from "@/lib/estimations";
import { formatCurrency } from "@/lib/format";

type Stats = {
  customers: number;
  estimations: number;
  estimationsByStatut: Record<string, number>;
};

function KpiCard({ label, value, href }: { label: string; value: string | number; href?: string }) {
  const inner = (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900">
      <p className="text-sm text-zinc-500 dark:text-zinc-400">{label}</p>
      <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
    </div>
  );
  if (href) return <Link href={href} className="hover:opacity-80 transition-opacity">{inner}</Link>;
  return inner;
}

export default function Home() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [customersResult, estimationsResult] = await Promise.allSettled([
          getCustomers(),
          getEstimations(),
        ]);

        const customers =
          customersResult.status === "fulfilled" ? (customersResult.value ?? []) : [];
        const estimations =
          estimationsResult.status === "fulfilled" ? (estimationsResult.value ?? []) : [];

        const estimationsByStatut: Record<string, number> = {};
        for (const e of estimations) {
          estimationsByStatut[e.statut] = (estimationsByStatut[e.statut] ?? 0) + 1;
        }

        setStats({
          customers: customers.length,
          estimations: estimations.length,
          estimationsByStatut,
        });
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  return (
    <main className="mx-auto w-full max-w-5xl p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Vue d&apos;ensemble de votre activité
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Chargement...</p>
      ) : (
        <div className="flex flex-col gap-8">
          {/* KPIs */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <KpiCard label="Clients" value={stats?.customers ?? 0} href="/customers" />
            <KpiCard label="Estimations" value={stats?.estimations ?? 0} href="/estimations" />
            <KpiCard label="Devis" value="→" href="/devis" />
            <KpiCard label="Factures" value="→" href="/factures" />
          </div>

          {/* Estimations par statut */}
          {stats && Object.keys(stats.estimationsByStatut).length > 0 && (
            <div>
              <h2 className="mb-3 text-base font-semibold text-gray-900 dark:text-white">
                Estimations par statut
              </h2>
              <div className="flex flex-wrap gap-3">
                {Object.entries(stats.estimationsByStatut).map(([statut, count]) => (
                  <div
                    key={statut}
                    className="rounded-lg border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-700 dark:bg-zinc-900"
                  >
                    <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{statut}</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{count}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Navigation rapide */}
          <div>
            <h2 className="mb-3 text-base font-semibold text-gray-900 dark:text-white">
              Accès rapide
            </h2>
            <div className="flex flex-wrap gap-3">
              {[
                { href: "/customers/new", label: "Nouveau client" },
                { href: "/articles/new", label: "Nouvel article" },
                { href: "/ouvrages/new", label: "Nouvel ouvrage" },
                { href: "/estimations/new", label: "Nouvelle estimation" },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-gray-300 dark:hover:bg-zinc-800"
                >
                  + {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
