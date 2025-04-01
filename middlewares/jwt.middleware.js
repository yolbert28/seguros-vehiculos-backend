import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) {
    return res.status(401).send("No token provided");
  }

  token = token.split(" ")[1];

  // token = token.replace("Bearer ", "");

  try {
    const { documento } = jwt.verify(token, process.env.JWT_SECRET);

    req.documento = documento;

    next();
  } catch (e) {
    return res.status(401).json({ error: e.message });
  }
};