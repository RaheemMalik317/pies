// const express = require('express');
// const router = express.Router();
const router = require('express').Router();
const { PieModel } = require('../models');
const middleware = require('../middleware'); 
// router.get('/', (req, res) => res.send('I love pies!'));
router.get('/all', async(req, res) => {
    try {
        const allPies = await PieModel.findAll();
        res.status(200).json(allPies);
    } catch (err) {
        res.status(500).json({
            error: err
        })
    }
})
router.get('/:name', async(req,res) => {
    try {
        const locatedPie=  await PieModel.findOne({
            where: {nameOfPie: req.params.name}
        })
        res.status(200).json({
            msg: `Success!`,
            locatedPie
        })
    } catch (err) {
        res.status(500).json({
            msg: `Failed to get pie(s): ${err}`
        })
    }
})
router.post('/', middleware.validateSession, async(req,res) => {
    const {
        nameOfPie, 
        baseOfPie,
        crust,
        timeToBake,
        servings,
        ratings
    } = req.body
    try {
        const Pie = await PieModel.create({
            nameOfPie, 
            baseOfPie,
            crust,
            timeToBake,
            servings,
            ratings
        })
        res.status(201).json({
            msg: `Pie successfully created!`,
            Pie
        })
    } catch (err) {
        res.status(500).json({
            msg: `Failed to create pie: ${err}`
        })
    }
})
router.put('/:id', middleware.validateSession, async(req,res) => {
    const {
        nameOfPie, baseOfPie, crust, timeToBake, servings, ratings
    } = req.body
    try{
        const pieUpdated = await PieModel.update(
            {nameOfPie, baseOfPie, crust, timeToBake, servings, ratings},
            {where: {id: req.params.id}}
            )
            res.status(200).json({
                msg: `Pie successfully updated!`,
                pieUpdated
            })
    } catch(err) {
        res.status(500).json({
            msg: `Failed to update pie: ${err}`
        })
    }
})
router.delete('/:id', middleware.validateSession, async (req,res) => {
    try {
        const locatedPie = await PieModel.destroy({
            where: {id: req.params.id}
        })
        .then(result => {
            res.status(200).json({
                msg: `Pie destroyed!`,
                deletedPie: result
            })
        })
    } catch (error) {
        res.status(500).json({
            msg: `Unable to delete: ${error}`
        })
    }
})
module.exports = router;

/* 
? 1 => The res (response) object represents the HTTP response that an Express app 
? sends back to us when it receives an HTTP request.
? 2 => We add some error handling to this by wrapping the code 
? inside of a try...catch statement.
? 3 => findAll() is a sequelize query method we can use to GET all objects 
? stored in a table from the database. This returns a promise that, 
? in conjunction with the async/await, gets captured in a variable called allPies.
* 4 => We use object deconstruction to extrapolate data from the request. 
* req.body allows you to access the JSON data that was sent in the request. 
* Generally used in POST/PUT requests to send arbitrary-length JSON to the server
* 5 => We use the sequelize method of .create() and pass in the data from the deconstructed request. 
* This builds a new instance of our model and is expecting the values of our keys to be sent through 
* the request body. We then capture the response from database as the pie was created and assign that 
* to a variable called Pie.
* 6 => We build a response and provide a 201 (content created) status code. 
* We also provide a message indicating this success and appending the newly created pie to the response.
? 7 => We use the the colon in this endpoint to accept a parameter. 
? 8 => req.params will look into the parameters of the endpoint, then we specify what to pull from it.
* */