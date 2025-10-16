const verifyRoles = (...allowedRoles)=>{
    return (req,res,next)=>{
        const rolesArray = [...allowedRoles]
        console.log(`${req.users}\t${req.roles}`)
        const result = req.roles.some(role=>rolesArray.includes(role))
        if(!result) return res.sendStatus(401)
        next()
    }
}

module.exports = verifyRoles