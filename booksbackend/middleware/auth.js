import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secretkey123";

export const authenticate = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ msg: "Anda belum login" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ msg: "Token tidak valid atau sudah kadaluarsa" });
  }
};
