let neo4j = require('neo4j-driver');
var uniqid = require('uniqid'); 
let { creds } = require("./../config/credentials");
let driver = neo4j.driver("bolt://34.200.250.123:7687", neo4j.auth.basic(creds.neo4jusername, creds.neo4jpw));


// find by id function 
const findById = async(id) =>{
    let session = driver.session();
    const result = await session.run(`MATCH (u:User {_id : '${id}'} ) return u limit 1`)
    return result.records[0].get('u').properties
}

// Add items api calls
// getItems get to find all the items

exports.getItem = async(node) =>{
    let session = driver.session();
    const result = await session.run('Match (i:Item) return i')
    return result.records.map(k=>k.get('i').properties )
}

// to add a item in data base  
exports.addItem = async(item) =>{
    let session = driver.session();
    console.log(item);
    const result = await session.run(`CREATE (i:Item {_id : '${item.id}', name: '${item.name}', description: '${item.description}', category: '${item.category}',price : '${item.price}' } ) return i`)
    // console.log(result);
    return result.records[0].get('i').properties
}

// Update the existing item in database

exports.findByIdAndUpdate = async function (id,item){
    console.log("INT HE KSKSK")
    let session =driver.session();
    try {
        
        const result = await session.run(`MATCH (i:Item {_id : '${id}'}) SET i.name= '${item.name}', i.description= '${item.description}', i.category= '${item.category}' , i.price ='${item.price}' return i`)
        return result.records[0].get('i').properties
    } catch (error) {
        console.log(error);
    }
}


// function to find existing user using email

const findbyemail = async(email)=>{
    let session = driver.session();
    const result = await session.run(`MATCH (u:User {email: '${email}'} ) return u limit 1`)
    if(result.records.length === 0) return false;
    return true;
}

// Function to login user 
// to do is authentication jwt encryption and express validator to validate email
// to do is to find by id IF user exits

exports.match = async function(email){
    let session = driver.session();
    const result = await session.run(`MATCH (u:User {email : '${email}'} ) return u limit 1`)
    return result.records[0].get('u').properties
    
}
// Create a user almost done but we have to encrypt password to store in data base

exports.create_user = async function (user) {
    let session = driver.session();
    try {
        const res = await findbyemail(user.email);
        if( res === true ) return "User With the same Email is Already registered"
        const unique_id = uniqid();
        const result = await session.run(`CREATE (u:User {_id : '${unique_id}', name: '${user.name}', email: '${user.email}', password: '${user.password}'} ) return u`)
        console.log(result.records[0].get('u').properties);
        return "User Has Been Created"   
    }
    catch (err) {
        console.error(err);
    }
    return user.records[0].get(0).properties.name;
}