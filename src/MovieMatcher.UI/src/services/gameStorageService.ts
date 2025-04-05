import { IndexedDBWrapper } from '../lib/indexedDB';

// Define types
export interface MovieMatch {
  title: string;
  overview: string;
  posterPath: string;
}

export interface Game {
  id?: number;
  timestamp: number;
  matches: MovieMatch[];
}

// Database configuration
const dbConfig = {
  name: 'MovieMatcherDB',
  version: 1,
  stores: {
    games: { keyPath: 'id', autoIncrement: true }
  }
};

// Create a singleton instance
let dbInstance: IndexedDBWrapper | null = null;

const getDBInstance = async (): Promise<IndexedDBWrapper> => {
  if (!dbInstance) {
    dbInstance = new IndexedDBWrapper(dbConfig);
    await dbInstance.init();
  }
  return dbInstance;
};

// Game storage service
export const gameStorageService = {
  async saveGame(game: Game): Promise<number> {
    const db = await getDBInstance();
    
    // If no ID is provided, generate one
    const gameToSave: Game = {
      ...game,
      timestamp: game.timestamp || Date.now()
    };
    
    const result = await db.add<Game>('games', gameToSave);
    return result as number;
  },
  
  async updateGame(game: Game): Promise<number> {
    if (!game.id) {
      throw new Error('Cannot update a game without an ID');
    }
    
    const db = await getDBInstance();
    const result = await db.update<Game>('games', game);
    return result as number;
  },
  
  async getGameById(id: number): Promise<Game | undefined> {
    const db = await getDBInstance();
    return db.getById<Game>('games', id);
  },
  
  async getAllGames(): Promise<Game[]> {
    const db = await getDBInstance();
    const games = await db.getAll<Game>('games');
    
    // Sort by timestamp (newest first)
    return games.sort((a, b) => b.timestamp - a.timestamp);
  },
  
  async deleteGame(id: number): Promise<void> {
    const db = await getDBInstance();
    return db.delete('games', id);
  },
  
  async clearAllGames(): Promise<void> {
    const db = await getDBInstance();
    return db.clear('games');
  }
}; 