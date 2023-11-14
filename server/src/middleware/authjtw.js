import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../helpers/config.js";
import { pool } from "../helpers/db.js";

export const verifyToken = async (req, res, next) => {
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) {
    return res.status(401).json({ error: "Token no proporcionado" });
  }
  const tokenArray = authorizationHeader.split(' ');
  if (tokenArray.length !== 2 || tokenArray[0] !== 'Bearer') {
    return res.status(401).json({ error: "Formato de token inválido" });
  }
  const token = tokenArray[1];
  try {
    const decoded = jwt.verify(token, TOKEN_SECRET);
    req.userID = decoded.userID;
    const [rows] = await pool.query(`SELECT * FROM User WHERE userID = ?`, [
      req.userID,
    ]);
    if (rows.length === 0) {
      return res.status(403).json({ error: "Usuario no encontrado" });
    }
    req.user = rows[0];
    next();
  } catch (error) {
    return res.status(403).json({ error: "Token inválido" });
  }
};


export const isAdmin = async (req, res, next) => {
  const [rows] = await pool.query(`SELECT * FROM User WHERE UserID = ?`, [
    req.userID,
  ]);
  const userData = rows[0];
  if (rows.length === 0) {
    return res.status(403).json({ error: "Usuario no encontrado" });
  }
  if (userData.role === 'Administrador'){
    next()
    return
  }
  return res.status(403).json({messagge: 'requieres el rol de adminitador para llevar a cabo esta acción'})
};

