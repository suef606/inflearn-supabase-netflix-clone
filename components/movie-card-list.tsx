"use client";

import { Spinner } from "@material-tailwind/react";
import MovieCard from "./movie-card";
import { useQuery } from "@tanstack/react-query";
import { searchState } from "utils/recoil/atoms";
import { searchMovies } from "actions/movieActions";
import { useRecoilValue } from "recoil";

export default function MovieCardList() {
  const search = useRecoilValue(searchState);
  const getAllMoviesQuery = useQuery({
    queryKey: ["movie", search],
    queryFn: () => searchMovies({ search }), // 객체 형태로 전달
  });


  return (
    <div className="grid gap-1 md:grid-cols-4 grid-cols-3 w-full h-full">
      {getAllMoviesQuery.isLoading && (
        <div className="flex justify-center items-center col-span-full">
          {/* 스피너 */}
          <div className="flex justify-center items-center col-span-full">
  <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-500"></div>
</div>
        </div>
      )}
      {getAllMoviesQuery.data &&
        getAllMoviesQuery.data.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
    </div>
  );
}