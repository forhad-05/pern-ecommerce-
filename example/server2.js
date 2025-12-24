const http = require('node:http');
function handler(req, res) {
    console.log('Received request for ',req.url,req.method );
      
    // if (req.url === '/create-categories') {
    //     res.end('Categories created');
    // } else if (req.url === '/delete-categories') {
    //     res.end('Categories deleted');
    // }else if (req.url === '/update-categories') {
    //     res.end('Categories updated');
    // }else if (req.url === '/read-categories') {
    //     res.end('Categories read');
    // }else {
    //     res.end('invalid request');

    // }
    switch (req.url) {
        case '/categories':
            if (req.method === 'POST') {
                res.end('Categories created');
            } else if (req.method === 'DELETE') {
                res.end('Categories deleted');
            } else if (req.method === 'PUT') {
                res.end('Categories updated');
            } else if (req.method === 'GET') {
                res.end('Categories read');
            } else {
                res.end('invalid request method for /categories');
            }
            break;
        default:
            res.statusCode = 404;
            res.end('Not Found');
            break;
    
    }   

}
const server = http.createServer(handler);

server.listen(3006, () => console.log('listening on 3006'));
