var express = require('express');
var router = express.Router();

var osc = require("osc");
var oscSendPort = 7771;

var udpPort = new osc.UDPPort({
    localAddress: "0.0.0.0",
    localPort: 7776,
    metadata: true
});

udpPort.open();
/* GET users listing. */
router.post('/qr', function(req, res, next) {
	var page = req.body.page;
    udpPort.send({
        address: "/page",
        args: [
            {
                type: "i",
                value: page
            }
        ]
    }, "127.0.0.1", oscSendPort);

      res.json({status:1, message: 'all ok'});
});

router.post('/eye', function(req, res, next) {
	var region = req.body.region;
    udpPort.send({
        address: "/para",
        args: [
            {
                type: "i",
                value: region
            }
        ]
    }, "127.0.0.1", oscSendPort);

      res.json({status:1, message: 'all ok'});
});

module.exports = router;