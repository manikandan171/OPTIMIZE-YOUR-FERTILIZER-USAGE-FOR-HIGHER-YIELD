#!/bin/bash
echo hi123
docker build -t test .
echo "Rithvikmani123#" | docker login -u mani1711 --password-stdin
docker tag test mani1711/task-2
docker push mani1711/task-2
