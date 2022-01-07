const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const pinRoute = require("./routes/Pins");
const userRoute = require("./routes/Users");

//to create express application
const app = express();

//configuring env file
dotenv.config();

//to parse the values that is posted
app.use(express.json())

//to connect mongoose with the app the url is added in .env
mongoose.connect(process.env.MONGO_URL,  {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("MongoDB connected successfully")
    })
    .catch((err) =>{
        console.log(err);
});

app.use("/pins" , pinRoute);
app.use("/users", userRoute);

//port number
app.listen(1122 , () =>{
    console.log("Hooray!!Backend server is running");
})