import { pool } from "../helpers/db.js";
import bcrypt from "bcryptjs";

export const getUsers = async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM User`);
    res.json(rows);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `something went wrong: ${error.message}` });
  }
};

export const getUser = async (req, res) => {
  try {
    const id = req.params.userId;
    const [rows] = await pool.query(`SELECT * FROM User WHERE userID = ?`, [
      id,
    ]);

    if (rows.length <= 0)
      return res.status(404).json({
        message: "Error 404: User not found",
      });

    res.json(rows[0]);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `something went wrong: ${error.message}` });
  }
};

export const updateUser = async (req, res) => {
  try {
    const id = req.params.userId;
    const { userName, realName, password, userPhone, userPhoto, role, active } = req.body;


    const [result] = await pool.query(
      ` 
      UPDATE User SET 
        RealName = IFNULL(?, RealName),
        Username = IFNULL(?, Username), 
        Password = IFNULL(?, Password), 
        UserPhone = IFNULL(?, UserPhone),
        UserPhoto = IFNULL(?, UserPhoto),
        Role = IFNULL(?, Role),
        Active = IFNULL(?, Active)  
      WHERE UserID = ?`,
      [realName, userName, password, userPhone, userPhoto, role, active, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const [rows] = await pool.query(`SELECT * FROM User WHERE UserID = ?`, [
      id,
    ]);

    res.json(rows[0]);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `something went wrong: ${error.message}` });
  }
};

// export const deleteUser = async (req, res) => {
//   try {
//     const id = req.params.userId;
//     const [result] = await pool.query(`DELETE FROM User WHERE UserID = ?`, [
//       id,
//     ]);

//     if (result.affectedRows <= 0)
//       return res.status(404).json({
//         message: "Category not found",
//       });

//     res.sendStatus(204);
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ message: `something went wrong: ${error.message}` });
//   }
// };
