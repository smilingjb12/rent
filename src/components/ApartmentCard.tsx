import Image from "next/image";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";

interface Apartment {
  id: string;
  title: string;
  price: string;
  floor: string;
  area: string;
  image: string;
  link: string;
  createdAt?: number;
}

interface ApartmentCardProps {
  apartment: Apartment;
  isLiked: boolean;
  showRemoveButton: boolean;
  isAuthenticated?: boolean;
  onToggleLike: (apartment: Apartment) => void;
  onMarkAsViewed: (apartmentId: string) => void;
}

export default function ApartmentCard({
  apartment,
  isLiked,
  showRemoveButton,
  isAuthenticated = true,
  onToggleLike,
  onMarkAsViewed,
}: ApartmentCardProps) {
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      await onMarkAsViewed(apartment.id);
    } finally {
      setIsRemoving(false);
    }
  };
  return (
    <div className="group bg-card text-card-foreground rounded-xl shadow-sm border border-border overflow-hidden transition-all hover:shadow-md hover:-translate-y-0.5">
      {apartment.image && (
        <a
          href={apartment.link}
          target="_blank"
          rel="noopener noreferrer"
          className="block relative aspect-[16/10] w-full cursor-pointer overflow-hidden"
        >
          <Image
            src={apartment.image}
            alt={apartment.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
        </a>
      )}

      <div className="p-4 md:p-5">
        <a
          href={apartment.link}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <h2 className="text-base md:text-lg font-semibold mb-2 line-clamp-2 text-card-foreground hover:text-primary transition-colors cursor-pointer">
            {apartment.title}
          </h2>
        </a>

        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="text-xl font-bold text-success">{apartment.price}</div>
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            {apartment.area && (
              <span className="inline-flex items-center rounded-full bg-accent px-2.5 py-1 font-medium text-accent-foreground">
                {apartment.area}
              </span>
            )}
            {apartment.floor && (
              <span className="inline-flex items-center rounded-full bg-accent px-2.5 py-1 font-medium text-accent-foreground">
                {apartment.floor}
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-2 items-center justify-between">
          {/* Creation date with clock icon */}
          {apartment.createdAt && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
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
              <span>
                {formatDistanceToNow(new Date(apartment.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
          )}

          <div className="flex gap-2 items-center">
            {/* Only show like/unlike button for authenticated users when they're liking, or always show if they've already liked */}
            {(isAuthenticated || isLiked) && (
              <button
                onClick={() => onToggleLike(apartment)}
                className={`p-2 rounded-lg border ${
                  isLiked
                    ? "bg-destructive text-destructive-foreground border-transparent hover:bg-red-600"
                    : "bg-muted text-muted-foreground border-border hover:bg-red-500 hover:text-white"
                }`}
                title={
                  isLiked
                    ? isAuthenticated
                      ? "Unlike"
                      : "Login to unlike"
                    : "Like"
                }
                disabled={isLiked && !isAuthenticated}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill={isLiked ? "currentColor" : "none"}
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                  />
                </svg>
              </button>
            )}

            {showRemoveButton && (
              <button
                onClick={handleRemove}
                disabled={isRemoving}
                className="p-2 cursor-pointer rounded-lg border border-border bg-secondary/90 text-secondary-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Remove from list"
              >
                {isRemoving ? (
                  <svg
                    className="w-4 h-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                    />
                  </svg>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
