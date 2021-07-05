const {username, password} = require("./credentials");
//credentials NOT included in repository. Username and Password must match Atlas credentials for ArtismaDB

let config = {
    dbUrl: "mongodb+srv://" + username + ":" + password + "@cluster0.n64o4.mongodb.net/ArtismaDB?retryWrites=true&w=majority",
    secretKey: 'thisisakey',
  };
  
  module.exports = config;