const express = require('express');
var bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const neo4j_calls = require('./../neo4j_calls/neo4j_api');


const JWT_TOKEN = "hisisbetter&farbetterthen&me";


router.get('/getitems', async function (req,res) {
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

router.post('/update/:id' , async function (req,res){
    try {
        const result = await neo4j_calls.FindbyIDandUpdate(req,params.id,req.body);
        res.json(result);
    } catch (error) {
        res.status(500).send("Internal Server Error Ocured");
    }


})

router.post('/additem' ,  async function(req,res){
    try {
        console.log("I am in call");
        const result = await neo4j_calls.addItem(req.body);
        res.json(result);

    } catch (error) {
        res.status(500).send("Some Error Occured");
    }

})


router.post('/login' , async function (req,res){

    try {
    const result = await neo4j_calls.match(req.body);
        if(result == true){
            return res.status(200).send('No user exits');
        }

        const passcompare = await bcrypt.compare(result.password,req.body.password);
        if(passcompare){
            return res.status(200).send("login Success");
        }else{
            return res.status(400).send("Wrong Creadentials");
        }

    } catch (error) {
        res.status(error)
    }


})


router.post('/createuser' ,[
    body("email", "Enter a valid Email").isEmail(),
    body("password", "Enter a valid Password").isLength({ min: 5 }),
    body("name", "Enter a valid name").isLength({ min: 3 }),
] , async function (req,res){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ valierror :'true',success : 'false', error: errors.array() });
    }

    try {
        // todo
        // const salt = await bcrypt.genSalt(10);
        // const securepassword = await bcrypt.hash(req.body.password, salt);
        // console.log(securepassword);
        const user = {
            nmae : req.body.name,
            email :req.body.email,
            password :req.body.password
        }

        const result = await neo4j_calls.create_user(user);
        // res.json(result);
        res.status(200).json(result);
    } catch (error) {
        res.status(404).send(error);
    }
})



module.exports = router;