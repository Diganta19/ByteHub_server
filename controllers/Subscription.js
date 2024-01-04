import Razorpay from "razorpay";
import User from "../models/auth.js"
import mongoose from "mongoose";
import 'dotenv/config'
import crypto from "crypto"



//const stripe = new Stripe('sk_test_51OPSz1SDb36Igos31yuik3SQrEIDvJgtrBpSx9fpDNaPXXs894uEfs4Lfq0ZXmgqrlx4D1V1XcjhLWKqD9iQmphZ00k5tj7QBt');

const membership = new Map([
    [1,{name: 'SILVER', priceInCents: 10}],
    [2,{name: 'GOLD', priceInCents: 50000}],
    [3,{name:  'PLATINUM', priceInCents: 100000}],
])


export const AskSubscription = async(req,res)=>{
    try {
         const {itemId,userId} = req.body;
        const subscriptionPlan = membership.get(JSON.parse(itemId))
        
       

        // const session = await stripe.checkout.sessions.create({
        //     payment_method_types:['card'],
        //     mode:"payment",
        //     line_items:[{
        //         price_data:{
        //             currency:'INR',
        //             product_data:{
        //                 name:subscriptionPlan.name
        //             },
        //             unit_amount:subscriptionPlan.priceInCents
        //         },
        //         quantity:1

        //         }],
        //     success_url: `http://localhost:3000/success/${userId}?plan=${subscriptionPlan.name}`,
        //     cancel_url: 'http://localhost:3000/',
        // })
        
        //  res.json({session:session, url:session.url, userId:userId, planName:subscriptionPlan.name})
        // res.json({session:session})

        const instance = new Razorpay({
            key_id:process.env.KEY_ID,
            key_secret:process.env.KEY_SECRET
            
        });
        
        const options = {
            amount:subscriptionPlan.priceInCents * 100,
            currency:"INR",
            // recipt: crypto.randomBytes(10).toString('hex'),
        };

        instance.orders.create(options,(error,order)=>{
            if(error){
                console.log(error);
                return res.status(500).json({message:"SOMETHING WENT WRONG"});
            }
            res.status(200).json({data:order,subplan:subscriptionPlan.name,UId:userId})
        });
    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
}

export const verifyPayment = async(req,res)=>{
    
    try {
        const {razorpay_order_id,razorpay_payment_id,razorpay_signature} =  req.body
        console.log(razorpay_order_id,razorpay_payment_id,razorpay_signature);
        const sign = razorpay_order_id +"|"+razorpay_payment_id;
        const expectedSign = crypto.createHmac("sha256",process.env.KEY_SECRET).update(sign.toString()).digest("hex")

        if(razorpay_signature === expectedSign){
            res.status(200).json({message:"PAYMENT VERIFIED"})
        }else{
            res.status(500).json({message:"PAYMENT FAILED"})
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"INTERNAL SERVER ERROR"})
    }
}

export const updateSubscription = async(req,res) =>{
    const{id:_id} = req.params;
    const {subplan} = req.body;
    console.log("sub",subplan);
    

    if(!mongoose.Types.ObjectId.isValid(_id)){
        return res.status(404).send('User unavliabe....')
    }
    try {
        const updatedSubscription = await User.findByIdAndUpdate(_id,{$set:{'subscription':subplan}},{new:true})
        res.status(200).json(updatedSubscription)
    } catch (error) {
        res.status(505).json({error:error.message})
    }
}