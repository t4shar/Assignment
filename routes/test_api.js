const express = require('express');
const router = express.Router();
const neo4j_calls = require('./../neo4j_calls/neo4j_api');

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
        if(result === false){
            res.status(404).send("Wrong Credentials");
        }else{
            res.status(200).send("Success");
        }  

    } catch (error) {
        res.status(error)
    }


})


router.post('/createuser' , async function (req,res){
    try {

        const result = await neo4j_calls.create_user(req.body);
        res.json(result);
        // res.status(202).send("USER HAS CREATED SUCCESFULLY");
    } catch (error) {
        res.status(404).send(error);
    }
})

router.get('/neo4j_get', async function (req, res, next) {
    try {
        let result = await neo4j_calls.get_num_nodes();
    console.log("RESULT IS", result)
    res.status(200).send({ result })    //Can't send just a Number; encapsulate with {} or convert to String.     
    return { result };
    } catch (error) {
        res.send(error);    
    }
    
})

router.post('/neo4j_post', async function (req, res, next) {
    try {
        let { name } = req.body;
        let string = await neo4j_calls.create_user(name);
        res.status(200).send("User named " + string + " created")
        return 700000;
    } catch (error) {
        res.send(error);
    }
})

module.exports = router;