const {v4:uuid} = require('uuid')
const {format,getDate} = require('date-fns')
const fs = require('fs/promises')
const path = require('path')

const logEvents = async(message,filePath)=>{
    const dateTime = format(new Date(),'dd:MM:yyyy\thh:mm:ss')
    const logItem = `\n${dateTime}\t${uuid()}\t${message}`
    const logsDir = path.join(__dirname,"..","logs")
    const logFile = path.join(__dirname,"..","logs",filePath)
    try{
        await fs.mkdir(logsDir,{recursive:true})
        await fs.appendFile(logFile,logItem)
    }catch(err){
        console.log(err)
    }
}


const logger = (req,res,next)=>{
    logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`,'reqLog.txt')
    console.log(`${req.method}\t${req.url}`)
    next()
}

module.exports = {logger,logEvents}