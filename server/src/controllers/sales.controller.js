import { pool } from "../helpers/db.js";

export const getSales = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT 
        Sale.*, User.userID, User.realName
      FROM Sale
      INNER JOIN User ON User.UserID = Sale.EmployeeID
        ORDER BY Sale.saleDate DESC;
      `
    );
    res.json(rows);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `something went wrong: ${error.message}` });
  }
};

export const getSalesByDate = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const [rows] = await pool.query(
      `
      SELECT *
      FROM Sale
      WHERE DATE(saleDate) BETWEEN ? AND ?;
      
      `,
      [startDate, endDate]
    );
    res.json(rows);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `something went wrong: ${error.message}` });
  }
};

export const getUserSalesByDate = async (req, res) => {
  try {
    const id = req.params.userId;
    const { startDate, endDate } = req.query;
    const [rows] = await pool.query(
      `
      SELECT *
      FROM Sale
      WHERE DATE(saleDate) BETWEEN ? AND ?
      AND employeeID = ?   
      `,
      [startDate, endDate, id]
    );
    res.json(rows);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `something went wrong: ${error.message}` });
  }
};

export const getSaleByUserId = async (req, res) => {
  try {
    const id = req.params.userId;
    const [rows] = await pool.query(
      `
      SELECT
        Sale.*,
        User.UserID, User.RealName
      FROM Sale
      INNER JOIN User ON User.UserID = Sale.EmployeeID
      WHERE EmployeeID = ?
      `,
      [id]
    );

    if (rows.length <= 0)
      return res.status(404).json({
        message: "Error 404: Sale not found",
      });

    res.json(rows);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `something went wrong: ${error.message}` });
  }
};

export const getSaleDetails = async (req, res) => {
  try {
    const id = req.params.saleId;
    const [rows] = await pool.query(
      `
      SELECT 
        SaleDetails.* ,
        Product.*
      FROM SaleDetails
      INNER JOIN Product ON Product.productID = SaleDetails.productID
      WHERE SaleID = ?
      `,
      [id]
    );

    if (rows.length <= 0)
      return res.status(404).json({
        message: "Error 404: Sale Details not found",
      });

    res.json(rows);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `something went wrong: ${error.message}` });
  }
};

export const createSale = async (req, res) => {
  try {
    const { saleDate, totalSale, employeeID, saleDetails } = req.body;
    const [rows] = await pool.query(
      `INSERT INTO Sale (SaleDate, TotalSale, EmployeeID) VALUES (?,?,?)`,
      [saleDate, totalSale, employeeID]
    );

    const saleID = rows.insertId;

    for (const detail of saleDetails) {
      await pool.query(
        "INSERT INTO SaleDetails (SaleID, ProductID, Unit, Quantity, UnitPrice, Subtotal) VALUES (?, ?, ?, ?, ?, ?)",
        [
          saleID,
          detail.productID,
          detail.unit,
          detail.quantity,
          detail.unitPrice,
          detail.subtotal,
        ]
      );
    }

    res.send({
      id: rows.insertId,
      saleDate,
      totalSale,
      employeeID,
      saleDetails,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `something went wrong: ${error.message}` });
  }
};

export const createSaleDetails = async (req, res) => {
  try {
    const saleId = req.params.saleId;
    const { productID, unit, quantity, unitPrice, subtotal } = req.body;

    const [rows] = await pool.query(
      "INSERT INTO SaleDetails (SaleID, ProductID, Unit, Quantity, UnitPrice, Subtotal) VALUES (?, ?, ?, ?, ?, ?)",
      [saleId, productID, unit, quantity, unitPrice, subtotal]
    );

    res.send({
      id: rows.insertId,
      saleId,
      productID: productID,
      unit: unit,
      quantity: quantity,
      unitPrice: unitPrice,
      subtotal: subtotal,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `something went wrong: ${error.message}` });
  }
};

export const updateSale = async (req, res) => {
  try {
    const id = req.params.saleId;
    const { saleDate, totalSale, employeeID, canceled } = req.body;

    const [result] = await pool.query(
      `
      UPDATE Sale SET 
      SaleDate = IFNULL(?, SaleDate), TotalSale = IFNULL(?, TotalSale), EmployeeID = IFNULL(?, EmployeeID), Canceled = IFNULL(?, Canceled)
      WHERE SaleID = ? 
      `,
      [saleDate, totalSale, employeeID, canceled, id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({
        message: "Sale not found",
      });

    const [rows] = await pool.query(`SELECT * FROM Sale WHERE SaleID = ?`, [
      id,
    ]);

    res.json(rows[0]);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `something went wrong: ${error.message}` });
  }
};

export const deleteSale = async (req, res) => {
  try {
    const id = req.params.saleId;
    const [result] = await pool.query(`DELETE FROM Sale WHERE SaleID = ?`, [
      id,
    ]);

    if (result.affectedRows <= 0)
      return res.status(404).json({
        message: "Sale not found",
      });

    res.sendStatus(204);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `something went wrong: ${error.message}` });
  }
};

export const deleteSaleDetails = async (req, res) => {
  try {
    const id = req.params.saleDetailsId;
    const [result] = await pool.query(
      `DELETE FROM SaleDetails WHERE DetailID = ?`,
      [id]
    );

    if (result.affectedRows <= 0)
      return res.status(404).json({
        message: "Detail not found",
      });

    res.sendStatus(204);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `something went wrong: ${error.message}` });
  }
};
