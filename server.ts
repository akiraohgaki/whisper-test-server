import { serve } from "https://deno.land/std@0.164.0/http/server.ts";

const port = 8080;

await serve(async (request) => {
  try {
    if (request.method === "GET" && request.url === "/health") {
      return new Response(null, {
        status: 200,
        headers: { "Content-Type": "application/octet-stream" },
      });
    } else if (request.method === "GET" && request.url === "/transcript") {
      let data = "";
      try {
        data = await Deno.readTextFile("/tmp/transcript");
      } catch {
        void 0;
      }
      return new Response(data, {
        status: 200,
        headers: { "Content-Type": "text/plain" },
      });
    } else if (request.method === "POST" && request.url === "/transcribe") {
      const formData = await request.formData();
      const data = await new Response(formData.get("audio")).arrayBuffer();
      await Deno.writeFile("/tmp/audio", new Uint8Array(data));
      try {
        await Deno.remove("/tmp/transcript");
      } catch {
        void 0;
      }
      // run whisper
      return new Response("Now processing...", {
        status: 200,
        headers: { "Content-Type": "text/plain" },
      });
    } else {
      return new Response("", {
        status: 400,
        headers: { "Content-Type": "text/plain" },
      });
    }
  } catch {
    return new Response("", {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    });
  }
}, { port: port });
