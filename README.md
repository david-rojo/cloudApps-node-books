# Práctica 2: Node y MongoDB

## Ejecución

```sh
$ docker run --name mongo-db  -p 27017:27017 -d mongo:latest
$ npm install
$ npm start
```
## API URL

```sh
http://localhost:3000/api/v1/<resource>
```

## Uso de la API

Se proporciona una colección Postman para interactuar con la API.

La baseURL tiene que configurarse para localhost:3000

La base de datos se inicializa con datos de ejemplo