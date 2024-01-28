const mongoose = require("mongoose");

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/relationshipDB');
  }
main()
.then(() => console.log('Connected'))
.catch(err => console.log(err));
const userSchema = new mongoose.Schema({
    first: String,
    last: String,
    addresses: [
        {
        _id:{_id:false},
        street:String,    
        city:String,
        state:String,
        country:{
            type:String,
            required:true
        },

        }
]
})

const user = mongoose.model('user',userSchema);
const newUser = async ()=>{
    const u = new user({
        first:'Harry',
        last:'Potter'
    })
    u.addresses.push({
        street:'123 Sesame St.',
        city:'New York',
        state:'NY',
        country:'USA'
    })
    const res = await u.save();
    console.log(res);
}

newUser();



const addAddress = async (id)=>{
 const u = await user.findById(id);   
 u.addresses.push({
    street:'99 3rd St.',
    city:'New York',
    state:'NY',
    country:'USA'
})
const res = await u.save();
}

addAddress('65b3716d228af727283724d0');
