# Nodebooks

## Installation

In order to download needed dependencies is needed to execute the following command:

```
npm install
```


## Deployment

Before deploy the application, is needed to has a available MongoDB database, the most easy way is with docker executing the following command:

```
docker run --rm -p 27017:27017 -d --name mongodb-nodebooks mongo:4.4.2-bionic
```

Once we have it ready, we launch the application from ```src``` folder:

```
node server.js
```