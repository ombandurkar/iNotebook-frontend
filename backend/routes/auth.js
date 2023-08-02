const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser')

const JWT_SECRET = "om@is#great"


//req - request, res - result

//*************ROUTE 1****************1. endpoint: create a user using: POST "api/auth/createuser" No login required , ispar post req maarni hai and data bhejna hai
router.post('/createuser',

    // this is a validation layer, everything inside [] is for authenticating and validating
    [
        body('name', 'Enter a valid name').isLength({ min: 2 }),
        body('email', 'Enter a valid email').isEmail(),
        body('password', 'Password length should be min. 8').isLength({ min: 8 }),
    ],
    async (req, res) => {

        let success = false;

        //if there are errors in validation of length of anything, return bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({  success , errors: errors.array() });  //status code 400 bhej do and json me ye bhej do
        }

        //this will be for checking if the email already exists in the system
        try {

            // check weather the usr with same email exists
            let user = await User.findOne({ email: req.body.email });

            // if user exists
            if (user) {
                return res.status(400).json({ success ,  error: "This email already exists" })
            }

            //creating a salt using function geSalt, i.e. generating salt
            const salt = await bcrypt.genSalt(10); //isko mai await  mark karunga kyyuki ye ek promise return karta hai
            //encrypting a password by hashing it with salt
            const secPass = await bcrypt.hash(req.body.password, salt)  //isko mai await  mark karunga kyyuki ye ek promise return karta hai


            //***************if email is new and unique, ceate and save the user*************
            user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: secPass,
            })

            const data = {
                user: {
                    id: user.id
                }
            }
            const authToken = jwt.sign(data, JWT_SECRET); //isse ek token generate hoga, and jab bhi mujhe vapis milega, mai usse ye upar waala data retrieve kar sakta hu aur ye  bhi pata kar paaunga ki temper hua hai kya data ya nahi with the secret by using .verify method

            // res.json(user) //thunder client par json dikega
            success = true;
            res.json({ success , authToken })

        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal server error occured")  //status code 500 bhej do and json me ye bhej do
        }

        //********Dusra code user ko save karne ke liyee*********
        // .then(user => res.json(user))
        // .catch(err => {console.log(err)
        // res.json({error: 'Please enter a uniqueu email address'})})


        //*****sabse pehela code user ko save karne ke liye***********
        // const user = User(req.body);
        // user.save()
        // res.send(req.body);

    })



//********ROUTE 2*************2nd end point: authticate a user using: POST "api/auth/login"*************************************
router.post('/login',

    // this is a validation layer, everything inside [] is for authenticating and validating
    [
        body('email', 'Enter a valid email').isEmail(),
        body('password', 'Password cannot be empty').exists(),
    ],
    async (req, res) => {

        let success = false;

        //if there are errors in validation of length of anything, return bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });  //status code 400 bhej do and json me ye bhej do
        }

        //lekin kaafi kam chances hai ki aisa hoga ki koi aayega and galat email format or passowrd blank rakhega, generally hume email and password dono milege

        const { email, password } = req.body;  //hum destructuring kar rahe hai to get email and password enetered

        try {
            let user = await User.findOne({ email })

            //agr is email ka koi user naghi milta hume in our database
            if (!user) {
                success = false;
                return res.status(400).json({ error: "INCORRECT credentials, please check and try again" });
            }

            //email found in DB, lets check for password
            const passwordCompare = await bcrypt.compare(password, user.password);  //comapring the entered password with user passowrd

            if (!passwordCompare) {
                success = false;
                return res.status(400).json({ success , error: "INCORRECT credentials, please check and try again" });
            }

            //idhar tak pahuch gaye means, correct crendentials, email matches with passowrd, so now we will send data
            const data = {
                user: {
                    id: user.id  //ye waali id DB se aa rahi hai, sabke id alg hoti hai na and with id we can retirve the data in the fastest way from DB
                }
            }

            const authToken = jwt.sign(data, JWT_SECRET);
            success = true;
            let userName = user.name   //hum user ka naam bhi bhej rahe hai to display it on logged-in screen
            res.json({ userName, success , authToken })

        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal server error occured")  //status code 500 bhej do and json me ye bhej do, ye hum user ko bhej rahe hai

        }

    })

//********ROUTE 3********Endpoint 3 : logged in user ki details dega using: POST "api/auth/getuser. login required"*/
//authentication token se saari ki saari details fetch kar dunga

router.post('/getuser', fetchuser , async (req, res) => {
        try {
            const userId = req.user.id;
            const user = await User.findById(userId).select("-password");  //selecting all fileds except password
            res.send(user);
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal server error occured")  //status code 500 bhej do and json me ye bhej do, ye hum user ko bhej rahe hai
        }
    })

module.exports = router