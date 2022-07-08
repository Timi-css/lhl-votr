//const bcrypt = require('bcryptjs');

//mock database of URLs
const pollsDatabase = {
  1 : {
    id: 1,
    user_id: 1,
    title: 4,
    description: "movie to watch",
    poll_link: 'administration_link',
    results_link: "userRandomID"
  },


  2 : {
    choices: ['choice'],
    user_id: "userRandomID"
  },


  3 : {
    choices: ['choice'],
    user_id: "userRandomID"
  },

  4 : {
    choices: ['choice'],
    user_id: "userRandomID"
  }
};

//mock database of users
const users = {
  1 : {
    id: "userRandomID",
    name: "john",
    email: "user@example.com"
  },

  2 : {
    id: "user2RandomID",
    name: "peter",
    email: "user2@example.com"
  },

  3 : {
    id: "userRandomID1",
    name: "david",
    email: "user0@example.com"
  },

};

function getUserByEmail(email, database) {
  for (const userId in database) {
    if (email === database[userId].email) {
      return database[userId];
    }
  }
  return undefined;
}

// generate random short URL
function generateRandomString() {
  return Math.floor((1 + Math.random()) * 0x1000000).toString(16).substring(1);
}

//polls for users
// function pollsForUser(id) {
//   let _poll = '';
//   let keysArr = Object.keys(pollsDatabase);

//   for (const k of keysArr) {
//     if (id === pollsDatabase[k].userID) {
//       _poll = pollsDatabase[k].longURL;
//     }
//   }
//   return _poll;
// }

module.exports = {
  pollsDatabase,
  getUserByEmail,
  users,
  generateRandomString
  // pollsForUser
};
