export interface Env {
  ASSETS: {
    fetch: (request: Request) => Promise<Response>;
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Health check endpoint
    if (url.pathname.startsWith('/api/health')) {
      return new Response(JSON.stringify({ status: 'ok', service: '3D Terrain Studio Worker' }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Serve static assets (HTML, CSS, JS, 3D Canvas)
    return env.ASSETS.fetch(request);
  }
};
