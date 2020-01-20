const fs = require("fs");
const inquirer = require("inquirer");
const axios = require("axios");
const pdf = require("html-pdf");




// get user inputs
function promptUser() {
    // uses inquirer to return user values and 
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
// set the state to false so that the conversion function doesn't run until after the axios request

promptUser()

    // enter user values into axios request 
    .then(function ({ username, faveColor }) {
        const queryUrl = `https://api.github.com/users/${username}`;
        axios
            .get(queryUrl).then(function (res) {
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
                console.log(newQueryUrl);

                //   use for loop to loop through each repo to get star count
                axios.get(newQueryUrl).then(function (res) {
                    let starCount = 0;
                    for (let index = 0; index < res.data.length; index++) {
                        let count = res.data[index].stargazers_count;
                        starCount = starCount + count;
                    }
                    console.log("star count for all repositories " + starCount)
                    info.starCount = starCount;

                    //   use $ reference in node
                    console.log(`${username}.html is ready to convert to PDF`);

                    //   change the ready to convert state to true now that the request is finished
                    readyToConvert = true;

                    //   
                    fs.writeFileSync(`${username}.html`, html);
                    var options = { format: 'landscape' };
                    pdf.create(html, options).toFile(`${username}.pdf`, function (err, res) {
                        if (err) return console.log(err);
                        console.log(res);
                    });

                });
            });

    })

.catch(function (err) {
  console.log(err);


});

// function generateHTML(answers) {
//     return `
//   <!DOCTYPE html>
//   <html lang="en">
//   <head>
//     <meta charset="UTF-8">
//     <meta http-equiv="X-UA-Compatible" content="ie=edge">
//     <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
//     <title>Document</title>
//   </head>
//   <body>
//     <div class="jumbotron jumbotron-fluid">
//     <div class="container">
//       <h1 class="display-4">Hi! My name is ${answers.name}</h1>
//       <p class="lead">I am from ${answers.location}.</p>
//       <h3>Example heading <span class="badge badge-secondary">Contact Me</span></h3>
//       <ul class="list-group">
//         <li class="list-group-item">My GitHub username is ${answers.github}</li>
//         <li class="list-group-item">LinkedIn: ${answers.linkedin}</li>
//       </ul>
//     </div>
//   </div>
//   </body>
//   </html>`;
//   }

