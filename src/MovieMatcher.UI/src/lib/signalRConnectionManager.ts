import * as signalR from "@microsoft/signalr";
import type { HubEvents } from "@/types";

type HubEventHandlerMap = {
  [K in keyof HubEvents]?: HubEvents[K];
};

export class SignalRConnectionManager {
  private connection: signalR.HubConnection | null = null;
  private eventHandlers: HubEventHandlerMap = {};

  public registerEventHandler<T extends keyof HubEvents>(
    event: T,
    handler: HubEvents[T]
  ) {
    this.eventHandlers[event] = handler;

    if (this.connection) {
      this.connection.on(event, handler);
    }
  }

  public unregisterEventHandler<T extends keyof HubEvents>(
    event: T,
    handler: HubEvents[T]
  ) {
    delete this.eventHandlers[event];

    if (this.connection) {
      this.connection.off(event);
    }
  }

  public getConnection() {
    return this.connection;
  }

  private buildConnection() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`${process.env.NEXT_PUBLIC_BASE_URL}/movieMatcherHub`, {
        withCredentials: true,
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000])
      .configureLogging(signalR.LogLevel.Information)
      .build();

    console.log("Connection built. Registering event handlers...");
    for (const [event, handler] of Object.entries(this.eventHandlers)) {
      this.connection!.on(event, handler);
    }
  }

  public async startConnection() {
    if (!this.connection) {
      console.log("Building connection...");
      this.buildConnection();
    }

    if (this.connection!.state !== signalR.HubConnectionState.Connected) {
      console.log("Calling connection.start()...");
      await this.connection!.start();
      console.log("SignalR connected.");
    }
    return this.connection!;
  }

  public async stopConnection() {
    if (this.connection) {
      await this.connection.stop();
      this.connection = null;
      console.log("SignalR disconnected.");
    }
  }
}

export const signalRConnectionManager = new SignalRConnectionManager();
