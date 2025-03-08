import type { HubEvents } from "./hubEvents";

export type HubEventHandlerMap = {
  [K in keyof HubEvents]?: HubEvents[K];
};
