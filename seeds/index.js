// require("dotenv").config();
// const mongoose = require("mongoose");
// const fetch = require("node-fetch"); // Ensure you have node-fetch installed
// const createuser = require("./createUsers");
// const Campground = require("../models/campground"); // Update path if necessary
// const cities = require("./cities");
// const descriptors = ["Forest", "Ancient", "Petrified", "Roaring", "Cascade"];
// const places = ["Flats", "Village", "Canyon", "Pond", "Group Camp"];

// // Sample function to select a random item from an array
// const sample = (array) => array[Math.floor(Math.random() * array.length)];

// let arrImages = [];
// let randomPage = Math.floor(Math.random() * 10) + 1;

// let clientID = "c9JeKRCEjblvDAPYSszzqGC4iRrPYpgZ7Ov7VwYK0bE";
// let endPoint = `https://api.unsplash.com/collections/9046579/photos?client_id=${clientID}&per_page=30&page=${randomPage}`;

// // Fetch images from Unsplash
// const fetchImages = async () => {
//   let retries = 3;
//   while (retries > 0) {
//     try {
//       console.log("Fetching images from Unsplash...");
//       const response = await fetch(endPoint);
//       if (!response.ok) throw new Error("Network response was not ok");
//       const jsonData = await response.json();
//       console.log(jsonData);
//       jsonData.forEach((obj) => {
//         arrImages.push(obj.urls.regular);
//       });
//       randomPage++; // Increase page number for next fetch
//       endPoint = `https://api.unsplash.com/collections/9046579/photos?client_id=${clientID}&per_page=30&page=${randomPage}`;
//       console.log("Successfully fetched images.");
//       return; // Exit the function if the fetch was successful
//     } catch (error) {
//       console.error("Error fetching images:", error);
//       retries -= 1;
//       if (retries === 0) throw error; // Re-throw the error if all retries fail
//       console.log(`Retrying... (${3 - retries} attempts left)`);
//     }
//   }
// };

// // Seed database with data
// const seedDb = async () => {
//   try {
//     for (let i = 0; i < 30; i++) {
//       while (arrImages.length < 4) {
//         await fetchImages();
//       }

//       const random1000 = Math.floor(Math.random() * 1000);
//       const numImages = Math.floor(Math.random() * 4) + 1;
//       const images = [];
//       for (let j = 0; j < numImages; j++) {
//         const imgIndex = Math.floor(Math.random() * arrImages.length);
//         images.push({
//           url: arrImages[imgIndex],
//           filename: `YelpCamp/${imgIndex}`,
//         });
//         arrImages.splice(imgIndex, 1); // Remove the used image
//       }

//       const camp = new Campground({
//         Author: await createuser(),
//         location: `${cities[random1000].city}, ${cities[random1000].state}`,
//         title: `${sample(descriptors)} ${sample(places)}`,
//         description:
//           "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!",
//         price: random1000,
//         geometry: {
//           type: "Point",
//           coordinates: [
//             cities[random1000].longitude,
//             cities[random1000].latitude,
//           ],
//         },
//         images: images,
//       });
//       await camp.save();
//     }
//   } catch (error) {
//     console.error("Error seeding database:", error);
//   } finally {
//     mongoose.connection.close();
//   }
// };

// // Fetch initial images and seed database
// fetchImages().then(() => {
//   seedDb();
// });



require("dotenv").config();
const createuser = require("./createUsers");
const mongoose = require("mongoose");
const fetch = require("node-fetch");
const cities = require("./cities");
const Campground = require("../models/campground");
const { descriptors, places } = require("./seedHelpers");

const dbUrl = process.env.DB_URL;

if (!process.env.DB_URL || !process.env.SECRET) {
  throw new Error("Environment variables DB_URL and SECRET must be defined.");
}

mongoose
  .connect(dbUrl)
  .then(() => console.log("Connected"))
  .catch((err) => console.log(err));

const sample = (array) => array[Math.floor(Math.random() * array.length)];
let arrImages = [];
let randomPage = Math.floor(Math.random() * 10) + 1;
let clientID = "c9JeKRCEjblvDAPYSszzqGC4iRrPYpgZ7Ov7VwYK0bE";
let endPoint = `https://api.unsplash.com/collections/9046579/photos?client_id=${clientID}&per_page=30&page=${randomPage}`;

const fetchImages = async () => {
  let retries = 3;
  while (retries > 0) {
    try {
      console.log("Fetching images from Unsplash...");
      const response = await fetch(endPoint);

      console.log(`Response status: ${response.status} ${response.statusText}`);

      if (!response.ok)
        throw new Error(
          `Network response was not ok: ${response.status} ${response.statusText}`
        );

      const jsonData = await response.json();
      console.log("Fetched images from Unsplash");

      if (!Array.isArray(jsonData)) {
        throw new Error("Expected JSON data to be an array");
      }

      console.log("Unsplash JSON data:", jsonData);
      jsonData.forEach((obj, index) => {
        if (!obj.urls || !obj.urls.regular) {
          console.error(`Missing URLs at index ${index}:`, obj);
          return;
        }
        arrImages.push(obj.urls.regular);
      });
      randomPage++;
      endPoint = `https://api.unsplash.com/collections/9046579/photos?client_id=${clientID}&per_page=30&page=${randomPage}`;
      console.log("Successfully fetched images.");
      return; // Exit the function if the fetch was successful
    } catch (error) {
      console.error("Error fetching images:", error);
      retries -= 1;
      if (retries === 0) throw error; // Re-throw the error if all retries fail
      console.log(`Retrying... (${3 - retries} attempts left)`);
    }
  }
};

const seedDb = async () => {
  try {
    for (let i = 0; i < 30; i++) {
      while (arrImages.length < 4) {
        await fetchImages();
      }

      const random1000 = Math.floor(Math.random() * 1000);
      const numImages = Math.floor(Math.random() * 4) + 1;
      const images = [];
      for (let j = 0; j < numImages; j++) {
        const imgIndex = Math.floor(Math.random() * arrImages.length);
        images.push({
          url: arrImages[imgIndex],
          filename: `YelpCamp/fayojjmm82exfj1cmzfa`,
        });
        arrImages.splice(imgIndex, 1); // Remove the used image
      }

      const camp = new Campground({
        Author: await createuser(),
        location: `${cities[random1000].city}, ${cities[random1000].state}`,
        title: `${sample(descriptors)} ${sample(places)}`,
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
        images: images,
      });
      await camp.save();
    }
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    mongoose.connection.close();
  }
};

fetchImages().then(() => {
  seedDb();
});
