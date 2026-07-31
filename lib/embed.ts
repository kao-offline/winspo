export const EMBED_FLAG = "embed";

export type WinspoMessage =
  | {
      type: "winspo:ready";
      datasetSource: string;
      itemCount: number;
    }
  | {
      type: "winspo:selection";
      selectedItemIds: number[];
      datasetSource: string;
    }
  | {
      type: "winspo:code";
      code: string;
      selectedItemIds: number[];
      datasetSource: string;
    };

export function postToParent(message: WinspoMessage): void {
  if (typeof window === "undefined") return;
  if (window.parent === window) return;
  try {
    window.parent.postMessage(message, "*");
  } catch {
    // targetOrigin "*" is allowed; structured-clone errors are swallowed
  }
}

export function isEmbedMode(): boolean {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).has(EMBED_FLAG);
}

export function selectionMessage(
  datasetSource: string,
  selectedItemIds: number[]
): WinspoMessage {
  return { type: "winspo:selection", selectedItemIds, datasetSource };
}

export function readyMessage(datasetSource: string, itemCount: number): WinspoMessage {
  return { type: "winspo:ready", datasetSource, itemCount };
}

export function codeMessage(
  datasetSource: string,
  code: string,
  selectedItemIds: number[]
): WinspoMessage {
  return { type: "winspo:code", code, selectedItemIds, datasetSource };
}
