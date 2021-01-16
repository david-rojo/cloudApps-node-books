const express = require('express');
const database = require('./database.js');
const booksRouter = require('./routes/bookRouter.js');
const usersRouter = require('./routes/userRouter.js');
const fs = require('fs');
const https = require('https');

const PORT = 3443

const app = express();

//Convert json bodies to JavaScript object
app.use(express.json());
app.use('/api/v1/books', booksRouter);
app.use('/api/v1/users', usersRouter);

async function main() {

    await database.connect();

    https.createServer({
        key: fs.readFileSync('cert/server.key'),
        cert: fs.readFileSync('cert/server.cert')
    }, app).listen(PORT, () => {
        console.log('Nodebooks https server listening on port ' + PORT);
    })

    process.on('SIGINT', () => {
        database.disconnect();
        console.log('Process terminated');
        process.exit(0);
    });
}

main();