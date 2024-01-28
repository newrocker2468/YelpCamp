const mongoose = require("mongoose");

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/relationshipDB');
  }
main()
.then(() => console.log('Connected'))
.catch(err => console.log(err));

const farmschema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Farm must have a name!']
    },
    city:{
        type:String
    },
    email:{
        type:String,
        required:[true,'Email required']
    },
    products:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product'
    }]
})
