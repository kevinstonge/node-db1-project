const express = require("express");
const cors = require('cors');
const accountsRouter = require('./accountsRouter.js');

const server = express();
server.use(cors());
server.use(express.json());

server.use('/api/accounts', accountsRouter);
server.get('/', (req, res) => {
    res.status(200).json({
        message: "api online at /api/accounts"
    })
})
module.exports = server;
