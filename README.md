# Nodebooks

This is a [Node](https://nodejs.org/en/) project that exposes a REST API, developed with [Express](https://expressjs.com/) and [Mongoose](https://mongoosejs.com/). All the information is stored in a [mongoDB](https://www.mongodb.com/) database.

It implements the following [scenario](doc/scenario.md). It has been developed using [Visual Studio Code](https://code.visualstudio.com/) as IDE.

## Installation

In order to download needed dependencies is needed to execute the following command from root folder:

```
$ npm install
```


## Deployment

Before deploy the application, is needed to has a available mongoDB database, the most easy way is with [docker](https://www.docker.com/) executing the following command:

```
$ docker run --rm -p 27017:27017 -d --name mongodb-nodebooks mongo:4.4.2-bionic
```
On nodebooks server startup two books and one user is created in mongoDb collection called ```books```, in order to check database content is recommended to user some mongo client like [Compass](https://www.mongodb.com/products/compass)

If you have been using the application previously, please drop the ```books``` collection or you cannot be able to launch it.

In order to launch the application, from ```src``` folder execute:

```
$ cd src
$ node server.js
```

## Testing

You can find in ```postman``` folder a file named [nodebooks-v2.postman_collection.json](/postman/nodebooks-v2.postman_collection.json) that you can import in [Postman](https://www.postman.com/), to test that the application covers the proposed scenario
