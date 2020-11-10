const express = require('express');
const router = express.Router();
const db = require("../data/dbConfig.js");
const validateAccount = (req,res,next) => {
    db('accounts').where({ id: req.params.id })
        .then(r => {
            if (r.length == 0) {
                res.status(404).json({message: "account not found"})
            } else {
                res.account = r;
                next();
            }
        })
        .catch(e=>res.status(500).json({message: "error retrieving account from the database"}))
}
router.use('/:id', validateAccount);
router.get('/', (req, res) => {
    db('accounts')
        .then(r => {
            res.status(200).json({
                message: "successfully retrieved accounts data",
                data: r
            })
        })
        .catch(e => res.status(500).json({ message: "error retrieving accounts from the database" }));
});

router.get('/:id', (req, res) => {
    res.status(200).json({ message: "successfully retrieved account", data: res.account });
});

router.post('/', (req, res) => {
    const { name, budget } = req.body;
    if (!name || !budget) { 
        res.status(300).json({message: "error: must provide account name and budget"})
    } else {
        db('accounts').where({ name }).then(r => {
            if (r.length == 0) {
                db('accounts').insert({ name, budget })
                .then(r => res.status(201).json({ message: "account created", data: r }))
                .catch(e=>res.status(500).json({message: "error creating account"}))
            } else {
                res.status(409).json({message: "error: account with that name already exists"})
            }
        })
    }
});

router.put('/:id', (req, res) => {
    const { name, budget } = req.body;
    if (!name && !budget) {
        res.status(300).json({ message: "error: include something to update (name and/or budget)" })
    } else {
        db('accounts').where({ id: req.params.id }).update(req.body)
            .then(r => res.status(200).json({ message: "successfully updated account" }))
            .catch(e => res.status(500).json({ message: "error updating account" }))
    }
});

router.delete('/:id', (req, res) => {
    db('accounts').where({ id: req.params.id }).del()
        .then(r => {
            res.status(200).json({message: "successfully deleted account"})
        })
        .catch(e => {
            res.status(500).json({message: "error deleting account"})
        })
})

module.exports = router;