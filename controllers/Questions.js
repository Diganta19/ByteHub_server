import Questions from "../models/Questions.js"
import User from "../models/auth.js"
import mongoose from 'mongoose'
import moment from 'moment'


const canPostQuestion = async(user,userId) => {
    const today = moment().startOf('day');
    const tomorrow = moment(today).add(1, 'days');
    var query = {userId:userId}
    const posts= await Questions.find(query)
    
  
    if (user.subscription === 'SILVER') {
       const todaysPost = posts.filter(post => moment(post.askedOn).isBetween(today,tomorrow));
       return todaysPost.length < 1;
    } else if (user.subscription === 'GOLD') {
        const todaysPost = posts.filter(post => moment(post.askedOn).isBetween(today,tomorrow));
        return todaysPost.length < 5;
    } else if (user.subscription === 'PLATINUM') {
      return true; // Gold users can post unlimited questions
    }
    return false;
  };


export const AskQuestion =async(req,res) =>{
    try {
    const postQuestionData = req.body;
    const user = await User.findById(postQuestionData.userId);
    const canPost = await canPostQuestion(user,postQuestionData.userId)
    if(user){
        if(canPost){      
            const postQuestion = new Questions(postQuestionData)
                await postQuestion.save();
                res.status(200).json("Posted a question successfully");
        }else{
            return res.status(404).json({ status: 'error', message: 'Exceeded daily posting limit' });
        }
        }else{
            
            return res.status(405).json({ status: 'error', message: 'User not found' });
        } 
    
        var query = {userId:postQuestionData.userId}
        const posts= await Questions.find(query)
        
        await User.findByIdAndUpdate(postQuestionData.userId,{$set:{'points':posts.length * 10}},{new:true})
        } catch (error) {
            console.log(error);
            res.status(409).json("Couldn't Post")
    }
}


export const getAllQuestions = async(req,res)=>{
    const {userId} = req.body;
    try {
        const questionList = await Questions.find()
        res.status(200).json(questionList)
    } catch (error) {
        res.status(404).json({message: error.message})
        console.log(error);
    }
}

export const deleteQuestion = async(req,res) =>{
    const {id:_id} = req.params;
 
    if(!mongoose.Types.ObjectId.isValid(_id)){
        return res.status(404).send('question unavliabe....')
    }

    try {
       await Questions.findByIdAndDelete(_id)
        res.status(200).json({message: "successfully deleted"})
    } catch (error) {
        res.status(404).json({message:error.message})
        console.log(error);
    }
}

export const voteQuestion =async (req,res) =>{
    const {id:_id} = req.params;
    const {value, userId} = req.body
    console.log("control");

    if(!mongoose.Types.ObjectId.isValid(_id)){
        return res.status(404).send('question unavliabe....')
    }

    try {
        const question = await Questions.findById(_id);
        const upIndex= question.upVote.findIndex((id) => id  === String(userId))
        const downIndex = question.downVote.findIndex((id)=>id === String(userId))
       

        if(value === 'upVote'){
            if(downIndex !== -1){
                question.downVote = question.downVote.filter(((id) => id!==String(userId) ))
            }
            if(upIndex === -1){
                question.upVote.push(userId)
            }else{
                question.upVote = question.upVote.filter((id) => id!==String(userId))
            }
        }else if(value === 'downVote'){
            if(upIndex !== -1){
                question.upVote = question.upVote.filter(((id) => id!==String(userId) ))
            }
            if(downIndex === -1){
                question.downVote.push(userId)
            }else{
                question.downVote = question.downVote.filter((id) => id!==String(userId))
            }
        }
        await Questions.findByIdAndUpdate(_id,question)
        res.status(200).json({message:"Voted Successfully"})
    } catch (error) {
        console.log(error);
        res.status(404).json({message: error.message})
        
    }
}