"use client";

import MovieCard from "components/movie-card";
import { useEffect, useState } from "react";
import { searchMovies } from "actions/movieActions";
import { getDeviceId } from "utils/deviceId";
import { Spinner } from "@material-tailwind/react";

export default function FavoritesUI() {
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDeviceId = () => {
      const id = getDeviceId();
      setDeviceId(id);
      
      if (id) {
        loadFavorites(id);
      }
    };
    
    loadDeviceId();
  }, []);
  
  const loadFavorites = async (id: string) => {
    setLoading(true);
    try {
      const result = await searchMovies({ 
        search: "", 
        page: 1, 
        pageSize: 100, 
        deviceId: id 
      });
      
      // 즐겨찾기된 영화만 필터링
      const favoriteMovies = result.data.filter(movie => movie.is_favorite);
      setFavorites(favoriteMovies);
    } catch (error) {
      console.error("즐겨찾기 로드 중 오류 발생:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        {/* @ts-ignore */}
        <Spinner className="h-10 w-10" color="blue" />
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">즐겨찾기한 영화가 없습니다</h2>
          <p className="mt-2 text-gray-600">
            마음에 드는 영화를 즐겨찾기에 추가해보세요!
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="container mx-auto py-8">
      <h1 className="mb-6 text-2xl font-bold">내 즐겨찾기</h1>
      
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {favorites.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </main>
  );
}