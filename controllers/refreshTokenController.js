const userDb = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.data = data;
  },
};

require("dotenv").config;
const path = require("path");
const jwt = require("jsonwebtoken");
const fs = require("fs/promises");
const { decode } = require("punycode");

const handleRefreshToken = async (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);

    const refreshToken = cookies.jwt;
    const foundUser = userDb.users.find(
      (person) => person.refreshToken === refreshToken
    );
    if (!foundUser) return res.sendStatus(40);

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err || decoded.userName !== foundUser.userName)
          return res
            .Status(403)
            .json({ message: "refresh token has been tampered" });
        const roles = Object.values(foundUser.roles);
        const accessToken = jwt.sign(
          {
            userInfo: {
              userName: decoded.userName,
              roles: roles,
            },
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "30s" }
        );
        res.json({ accessToken });
      }
    );
  } catch (err) {
    res.status(500).json(`message : ${err.message}`);
  }
};

module.exports = {handleRefreshToken};
