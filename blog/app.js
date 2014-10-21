
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var fs=require('fs');
var app = express();
var Busboy=require("busboy");
var config=require("./config.json")[app.get("env")];
console.log(config.db_host);
// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger({
    format: 'tiny',
    stream: fs.createWriteStream('app.log', {'flags': 'w'})
}));
app.use(express.bodyParser({ keepExtensions: true, uploadDir: './public/fastfs' }));
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.cookieSession({
    key: 'app.sess',
    secret: 'SUPERsekret'
}));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.responseTime());
// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/file',function(req,res,next){
   next();
   res.sendfile("./views/file.txt");

});
app.use(function(req,res){
    console.log(req.ip);
});
app.get('/next',
    function(req, res, next) {
        next();
        res.send('one');

    },
    function(req, res, next) {
        next();
        res.send('two');
    },
    function(req, res) {
        res.send('three');
    } );
app.get('/abc*', function(req, res) {
    res.send('abc*');
});
app.get('/abcd', function(req, res) {
    res.send('abcd');
});

app.get('/404', function(req, res) {
    res.status(404).send("404 not found");
});
app.get('/jsonp', function(req, res) {
    res.jsonp({message: 'welcome'});
});
app.get('/log', function(req, res) {
    res.download("./public/stylesheets/style.css");
});
app.get('/post', function(req, res) {
    res.sendfile("views/post.html");
});
app.post('/post.action', function(req, res) {
    res.json(req.body);
});
app.get('/upload', function(req, res) {
    res.sendfile("views/upload.html");
});
app.post('/upload.action', function(req, res) {
    for (var i in req.files) {
        if (req.files[i].size == 0){
            fs.unlinkSync(req.files[i].path);
            console.log('Successfully removed an empty file!');
        } else {
            var target_path = 'public/fastfs/' + req.files[i].name;
            console.log(target_path);
            console.log(req.files[i].path);
            fs.renameSync(req.files[i].path, target_path);
            res.redirect(path.join("/fastfs",req.files[i].name));
        }
    }
});
app.get('/cookie', function(req, res) {

    var count = req.cookies.count || 0;
    count++;
    res.cookie("count",count,{
        expires: 0
    });

    var count1 = req.session["app.sess"] || 0;
    count1++;
    req.session["app.sess"]=count1;
    console.log(req.session["app.sess"]);
    res.send("ssd");
});
app.get('/delcookie', function(req, res) {
    res.clearCookie("count");
    res.send("delete cookie");
});
app.get('/busboy', function(req, res) {
    res.sendfile("views/busboy.html");
});
app.post('/busboy', function(req, res) {
    var busboy = new Busboy({ headers: req.headers });
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        console.log(fieldname);
        console.log(file);
        console.log(filename);
        console.log(encoding);
        console.log(mimetype);
//        var saveTo = path.join(os.tmpDir(), path.basename(fieldname));
//        file.pipe(fs.createWriteStream(saveTo));
    });
    busboy.on('finish', function() {
        res.writeHead(200, { 'Connection': 'close' });
        res.end("That's all folks!");
    });
    return req.pipe(busboy);
});
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
