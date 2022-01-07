const router = require("express").Router();
const Pin = require("../models/Pin");

//to create a pin
router.post("/", async (req, res) => {
    const newPin = new Pin(req.body);
    //req.body is bcoz we are saving title description and rating
    try{
        const savedPin = await newPin.save();
        res.status(200).json(savedPin);
    }catch(err){
        res.status(500).json(err);
    }
})

//to get all pins
router.get("/", async(req,res) => {
    try{
        const pins = await Pin.find();
        res.status(200).json(pins);
    }catch(err){
        res.status(500).json(err);
    }
})

module.exports = router;