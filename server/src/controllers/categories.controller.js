import { pool } from "../helpers/db.js";

export const getCategories = async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM Category`);
    res.json(rows);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `something went wrong: ${error.message}` });
  }
};

export const getCategory = async (req, res) => {
  try {
    const id = req.params.categoryId;
    const [rows] = await pool.query(
      `SELECT * FROM Category WHERE categoryID = ?`,
      [id]
    );

    if (rows.length <= 0)
      return res.status(404).json({
        message: "Error 404: Category not found",
      });

    res.json(rows[0]);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `something went wrong: ${error.message}` });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { categoryName } = req.body;
    const [rows] = await pool.query(
      `INSERT INTO Category (CategoryName) VALUES (?)`,
      [categoryName]
    );

    res.send({
      id: rows.insertId,
      categoryName,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `something went wrong: ${error.message}` });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const id = req.params.categoryId;
    const { categoryName } = req.body;

    const [result] = await pool.query(
      ` 
      UPDATE Category SET 
        CategoryName = IFNULL(?, CategoryName)  
      WHERE CategoryID = ?
      `,
      [categoryName, id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({
        message: "Category not found",
      });

    const [rows] = await pool.query(
      `SELECT * FROM Category WHERE CategoryID = ?`,
      [id]
    );

    res.json(rows[0]);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `something went wrong: ${error.message}` });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const id = req.params.categoryId;
    const [result] = await pool.query(
      `DELETE FROM Category WHERE CategoryID = ?`,
      [id]
    );

    if (result.affectedRows <= 0)
      return res.status(404).json({
        message: "Category not found",
      });

    res.sendStatus(204);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `something went wrong: ${error.message}` });
  }
};
