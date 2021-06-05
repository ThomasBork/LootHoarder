#! /usr/bin/bash
cd ./AngularFrontend/LootHoarderClient
npm run build
echo Done building client
cd ../../NestServer/LootHoarderServer
npm run build
echo Done building server
cd ../..
