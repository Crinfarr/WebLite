const http = require('http');
const mh = require('magic-home');
const fs = require('fs')

let tlights = []
JSON.parse(fs.readFileSync('./lights.json')).forEach(light => {
    tlights.push(light.address);
});
const lights = tlights;
let power = true
lights.forEach(lightaddr => {
    let c = new mh.Control(lightaddr);
    c.setPower(power);
})

http.createServer((req, res) => {
    //get request
    const { headers, method, url } = req;
    let body = []

    req.on('error', (err) => {
        console.error(err)//if theres an error, error the error
    })

    req.on('data', (chunk) => {
        body.push(chunk);//unused usually
    })

    req.on('end', () => {
        body = Buffer.concat(body).toString()//unused usually
    })

    //respond
    if (method.toLowerCase() == "get") {
        res.statusCode = 200;
        if (url == '/favicon.ico') {//if browser requests a favicon
            res.setHeader('Content-Type', "image/png")
            res.end(fs.readFileSync(`./bulb_${(power) ? "on" : "off"}.ico`))//choose on or off icon depending on light state
            console.log('sent ico')
        }
        else {//assume request for body
            res.setHeader('content-type', 'text/html')
            power = !power
            lights.forEach(lightaddr => {
                l = new mh.Control(lightaddr);
                l.setPower(power);
            })
            res.end(`<center><h1>Light turned ${(power) ? "on" : "off"}</h1><p>good job, now it's ${(power) ? "light" : "dark"}</p></center>`)//heehoo
            console.log('sent body');
        }
    }
    else {
        res.statusCode = 418;
        res.setHeader('Content-Type', 'text/html');
        res.end('<h1><center>418 I\'m a teapot</center></h1>\n' + JSON.stringify(response));
    }
}).listen(7486);