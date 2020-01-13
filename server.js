const express = require('express');

const accountsRouter = require('./accounts/accountsRouter');

const server = express();

function logger(req, res, next) {
    console.log(
      `[${new Date().toISOString()}] ${req.method} to ${req.url}`
    );
  
    next();
  }

server.use(express.json());
server.use(logger);

server.use("/api/accounts", accountsRouter);

module.exports = server;