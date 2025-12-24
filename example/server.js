const http = require('node:http');
function handler(req, res) {
    res.end('hello world');
}
const server = http.createServer(handler);

server.listen(3005, () => console.log('listening on 3001'));