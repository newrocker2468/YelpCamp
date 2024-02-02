const mongoose = require("mongoose");
const cities = require("./cities");
const Campground = require("../models/campground");
const { descriptors, places } = require("./seedHelpers");
const { json } = require("body-parser");

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/campground");
}
main()
  .then(() => console.log("Connected"))
  .catch((err) => console.log(err));
const sample = (array) => array[Math.floor(Math.random() * array.length)];
let arrimages = [];
let rnumber = Math.floor(Math.random() * 10) + 1;

let clientID = "c9JeKRCEjblvDAPYSszzqGC4iRrPYpgZ7Ov7VwYK0bE";
let endPoint = `https://api.unsplash.com/collections/9046579/photos?client_id=${clientID}&per_page=30&page=${rnumber}`;
fetch(endPoint)
  .then(async function (response) {
    return await response.json();
  })
  .then((jsondata) => {
    console.log(arrimages.length, jsondata.length);

    jsondata.forEach(function (obj) {
      // console.log(obj.urls.regular)
      arrimages.push(obj.urls.regular);
    });
    return arrimages; // Move this line outside the forEach loop
  })
  .then((arrimages) => {
    let seedDb = async function (arrimages) {
      await Campground.deleteMany({});
      for (let i = 0; i < 30; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
          tittle: `${sample(descriptors)} ${sample(places)}`,
          location: `${cities[random1000].city},${cities[random1000].state}`,
          image: arrimages[i],
          description:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque, volupta  tem. Quisquam, voluptatem. Quisquam, voluptatem.",
          price: Math.floor(Math.random() * 20) + 10,
        });
        await camp.save();
      }
    };
    seedDb(arrimages).then(() => {
      mongoose.connection.close();
    });
  })
  .catch((err) => {
    console.log("Error:", err);
    mongoose.connection.close();
  });

// let getimages = async ()=>{
//     let clientID="c9JeKRCEjblvDAPYSszzqGC4iRrPYpgZ7Ov7VwYK0bE";
//     let endPoint=`https://api.unsplash.com/collections/483251/related?client_id=${clientID}&count=30`;
//     fetch(endPoint)
//         .then(function (response){
//             return response.json();
//         })
//         .then(jsondata=>{
//             jsondata.forEach(function(obj){
//                  arrimages.push(obj.urls.regular);
//                  })
//                  return arrimages;
//             })
//         .then((arrimages)=>{
//                 let seedDb = async function(arrimages){
//                     await Campground.deleteMany({})
//                     for(let i=0;i<30;i++){
//                         const random1000 = Math.floor(Math.random()*1000);
//                         const camp = new Campground({
//                             tittle : `${sample(descriptors)} ${sample(places)}`,
//                             location:`${cities[random1000].city},${cities[random1000].state}`,
//                             image:arrimages[i],
//                             description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque, volupta  tem. Quisquam, voluptatem. Quisquam, voluptatem.",
//                             price:Math.floor(Math.random()*20)+10
//                      });
//                      await camp.save();
//                     }

//                 }
//                 seedDb(arrimages);
//                 // await Campground.deleteMany({});

//             })
//             .catch((err)=>{
//                 mongoose.connection.close();
//             })

//         }

// getimages();

// const seedDB = async ()=>{
//     await Campground.deleteMany({});

//         for(let i=0;i<50;i++){
//             const random1000 = Math.floor(Math.random()*1000);
//             const camp = new Campground({
//                 tittle : `${sample(descriptors)} ${sample(places)}`,
//                 location:`${cities[random1000].city},${cities[random1000].state}`,
//                 image:"https://source.unsplash.com/collection/483251/related",
//                 description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque, volupta  tem. Quisquam, voluptatem. Quisquam, voluptatem.",
//                 price:Math.floor(Math.random()*20)+10

// })
//      await camp.save();
// }}
//     seedDB().then(()=>{
//         mongoose.connection.close();
//     })

//    seedDB();
