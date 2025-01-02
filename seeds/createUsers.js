require("dotenv").config();
const mongoose = require("mongoose");
const dbUrl = process.env.DB_URL; // Ensure this matches your .env file
const firstNames = [
  "Alice",
  "Bob",
  "Charlie",
  "Diana",
  "Ethan",
  "Fiona",
  "George",
  "Hannah",
  "Ian",
  "Julia",
  "Kevin",
  "Lila",
  "Michael",
  "Nina",
  "Oliver",
  "Penny",
  "Quentin",
  "Rachel",
  "Steven",
  "Tina",
  "Uma",
  "Victor",
  "Wendy",
  "Xander",
  "Yara",
  "Zane",
];

const lastNames = [
  "Smith",
  "Johnson",
  "Williams",
  "Jones",
  "Brown",
  "Davis",
  "Miller",
  "Wilson",
  "Moore",
  "Taylor",
  "Anderson",
  "Thomas",
  "Jackson",
  "White",
  "Harris",
  "Martin",
  "Thompson",
  "Garcia",
  "Martinez",
  "Robinson",
  "Clark",
  "Rodriguez",
  "Lewis",
  "Lee",
  "Walker",
  "Hall",
];
const RandomDataGenerator = () => {
  const firstIndex = Math.floor(Math.random() * firstNames.length);
  const lastIndex = Math.floor(Math.random() * lastNames.length);
  const randomNumber = Math.floor(Math.random() * 10000);
  let username = `${firstNames[firstIndex]}${lastNames[lastIndex]}${randomNumber}`;
  let email = `${username}@gmail.com`;
  let password = `${email}`;
  return { username, email, password };
};
async function main() {
  await mongoose.connect(dbUrl);
}
main()
  .then(() => console.log("Connected"))
  .catch((err) => console.log(err));

let rnumber = Math.floor(Math.random() * 10) + 1;


const createuser = async () => {
    const data = RandomDataGenerator();

    const formBody = Object.keys(data)
      .map(
        (key) => encodeURIComponent(key) + "=" + encodeURIComponent(data[key])
      )
      .join("&");
    let id;
  await fetch("http://localhost:3001/register/seed", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formBody,
  })
    .then(async (res) => {
      if (res.ok) {
        const result = await res.json(); 
        console.log("Registration result:", result);
        id = result.userId;
      } else {
        const error = await res.json();
     
        console.error("Registration error:", error.error);
      }
    })
    .catch((error) => {
      console.error("Network error:", error);
    });
    
  return id;
};

module.exports = createuser;
