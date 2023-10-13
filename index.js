// require('dotenv').config()


const express = require("express");

const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./model/user");
const Admin = require("./model/admin");
mongoose.connect(
  process.env.URL
);

app.use(cors());
app.use(express.json());


function authenticate(req,res,next){


if (req.headers.auth) {
  let decode=jwt.verify(req.headers.auth,process.env.key)
  if (decode) {
    req.abd=decode.id
    next()
    
  } else {
    res.status(401).json({ message: 'it is nto crt token' })
  }
  
} else {
  res.status(401).json({ message: 'UNAUTUORIZED' })
}


}



app.get("/get",authenticate, async (req, res) => {
  try {
    const data = await User.find({create:req.abd});
    res.status(201).json(data);
  } catch (error) {
    res.json({ message: "counld get the data" });
  }
});

app.get("/get/:id",authenticate, async (req, res) => {
  const { id } = req.params;
  try {
    const data = await User.findById({ _id: id });
    res.status(201).json(data);
  } catch (error) {
    res.json({ message: "counld get the data" });
  }
});

app.post("/post",authenticate, async (req, res) => {
  const { name, post } = req.body;
  try {
    const data = await User.create({
      name,
      post,
      create:req.abd
    });
    res.status(201).json(data);
  } catch (error) {
    res.json({ message: "counld create the data" });
  }
});

app.put("/put/:id",authenticate, async (req, res) => {
  const { id } = req.params;
  const { name, post } = req.body;
  try {
    const data = await User.findByIdAndUpdate({ _id: id }, { name, post });
    res.status(201).json(data);
  } catch (error) {
    res.json({ message: "counld put the data" });
  }
});

app.delete("/del/:id",authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    const data = await User.findByIdAndDelete({ _id: id });
    res.status(201).json(data);
  } catch (error) {
    res.json({ message: "counld delete the data" });
  }
});

//////////////////////////////////////////regsiter//////////////////////////////////////////////////////////////

app.get("/log", async (req, res) => {
  try {
    const data = await Admin.find();
    res.json(data);
  } catch (error) {
    res.json({ message: "counld get the data" });
  }
});

app.post("/reg", async (req, res) => {
  const { name, email, pass } = req.body;
  try {
    const salt = bcryptjs.genSaltSync(1);
    const hash = bcryptjs.hashSync(pass, salt);
    const data = await Admin.create({
      name,
      email,
      pass: hash,
    });
    res.json(data);
  } catch (error) {
    res.json({ message: "counld get the data" });
  }
});

app.post("/log", async (req, res) => {
  const { email, pass } = req.body;

  try {
    const user = await Admin.findOne({ email });
    if (user) {
      let compare = bcryptjs.compareSync(pass, user.pass);
      if (compare) {
        var sign = jwt.sign({ email: user.email, id: user._id }, process.env.key);
        res.json({ token: sign });
      } else {
        res.json({ message: "password not match " });
      }
    } else {
      res.json({ message: "no user exist" });
    }

   
  } catch (error) {
   console.log(error);
  }
});

app.listen(process.env.PORT, () => {
  console.log("server connected");
});
