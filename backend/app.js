// import express module
const express = require("express");
// import body-parser module
const bodyParser = require("body-parser");

// import path module 
const path = require('path');

//import Multer module

const multer = require('multer');

// create express application
const app = express();

const bcrypt = require("bcrypt");

// configure Body Parser
// send response with JSON format
app.use(bodyParser.json());
// parse objects sended from FE
app.use(bodyParser.urlencoded({ extended: true }));

// Security configuration
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, Accept, Content-Type, X-Requested-with"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, DELETE, OPTIONS, PATCH, PUT"
  );
  next();
});

// DB config
// import mongoose module
const mongoose = require("mongoose");
// connect app to DB
mongoose.connect("mongodb://localhost:27017/sportDB");

//Multer Configuration

app.use('/images', express.static(path.join('backend/images')))

const MIME_TYPE = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
 }

 const storage = multer.diskStorage({
  // destination
  destination: (req, file, cb) => {
  const isValid = MIME_TYPE[file.mimetype];
  let error = new Error("Mime type is invalid");
  if (isValid) {
  error = null;
}
cb(null, 'backend/images')
},
//filename
filename: (req, file, cb) => {
const name = file.originalname.toLowerCase().split(' ').join('-');
const extension = MIME_TYPE[file.mimetype];
const imgName = name + '-' + Date.now() + '-crococoder-' + '.' + 
extension;
cb(null, imgName);
}
});


// import match model
const Match = require("./models/match");
const Player = require("./models/player");
const Team = require("./models/team");
const Blog = require("./models/blog");
const User = require("./models/user");

function replaceCh(ch) {
  var newCh = ch.replace("C:\\fakepath\\", "assets/images/");
  return newCh;
}

// Business logic: Get All matches
app.get("/matches", (req, res) => {
  console.log("here into business logic of Get All Matches");
  Match.find((error, docs) => {
    if (error) {
      console.log(error);
    } else {
      res.status(200).json({
        result: docs,
      });
    }
  });
});
// Business logic: Get Match By Id
app.get("/matches/:id", (req, res) => {
  Match.findOne({ _id: req.params.id }).then((data) => {
    if (data) {
      res.status(200).json({
        result: data,
      });
    }
  });
});
// Business logic: Edit Match By Id
app.put("/matches/:id", (req, res) => {
  Match.updateOne({ _id: req.params.id }, req.body).then((data) => {
    console.log(data);
    res.status(200).json({
      result: "edited with success",
    });
  });
});
// Business logic: Delete Match
app.delete("/matches/:id", (req, res) => {
  Match.deleteOne({ _id: req.params.id }).then((data) => {
    console.log(data);
    res.status(200).json({
      result: "deleted with success",
    });
  });
});
// Business logic: Add Match
app.post("/matches", (req, res) => {
  const match = new Match({
    teamOne: req.body.teamOne,
    scoreOne: req.body.scoreOne,
    scoreTwo: req.body.scoreTwo,
    teamTwo: req.body.teamTwo,
  });
  match.save((error, result) => {
    if (error) {
      console.log(error);
    } else if (result) {
      res.status(200).json({
        result: "added with success",
      });
    }
  });
});
app.get("/matches/search/:teamOne", (req, res) => {
  Match.find({ teamOne: req.params.teamOne }).then((data) => {
    if (data) {
      res.status(200).json({
        result: data,
      });
    }
  });
});

// Business logic: Get All players
app.get("/players", (req, res) => {
  Player.find((error, docs) => {
    if (error) {
      console.log(error);
    } else {
      res.status(200).json({
        result: docs,
      });
    }
  });
  console.log("here into business logic of Get All Players");
});
// Business logic: Get player by Id
app.get("/players/:id", (req, res) => {
  Player.findOne({ _id: req.params.id }).then((data) => {
    res.status(200).json({
      result: data,
    });
  });
});
// Business logic: Edit Player By Id
app.put("/players/:id", (req, res) => {
  if (req.body.avatar) {
    req.body.avatar = replaceCh(req.body.avatar);
  }
  Player.updateOne({ _id: req.params.id }, req.body).then((data) => {
    res.status(200).json({
      result: "edited with success",
    });
  });
});
// Business logic: Add Player
app.post("/players", (req, res) => {
  if (req.body.avatar) {
    req.body.avatar = replaceCh(req.body.avatar);
  }
  const player = new Player({
    age: req.body.age,
    name: req.body.name,
    poste: req.body.poste,
    number: req.body.number,
    avatar: req.body.avatar,
    note: req.body.note,
  });
  player.save((error, result) => {
    if (error) {
      console.log(error);
    } else if (result) {
      res.status(200).json({
        result: "added with success",
      });
    }
  });
});
// Business logic: Delete Player
app.delete("/players/:id", (req, res) => {
  Player.deleteOne({ _id: req.params.id }).then((data) => {
    res.status(200).json({
      result: "deleted with success",
    });
  });
});

// Business logic: Get All Teams
app.get("/teams", (req, res) => {
  console.log("here into business logic of Get All Teams");
  Team.find((error, docs) => {
    if (error) {
      console.log(error);
    } else {
      res.status(200).json({
        result: docs,
      });
    }
  });
});
// Business logic: Get Team by Id
app.get("/teams/:id", (req, res) => {
  Team.findOne({ _id: req.params.id }).then((data) => {
    if (data) {
      res.status(200).json({
        result: data,
      });
    }
  });
});
// Business logic: Edit Team By Id
app.put("/teams/:id", (req, res) => {
  if (req.body.logo) {
    req.body.logo = replaceCh(req.body.logo);
  }
  Team.updateOne({ _id: req.params.id }, req.body).then((data) => {
    res.status(200).json({
      result: "edited with success",
    });
  });
});
// Business logic: Add Team
app.post("/teams", multer({ storage: storage }).single('img'), (req, res) => {
  console.log('Here into add team');
  let protocol = req.protocol;
  console.log('protocol',protocol);
  let host = req.get('host');
  console.log('Host',host);
  let url = protocol + '://' + host;
  console.log('Here Base URL', url);

  let fileName = (req.file) ? req.file.filename : 'anonymous.jpg';
  console.log('fileName',fileName)
  let teamObj = new Team({
    name: req.body.name,
    foundation: req.body.foundation,
    country: req.body.country,
    stadium: req.body.stadium,
    img: url + '/images/' + fileName
  })

  teamObj.save((err, result)=>{
    console.log('result', result)
    if (err) {
      console.log('Here error', err);
    } else {
      res.status(200).json({
        message:'Added with success'
      })
    }
  })
  // if (req.body.logo) {
  //   req.body.logo = replaceCh(req.body.logo);
  // }
  // const team = new Team({
  //   logo: req.body.logo,
  //   name: req.body.name,
  //   foundation: req.body.foundation,
  //   country: req.body.country,
  //   stadium: req.body.stadium,
  // });
  // team.save((error, result) => {
  //   if (error) {
  //     console.log(error);
  //   } else if (result) {
  //     res.status(200).json({
  //       result: "added with success",
  //     });
  //   }
  // });
});
// Business logic: Delete Player
app.delete("/teams/:id", (req, res) => {
  Team.deleteOne({ _id: req.params.id }).then((data) => {
    res.status(200).json({
      result: "deleted with success",
    });
  });
});
// Business logic: Get IMC
app.post("/players/player-status", (req, res) => {
  let playerDetails = req.body;
  let message;
  let IMC =
    playerDetails.weight /
    ((playerDetails.height / 100) * (playerDetails.height / 100));
  if (IMC >= 30) {
    message = "Obesity";
  } else if (IMC < 30 && IMC >= 25) {
    message = "Over Weight";
  } else if (IMC < 25 && IMC >= 18.5) {
    message = " Normal";
  } else if (IMC < 18.5) {
    message = "Insufficient";
  }
  res.status(200).json({
    result: IMC,
    resultMessage: message,
  });
});

// Business logic: Login
app.post("/users/login", (req, res) => {
  User.findOne({ email: req.body.email })
    .then((emailResult) => {
      if (!emailResult) {
        res.status(200).json({
          res: "E-mail not found",
        });
      }
      return bcrypt.compare(req.body.password, emailResult.password);
    })
    .then((passwordResult) => {
      if (!passwordResult) {
        res.status(200).json({
          res: "Password false",
        });
      }
      User.findOne({ email: req.body.email }).then((finalUser) => {
        let user = {
          id: finalUser._id,
          firstName: finalUser.firstName,
          lastName: finalUser.lastName,
          role: finalUser.role
        };
        res.status(200).json({
          res: "User true",
          user: user,
        });
      });
    });
});
// Business logic: Signup
app.post("/users/signup", (req, res) => {
  bcrypt.hash(req.body.password, 8).then((cryptPassword) => {
    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      password: cryptPassword,
      role: req.body.role,
    });
    user.save((error, newUser) => {
      if (error) {
        console.log(error);
      } else if (newUser) {
        res.status(200).json({
          result: newUser,
        });
      }
    });
  });
});
app.get("/users", (req, res) => {
  User.find((error, docs) => {
    if (error) {
      console.log(error);
    } else {
      res.status(200).json({
        result: docs,
      });
    }
  });
});
app.get("/users/:id", (req, res) => {
  User.findOne({ _id: req.params.id }).then((data) => {
    res.status(200).json({
      result: data,
    });
  });
});
app.put("/users/:id", (req, res) => {
  User.updateOne({ _id: req.params.id }, req.body).then((data) => {
    res.status(200).json({
      result: data,
    });
  });
});
app.delete("/users/:id", (req, res) => {
  User.deleteOne({ _id: req.params.id }).then((data) => {
    res.status(200).json({
      result: data,
    });
  });
});

app.get("/blogs", (req, res) => {
  Blog.find((error, docs) => {
    if (error) {
      console.log(error);
    } else {
      res.status(200).json({
        result: docs,
      });
    }
  });
});
app.get("/blogs/:id", (req, res) => {
  Blog.findOne({ _id: req.params.id }).then((data) => {
    res.status(200).json({
      result: data,
    });
  });
});
app.put("/blogs/:id", (req, res) => {
  if (req.body.image) {
    req.body.image = replaceCh(req.body.image);
  }
  Blog.updateOne({ _id: req.params.id }, req.body).then((data) => {
    res.status(200).json({
      result: "edited with success",
    });
  });
});
app.post("/blogs", (req, res) => {
  if (req.body.image) {
    req.body.image = replaceCh(req.body.image);
  }
  const blog = new Blog({
    date: req.body.date,
    image: req.body.image,
    title: req.body.title,
    description: req.body.description,
  });
  blog.save((error, result) => {
    if (error) {
      console.log(error);
    } else if (result) {
      res.status(200).json({
        result: "added with success",
      });
    }
  });
});
app.delete("/blogs/:id", (req, res) => {
  Blog.deleteOne({ _id: req.params.id }).then((data) => {
    res.status(200).json({
      result: "deleted with success",
    });
  });
});

app.get('/api/weather/:cityObj', (req,res)=>{
  console.log('Here into weather', JSON.parse(req.params.cityObj).city);
  let city = JSON.parse(req.params.cityObj).city;
  let key ="62ee756a34835483299877a61961cafb";
const apiUrl = 
"https://api.openweathermap.org/data/2.5/weather?q=" + city +"&appid=" +key + "&units=metric"; 
axios.get(apiUrl) .then((response) => { 
        console.log('Here response', response); 
 
            });
})

module.exports = app;
