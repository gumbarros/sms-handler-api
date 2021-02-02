const express = require("express");
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser')
const db = require('better-sqlite3')('sms.db', { verbose: console.log });
app.use(bodyParser.json());

app.get("/", function(req,res){
    res.send("API Online...");
});

app.route("/sms/:phone?")
.post(function(req,res){

    const sms = {
      phone: req.body.phone,  
      content: req.body.content,
      date: req.body.date
    }

    const statement = db.prepare('INSERT INTO TB_SMS (SMS_PHONE,SMS_CONTENT,SMS_DATE) VALUES(@phone,@content,@date)');

    const insertSMS = db.transaction((sms) => {
       statement.run(sms);
    });

    insertSMS(sms);

    return res.send("SMS gravado com sucesso no DB.")
})
.get(function(req,res){

    const phone = req.params.phone;

    let statement

    if (phone != null){
        statement = db.prepare('SELECT * FROM TB_SMS WHERE SMS_PHONE =' + phone);
    }

    else{
        statement = db.prepare('SELECT * FROM TB_SMS');
    }

    const sms = statement.all()

    res.writeHead(200, {'Content-Type': 'application/json'});

    return res.end(JSON.stringify(sms));
});

const port = process.env.PORT || 3000;

app.listen(port, function(){
    console.log(port + "!");
});