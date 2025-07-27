"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Link from "next/link";

interface HeaderProps {
  onRefresh: () => void;
  isRefreshing?: boolean;
  showRefreshButton?: boolean;
}

export default function Header({ onRefresh, isRefreshing = false, showRefreshButton = true }: HeaderProps) {
  const currentUser = useQuery(api.users.currentUser);
  const isAuthenticated = !!currentUser;

  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold text-foreground">Poznan Apartments</h1>
      <div className="flex gap-3">
        {!isAuthenticated && (
          <Link
            href="/auth"
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors"
          >
            Sign In
          </Link>
        )}
        {showRefreshButton && (
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </button>
        )}
      </div>
    </div>
  );
}
