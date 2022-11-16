# whisper-test-server

### Run the server

```
docker run --name whisper-test-server -d -p 8080:80 docker.io/akiraohgaki/whisper-test-server
```

### Transcribe from audio file

```
curl -X POST -F 'audio=@audio.m4a' 'http://localhost:8080/transcribe?model=base&language=en'
```

### Retrieve transcript

```
curl http://localhost:8080/transcript
```
