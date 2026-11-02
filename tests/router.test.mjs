import { afterEach, expect, it, vi } from "vitest";
import router from "../infra/winspo-router.mjs";

afterEach(() => vi.unstubAllGlobals());

it("preserves paths, queries and media range requests while forwarding to Vercel", async () => {
  const response = new Response("media", { status: 206 });
  const fetchMock = vi.fn().mockResolvedValue(response);
  vi.stubGlobal("fetch", fetchMock);
  const result = await router.fetch(new Request("https://winspo.kaooffline.top/datasets/root/assets/a.mp4?x=1", {
    headers: { Range: "bytes=0-4" },
  }));
  const [upstream, options] = fetchMock.mock.calls[0];
  expect(upstream.url).toBe("https://winspo-brown.vercel.app/datasets/root/assets/a.mp4?x=1");
  expect(upstream.headers.get("Range")).toBe("bytes=0-4");
  expect(upstream.headers.get("X-Forwarded-Host")).toBe("winspo.kaooffline.top");
  expect(options.redirect).toBe("manual");
  expect(result).toBe(response);
});
