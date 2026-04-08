"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle";

const NAV = [
  { href: "/", label: "Dashboard", exact: true },
  { href: "/customers", label: "Clients" },
  { href: "/articles", label: "Articles" },
  { href: "/ouvrages", label: "Ouvrages" },
  { href: "/estimations", label: "Estimations" },
  { href: "/devis", label: "Devis" },
  { href: "/factures", label: "Factures" },
  { href: "/paiements", label: "Paiements" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <aside className="flex h-full w-56 shrink-0 flex-col border-r border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
      {/* Brand */}
      <div className="border-b border-zinc-200 px-4 py-4 dark:border-zinc-700">
        <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
          EstimElec
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-3">
        <ul className="flex flex-col gap-0.5">
          {NAV.map(({ href, label, exact }) => {
            const active = isActive(href, exact);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "bg-zinc-100 text-gray-900 dark:bg-zinc-800 dark:text-white"
                      : "text-gray-600 hover:bg-zinc-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-zinc-800 dark:hover:text-white"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full transition-colors ${active ? "bg-blue-600" : "bg-transparent"}`}
                  />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t border-zinc-200 px-3 py-3 dark:border-zinc-700">
        {user && (
          <p className="mb-2 truncate text-xs text-zinc-500 dark:text-zinc-400">
            {user.prenom} {user.nom}{" "}
            <span className="text-zinc-400 dark:text-zinc-500">({user.role})</span>
          </p>
        )}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={logout}
            className="text-xs text-zinc-500 hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-400"
          >
            Déconnexion
          </button>
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}
