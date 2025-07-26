import Image from "next/image";

interface Apartment {
  id: string;
  title: string;
  price: string;
  floor: string;
  area: string;
  image: string;
  link: string;
}

interface ApartmentCardProps {
  apartment: Apartment;
  isLiked: boolean;
  showRemoveButton: boolean;
  onToggleLike: (apartment: Apartment) => void;
  onMarkAsViewed: (apartmentId: string) => void;
}

export default function ApartmentCard({
  apartment,
  isLiked,
  showRemoveButton,
  onToggleLike,
  onMarkAsViewed,
}: ApartmentCardProps) {
  return (
    <div className="bg-card text-card-foreground rounded-lg shadow-md border border-border overflow-hidden">
      {apartment.image && (
        <a
          href={apartment.link}
          target="_blank"
          rel="noopener noreferrer"
          className="block relative h-48 w-full cursor-pointer"
        >
          <Image
            src={apartment.image}
            alt={apartment.title}
            fill
            className="object-cover hover:opacity-90 transition-opacity"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </a>
      )}

      <div className="p-4">
        <h2 className="text-lg font-semibold mb-2 line-clamp-2 text-card-foreground">
          {apartment.title}
        </h2>

        <div className="space-y-1 text-sm text-muted-foreground mb-4">
          <div className="text-xl font-bold text-success">
            {apartment.price}
          </div>
          {apartment.area && <div>Area: {apartment.area}</div>}
          {apartment.floor && <div>Floor: {apartment.floor}</div>}
        </div>

        <div className="flex gap-2 items-center justify-end">

          <button
            onClick={() => onToggleLike(apartment)}
            className={`p-2 rounded-md transition-colors ${
              isLiked
                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
            title={isLiked ? "Unlike" : "Like"}
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

          {showRemoveButton && (
            <button
              onClick={() => onMarkAsViewed(apartment.id)}
              className="p-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors"
              title="Remove from list"
            >
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
            </button>
          )}
        </div>
      </div>
    </div>
  );
}