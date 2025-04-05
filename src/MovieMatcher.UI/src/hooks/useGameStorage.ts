import { useCallback } from 'react';
import { Game, MovieMatch, gameStorageService } from '../services/gameStorageService';

export const useGameStorage = () => {
  // Get all games (no caching)
  const getGames = useCallback(async (): Promise<Game[]> => {
    try {
      return await gameStorageService.getAllGames();
    } catch {
      return [];
    }
  }, []);

  // Get a specific game by ID
  const getGameById = useCallback(async (id: number): Promise<Game | undefined> => {
    try {
      return await gameStorageService.getGameById(id);
    } catch {
      return undefined;
    }
  }, []);

  // Save a new game
  const saveGame = useCallback(async (matches: MovieMatch[]): Promise<number | undefined> => {
    try {
      const newGame: Game = {
        timestamp: Date.now(),
        matches,
      };
      
      return await gameStorageService.saveGame(newGame);
    } catch {
      return undefined;
    }
  }, []);

  // Delete a game
  const deleteGame = useCallback(async (id: number): Promise<boolean> => {
    try {
      await gameStorageService.deleteGame(id);
      return true;
    } catch {
      return false;
    }
  }, []);

  // Clear all games
  const clearAllGames = useCallback(async (): Promise<boolean> => {
    try {
      await gameStorageService.clearAllGames();
      return true;
    } catch {
      return false;
    }
  }, []);

  // Add a match to an existing game
  const addMatchToGame = useCallback(async (gameId: number, match: MovieMatch): Promise<boolean> => {
    try {
      const game = await gameStorageService.getGameById(gameId);
      
      if (!game) {
        return false;
      }

      game.matches = [...game.matches, match];
      await gameStorageService.updateGame(game);
      return true;
    } catch {
      return false;
    }
  }, []);

  return {
    getGames,
    getGameById,
    saveGame,
    deleteGame,
    clearAllGames,
    addMatchToGame
  };
}; 