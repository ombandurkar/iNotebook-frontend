let jwt = require('jsonwebtoken');

// let JWT_SECRET = "om@is#great"

require('dotenv').config()
const JWT_SECRET = process.env.JWT_SECRET_CODE

//request, response, and next lega middleware, middleware ek function hota hai
//yaha par next means, iske baad joo bhi function ho use run karva do, here it is async (req,res) waala in auth.js
const fetchuser = (req, res, next) => {

    //get the user from the jwt token and add id to req object
    const token = req.header('auth-token') //mai token header se le aaunga and mai iska naam auth-token rakh deta hu

    if (!token) {
        res.status(401).send({ error: "Access denied, please autheticate with a valid token" })
    }

    try {
        //hum is token ko verify karege and 
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;  //hume user mil jaayega
        next();
    } catch (error) {
        res.status(401).send({ error: "Access denied, please autheticate with a valid token" })
    }

}

module.exports = fetchuser;