var express = require('express');
var mime = require('mime');
var exec = require('child_process').exec;
var execSync = require('child_process').execSync;
var multer  = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './imgReceived/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); //+ Date.now() + '.' + mime.extension(file.mimetype));
  }
});
var upload = multer({ storage: storage });
var app = express();

app.get('/test', function (req, res) {
  console.log("test request received");
  res.setHeader('Content-Type', 'application/json');
  res.json({"status": "cool"});
});

app.get('/api', function (req, res) {
  console.log(req);
  res.send('Hello World!');
});

app.post('/image', upload.array('file', 12), function (req, res) {
  console.log(req.files);
  try {
    var stdout = execSync("D:\\Oliver\\Work\\ML\\BVLC_caffe\\build\\examples\\cpp_classification\\Release\\classification.exe D:\\Oliver\\Work\\ML\\BVLC_caffe\\models\\bvlc_reference_caffenet\\deploy.prototxt D:\\Oliver\\Work\\ML\\BVLC_caffe\\models\\bvlc_reference_caffenet\\bvlc_reference_caffenet.caffemodel D:\\Oliver\\Work\\ML\\BVLC_caffe\\data\\ilsvrc12\\imagenet_mean.binaryproto D:\\Oliver\\Work\\ML\\BVLC_caffe\\data\\ilsvrc12\\synset_words.txt D:\\Oliver\\Work\\API\\imgReceived\\upload.jpg");
    console.log(stdout);
    stdout = stdout + '';
    var lines = stdout.split('\n');
    lines.splice(0,1);
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];
      line = line.slice(0,-2);
      var name = line.slice(20);
      var prob = line.slice(0,6);
      lines[i] = name + ' ' + prob;
    }
    var result = lines.join('\n');
    res.setHeader('Content-Type', 'application/json');
    res.json({"status": "done", "result": result});
  }
  catch (stderr) {
    console.log("ERROR!!!");
    console.log(stderr);
    console.log("ERROR!!!");
  }
});
 
var server = app.listen(3000, function () {
  var host = server.address().address;
  host = (host === '::' ? 'localhost' : host);
  var port = server.address().port;
  
  console.log('listening at http://%s:%s', host, port);
});

