import mongoose from 'mongoose'

const QuestionSchema =  mongoose.Schema({
    questionTitle : {type:String,required:"Question Title is required"},
    questionBody : {type:String,required:"Question Body is required"},
    questionTags : {type:[String],required:"Question Tag is required"},
    noOfAnswers : {type:Number,default:0},
    upVote : {type:Array,default:[]},
    downVote : {type:Array,default:[]},
    userPosted:{type:String,required:"Question Must have an Author "},
    userId:{type:String},
    askedOn:   {type:Date,default:Date.now },
    answer:[{
        answerBody:String,
        userAnswered:String,
        userId:String,
        answeredOn:{type:Date,default:Date.now},
    }]
})

export default mongoose.model("Question",QuestionSchema);