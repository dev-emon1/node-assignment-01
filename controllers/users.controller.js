const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

module.exports.getRandomUser = async (req, res) => {
  const data = fs.readFileSync("userData.json");
  const users = JSON.parse(data);
  const randomUser = users[Math.floor(Math.random() * users.length)];
  res.json(randomUser);
};

module.exports.getAllUser = async (req, res) => {
  const data = fs.readFileSync("userData.json");
  const users = JSON.parse(data);
  let limit = parseInt(req.query.limit, 10);
  if (!isNaN(limit) && limit > 0) {
    res.json(users.slice(0, limit));
  } else {
    res.json(users);
  }
};

module.exports.saveRandomUser = async (req, res) => {
  const { name, gender, contact, address } = req.body;
  // const { filename } = req.file;

  if (!name || !gender || !contact || !address) {
    return res.send({ error: "Require all fields" });
  }

  try {
    let newUser = {
      id: uuidv4(),
      name: name,
      gender: gender,
      contact: contact,
      address: address,
      // photoUrl: photoUrl,
    };

    const users = fs.readFileSync("userData.json");
    let jsonData;

    if (users) {
      jsonData = JSON.parse(users);
    } else {
      jsonData = [];
    }

    if (!Array.isArray(jsonData)) {
      jsonData = [jsonData];
    }

    jsonData.push(newUser);

    const updatedStringUser = JSON.stringify(jsonData);

    const data = fs.writeFileSync("userData.json", updatedStringUser);
    res.send("new user added");
  } catch (error) {
    console.log(error);
  }
};

module.exports.updateUser = async (req, res) => {
  const { name, gender, contact, address } = req.body;
  const id = req.params.id;

  try {
    let newUser = {
      name: name,
      gender: gender,
      contact: contact,
      address: address,
    };

    const users = fs.readFileSync("userData.json");
    let jsonData;

    if (users) {
      jsonData = JSON.parse(users);
    } else {
      jsonData = [];
    }

    if (!Array.isArray(jsonData)) {
      jsonData = [jsonData];
    }

    const userIndex = jsonData.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      return res.send({ error: "User id not found" });
    }

    // Update the user's data
    jsonData[userIndex] = { ...jsonData[userIndex], ...newUser };

    const updatedStringUser = JSON.stringify(jsonData);

    const data = fs.writeFileSync("userData.json", updatedStringUser);
    res.send("updated the user");
  } catch (error) {
    console.error("Error reading or writing to file", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.deleteUser = async (req, res) => {
  const id = req.params.id;
  try {
    const users = fs.readFileSync("userData.json");
    let jsonData;

    if (users) {
      jsonData = JSON.parse(users);
    } else {
      jsonData = [];
    }

    if (!Array.isArray(jsonData)) {
      jsonData = [jsonData];
    }

    const userIndex = jsonData.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      return res.send({ error: "User id not found" });
    }

    // Remove the user from the array
    jsonData.splice(userIndex, 1);

    const updatedStringUser = JSON.stringify(jsonData);
    fs.writeFileSync("userData.json", updatedStringUser);
    res.status(200).json({ message: `User has been deleted.` });
  } catch (error) {
    console.error("Error reading or writing to file", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
