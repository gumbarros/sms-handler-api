const express = require("express");
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser')

app.use(bodyParser.json());

app.get("/", function(req,res){
    res.send("API Online...");
});

app.route("/sms")
.post(function(req,res){

    const sms = req.body.sms

    fs.writeFile("sms.txt", sms, function(err){
        if (err) res.send(err);
        return res.send("SMS gravado.")
    });
})
.get(function(req,res){
    fs.readFile('sms.txt', function(err, data) {
        if (err) res.send(err);
        const sms = data.toString()
        res.writeHead(200, {'Content-Type': 'application/json'});
        return res.end(JSON.stringify({ sms:sms }));
      });
});

const port = process.env.PORT || 3000;

app.listen(port, function(){
    console.log(port + "!");
    
});