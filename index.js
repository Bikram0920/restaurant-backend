require('dotenv').config()
const express = require("express")
const PORT = process.env.PORT || 4600
const Table=require('./TableSchema');
const user = require("./auth_schema_signup")
const Reservation=require('./ResSchema');
const bodyParser = require("body-parser")
const cors=require('cors');
const {ObjectId}=require('mongodb');
const {signup, signin}=require('./auth_schema')
const app = express()
app.use(express.json());
app.use(cors())

require("./mongoConnection")

app.post("/signup", signup )
app.post("/signin", signin )

app.get("/",(req,res)=>{
    res.send("Hey I am Bikram");
})

app.post('/newtable',async (req,res)=>
{
    try{
        const newTable=new Table(req.body);
        await newTable.save();
        return res.status(200).json({message:"Table Created"})
    }
    catch(e){console.log(e);
    console.log("table not created");}
})

app.post('/gettables', async (req,res)=>
{
    console.log(req.body);
    const {date,time_slot,party_size}=req.body;
    console.log(date,time_slot,party_size);
    try{
        const tables=await Table.find({
            capacity: party_size,
            $or:[
                {
                    $and:[
                        { date: {$ne:date}},
                        {time_slot: {$ne: time_slot}}
                    ]
                },
                {
                    date: {$ne: date}
                },
                {
                    time_slot:{$ne: time_slot}
                }
               
            ]
        })

        res.status(200).send(tables);
    }
    catch(e){
        console.log(e);
    }
} )

app.post('/reservation',async(req,res)=>
{
    try{
        console.log(req.body);
        const{name,email,date,time_slot,party_size,T_id} = req.body;
        if(!name || !email || !date || !time_slot || !party_size || !T_id)
        {
            return res.status(400).json({error:'Please fill all fields'});
        }
        if(party_size<=0)
        {
            return res.status(400).json({error:'Invalid party size'});
        }
        const newRes=await Reservation(req.body);
        newRes.save();
        return res.status(200).json({message:"Table Reserved"})
    }
    catch(e){
        console.log(e); console.log("Couldnt reserve")
        return res.status(400).json({error:"Could not Reserve table"});}
    
})

app.get('/user/reservation/:email', async(req,res)=>
{
    try{
        const email=req.params.email;
        // const id=new ObjectId(req.params.email)
        console.log(req.params.email)
        // const Curruser=await user.findOne({email:email});
        const reservations=await Reservation.find({email:email});
        return res.status(200).send(reservations);
    }
    catch(e){console.log(e)}
})

app.listen(PORT, (req,res)=>{
    console.log(`Server is running on ${PORT}`)
})



