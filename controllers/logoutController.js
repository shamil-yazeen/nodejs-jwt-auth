const usersDb = {
    users:require('../model/users.json'),
    setUsers:function(data){this.users = data}
}

const fs = require('fs/promises')
const path = require('path')


const handleLogout = async (req, res) => {
  try {
    const cookie = req.cookies;
    if (!cookie?.jwt) return res.sendStatus(204);

    const refreshToken = cookie.jwt;
    const foundUser = usersDb.users.find(
      person => person.refreshToken === refreshToken
    );
    if (!foundUser) {
      res.clearCookie("jwt", { httpOnly: true });
      return res.sendStatus(204);
    }
    const currentUser = { ...foundUser, refreshToken: "" };
    const otherUsers = usersDb.users.filter(
      (person) => person.refreshToken !== refreshToken
    );
    usersDb.setUsers([...otherUsers, currentUser]);
    await fs.writeFile(
      path.join(__dirname, "..", "model", "users.json"),
      JSON.stringify(usersDb.users)
    );
    res.clearCookie('jwt',{httpOnly:true , sameSite:'None' , secure:true})
    res.sendStatus(204)

  } catch (err) {
    res.status(500).json(`message : ${err.message} `)
  }
};

module.exports = { handleLogout };


