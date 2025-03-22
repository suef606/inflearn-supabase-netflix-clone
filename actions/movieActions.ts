"use server";

import { createServerSupabaseClient } from "utils/supabase/server";

function handleError(error) {
  if (error) {
    console.error(error);
    throw error;
  }
}

export async function searchMovies({ search = "" }) {
  try {
    const supabase = await createServerSupabaseClient();

    // 검색어가 없을 경우 모든 영화 반환
    let query = supabase.from("movies").select("*");
    
    // 검색어가 있을 경우에만 like 조건 추가
    if (search && search.trim() !== "") {
      query = query.ilike('title', `%${search}%`);
    }

    const { data, error } = await query;

    handleError(error);
    
    // 결과가 없을 경우 빈 배열 반환
    return data || [];
  } catch (error) {
    console.error("영화 검색 중 오류 발생:", error);
    // 오류가 발생해도 클라이언트에 빈 배열 반환
    return [];
  }
}

export async function getMovie(id) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("movies")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  handleError(error);

  return data;
}