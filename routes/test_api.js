const express = require('express');
var bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const neo4j_calls = require('./../neo4j_calls/neo4j_api');



router.get('/getitems', async function (req, res) {
    try {
        const result = await neo4j_calls.getItem()
        res.status(200).json(result);
    } catch (error) {
        res.status(500).send("Some Eroor Ocured");
    }


})


// router.put('/update/:id' , async function(req,res){
//     const result = await neo4j_calls.FindbyIDandUpdate(req.params.id , req.body);
//     res.json(result);
// })


// update the item api call

router.put('/update/:id', async function (req, res) {
    console.log("hello")
    try {
        const result = await neo4j_calls.findByIdAndUpdate(req.params.id, req.body)
        res.json(result)
    } catch (error) {
        console.log(error);
    }
})

router.post('/additem', async function (req, res) {
    try {
        console.log("I am in call");
        const result = await neo4j_calls.addItem(req.body);
        res.json(result);

    } catch (error) {
        res.status(500).send("Some Error Occured");
    }

})


router.post('/login', [
    body("email", "Enter a valid Email").isEmail(),
    body("password", "Enter a valid Password").isLength({ min: 5 })
], async function (req, res) {
    console.log('login');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ valierror: 'true', success: 'false', error: errors.array() });
    }


    try {

        const {email,password} = req.body;

        const result = await neo4j_calls.match(email);
        if (result === {} ) {
            return res.status(400).send('No user exits');
        }
        console.log(password);
        console.log(result.password);
        const pascompare = await bcrypt.compare(password,result.password);
        if(pascompare){
            res.json({success : 'true'})
        }else{
            res.status(400).json({success : 'false' , message : 'wrong creds'});
        }
        
        res.status(400).send("Unauthorized Access");
    } catch (error) {
        res.status(error)
    }


})


router.post('/createuser', [
    body("email", "Enter a valid Email").isEmail(),
    body("password", "Enter a valid Password").isLength({ min: 5 }),
    body("name", "Enter a valid name").isLength({ min: 3 }),
], async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ valierror: 'true', success: 'false', error: errors.array() });
    }

    try {
        const securepassword = await bcrypt.hash(req.body.password, 10);
        // console.log(securepassword);

        const user = {
            nmae: req.body.name,
            email: req.body.email,
            password: securepassword
        }

        const result = await neo4j_calls.create_user(user);
        // res.json(result);
        res.status(200).json(result);
    } catch (error) {
        res.status(404).send(error);
    }
})



module.exports = router;