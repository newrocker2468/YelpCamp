const mongoose = require("mongoose");

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/relationshipDB');
  }
main()
.then(() => console.log('Connected'))
.catch(err => console.log(err));

const productschema = new mongoose.Schema({
    name:String,
    price:Number,
    season:{
        type:String,
        enum:['Spring','Summer','Fall','Winter']
    }
})



const farmSchema = new mongoose.Schema({
    name:String,
    city:String,
    products:[{type:mongoose.Schema.Types.ObjectId,ref:'Product'}]
})
const Product = mongoose.model('Product',productschema);
const Farm = mongoose.model('farm',farmSchema);
const makeFarm = async ()=>{
    const farm = new Farm({name:'Full Belly Farms',city:'Guinda,CA'});
    const melon = await Product.findOne({name:'Goddess Melon'});
    farm.products.push(melon);
    await farm.save();
    console.log(farm);
}

const addProduct = async ()=>{
    const farm = await Farm.findOne({name:'Full Belly Farms'});
    const watermelon = await Product.findOne({name:'Sugar Baby Watermelon'});
    farm.products.push(watermelon);
    await farm.save();
    console.log(farm);
}
Farm.findOne({name:'Full Belly Farms'})
.populate('products')
.then(farm=>{console.log(farm)}).catch(err=>console.log(err));
