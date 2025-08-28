"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

interface TabNavigationProps {
  latestCount: number;
  likedCount: number;
}

function TabNavigationContent({ latestCount, likedCount }: TabNavigationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTab = pathname === "/liked" ? "liked" : "latest";
  const { signOut } = useAuthActions();

  // Check if user is authenticated
  const currentUser = useQuery(api.users.currentUser);
  const isAuthenticated = !!currentUser;

  // Current query string passthrough
  const queryString = searchParams.toString();
  const queryPrefix = queryString ? `?${queryString}` : "";

  const handleSignOut = () => {
    signOut();
  };

  return (
    <nav className="fixed bottom-4 left-0 right-0 z-50">
      <div className="mx-auto w-[92%] max-w-2xl rounded-2xl border border-border bg-card/90 backdrop-blur supports-[backdrop-filter]:bg-card/70 shadow-lg">
        <div className="flex h-16">
          {/* Latest tab - only for authenticated users */}
          {isAuthenticated && (
            <Link
              href={`/latest${queryPrefix}`}
              className={`flex-1 flex flex-col items-center justify-center px-3 transition-colors ${
                activeTab === "latest" ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-sm font-medium">Latest</span>
              </div>
              <span className="text-[11px] mt-0.5">({latestCount})</span>
            </Link>
          )}

          {/* Liked tab - always show */}
          <Link
            href={`/liked${queryPrefix}`}
            className={`${isAuthenticated ? "flex-1" : "flex-1"} flex flex-col items-center justify-center px-3 transition-colors ${
              activeTab === "liked" ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill={activeTab === "liked" ? "currentColor" : "none"}
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
              </svg>
              <span className="text-sm font-medium">Liked</span>
            </div>
            <span className="text-[11px] mt-0.5">({likedCount})</span>
          </Link>

          {/* Sign out button - only show for authenticated users */}
          {isAuthenticated && (
            <button
              onClick={handleSignOut}
              className="flex-1 flex flex-col items-center justify-center px-3 transition-colors text-muted-foreground hover:text-foreground"
            >
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                  />
                </svg>
                <span className="text-sm font-medium">Sign Out</span>
              </div>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default function TabNavigation(props: TabNavigationProps) {
  return (
    <Suspense
      fallback={
        <nav className="fixed bottom-4 left-0 right-0 z-50">
          <div className="mx-auto w-[92%] max-w-2xl rounded-2xl border border-border bg-card/90 backdrop-blur supports-[backdrop-filter]:bg-card/70 shadow-lg">
            <div className="flex h-16">
              <div className="flex-1 flex flex-col items-center justify-center px-3">
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-sm font-medium">Latest</span>
                </div>
                <span className="text-[11px] mt-0.5">({props.latestCount})</span>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center px-3">
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                    />
                  </svg>
                  <span className="text-sm font-medium">Liked</span>
                </div>
                <span className="text-[11px] mt-0.5">({props.likedCount})</span>
              </div>
            </div>
          </div>
        </nav>
      }
    >
      <TabNavigationContent {...props} />
    </Suspense>
  );
}

