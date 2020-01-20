const fs = require("fs");
const inquirer = require("inquirer");
const axios = require("axios");
const conversion = require("conversion");
const pdf = require("html-pdf");
const util = require("util");




function promptUser() {
    return inquirer.prompt([{
        type: "input",
        message: "Enter your Github username;",
        name: "username"
    }, {
        type: "list",
        message: "What's your favorite color?",
        name: "faveColor",
        choices: ['red', 'green', 'blue']
      }]);
}
promptUser()
.then(function({username, faveColor}){
    const queryUrl = `https://api.github.com/users/${username}`;
    axios
    .get(queryUrl).then(function(res){
        info = {
            color: faveColor,
            profilePic: res.data.avatar_url,
            name: res.data.login,
            location: res.data.location,
            profileUrl: res.data.html_url,
            blog: res.data.blog,
            bio: res.data.bio,
            company: res.data.company,
            repos: res.data.public_repos,
            followers: res.data.followers,
            following: res.data.following,
          }
          console.log(info);

          const newQueryUrl = `https://api.github.com/users/${username}/repos`
          console.log (newQueryUrl);

          axios.get(newQueryUrl).then(function (res) {
              let starCount = 0;
              for (let index = 0; index<res.data.length; index ++){
                  let count = res.data[index].stargazers_count;
                  starCount = starCount + count;
              }
              console.log("star count for all repositories " + starCount)
              info.starCount = starCount;
         
         
            })
            
        })
    })


