## SynMon by Example
Synthetic monitoring using cypress

### Running 
Build the project and run with docker-compose
```
docker-compose build
make up
docker logs -f cypress
```



#### Run single test
```
docker-compose up -d
npm run cy:run -- --spec **/prometheus.ui.spec.js
```

### Re-run tests
```
make test
```

### Verification
```
#view cypress logs
docker logs cypress
#view logs written by server side collector
docker logs echo
```
