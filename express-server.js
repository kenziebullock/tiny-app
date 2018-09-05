const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
const PORT = 8080;

app.set('view engine', 'ejs');

let urlDatabase = {
    'b2xVn2': 'http://www.lighthouselabs.ca',
    '9sm5xK': 'http://www.google.com',
    'dx5gt2': 'http://www.reddit.com'
};

app.get('/urls', (request, response) => {
    let templateVars = { urls: urlDatabase };
    response.render('urls-index', templateVars);
});

app.get('/urls/new', (request, response) => {
    response.render('urls-new');
});

app.get('/urls/:id', (request, response) => {
    let templateVars = { shortURL: request.params.id, longURL: urlDatabase };
    response.render('urls-show', templateVars);
});

app.get('/', (request, response) => {
    response.send('Hello!');
});

app.get('/urls.json', (request, response) => {
    response.json(urlDatabase);
});

app.get('/hello', (request, response) => {
    response.send('<html><body>Hello <b>World</b></body></html>\n');
});

app.post('/urls', (request, response) => {
    console.log(request.body.longURL);
    urlDatabase[generateRandomString()] = request.body.longURL;
    console.log(urlDatabase);
    // response
    //response.send('generateRandomString()');
    //response.writeHead(301, )
    
})

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`);
});

function generateRandomString() {
    let rndString = '';
    rndString = Math.random().toString(36).substr(2, 6);
    return rndString;
}