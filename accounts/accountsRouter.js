const express = require("express");

const router = express.Router();

const db = require("../data/dbConfig");

router.post("/", validateAccount, (req, res) => {

    const { name, budget } = req.body;

  db("accounts")
    .insert({ name: name, budget: budget })
    .then(account => {
      res.status(201).json(account);
    })
    .catch(err =>
      res.status(500).json({ errorMessage: "Error adding this account" })
    );
});

router.get("/", (req, res) => {
    var { limit } = req.body;
    var { sortBy } = req.body;
    var { sortDir } = req.body;
    if(!limit){
        limit = 10
    }
    if(!sortBy){
        sortBy = 'id'
    }
    if(!sortDir){
        sortDir = 'asc'
    }

  db("accounts").orderBy(sortBy, sortDir).limit(limit)
    .then(accounts => res.status(200).json(accounts))
    .catch(err =>
      res.status(500).json({ errorMessage: "Error fetching accounts" })
    );
});

router.put("/:id", validateAccount, (req, res) => {

    const { name, budget } = req.body;

    db('accounts').where({id: req.params.id}).update({name: name, budget: budget})
    .then(account => res.status(200).json(account))
    .catch(err =>
      res.status(500).json({ errorMessage: "Error updating account" })
    );
})

router.delete("/:id", validateAccountId, (req, res) => {
  db("accounts")
    .where({ id: req.params.id })
    .del()
    .then(account => {
      if (account > 0) {
        res.status(200).json({ message: "Account deleted" });
      } else {
        res.status(400).json({ errorMessage: "Account could not be deleted" });
      }
    })
    .catch(err =>
      res.status(500).json({ errorMessage: "Error deleting account" })
    );
});

// Stretch

// custom middleware

function validateAccountId(req, res, next) {
  const { id } = req.params;

  db("accounts")
    .where({ id })
    .then(account => {
      if (account) {
        postId = id;
        next();
      } else {
        res.status(400).json({ errorMessage: "Invalid account id." });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ errorMessage: "Error validation account id." });
    });
}

function validateAccount(req, res, next) {
  const account = req.body;
  if (!account) {
    res.status(400).json({ message: "Missing account data" });
  } else if (!account.name || !account.budget) {
    res
      .status(400)
      .json({ message: "Missing required field. Name or Budget." });
  } else {
    next();
  }
}

module.exports = router;
