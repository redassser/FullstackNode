const fs = require("fs");
const http = require("http");
const querystring = require("querystring");

const port = process.env.PORT;

function res_text(req, res) {
    res.setHeader("Content-Type", "text/plain");
    res.end("pie");
}
function res_json(req, res) {
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({
        text: "pie",
        stuff: [1, 3, 2]
    }));
}
function res_static(req, res) {
    const filename = __dirname+"/public"+req.url.split("/static")[1];
    fs.createReadStream(filename)
        .on("error", () => res_notfound(req, res))
        .pipe(res);
}
function res_echo(req, res) {
    const { input = "", text = "" } = querystring.parse(req.url.split("?").slice(1).join(""));
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({
        input: input,
        text: text
    }));
}
function res_notfound(req, res) {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
}

const server = http.createServer((req, res) => {
    if(req.url==="/") return res_text(req, res);
    if(req.url==="/json") return res_json(req, res);
    if(req.url.match(/^\/echo/)) return res_echo(req, res);
    if(req.url.match(/^\/static/)) return res_static(req, res);
    else return res_notfound(req, res);
});

server.listen(port);

console.log("Port: "+port);