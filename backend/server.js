const express = require("express")
const cors = require("cors")

const app = express()

app.use(cors())
app.use(express.json())

let drugs = []
let qrs = []
let scans = []

// Register drug
app.post("/registerDrug", (req,res)=>{

    const drug = req.body
    drugs.push(drug)

    res.json({
        message:"Drug registered",
        drug
    })

})

// Generate QR
app.post("/generateQR",(req,res)=>{

    const {drugId} = req.body

    const qrId = "QR-" + Math.floor(Math.random()*100000)

    const otp = Math.floor(100000 + Math.random()*900000).toString()

    const record = {
        qrId,
        drugId,
        otp,
        status:"active"
    }

    qrs.push(record)

    res.json({
        qrId,
        otp
    })

})

// Verify
app.post("/verify",(req,res)=>{

    const {qrId,otp} = req.body

    const qr = qrs.find(q=>q.qrId===qrId)

    if(!qr){
        return res.json({status:"COUNTERFEIT"})
    }

    if(qr.status==="used"){
        return res.json({status:"QR_ALREADY_USED"})
    }

    if(qr.otp!==otp){
        return res.json({status:"INVALID_OTP"})
    }

    qr.status="used"

    scans.push({
        qrId,
        result:"AUTHENTIC",
        time:new Date()
    })

    res.json({
        status:"AUTHENTIC"
    })

})

app.get("/stats",(req,res)=>{

    res.json({
        drugs:drugs.length,
        qrs:qrs.length,
        scans:scans.length
    })

})

const PORT = process.env.PORT || 5000

app.listen(PORT,()=>{
    console.log("Server running on",PORT)
})