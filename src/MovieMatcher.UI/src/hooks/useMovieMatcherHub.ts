import { useState, useCallback, useRef, useEffect } from "react";
import * as signalR from "@microsoft/signalr";
import { getSignalRConnection } from "@/lib";
import type { HubEvents, SessionOptions } from "@/types";

// ✅ Singleton connection instance (prevents losing state on page navigation)
let connectionInstance: signalR.HubConnection | null = null;

export const useMovieMatcherHub = () => {
  const connectionRef = useRef<signalR.HubConnection | null>(connectionInstance);
  const [isConnected, setIsConnected] = useState(
    connectionInstance?.state === signalR.HubConnectionState.Connected
  );
  const [connecting, setConnecting] = useState(false);

  // 🚀 Explicitly connect to SignalR hub
  const connect = useCallback(async () => {
    if (connectionRef.current?.state === signalR.HubConnectionState.Connected) {
      return connectionRef.current;
    }

    setConnecting(true);
    try {
      const conn = await getSignalRConnection();
      connectionRef.current = conn;
      connectionInstance = conn; // ✅ Persist the connection instance globally

      // ✅ Ensure state updates after connection is established
      setIsConnected(true);
      return conn;
    } catch (error) {
      console.error("Failed to connect to SignalR:", error);
      return null;
    } finally {
      setConnecting(false);
    }
  }, []);

  // 🔌 Disconnect from SignalR hub
  const disconnect = useCallback(async () => {
    if (connectionRef.current) {
      await connectionRef.current.stop();
      connectionRef.current = null;
      connectionInstance = null; // Reset global instance
      setIsConnected(false);
    }
  }, []);

  // ✅ Ensure state stays correct on re-renders (fixes losing connection when navigating)
  useEffect(() => {
    setIsConnected(connectionRef.current?.state === signalR.HubConnectionState.Connected);
  }, [connectionRef.current?.state]);

  // 🎬 Hub Methods (Async Calls to Server)
  const startSwiping = useCallback(async (sessionId: string): Promise<void> => {
    if (!connectionRef.current) return;
    await connectionRef.current.invoke("StartSwipingAsync", sessionId);
  }, []);

  const swipeMovie = useCallback(
    async (sessionId: string, movieId: string, isLiked: boolean): Promise<void> => {
      if (!connectionRef.current) return;
      await connectionRef.current.invoke("SwipeMovieAsync", sessionId, movieId, isLiked);
    },
    []
  );

  const createSession = useCallback(async (options: SessionOptions): Promise<string | null> => {
    if (!connectionRef.current) return null;
    return await connectionRef.current.invoke<string>("CreateSessionAsync", options);
  }, []);

  const joinSession = useCallback(async (sessionId: string): Promise<void> => {
    if (!connectionRef.current) return;
    await connectionRef.current.invoke("JoinSessionAsync", sessionId);
  }, []);

  const leaveSession = useCallback(async (): Promise<void> => {
    if (!connectionRef.current) return;
    await connectionRef.current.invoke("LeaveSessionAsync");
  }, []);

  // 🔥 Event Subscription Helper
  const on = useCallback(<T extends keyof HubEvents>(event: T, callback: HubEvents[T]): void => {
    if (!connectionRef.current) return;
    connectionRef.current.on(event, callback);
  }, []);

  const off = useCallback(<T extends keyof HubEvents>(event: T, callback: HubEvents[T]): void => {
    if (!connectionRef.current) return;
    connectionRef.current.off(event, callback);
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
  };
};
