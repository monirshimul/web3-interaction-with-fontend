

var ethService = require('../web3/ethService')
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const path = require("path");


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



// app.set('views', path.join(__dirname, '../views'));
// app.set('view engine', 'ejs');


// app.get('/add', (req, res, next)=>{
//     res.render("../views/add");
    
// })

app.get('/add', (req, res)=>{
    res.sendFile(path.join(__dirname, '../views', 'add.html'))
})


app.post('/add', (req, res)=>{
    console.log("hello from post req")
    try{
        console.log(req.body);
        return ethService.setNid(req.body.key, req.body.nid, req.body.image, res)
        //.then(console.log(res))
    }
    catch (ex) {
        res.status(500).json({ message: ex });
    }
    
})


app.get('/search/:key', async (req, res)=>{
    const result = await ethService.getNid(req.params.key);
    console.log(result);
    return res.json({
        name: result[0],
        address: result[1]
    });
})




app.listen(3002, (err, res)=>{
    console.log("server is listing");
})
