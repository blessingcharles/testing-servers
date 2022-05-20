const res = require("express/lib/response");
const http = require("http");
const fs = require("fs")

// https://nodejs.org/en/docs/guides/anatomy-of-an-http-transaction/
const port = 8002

console.log("server started at " + port);
http.createServer((request, response) => {

    let body = [];
    request
        .on("error", (err) => {
            console.log(request.headers);
            console.log(response.statusCode)

            response.end("error while reading body: " + err);
        })
        .on("data", (chunk) => {
            body.push(chunk);
        })
        .on("end", () => {
            body = Buffer.concat(body).toString();
            console.log("\n----------------------------\n")
            console.log(request.headers);
            console.log("Body : " , body , " length  : " , body.length.toString())
            console.log(response.statusCode)
            
            content = `\n----${response.statusCode} --------\n${JSON.stringify(request.headers)}\nBody:[${body.toString()}]\n`
            
            fs.writeFile('output.txt', content, { flag: 'a+' }, err => {})

            response.on("error", (err) => {
                response.end("error while sending response: " + err);
            });

            response.end(
                "Body length: " + body.length.toString() + " Body: " + body
            );
        });
}).listen(port);
