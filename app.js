//===============================================================
// EXPRESS SETUP
// require('dotenv').config()
var express = require("express");
var sassMiddleware = require("node-sass-middleware");
var path = require("path");
// MONGOOSE SETUP
var mongoose = require("mongoose");

var url = process.env.DB_URI;
mongoose.connect(url);

mongoose.Promise = global.Promise;
//====================
// IMPORT MODELS
var Page = require("./models/page");
//====================
// APP START
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
// SASS SETUP
app.use(
    sassMiddleware({
        src: __dirname + '/sass',
        dest: __dirname + '/public/stylesheets',
        prefix: '/stylesheets',
        indentedSyntax: true,
        debug: true,
    })
);
//USE PUBLIC TO LOOKUP  
app.use(express.static(path.join(__dirname, '/public')));
//EJS AS PRIMARY VIEW ENGINE SETUP
app.set("view engine", "ejs");
Page.remove({},function(error){});
//===============================================================
//ROUTING SETUPS
var indexRoutes = require("./routes/index");
var errorRoutes = require("./routes/404");
app.use(indexRoutes);
app.use(errorRoutes);
socket_ids = [];
io.sockets.on('connection', function (socket) {
    var cPage = socket.handshake.headers.referer.split("/");
    cPage = "/" + cPage[cPage.length - 1];
    socket.on("keep-alive",function(data){
        if(socket_ids.indexOf(socket.id)==-1){
            socket_ids.push(socket.id);
            Page.find({page: cPage},function(error,found){
                if(found.length == 0){
                    Page.create({page: cPage, count: 1});
                }else{
                    found[0].count++;
                    found[0].save();
                }
            });
        }
    });
    socket.on('reset-info', function(data){
        Page.find({},function(error,all){
            all.forEach(function(each){
                each.count = 0;
                each.save();
                socket_ids.splice(0,socket_ids.length);
            });
        });        
    });
    socket.on('disconnect', function (data) {
        Page.find({ page: cPage }, function (error, found) {
            if(found.length){
                if(found[0].count>0){
                    found[0].count--;
                    found[0].save();
                    index = socket_ids.indexOf(socket.id);
                    socket_ids.splice(index,1);
                }
            }
        });
    });
    setInterval(function () {
        Page.find({page: cPage}, function (error, found) {
            if(found.length){
                socket.emit("visiting-info", found[0].count);
            }
        });
    },2000);
    setInterval(function () {
        Page.find({count: {$gt: 0}}, function (error, all) {
            if(all.length){
                socket.emit("dashboard-info", all);
            }
        });
    },2000);
});
//=================================================================================
//=================================================================================
//SERVER LISTENING AT SETUP
server.listen(process.env.PORT, process.env.IP, function () {
    console.log("Servidor funcionando");
});