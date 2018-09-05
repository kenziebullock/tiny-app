const express = require('express');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
const app = express();
const PORT = 8080;

app.set('view engine', 'ejs');

const urlDatabase = {
    'b2xVn2': 'http://www.lighthouselabs.ca',
    '9sm5xK': 'http://www.google.com'
};

app.get('/urls', (request, respond) => {
    let templateVars = { urls: urlDatabase };
    respond.render('urls-index', templateVars);
});

app.get('/urls/:id', (request, respond) => {
    let templateVars = { shortURL: request.params.id, longURL: urlDatabase };
    respond.render('urls-show', templateVars);
});

app.get('/', (request, respond) => {
    respond.send('Hello!');
});

app.get('/urls.json', (request, respond) => {
    respond.json(urlDatabase);
});

app.get('/urls/new', (request, respond) => {
    res.render('urls-new');
});

app.get('/hello', (request, respond) => {
    respond.send('<html><body>Hello <b>World</b></body></html>\n');
});



app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`);
});