import { useState, useCallback, useEffect, useRef } from "react";
import { signalRConnectionManager } from "@/lib/signalRConnectionManager";
import type { HubEvents, SessionOptions } from "@/types";

type ConnectionContext = {
  options?: SessionOptions;
  sessionId?: string;
};

let connectionContext = {};

export const useMovieMatcherHub = () => {
  const [isConnected, setIsConnected] = useState(
    signalRConnectionManager.getConnection()?.state === "Connected"
  );
  const [connecting, setConnecting] = useState(false);
  const contextRef = useRef<ConnectionContext>(connectionContext);

  const connect = useCallback(
    async (options?: SessionOptions) => {
      if (isConnected || connecting) {
        return signalRConnectionManager.getConnection();
      }

      setConnecting(true);
      try {
        const conn = await signalRConnectionManager.startConnection();
        setIsConnected(true);
        if (options) {
          contextRef.current.options = options;
          connectionContext = {
            options,
          };
        }
        return conn;
      } catch (error) {
        console.error("Failed to connect:", error);
        return null;
      } finally {
        setConnecting(false);
      }
    },
    [isConnected, connecting]
  );

  const cleanSession = useCallback(() => {
    contextRef.current = {};
    connectionContext = {};
  }, []);

  const disconnect = useCallback(async () => {
    await signalRConnectionManager.stopConnection();
    setIsConnected(false);
    cleanSession();
  }, [cleanSession]);

  const createSession = useCallback(async (): Promise<string | null> => {
    const connection = signalRConnectionManager.getConnection();
    if (!connection || !contextRef.current.options) return null;

    const sessionId = await connection.invoke<string>(
      "CreateSessionAsync",
      contextRef.current.options
    );
    if (sessionId) {
      contextRef.current.sessionId = sessionId;
      connectionContext = {
        ...connectionContext,
        sessionId,
      };
    }
    return sessionId;
  }, []);

  const joinSession = useCallback(async (sessionId: string) => {
    const connection = signalRConnectionManager.getConnection();
    if (!connection) return;
    await connection.invoke("JoinSessionAsync", sessionId);
    contextRef.current.sessionId = sessionId;
    connectionContext = {
      sessionId,
    };
  }, []);

  const leaveSession = useCallback(async () => {
    const connection = signalRConnectionManager.getConnection();
    if (!connection) return;
    await connection.invoke("LeaveSessionAsync");
    cleanSession();
  }, [cleanSession]);

  const startSwiping = useCallback(async (sessionId: string) => {
    const connection = signalRConnectionManager.getConnection();
    if (!connection) return;
    await connection.invoke("StartSwipingAsync", sessionId);
  }, []);

  const swipeMovie = useCallback(
    async (sessionId: string, movieId: number, isLiked: boolean) => {
      const connection = signalRConnectionManager.getConnection();
      if (!connection) return;
      await connection.invoke("SwipeMovieAsync", sessionId, movieId, isLiked);
    },
    []
  );

  const on = useCallback(
    <T extends keyof HubEvents>(event: T, handler: HubEvents[T]) => {
      signalRConnectionManager.registerEventHandler(event, handler);
    },
    []
  );

  const off = useCallback(
    <T extends keyof HubEvents>(event: T, handler: HubEvents[T]) => {
      signalRConnectionManager.unregisterEventHandler(event, handler);
    },
    []
  );

  const isJoinedSession = useCallback(() => !!contextRef.current.sessionId, []);

  useEffect(() => {
    setIsConnected(
      signalRConnectionManager.getConnection()?.state === "Connected"
    );
  }, []);

  return {
    connect,
    disconnect,
    isConnected,
    connecting,
    createSession,
    joinSession,
    leaveSession,
    startSwiping,
    swipeMovie,
    on,
    off,
    isJoinedSession,
    getContext: () => contextRef.current,
  };
};
