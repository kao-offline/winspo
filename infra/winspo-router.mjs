const router = {
  async fetch(request) {
    const url = new URL(request.url);
    url.hostname = "winspo-brown.vercel.app";
    const upstream = new Request(url, request);
    upstream.headers.set("X-Forwarded-Host", "winspo.kaooffline.top");
    upstream.headers.set("X-Forwarded-Proto", "https");
    return fetch(upstream, { redirect: "manual" });
  },
};

export default router;
