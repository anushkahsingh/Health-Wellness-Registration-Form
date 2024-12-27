const http = require("http");
const fs = require("fs");
const qs = require("querystring");
const path = require('path');
const server = http.createServer((req, res) => {
    let { method } = req;
    if (req.url === '/style.css'){
        fs.readFile('style.css',"utf-8",(err,data)=>
        {
            if(err)
            {
                res.writeHead(500);
                console.log("Server error");
                
                
            }
            else{
                res.writeHead(200, {'Content-Type': 'text/css'});
                res.end(data);
            }
        })
    }
    
    else if (req.url.startsWith('/pics/')) {
        // Serve image files
        const filePath = path.join(__dirname, req.url);
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('404 - File Not Found');
            } else {
                const ext = path.extname(filePath).toLowerCase();
                const mimeTypes = {
                    '.jpg': 'image/jpeg',
                    '.png': 'image/png',
                    '.gif': 'image/gif',
                };
                res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
                res.end(data);
            }
        });
    } 



    else if (method == "GET") {
        //get request handling
        if (req.url === "/") {
            console.log("inside / route and Get rquest");
            fs.readFile("User.json", "utf8", (err, data) => {
                if (err) {
                    console.log(err);
                    res.writeHead(500);
                    res.end("Server Error");
                } else {
                    console.log(data);
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(data);
                }
            });
            //   res.end("welcome to home route");
        } else if (req.url == "/info") {
            fs.readFile("info.html", "utf8", (err, data) => {
                if (err) {
                    res.writeHead(500);
                    res.end("Server Error");
                } else {
                    console.log("sending info.html file");
                    res.end(data);
                }
            });
        } else if (req.url === "/survey1") {
            fs.readFile("survey1.html", "utf8", (err, data) => {
                if (err) {
                    res.writeHead(500);
                    res.end("Server Error");
                } else {

                    console.log("sending survey1.html file");
                    res.end(data);
                }
            });
        }
        else{
            //error handlings
            console.log(req.url);  
            res.writeHead(404);
            res.end("Not Found");
        }
    }




        // post method handling and // Store the user data in a file 
    else {
        if (req.url === "/survey1") {
            console.log("inside /survey1 route and post request");
            let body = "";
            req.on("data", (chunk) => {
                body += chunk.toString();
                //  console.log(chunk);
            });
            req.on("end", () => {
                let readdata = fs.readFileSync("User.json", "utf-8"); //data stored in string type
                console.log(readdata);

                if (!readdata) {  // if file is empty add an empty array
                    fs.writeFileSync("User.json", JSON.stringify([]));
                    let users=[];
                    let convertedbody = qs.decode(body);
                    users.push(convertedbody);
                    fs.writeFile("User.json", JSON.stringify(users), (err) => {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log("userdata inserted succefuly");
                        }
                    });
                }
                else {      //if file have already some data
                    let jsonData = JSON.parse(readdata);
                    let users = [...jsonData];
                    console.log(users);

                    let convertedbody = qs.decode(body);
                    users.push(convertedbody);
                    console.log(convertedbody);
                    fs.writeFile("User.json", JSON.stringify(users), (err) => {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log("userdata inserted succefuly");
                        }
                    });

                }

                res.writeHead(200, { "Content-Type": "text/html" });
                res.end("Registration successful!");
            });
        }
        else {
            res.writeHead(404);
            res.end("Not Found in post request");
        }

    }
});

server.listen(3000,() => {
    console.log("Server listening on port 3000");
});