require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());
const User = require("./dataSchema/UserSchema");
const Event = require("./dataSchema/EventsSchema");
const Team = require("./dataSchema/TeamMemberSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
let ObjectId = require("mongoose").Types.ObjectId;

mongoose.connect(
  `mongodb+srv://aniket1:${process.env.DB_PASS}cluster0.z69mafx.mongodb.net/?retryWrites=true&w=majority`
  // `mongodb+srv://meet:${process.env.DB_PASS}@nodeexpress.s5tfuan.mongodb.net/HAM_Website?retryWrites=true&w=majority`,
  // { useNewUrlParser: true }
);

app.post("/signUpPost", async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const phNo = req.body.phNo;
  const passingYear = req.body.passingYear;
  const course = req.body.course;
  const branch = req.body.branch;
  const passWord = req.body.passWord;
  const newPassWord = await bcrypt.hash(passWord, 10);
  const userData = new User({
    name: name,
    email: email,
    phNo: phNo,
    passingYear: passingYear,
    course: course,
    branch: branch,
    passWord: newPassWord,
  });
  try {
    await userData.save();
    console.log("data inserted");
  } catch (err) {
    console.log(err);
    res.send("userName already exist");
  }
});

app.post("/loginPost", async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
  });
  if (!user) {
    res.send("Wrong email");
    // return { status: "error", error: "Invalid login" };
  }
  if (user) {
    const isPasswordValid = await bcrypt.compare(
      req.body.passWord,
      user.passWord
    );
    if (isPasswordValid) {
      const token = jwt.sign(
        {
          email: user.email,
        },
        "secret123"
      );
      console.log("Login successful");
      //   res.send(user.userType);
      return res.json({ status: "ok", user: token, userType: user.userType });
    } else if (!isPasswordValid) {
      console.log("wrong password");
      return res.json({ status: "error", user: false });
    }
  }
});

app.get("/getCurrUserData", async (req, res) => {
  const currUserData = await User.findOne({
    email: req.query.currUserEmail,
  });
  if (currUserData) res.send(currUserData);
  else {
    res.send("no user found");
  }
});

app.post("/updatePassWord", async (req, res) => {
  const email = req.body.email;
  const newPassWord = await bcrypt.hash(req.body.passWord, 10);
  const filter = { email: email };
  const update = { passWord: newPassWord };
  let doc = await User.findOneAndUpdate(filter, update, {
    new: true,
  });
  res.send("Password Updated");
});

app.post("/addEvent", async (req, res) => {
  const eventData = new Event({
    eventName: req.body.eventName,
    eventDescription: req.body.eventDescription,
    eventRegistrationStartDate: new Date(req.body.eventRegStartDate),
    eventRegistrationEndDate: new Date(req.body.eventRegEndDate),
    eventDate: new Date(req.body.eventDate),
    eventTime: req.body.eventTime,
    eventLocation: req.body.eventLocation,
    eventHolderPhNumber: req.body.eventHolderPhNo,
    eventPhoto: req.body.eventPhoto,
    collaboration: req.body.collaboration,
    rules:req.body.rules,
    igLink:req.body.igLink,
    eventManagers:req.body.eventManagers
  });
  try {
    await eventData.save();
    console.log("Event data inserted");
  } catch (err) {
    console.log(err);
    res.send("Event Data Not Inserted");
  }
});

app.get("/allEventData", async (req, res) => {
  allEventData = await Event.find();
  res.send(allEventData);
});

app.get("/registerEvent", async (req, res) => {
  currUserId = req.query.currUserId;
  currEventId = req.query.currEventId;
  let data = await Event.find({ _id: currEventId });
  // console.log(data);
  let currParticipants = data[0].participants;
  Event.findOneAndUpdate(
    { _id: currEventId },
    { $push: { participants: { userId: currUserId } } },
    { safe: true, upsert: true, new: true }
  ).then((res) => {
    console.log("registered");
  });
});

app.get("/registeredEvents", async (req, res) => {
  const currUserEmail = req.query.currUserEmail;
  data = await User.find({ email: currUserEmail });
  let currUserId = data[0]._id.toString();
  allEventData = await Event.find();
  let registeredEvents = [];
  allEventData.forEach((event) => {
    event.participants.forEach((participant) => {
      if (participant.userId === currUserId) {
        registeredEvents.push(event.eventName);
      }
    });
  });
  res.send(registeredEvents);
});

app.get("/deleteEvent", async (req, res) => {
  const idd = req.query.key;
  await Event.deleteOne({ _id: idd });
});

app.get("/currEventInfo", async (req, res) => {
  currEventName = req.query.currEventName;
  // console.log(currEventId)
  const currEventData = await Event.find({ eventName: currEventName });
  res.send(currEventData);
});

app.get("/isRegisteredOnEvent", async (req, res) => {
  const currUserId = req.query.currUserId;
  const currEventId = req.query.currEventId;
  const eventData = await Event.find({ _id: currEventId });
  let flag = false;
  for (let i = 0; i < eventData[0].participants.length; i++) {
    if (eventData[0].participants[i].userId === currUserId) {
      flag = true;
      break;
    }
  }
  res.send(flag);
});

app.post("/addTeamMember", async (req, res) => {
  const memberData = new Team({
    name: req.body.name,
    position: req.body.position,
    photo: req.body.photo,
  });
  try {
    await memberData.save();
    console.log("new member data inserted");
  } catch (err) {
    console.log(err);
    res.send("member Data Not Inserted");
  }
});

app.get("/allTeamData", async (req, res) => {
  const allTeamData = await Team.find();
  res.send(allTeamData);
});

app.get("/deleteMember", async (req, res) => {
  const idd = req.query.key;
  await Team.deleteOne({ _id: idd });
});

app.get("/allParticipants", async (req, res) => {
  const currEventId = req.query.currEventId;
  eventData = await Event.find({ _id: currEventId });
  noOfParticipants = eventData[0].participants.length;
  let participantsUserNameList = [];
  const allP = eventData[0].participants;
  for (i = 0; i < allP.length; i++) {
    let participant = allP[i];
    User.find({ _id: participant.userId }).then((userData) => {
      participantsUserNameList.push(userData[0].name);
      if (participantsUserNameList.length === noOfParticipants) {
        res.send(participantsUserNameList);
      }
    });
  }

});

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
