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
    <div className="sticky top-0 z-40 -mx-4 px-4 md:mx-0 md:px-0 mb-8">
      <div className="rounded-xl border border-border bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60 shadow-sm">
        <div className="flex items-center justify-between p-4 md:p-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Poznań Apartments
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Discover, like, and keep track of listings.</p>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            {!isAuthenticated && (
              <Link
                href="/auth"
                className="inline-flex items-center gap-2 rounded-lg border border-transparent bg-secondary/90 px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                  <path fillRule="evenodd" d="M12 1.5a3.75 3.75 0 00-3.75 3.75v1.5H6a3 3 0 00-3 3v7.5a3 3 0 003 3h12a3 3 0 003-3V9.75a3 3 0 00-3-3h-2.25V5.25A3.75 3.75 0 0012 1.5zm-1.5 3.75a1.5 1.5 0 113 0v1.5h-3V5.25z" clipRule="evenodd" />
                </svg>
                Sign In
              </Link>
            )}
            {showRefreshButton && (
              <button
                onClick={onRefresh}
                disabled={isRefreshing}
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992m0 0V4.356m0 4.992l-3.181-3.181A8.25 8.25 0 103.75 12.75" />
                </svg>
                {isRefreshing ? "Refreshing" : "Refresh"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
