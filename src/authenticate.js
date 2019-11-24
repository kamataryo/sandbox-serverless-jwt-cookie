const jwt = require("jsonwebtoken");
const Cookie = require("cookie");
const { JWT_SECRET, CREDENTIAL } = process.env;

const handler = (event, context, callback) => {
  console.log(event.body);
  const { username, password } = JSON.parse(event.body) || {};

  if (`${username}:${password}` !== CREDENTIAL) {
    return callback(null, {
      statusCode: 401,
      body: JSON.stringify({
        message: "You are not authorized."
      })
    });
  } else {
    const expiresIn = 86400;
    const expiresAt = Date.now() + expiresIn * 1000;
    const token = jwt.sign({ hello: "world" }, JWT_SECRET, {
      expiresIn
    });
    const cookie = Cookie.serialize("token", token, {
      httpOnly: true,
      // secure: true,
      maxAge: expiresIn,
      path: "/"
    });
    return callback(null, {
      statusCode: 200,
      headers: {
        "Set-Cookie": cookie
      },
      body: JSON.stringify({
        expiresAt
      })
    });
  }
};

module.exports.handler = handler;
