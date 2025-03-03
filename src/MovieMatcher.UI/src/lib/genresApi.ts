import apiClient from "./apiClient";
import { GenreDto } from "@/types";

export const getMovieGenres = async (): Promise<GenreDto[]> => {
  try {
    const response = await apiClient.get<GenreDto[]>("/genres/movies");
    return response.data;
  } catch (error) {
    console.error("Error fetching movie genres:", error);
    throw error;
  }
};
