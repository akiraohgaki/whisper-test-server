#!/bin/sh

pip install git+https://github.com/openai/whisper.git

exec "${@}"
