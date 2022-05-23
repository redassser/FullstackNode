const fs = require("fs");
const express = require("express");
const EventEmitter = require("events");

const chatEmitter = new EventEmitter(); chatEmitter.on("message", console.log);
const port = process.env.PORT;
const app = express();

function res_text(req, res) {
    res.setHeader("Content-Type", "text/plain");
    res.end("pie");
}
function res_static(req, res) {
    const filename = __dirname+"/public/"+req.params[0];
    fs.createReadStream(filename)
        .on("error", () => res_notfound(req, res))
        .pipe(res);
}
function res_echo(req, res) {
    const { input = "", text = "" } = req.query;
    res.json({
        input: input,
        text: text
    });
}
function res_chat(req, res) {
    const { name , message } = req.query;
    var thename = (name=="") ? "anon" : name;
    chatEmitter.emit("message", thename+": "+message);
    res.end();
}
function res_sse(req, res) {
    res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Connection": "keep-alive"
    });

    const onMessage = (msg) => res.write("data: "+msg+"\n\n");
    chatEmitter.on("message", onMessage);

    res.on("close", () => {
        chatEmitter.off("message", onMessage);
    })
}
function res_notfound(req, res) {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
}

app.get("/", res_text);
app.get("/echo", res_echo);
app.get("/static/*", res_static);
app.get("/chat", res_chat);
app.get("/sse", res_sse);

app.listen(port, () => console.log("Port: "+port));