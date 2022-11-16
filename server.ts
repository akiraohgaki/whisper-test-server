import { serve } from 'https://deno.land/std@0.164.0/http/server.ts';
import { $ } from 'https://deno.land/x/zx_deno@1.2.2/mod.mjs';

const port = 80;

let processing = false;

const runWhisper = async (model: string, language: string) => {
  processing = true;
  const startMessage = `Transcribe started at ${(new Date()).toUTCString()}`;
  console.log(startMessage);

  await $`whisper /tmp/audio --model ${model} --language ${language} --output_dir /tmp`;

  processing = false;
  const finishMessage = `Transcribe finished at ${(new Date()).toUTCString()}`;
  console.log(finishMessage);

  await Deno.writeTextFile('/tmp/audio.txt', `\n\n--\n\n${startMessage}\n${finishMessage}`, { append: true });
};

await serve(async (request) => {
  try {
    console.log(`${request.method} ${request.url}`);

    const url = new URL(request.url);

    if (request.method === 'GET' && url.pathname === '/health') {
      return new Response('', {
        status: 200,
        headers: { 'Content-Type': 'text/plain' },
      });
    } else if (request.method === 'GET' && url.pathname === '/transcript') {
      let data = '';

      try {
        data = await Deno.readTextFile('/tmp/audio.txt');
      } catch {
        void 0;
      }

      return new Response(data, {
        status: 200,
        headers: { 'Content-Type': 'text/plain' },
      });
    } else if (request.method === 'POST' && url.pathname === '/transcribe') {
      if (!processing) {
        const formData = await request.formData();
        const data = await new Response(formData.get('audio')).arrayBuffer();

        await Deno.writeFile('/tmp/audio', new Uint8Array(data));

        try {
          await Deno.remove('/tmp/audio.txt');
        } catch {
          void 0;
        }

        runWhisper(url.searchParams.get('model') || 'base', url.searchParams.get('language') || 'en');
      }
      return new Response('Now processing...', {
        status: 200,
        headers: { 'Content-Type': 'text/plain' },
      });
    } else {
      return new Response('Bad request', {
        status: 400,
        headers: { 'Content-Type': 'text/plain' },
      });
    }
  } catch {
    return new Response('Internal server error', {
      status: 500,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
}, { port: port });