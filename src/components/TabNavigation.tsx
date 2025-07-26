"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";

interface TabNavigationProps {
  latestCount: number;
  likedCount: number;
}

function TabNavigationContent({
  latestCount,
  likedCount,
}: TabNavigationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTab = pathname === "/liked" ? "liked" : "latest";
  
  // Get current query string to preserve password parameter
  const queryString = searchParams.toString();
  const queryPrefix = queryString ? `?${queryString}` : "";
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-border">
      <div className="flex h-20">
        <Link
          href={`/latest${queryPrefix}`}
          className={`flex-1 flex flex-col items-center justify-center py-3 px-3 transition-colors ${
            activeTab === "latest"
              ? "text-primary border-t-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm font-medium">Latest</span>
          </div>
          <span className="text-xs">({latestCount})</span>
        </Link>
        <Link
          href={`/liked${queryPrefix}`}
          className={`flex-1 flex flex-col items-center justify-center py-3 px-3 transition-colors ${
            activeTab === "liked"
              ? "text-primary border-t-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill={activeTab === "liked" ? "currentColor" : "none"}
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
            <span className="text-sm font-medium">Liked</span>
          </div>
          <span className="text-xs">({likedCount})</span>
        </Link>
      </div>
    </nav>
  );
}

export default function TabNavigation(props: TabNavigationProps) {
  return (
    <Suspense fallback={
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-border">
        <div className="flex h-20">
          <div className="flex-1 flex flex-col items-center justify-center py-3 px-3">
            <div className="flex items-center gap-2 mb-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-sm font-medium">Latest</span>
            </div>
            <span className="text-xs">({props.latestCount})</span>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center py-3 px-3">
            <div className="flex items-center gap-2 mb-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
              </svg>
              <span className="text-sm font-medium">Liked</span>
            </div>
            <span className="text-xs">({props.likedCount})</span>
          </div>
        </div>
      </nav>
    }>
      <TabNavigationContent {...props} />
    </Suspense>
  );
}