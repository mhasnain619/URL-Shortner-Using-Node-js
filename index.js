const express = require("express")
const { connectToMongoDB } = require('./connect')

const urlRoute = require('./routes/url')


const app = express()
const PORT = 8001

connectToMongoDB('mongodb://localhost:27017/short-url')
    .then(() => {
        console.log('Mongodb Connected Successfully');

    })

app.use(express.json())
app.use('/', urlRoute)

app.listen(PORT, () => {
    console.log("Server Started at PORT : " + PORT);
})