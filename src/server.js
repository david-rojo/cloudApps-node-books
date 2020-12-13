const express = require('express');
const booksRouter = require('./booksRouter.js').router;
const booksInit = require('./booksRouter.js').init;

const app = express();

//Convert json bodies to JavaScript object
app.use(express.json());

app.use(booksRouter);

async function main() {

    await booksInit();

    app.listen(8080, () => {
        console.log('Nodebooks server listening on port 8080!');
    });
}

main();