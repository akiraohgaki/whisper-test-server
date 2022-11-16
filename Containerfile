FROM docker.io/library/ubuntu:latest

RUN apt update && \
  DEBIAN_FRONTEND=noninteractive apt install -y --no-install-recommends \
  git \
  ffmpeg \
  build-essential \
  python3 \
  python3-pip \
  python3-distutils && \
  apt clean && \
  rm -rf /var/lib/apt/lists/*

COPY entrypoint.sh /entrypoint.sh
COPY server.ts /srv/server.ts
COPY deno.json /srv/deno.json
COPY deno.lock /srv/deno.lock

RUN chmod 755 /entrypoint.sh && \
  deno cache /srv/server.ts && \
  pip install git+https://github.com/openai/whisper.git

EXPOSE 80

ENTRYPOINT ["/entrypoint.sh"]

CMD ["deno", "run", "--allow-all", "/srv/server.ts"]
