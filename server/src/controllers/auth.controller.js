import { pool } from "../helpers/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { EMAIL, TOKEN_SECRET } from "../helpers/config.js";
import { transporter } from "../helpers/mailer.js";
import { htmlToText } from "nodemailer-html-to-text";

export const login = async (req, res) => {
  const { usernameOrEmail, password } = req.body;

  try {
    // Validación de datos de entrada
    if (!usernameOrEmail || !password) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    // Buscar al usuario por nombre de usuario o correo electrónico
    const [user] = await pool.query(
      "SELECT * FROM User WHERE userName = ? OR Email = ?",
      [usernameOrEmail, usernameOrEmail]
    );

    // Verificar si se encontró un usuario
    if (user.length === 0) {
      return res.json({
        error: "Nombre de usuario o correo electrónico no válido",
      });
    }

    // Comparar la contraseña ingresada con la contraseña almacenada en la base de datos
    const isPasswordValid = await bcrypt.compare(password, user[0].password);

    if (!isPasswordValid) {
      return res.json({ error: "Contraseña incorrecta" });
    }

    if (isPasswordValid) {
      const tokenPayload = {
        userID: user[0].userID,
        username: user[0].username,
        role: user[0].role,
      };

      const token = jwt.sign(tokenPayload, TOKEN_SECRET, { expiresIn: 86400 });

      res.json({ user: user[0], token });
    }
  } catch (error) {
    console.error("Error en el inicio de sesión:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

export const register = async (req, res) => {
  const { realName, username, email, password } = req.body;

  try {
    // Validación de datos de entrada
    if (!realName || !username || !email || !password) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "La contraseña debe tener al menos 6 caracteres" });
    }

    // Verificar si el nombre de usuario o correo electrónico ya están en uso en la base de datos
    const [existingUsername] = await pool.query(
      "SELECT * FROM User WHERE userName = ?",
      [username]
    );

    if (existingUsername.length > 0) {
      return res.json({ error: "El nombre de usuario ya esta en uso" });
    }

    const [existingEmail] = await pool.query(
      "SELECT * FROM User WHERE Email = ?",
      [email]
    );

    if (existingEmail.length > 0) {
      return res.json({ error: "El correo electrónico ya esta en uso" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      "INSERT INTO User (RealName, Username, Email, Password) VALUES (?, ?, ?, ?)",
      [realName, username, email, hashedPassword]
    );

    res.json({
      id: result.insertId,
      realName,
      username,
      email,
    });
  } catch (error) {
    console.error("Error en el registro:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

export const emailVerification = async (req, res) => {
  const { email } = req.params;
  const { code, reason } = req.body;
  try {
    transporter.use("compile", htmlToText());

    const htmlEmail = `
      <html>
        <body>
          <h1>Bienvenido a Forrajeria Don Mateo</h1>
          <h3> ${reason}</h3>
          <p>Por favor, ingresa el siguiente código en la aplicación:</p>
          <h2>${code}</h2>
        </body>
      </html>
    `;

    const result = await transporter.sendMail({
      from: `Forrajeria Don Mateo ${EMAIL}`,
      to: email,
      subject: "Código de inicio de sesión",
      html: htmlEmail, // Utiliza el correo HTML personalizado
    });

    res.status(200).json({ message: "Código enviado con éxito" });
  } catch (error) {
    console.error("Error al enviar el correo electrónico:", error);
    res.status(500).json({ message: "Error al enviar el correo electrónico" });
  }
};



export const verifyExistingUser = async (req, res) => {
  const { username, email } = req.body;

  const [existingUsername] = await pool.query(
    "SELECT * FROM User WHERE userName = ?",
    [username]
  );

  const [existingEmail] = await pool.query(
    "SELECT * FROM User WHERE Email = ?",
    [email]
  );

  const response = {
    usernameExists: existingUsername.length > 0,
    emailExists: existingEmail.length > 0,
  };

  res.json(response);
};


export const changePassword = async (req, res) => {
  try {
    const email = req.params.email;
    const { password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      ` 
      UPDATE User SET 
        Password = ?
      WHERE Email = ?`,
      [hashedPassword, email]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    const [rows] = await pool.query(`SELECT * FROM User WHERE Email = ?`, [
      email,
    ]);

    res.json(rows[0]);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `something went wrong: ${error.message}` });
  }
};
