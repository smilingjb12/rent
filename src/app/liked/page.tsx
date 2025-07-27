"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import ApartmentCard from "../../components/ApartmentCard";
import TabNavigation from "../../components/TabNavigation";
import Header from "../../components/Header";
import LoadingSpinner from "../../components/LoadingSpinner";

interface Apartment {
  id: string;
  title: string;
  price: string;
  floor: string;
  area: string;
  image: string;
  link: string;
}

export default function LikedPage() {
  const likedApartments = useQuery(api.apartments.getLikedApartments);
  const toggleLike = useMutation(api.interactions.toggleLike);
  const currentUser = useQuery(api.users.currentUser);
  const isAuthenticated = !!currentUser;

  const loading = likedApartments === undefined;

  const handleToggleLike = async (apartment: Apartment) => {
    try {
      await toggleLike({ apartmentId: apartment.id, isLiked: false });
    } catch (error) {
      console.error("Error toggling apartment like:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 pb-24">
      <Header onRefresh={() => {}} isRefreshing={false} showRefreshButton={false} />
      
      <TabNavigation
        latestCount={0}
        likedCount={likedApartments?.length || 0}
      />

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner />
        </div>
      ) : (likedApartments?.length || 0) === 0 ? (
        <div className="text-center text-xl text-muted-foreground">
          <p>No liked apartments yet. Like some apartments to see them here.</p>
          {!isAuthenticated && (
            <p className="mt-4">
              <a href="/auth" className="text-indigo-600 hover:text-indigo-800 underline">
                Sign in
              </a> to access all features and manage your preferences.
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {likedApartments?.map((apartment) => (
            <ApartmentCard
              key={apartment.id}
              apartment={apartment}
              isLiked={true}
              showRemoveButton={false}
              isAuthenticated={isAuthenticated}
              onToggleLike={handleToggleLike}
              onMarkAsViewed={() => {}}
            />
          ))}
        </div>
      )}

      <div className="mt-8 text-center text-muted-foreground">
        Showing {likedApartments?.length || 0} liked apartments
      </div>
    </div>
  );
}