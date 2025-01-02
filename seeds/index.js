require("dotenv").config();
const createuser = require("./createUsers");
const mongoose = require("mongoose");
const cities = require("./cities");
const Campground = require("../models/campground");
const { descriptors, places } = require("./seedHelpers");
const { json } = require("body-parser");
const MongoStore = require("connect-mongo");
const { MongoClient, ServerApiVersion } = require("mongodb");
const dbUrl = process.env.DB_URL; //wont work not same as in .env
const secret = process.env.SECRET;
if (!process.env.DB_URL || !process.env.SECRET) {
  console.log(process.env.SECRET, process.env.DB_URL);
  throw new Error(
    "Environment variables MONGO_URL and SECRET must be defined."
  );
}
const store = MongoStore.create({
  mongoUrl:
    dbUrl,
  touchAfter: 24 * 60 * 60,
  crypto: {
    secret: process.env.SECRET,
  },
});

store.on("error", function (e) {
  console.log("Session Store Error", e);
});
const client = new MongoClient(dbUrl, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function main() {
  await mongoose.connect(dbUrl);
}
main()
  .then(() => console.log("Connected"))
  .catch((err) => console.log(err));
async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    await client.close();
  }
}
run().catch(console.dir);
const sample = (array) => array[Math.floor(Math.random() * array.length)];
let arrimages = [];
let rnumber = Math.floor(Math.random() * 10) + 1;

let clientID = "c9JeKRCEjblvDAPYSszzqGC4iRrPYpgZ7Ov7VwYK0bE";
let endPoint = `https://api.unsplash.com/collections/9046579/photos?client_id=${clientID}&per_page=35&page=${rnumber}`;
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
    return arrimages;
  })
  .then(async (arrimages) => {
    let seedDb = async function (arrimages) {
      for (let i = 0; i <30; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
          Author: await createuser(),
          location: `${cities[random1000].city}, ${cities[random1000].state}`,
          tittle: `${sample(descriptors)} ${sample(places)}`,
          description:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!",
          price: random1000,
          geometry: {
            type: "Point",
            coordinates: [
              cities[random1000].longitude,
              cities[random1000].latitude,
            ],
          },
          images: [
            {
              url: arrimages[i],
              filename: "YelpCamp/fayojjmm82exfj1cmzfa",
            },
          ],
        });
        await camp.save();
      }
    };
    seedDb(arrimages).then(() => {
      mongoose.connection.close();
    });
  });
// const seedDB = async () => {
//   await Campground.deleteMany({});
//   for (let i = 0; i < 200; i++) {
//     const random1000 = Math.floor(Math.random() * 1000);
//     const price = Math.floor(Math.random() * 20) + 10;
//     const camp = new Campground({
//       Author: "65c11e21a0de6d70b817d749",
//       location: `${cities[random1000].city}, ${cities[random1000].state}`,
//       tittle: `${sample(descriptors)} ${sample(places)}`,
//       description:
//         "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!",
//       price,
//       geometry: { type: "Point", coordinates: [
//         cities[random1000].longitude,
//         cities[random1000].latitude,
//       ] },
//       images: [
//         {
//           url: "https://res.cloudinary.com/dk3oikndv/image/upload/v1707154485/YelpCamp/fayojjmm82exfj1cmzfa.png",
//           filename: "YelpCamp/fayojjmm82exfj1cmzfa",
//         },
//         {
//           url: "https://res.cloudinary.com/dk3oikndv/image/upload/v1707154486/YelpCamp/pbicqrn43thknjdbf4pw.png",
//           filename: "YelpCamp/pbicqrn43thknjdbf4pw",
//         },
//       ],
//     });
//     await camp.save();
//   }
// };
// seedDB()
//   .then(() => {
//     mongoose.connection.close();
//   })
//   .catch((err) => {
//     console.log("Error:", err);
//     mongoose.connection.close();
//   });

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

// seedDB();
