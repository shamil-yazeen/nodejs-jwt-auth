const express = require('express')
const path = require('path')
const {logger} = require('./middleware/logEvents')
const errorHandler = require('./middleware/errorHandler')
const verifyJwt = require('./middleware/verifyJwt')
const cors = require('cors')
const corsOptions = require('./conf/corsOptions')
const cookieParser = require('cookie-parser')
const { verify } = require('crypto')
const app = express()
const PORT = process.env.PORT || 3500

app.use(logger)
app.use(cors(corsOptions))
app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use(cookieParser())
app.use('/',express.static(path.join(__dirname,'public')))

app.use('/',require('./routes/root'))
app.use('/register',require('./routes/register'))
app.use('/auth',require('./routes/auth'))
app.use('/refresh',require('./routes/refresh'))
app.use('/logout',require('./routes/logout'))

app.use(verifyJwt)
app.use('/employees',require('./routes/api/employees'))

app.use('/', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ "error": "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});

app.use(errorHandler)
app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`)
})