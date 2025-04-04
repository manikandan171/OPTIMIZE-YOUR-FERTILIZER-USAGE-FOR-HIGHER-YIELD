#!/bin/bash
docker build -t task37 .
echo Hyyy
docker login -u mani1711 -p Rithvikmani123#
docker tag task37 mani1711/finaltask
docker push mani1711/finaltask
kubectl apply -f  deploy.yaml --validate=false
kubectl apply -f svc.yaml --validate=false
