var http = require('http'); 
var fs = require('fs'); 
var path = require('path'); 

var port = 3000;
var hostname = '10.0.0.56';

function send404(response) { 
    response.writeHead(404, { 'Content-Type': 'text/plain' }); 
    response.write('Error 404: Resource not found.'); 
    response.end(); 
} 

var mimeLookup = { 
    '.js': 'application/javascript', 
    '.html': 'text/html',
    '.css' : 'text/css',
    '.ttf': 'font/ttf',
    '.jpg': 'image/jpeg'
}; 

var server = http.createServer(function (req, res) {
  console.log(req.url);
    if (req.method == 'GET') { 
         var fileurl; 
        if (req.url == '/') 
           fileurl = '/index.html'; 
        else 
           fileurl = req.url; 
        var filepath = path.resolve('.' + fileurl); 

        var fileExt = path.extname(filepath); 
        var mimeType = mimeLookup[fileExt]; 
        if (!mimeType) { 
            send404(res); 
            return;
        }
        fs.exists(filepath, function (exists) {
            if (!exists) {
                send404(res); 
                return; 
            };
            res.writeHead(200, { 'content-type': mimeType }); 
            fs.createReadStream(filepath).pipe(res);
         }); 
     } else {
         send404(res);
     } 
})


server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});