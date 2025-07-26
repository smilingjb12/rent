"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useAction } from "convex/react";
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

export default function LatestPage() {
  const likedApartments = useQuery(api.apartments.getLikedApartments);
  const markAsViewed = useMutation(api.interactions.markAsViewed);
  const toggleLike = useMutation(api.interactions.toggleLike);
  const scrapeLatest = useAction(api.apartments.scrapeAndGetLatestApartments);

  const [latestApartments, setLatestApartments] = useState<Apartment[] | undefined>(undefined);
  const [isLoadingLatest, setIsLoadingLatest] = useState(false);

  const loading = isLoadingLatest || latestApartments === undefined;

  useEffect(() => {
    if (latestApartments === undefined && !isLoadingLatest) {
      refreshApartments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latestApartments, isLoadingLatest]);

  const handleMarkAsViewed = async (apartmentId: string) => {
    try {
      await markAsViewed({ apartmentId });
      if (latestApartments) {
        setLatestApartments(latestApartments.filter(apt => apt.id !== apartmentId));
      }
    } catch (error) {
      console.error("Error marking apartment as viewed:", error);
    }
  };

  const handleToggleLike = async (apartment: Apartment) => {
    const isCurrentlyLiked = likedApartments?.some((apt) => apt.id === apartment.id) || false;
    const newLikeStatus = !isCurrentlyLiked;

    try {
      await toggleLike({ apartmentId: apartment.id, isLiked: newLikeStatus });
      
      if (newLikeStatus && latestApartments) {
        setLatestApartments(latestApartments.filter(apt => apt.id !== apartment.id));
      }
    } catch (error) {
      console.error("Error toggling apartment like:", error);
    }
  };

  const isApartmentLiked = (apartmentId: string) => {
    return likedApartments?.some((apt) => apt.id === apartmentId) || false;
  };

  const refreshApartments = async () => {
    try {
      setIsLoadingLatest(true);
      const apartments = await scrapeLatest({});
      setLatestApartments(apartments);
    } catch (error) {
      console.error("Error refreshing apartments:", error);
    } finally {
      setIsLoadingLatest(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 pb-24">
      <Header onRefresh={refreshApartments} isRefreshing={isLoadingLatest} />
      
      <TabNavigation
        latestCount={latestApartments?.length || 0}
        likedCount={likedApartments?.length || 0}
      />

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner />
        </div>
      ) : (latestApartments?.length || 0) === 0 ? (
        <div className="text-center text-xl text-muted-foreground">
          No new apartments found. All have been marked as viewed.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestApartments?.map((apartment) => (
            <ApartmentCard
              key={apartment.id}
              apartment={apartment}
              isLiked={isApartmentLiked(apartment.id)}
              showRemoveButton={true}
              onToggleLike={handleToggleLike}
              onMarkAsViewed={handleMarkAsViewed}
            />
          ))}
        </div>
      )}

      <div className="mt-8 text-center text-muted-foreground">
        Showing {latestApartments?.length || 0} new apartments
      </div>
    </div>
  );
}