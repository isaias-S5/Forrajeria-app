import { pool } from "../helpers/db.js";

export const getSuppliers = async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM Supplier`);
    res.json(rows);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `something went wrong: ${error.message}` });
  }
};

export const getSupplier = async (req, res) => {
  try {
    const id = req.params.supplierId;
    const [rows] = await pool.query(
      `SELECT * FROM supplier WHERE supplierID = ?`,
      [id]
    );

    if (rows.length <= 0)
      return res.status(404).json({
        message: "Error 404: supplier not found",
      });

    res.json(rows[0]);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `something went wrong: ${error.message}` });
  }
};

export const createSupplier = async (req, res) => {
  try {
    const { supplierName, supplierPhone, supplierEmail } = req.body;
    const [rows] = await pool.query(
      `INSERT INTO Supplier (SupplierName, SupplierPhone, SupplierEmail) VALUES (?, ?, ?)`,
      [supplierName, supplierPhone, supplierEmail]
    );

    res.send({
      id: rows.insertId,
      supplierName,
      supplierPhone,
      supplierEmail,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `something went wrong: ${error.message}` });
  }
};

export const updateSupplier = async (req, res) => {
  try {
    const id = req.params.supplierId;
    const { supplierName, supplierPhone, supplierEmail } = req.body;

    const [result] = await pool.query(
      ` UPDATE Supplier SET 
          supplierName = IFNULL(?, supplierName), SupplierPhone = IFNULL(?, SupplierPhone), SupplierEmail = IFNULL(?, SupplierEmail) 
        WHERE SupplierID = ?`,
      [supplierName, supplierPhone, supplierEmail, id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({
        message: "Supplier not found",
      });

    const [rows] = await pool.query(
      `SELECT * FROM Supplier WHERE SupplierID = ?`,
      [id]
    );

    res.json(rows[0]);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `something went wrong: ${error.message}` });
  }
};

export const deleteSupplier = async (req, res) => {
  try {
    const id = req.params.supplierId;
    const [result] = await pool.query(
      `DELETE FROM Supplier WHERE SupplierID = ?`,
      [id]
    );

    if (result.affectedRows <= 0)
      return res.status(404).json({
        message: "Supplier not found",
      });

    res.sendStatus(204);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `something went wrong: ${error.message}` });
  }
};
