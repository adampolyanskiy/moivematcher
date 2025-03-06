import { useState, useCallback, useRef, useEffect } from "react";
import * as signalR from "@microsoft/signalr";
import { getSignalRConnection } from "@/lib";
import type { HubEvents, SessionOptions } from "@/types";

let connectionInstance: signalR.HubConnection | null = null;
let connectionContext: SessionOptions | null = null;

export const useMovieMatcherHub = () => {
  const connectionRef = useRef<signalR.HubConnection | null>(
    connectionInstance
  );
  const contextRef = useRef<SessionOptions | null>(connectionContext);
  const [isConnected, setIsConnected] = useState(
    connectionInstance?.state === signalR.HubConnectionState.Connected
  );
  const [connecting, setConnecting] = useState(false);

  const connect = useCallback(async (context?: SessionOptions) => {
    if (connectionRef.current?.state === signalR.HubConnectionState.Connected) {
      return connectionRef.current;
    }

    setConnecting(true);
    try {
      const conn = await getSignalRConnection();
      connectionRef.current = conn;
      connectionInstance = conn;

      if (context != null) {
        contextRef.current = context;
        connectionContext = context;
      }

      setIsConnected(true);
      return conn;
    } catch (error) {
      console.error("Failed to connect to SignalR:", error);
      return null;
    } finally {
      setConnecting(false);
    }
  }, []);

  const disconnect = useCallback(async () => {
    if (connectionRef.current) {
      await connectionRef.current.stop();
      connectionRef.current = null;
      connectionInstance = null;
      contextRef.current = null;
      connectionContext = null;
      setIsConnected(false);
    }
  }, []);

  // Ensure state stays correct on re-renders
  useEffect(() => {
    setIsConnected(
      connectionRef.current?.state === signalR.HubConnectionState.Connected
    );
  }, [connectionRef.current?.state]);

  const startSwiping = useCallback(async (sessionId: string): Promise<void> => {
    if (!connectionRef.current) return;
    await connectionRef.current.invoke("StartSwipingAsync", sessionId);
  }, []);

  const swipeMovie = useCallback(
    async (
      sessionId: string,
      movieId: number,
      isLiked: boolean
    ): Promise<void> => {
      if (!connectionRef.current) return;
      await connectionRef.current.invoke(
        "SwipeMovieAsync",
        sessionId,
        movieId,
        isLiked
      );
    },
    []
  );

  const createSession = useCallback(async (): Promise<string | null> => {
    if (!connectionRef.current) return null;
    if (!contextRef.current) return null;

    return await connectionRef.current.invoke<string>(
      "CreateSessionAsync",
      contextRef.current
    );
  }, []);

  const joinSession = useCallback(async (sessionId: string): Promise<void> => {
    if (!connectionRef.current) return;
    await connectionRef.current.invoke("JoinSessionAsync", sessionId);
  }, []);

  const leaveSession = useCallback(async (): Promise<void> => {
    if (!connectionRef.current) return;
    await connectionRef.current.invoke("LeaveSessionAsync");
  }, []);

  const on = useCallback(
    <T extends keyof HubEvents>(event: T, callback: HubEvents[T]): void => {
      if (!connectionRef.current) return;
      connectionRef.current.on(event, callback);
    },
    []
  );

  const off = useCallback(
    <T extends keyof HubEvents>(event: T, callback: HubEvents[T]): void => {
      if (!connectionRef.current) return;
      connectionRef.current.off(event, callback);
    },
    []
  );

  const getContext = useCallback(() => {
    return contextRef.current;
  }, []);

  return {
    connect,
    disconnect,
    isConnected,
    connecting,
    startSwiping,
    swipeMovie,
    createSession,
    joinSession,
    leaveSession,
    on,
    off,
    getContext,
  };
};
