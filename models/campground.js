const mongoose = require('mongoose');
const Review = require('./review');
const { post } = require('request');
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
    tittle:String,
    image:String,
    price:Number,
    description:String,
    location:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review"
        }
    ]
})






CampgroundSchema.post('findOneAndDelete',async function(doc){
    if(doc){
        console.log(doc);
        await Review.deleteMany({
            _id:{
                $in:doc.reviews
            }
    })
    }
})


module.exports = mongoose.model("Campground",CampgroundSchema); 