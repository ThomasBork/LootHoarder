cd ./AngularFrontend/LootHoarderClient
call npm run build
echo Done building client
cd ../../NestServer/LootHoarderServer
call npm run build
echo Done building server
cd ../..
call node ./NestServer/LootHoarderServer/dist/main.js
echo Server started