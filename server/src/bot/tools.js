const { CordDB } = require("cord-db-js");

const db = new CordDB({
  databaseURL: "https://testproje-d98e9-default-rtdb.firebaseio.com/",
  serviceAccount: "./Config/serviceAccountKey.json" 
});

module.exports = { db };
