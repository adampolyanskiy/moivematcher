import * as signalR from "@microsoft/signalr";

let connection: signalR.HubConnection | null = null;

export const getSignalRConnection = async () => {
  if (connection && connection.state === signalR.HubConnectionState.Connected) {
    return connection;
  }

  connection = new signalR.HubConnectionBuilder()
    .withUrl(`${process.env.NEXT_PUBLIC_BASE_URL}/movieMatcherHub`, {
      withCredentials: true,
    })
    .withAutomaticReconnect([0, 2000, 5000, 10000])
    .configureLogging(signalR.LogLevel.Information)
    .build();

  try {
    console.log("Calling connection.start()...");
    await connection.start();
    console.log("SignalR Connected.");
  } catch (error) {
    console.error("Error connecting to SignalR:", error);
  }

  return connection;
};