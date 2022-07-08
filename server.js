// load .env data into process.env
require("dotenv").config();
let alert = require("alert");
// Web server config
const PORT = process.env.PORT || 8080;
const sassMiddleware = require("./lib/sass-middleware");
const cookieSession = require("cookie-session");
// $ = require("jquery");

const express = require("express");
const app = express();
const morgan = require("morgan");

// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect();

//Mail sending API
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

let choice1;
let choice2;
let choice3;

const {
  pollsDatabase,
  getUserByEmail,
  users,
  generateRandomString,
  // pollsForUser
} = require("./helpers");

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(
  cookieSession({
    name: "session",
    keys: ["oh", "Lord", "Christ", "Jesus"],
  })
);

app.set("view engine", "ejs");

app.use(
  "/styles",
  sassMiddleware({
    source: __dirname + "/styles",
    destination: __dirname + "/public/styles",
    isSass: false, // false => scss, true => sass
  })
);

app.use(express.static("public"));
app.use("/styles", express.static("styles"));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const usersRoutes = require("./routes/users");
const widgetsRoutes = require("./routes/widgets");
const { user } = require("pg/lib/defaults");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/api/users", usersRoutes(db));
app.use("/api/widgets", widgetsRoutes(db));
// Note: mount other resources here, using the same pattern above

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/polls", (req, res) => {
  res.render("polls");
});

app.get("/results", (req, res) => {
  let firstChoice;
  let firstPoints;
  let secondChoice;
  let secondPoints;
  let thirdPoints;
  let thirdChoice;

  db.query(
    `SELECT activity, rating FROM submission JOIN polls on poll_id = polls.id WHERE poll_id = 2 ORDER BY rating DESC;`,
    [],
    (err, response) => {
      console.log(response.rows);
      firstChoice = response.rows[0].activity;
      firstPoints = response.rows[0].rating;
      secondChoice = response.rows[1].activity;
      secondPoints = response.rows[1].rating;
      thirdPoints = response.rows[2].rating;
      thirdChoice = response.rows[2].activity;

      const templateVars = {
        firstChoice: firstChoice,
        firstPoints: firstPoints,
        secondChoice: secondChoice,
        secondPoints: secondPoints,
        thirdChoice: thirdChoice,
        thirdPoints: thirdPoints,
      };
      console.log(templateVars);
      res.render("results", templateVars);
    }
  );
});

app.listen(PORT, () => {
  console.log(`Votr app listening on port ${PORT}.`);
});

app.get("/vote", (req, res) => {
  const templateVars = {
    firstChoice: choice1,
    secondChoice: choice2,
    thirdChoice: choice3,
  };
  res.render("voters", templateVars);
});

// app.get("/results", (req, res) => {
//   res.render("results");
// });

app.post("/vote", (req, res) => {
  console.log(req.body);
  let firstRank = 3 - Number(req.body.select);
  let secondRank = 3 - Number(req.body.select2);
  let thirdRank = 3 - Number(req.body.select3);

  db.query(
    `INSERT INTO submission (poll_id, activity, rating)
    VALUES (2, $1, $2),
    (2, $3, $4),
    (2, $5, $6);`,
    [choice1, firstRank, choice2, secondRank, choice3, thirdRank],
    (err, response) => {
      console.log(
        err
          ? err.stack
          : (choice1, firstRank, choice2, secondRank, choice3, thirdRank)
      );
    }
  );
  res.redirect("/");
});

app.post("/polls", (req, res) => {
  let userEmail = req.body.email;
  let title = req.body.activity;
  let description = req.body.description;
  choice1 = req.body.choiceOne;
  choice2 = req.body.choiceTwo;
  choice3 = req.body.choiceThree;

  db.query(
    `INSERT INTO users (email)
    VALUES ($1)`,
    [userEmail],
    (err, response) => {}
  );

  db.query(
    `INSERT INTO polls (
    user_id,
    title,
    description,
    poll_link,
    results_link
    )
    VALUES (
    11,
    $1,
    $2,
    'localhost:8080/vote',
    'localhost:8080/results'
  )`,
    [title, description],
    (err, response) => {
      console.log(err ? err.stack : title, " ", description);
    }
  );
  /*
  db.query(`INSERT INTO polls (
    user_id,
    title,
    description,
    poll_link,
    results_link
  )VALUES (
    4,
    'Movies',
    'Movies to watch',
    'www.google.com/links',
    'www.google.com/results'
  ),`);
  db.query(`SELECT * FROM `, [], (err, response) => {
    console.log(err ? err.stack : response.rows);
  });*/

  const msg = {
    to: userEmail, // recipient
    from: "votrapp@outlook.com", // verified sender
    subject: "Polls Links",
    text: "If you can read this, it worked",
    html: '<p> Dear User, <br><br> Here is your voting link, send this to your friends: <a href="http://localhost:8080/vote">Voting Link</a></p> <p>Here is the results page, click to see polls result: <a href="http://localhost:8080/results">Results Link</a> <br><br> Have fun!   &#128521</p>',
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });

  res.redirect("/");
  alert("Email Sent!");
});
