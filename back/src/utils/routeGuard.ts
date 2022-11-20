import { RequestHandler } from "express";
import { verify } from "jsonwebtoken";

/**
 * A middleware function that is used to protect routes.
 *
 * @constant
 * @name routeGuard
 * @kind variable
 * @type {RequestHandler<ParamsDictionary, any, any, QueryString.ParsedQs, Record<string, any>>}
 * @exports
 */
export const routeGuard: RequestHandler = (req, res, next) => {
  try {
    const auth = req.cookies["jwt-auth"];
    const verified = verify(auth, <string>process.env.JWT_SECRET);
    const payload: { accountId: number; username: string } = verified as {
      accountId: number;
      username: string;
    };
    res.locals.id = payload.accountId;
    res.locals.username = payload.username;
    next();
  } catch (ex) {
    if (ex instanceof Error) {
      res.status(401);
      res.send({ status: "Unauthorized access" });
    }
  }
};
