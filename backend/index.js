//this is the entry point, this will be our express server

const connectToMongo = require('./db');
const express = require('express')
const cors = require('cors')

connectToMongo();


const app = express()
const port = 5000


app.use(cors())

app.use(express.json());

//abhi humne ek .get karke end-point banaya hai and vo return kar raha hai hello om, but hamare ye application ko chaiye hoge kuch aur endpoints taaki hum hamare application me various  kaam kar sake for example user autnthicate ke liye, konsa user kaha connected hai kiske konse notes hai, etc.
// app.get('/', (req, res) => {
//   res.send('Hello Om!')
// })

//hum yaha pe, is file me apne saare ke saare routes likh sakte hai, login, signup, etc
// app.get('/api/v/login', (req, res) => {
//     res.send('This is login functionality')
//   })

// app.get('/api/v/signup', (req, res) => {
//     res.send('This is signup functionality')
//   })    //par ek achha developer hamaesha ek achha file structure maintain karta saare alg alg chizo ke liye

//avaiable routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));


app.listen(port, () => {
  console.log(`iNotebook backend listening on port ${port}`)
})