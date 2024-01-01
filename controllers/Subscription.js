import Stripe from "stripe";
import User from "../models/auth.js"
import mongoose from "mongoose";


const stripe = new Stripe('sk_test_51OPSz1SDb36Igos31yuik3SQrEIDvJgtrBpSx9fpDNaPXXs894uEfs4Lfq0ZXmgqrlx4D1V1XcjhLWKqD9iQmphZ00k5tj7QBt');

const membership = new Map([
    [1,{name: 'SILVER', priceInCents: 0}],
    [2,{name: 'GOLD', priceInCents: 50000}],
    [3,{name:  'PLATINUM', priceInCents: 100000}],
])


export const AskSubscription = async(req,res)=>{
    try {
         const {itemId,userId} = req.body;
        console.log(userId);
        const subscriptionPlan = membership.get(JSON.parse(itemId))
        const session = await stripe.checkout.sessions.create({
            payment_method_types:['card'],
            mode:"payment",
            line_items:[{
                price_data:{
                    currency:'INR',
                    product_data:{
                        name:subscriptionPlan.name
                    },
                    unit_amount:subscriptionPlan.priceInCents
                },
                quantity:1

                }],
            success_url: `https://wondrous-halva-f4c999.netlify.app//success/${userId}?plan=${subscriptionPlan.name}`,
            cancel_url: 'https://wondrous-halva-f4c999.netlify.app/',
        })
        
         res.json({url:session.url, planName:subscriptionPlan.name})
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

export const updateSubscription = async(req,res) =>{
    const{id:_id} = req.params;
    const {subscription} = req.body;
    

    if(!mongoose.Types.ObjectId.isValid(_id)){
        return res.status(404).send('User unavliabe....')
    }
    try {
        const updatedSubscription = await User.findByIdAndUpdate(_id,{$set:{'subscription':subscription}},{new:true})
        res.status(200).json(updatedSubscription)
    } catch (error) {
        res.status(505).json({error:error.message})
    }
}