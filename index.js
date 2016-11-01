/**
 * Created by URIY on 31.10.2016.
 */

var express = require('express');
var fortune = require('./lib/fortune.js');
var app = express();

var handlebars = require('express3-handlebars').create({
    defaultLayout:'main',
    helpers: {
        section: function(name, options){
            if(!this._sections) this._sections = {};
            this._sections[name] = options.fn(this);
            return null;
        }
    }
});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.set('port',process.env.PORT || 3000);

app.use(express.static(__dirname + '/public'));
app.use(require('body-parser').urlencoded({ extended: true }));

app.get('/newsletter', function(req, res){
// мы изучим CSRF позже... сейчас мы лишь
// заполняем фиктивное значение
    res.render('newsletter', { csrf: 'CSRF token goes here' });
});
app.post('/process' , function(req, res){
    console.log('Form (from querystring): ' + req.query.form);
    console.log('CSRF token (from hidden form field): ' + req.body._csrf);
    console.log('Name (from visible form field): ' + req.body.name);
    console.log('Email (from visible form field): ' + req.body.email);
    res.redirect(303, '/thank-you' );
});

app.get('/', function(req, res) {
    res.render('home');
});
app.get('/about', function(req, res){
    res.render('about', { fortune: fortune.getFortune() } );
});
app.get('/nursery-rhyme', function(req, res){
    res.render('nursery-rhyme');
});
app.get('/data/nursery-rhyme', function(req, res){
    res.json({
        animal: 'бельчонок',
        bodyPart: 'хвост',
        adjective: 'пушистый',
        noun: 'черт',
    });
});
// Обобщенный обработчик 404 (промежуточное ПО)
app.use(function(req, res, next){
    res.status(404);
    res.render('404');
});
// Обработчик ошибки 500 (промежуточное ПО)
app.use(function(err, req, res, next){
    console.error(err.stack);
    res.status(500);
    res.render('500');
});

app.listen(app.get('port'), function () {
    console.log('Express запущен на http://localhost:' +
        app.get('port') + '; нажмите Ctrl+C для завершения.')
});