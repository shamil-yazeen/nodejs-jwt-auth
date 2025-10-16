const UserDb = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};
require("dotenv").config();
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs/promises");

const handleLogin = async (req, res) => {
  try {
    const { user, pwd } = req.body;
    if (!user || !pwd)
      return res
        .status(400)
        .json({ message: "Username and Password are required" });

    const foundUser = UserDb.users.find((person) => person.userName === user);
    if (!foundUser) return res.sendStatus(401);

    const match = await bcrypt.compare(pwd, foundUser.password);
    if (!match)
      return res.status(401).json({ message: "password does not match" });

    const roles = Object.values(foundUser.roles);

    const accessToken = jwt.sign(
      {
        userInfo: {
          userName: foundUser.userName,
          roles: roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" }
    );
    const refreshToken = jwt.sign(
      {
        userName: foundUser.userName,
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    const currentUser = { ...foundUser, refreshToken };
    const otherUsers = UserDb.users.filter(
      (person) => person.userName !== foundUser.userName
    );  
    UserDb.setUsers([...otherUsers, currentUser]);
    await fs.writeFile(
      path.join(__dirname, "..", "model", "users.json"),
      JSON.stringify(UserDb.users)
    );
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { handleLogin };
