# Nodebooks

This is a [Node](https://nodejs.org/en/) project that exposes a REST API, developed with [Express](https://expressjs.com/) and [Mongoose](https://mongoosejs.com/) implementing Authentication and Auhorization using [JWT](https://www.jwt.io/). All the information is stored in a [mongoDB](https://www.mongodb.com/) database.

It implements the following [scenario](doc/scenario.md). It has been developed using [Visual Studio Code](https://code.visualstudio.com/) as IDE.

## Deploying infrastructure

Is needed to run the application the deployment of mongoDB instance:

```
$ docker-compose up
```

If you wish to launch the containers in background, include ```-d```

The running database has these connection details:

  * port: ```27017```

## Installation

In order to download needed dependencies is needed to execute the following command from root folder:

```
$ npm install
```

## Deploying the application

```
$ node src/server.js
```

When the application is deployed some data is loaded, in order to check database content is recommended to user some mongo client like [Compass](https://www.mongodb.com/products/compass)

## Testing

A [Postman](https://www.postman.com/) collection is provided in the current repository [Practice4-security-node.postman_collection.json](Practice4-security-node.postman_collection.json) to easily play and test the application.


## Author

[David Rojo(@david-rojo)](https://github.com/david-rojo)
