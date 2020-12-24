## SynMon by Example
Synthetic monitoring using cypress

### Running 
Build the project and run with docker-compose
```
docker-compose build
docker-compose up -d
docker logs -f cypress-runner
```



#### Run single test
```
docker-compose up -d
npm run cy:run -- --spec **/prometheus.ui.spec.js
```


