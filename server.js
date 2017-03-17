const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
var app = express();
const port = process.env.PORT || 3000;
//process.env is an object that stores all our environment variables as
//key value pairs, and we are looking for one that heroku needs 'PORT'
//But when app is run locally the port environment variable wont exist so we set a default 

hbs.registerPartials(__dirname + '/views/partials'); 
//allows partials to be used. A partial is a partial code that can be used multiple times instead of
//having to write the same code for each route that we create 

app.set('view engine', 'hbs');
//telling node what view engine we are using which is hbs handlebarsjs 
//directory views is what node uses as default for templates 


app.use((req, res, next) => { //next is used to tell express when our middleware is done, allows
    //application to continue executing
    var now = new Date().toString(); //creates a readble time stamp
    var log = `${now}: ${req.method} ${req.url}`;
    console.log(log);
    fs.appendFile('server.log', log + '\n', (err) => {
        if (err) {
            console.log('Unable to append to server.log');
        }
    });
    next();

});

// app.use((req, res, next) => {
//     res.render('maintenance.hbs');
// }); since we are not calling next() it will stop here and not call anything else 


app.use(express.static(__dirname + '/public'))
//__dirname passes in the path to our folder which is Section 5 - webservers

hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear()
});//helper able to execute functions that are used a lot and allows us to inject them into our
//templates. First paramter is the helper name, second is the function that is called when we
//call the helper in our templates. That data is what will show when we call that helper 

hbs.registerHelper('allCapsIt', (text) => {
    return text.toUpperCase();
});//helpers can take paramters as well, when calling the function the paramter passed is declared
//by using a single space

app.get('/', (req, res) => {//request headers, body, path. response has a bunch of methods to use
    // res.send('<h1>Hello World</h1>');
    res.render('home.hbs', {
        pageTitle: 'Home',
        welcomeMessage: 'Hello World'
    })
});

app.get('/about', (req, res) => {
    res.render('about.hbs', {
        pageTitle: 'About Page'
 
    });//the template file name we want to render 
    //render allows us to render any templates with our current view engine
});

app.get('/bad', (req, res) => {
    res.send({
        errorMessage: "Bad Route"
    });
});

app.get('/projects', (req, res) => {
    res.render('projects.hbs', {
        pageTitle: 'Projects',
        welcomeMessage: 'Portfolio goes here'
    })
})


app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});