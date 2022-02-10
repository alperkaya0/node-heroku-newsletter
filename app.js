const express = require("express");
const app = express();
const parser = require("body-parser");
const https = require("https");

app.use(express.static("public"));
app.use(parser.urlencoded({extended:true}));

app.get("/", function(req,res) {
    res.sendFile(__dirname+"/signup.html");   
});

app.post("/", function(req,res) {
    console.log(req.body);
    let name = req.body.name;
    let surname = req.body.surname;
    let email = req.body.email;
    
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: name,
                    LNAME: surname
                }
            }
        ]
    };

    const url = "https://YOURDCGOESHERE[example:us14].api.mailchimp.com/3.0/lists/YOURLISTIDGOESHERE"

    let options = {
        method : "POST",
        auth : "anystringgoeshere_maybeyourname:APIKEYHERE"
    }

    let rcode = 404;

    const request = https.request(url, options, function(response) {
        rcode = response.statusCode;
        console.log(rcode);
        if (rcode === 200) {
            res.sendFile(__dirname+"/success.html");
        }else {
            res.sendFile(__dirname+"/failure.html");
        }
        
        response.on("data", function(data) {
            console.log(JSON.parse(data));
        });
        
    });

    request.write(JSON.stringify(data));
    request.end();
    
});

app.post("/failure", function(req,res) {
    res.redirect("/");    
});





let portnum = process.env.PORT || 3001;

app.listen(portnum, function() {
    console.log("Server is running at: http://localhost:"+portnum);
})
