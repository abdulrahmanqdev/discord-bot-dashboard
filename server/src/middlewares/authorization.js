// @ts-check
const settings = require("../settings.js");
const jwt = require("jsonwebtoken");

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */
function verifyAuthorization(req, res, next) {
  const authorization = req.headers.authorization;
  if (!authorization) {
    res.status(401).send({ succcess: false, message: "Access denied. No authentication token provided. Please include a valid token in your request." })
    return;
  }

  /** @type {string} */
  const access_token = authorization.split(" ")[1];

  try {
    const decoded = jwt.verify(access_token, settings.jwt);
    // @ts-expect-error
    req.user = decoded;

    next();
  } catch (error) {
    res.status(430).send({ succcess: false, message: "Invalid authentication token. Please provide a valid token to access this resource." })
    return;
  }
}

module.exports = { verifyAuthorization };
