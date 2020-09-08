const http = require("http");
const server = http.createServer(function(request, response){
    response.writeHead(200,{"Content-Type": "text/plain"});
    response.write("This is a really cool message");
    response.end();
});
server.listen(3000, "localhost");

