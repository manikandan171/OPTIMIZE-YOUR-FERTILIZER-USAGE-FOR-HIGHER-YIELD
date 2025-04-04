#!/bin/bash
docker build -t test .
docker run -itd -p 99:80 test
