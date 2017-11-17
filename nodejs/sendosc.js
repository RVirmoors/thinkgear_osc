const http = require('http');
var qs = require('querystring');
var bp = require('body-parser');

const hostname = '127.0.0.1';
const port = 3000;

var osc = require("osc");
var oscSendPort = 7777;

var udpPort = new osc.UDPPort({
    localAddress: "0.0.0.0",
    localPort: 7776,
    metadata: true
});

udpPort.open();

const server = http.createServer((request, response) => {
  request.on('error', (err) => {
    console.error(err);
    response.statusCode = 400;
    response.end();
  });
  response.on('error', (err) => {
    console.error(err);
  });
  if (request.method === 'POST' && request.url === '/qr') {
  	  var requestBody = '';
      request.on('data', function(data) {
        requestBody += data;
        if(requestBody.length > 1e7) {
          response.writeHead(413, 'Request Entity Too Large', {'Content-Type': 'text/html'});
          response.end('<!doctype html><html><head><title>413</title></head><body>413: Request Entity Too Large</body></html>');
        }
      });
      request.on('end', function() {
        var formData = qs.parse(requestBody);
        console.log(formData);

		udpPort.on("ready", function () {
		    udpPort.send({
		        address: "/s_new",
		        args: [
		            {
		                type: "s",
		                value: formData
		            }
		        ]
		    }, "127.0.0.1", oscSendPort);
		});
      });
     response.setHeader('Content-Type', 'application/json');
     response.write(requestBody + '\n');
 	 response.end('this is the page number\n');
  } else {
    response.statusCode = 404;
    response.end();
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});