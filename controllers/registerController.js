const usersDB = {
    users:require('../model/users.json'),
    settUsers:function(data){this.users = data}
}
const fs = require('fs/promises')
const path = require('path')
const bcrypt = require('bcrypt')

const handleNewuser = async(req,res)=>{
    const {user,pwd} = req.body
    if(!user||!pwd)return res.status(404).json({'message' : `Username and Password are requried`})

    const duplicate = usersDB.users.find(person=>person.userName === user)
    if(duplicate)return res.status(409).json({"message" : "user already exist"})
    console.log(user,pwd)
    try{    
        // encrypt the password
        const hashedPwd = await bcrypt.hash(pwd,10)
        const newUser = {
            "userName" : user,
            "roles":{"User" : 2001},
            "password" : hashedPwd,
        }
        usersDB.settUsers([...usersDB.users,newUser])
        await fs.writeFile(
            path.join(__dirname,'..','model','users.json'),
            JSON.stringify(usersDB.users)
        )
        res.status(201).json({'success':`New user ${user} created!`})
        console.log(newUser)
    }catch(err){
        res.status(500).json({'err message': err.message})
    }
}

module.exports={handleNewuser}