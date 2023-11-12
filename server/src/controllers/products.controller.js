import { pool } from "../helpers/db.js";

export const getProducts = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT  
        Product.*,
        Category.*,
        Supplier.supplierID, Supplier.supplierName
      FROM 
        Product 
      INNER JOIN Supplier ON Product.SupplierID = Supplier.SupplierID
      INNER JOIN Category ON Product.CategoryID = Category.CategoryID
      `
    );
    res.json(rows);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `something went wrong: ${error.message}` });
  }
};

export const getProduct = async (req, res) => {
  try {
    const id = req.params.productId;
    const [rows] = await pool.query(
      `
      SELECT  
        Product.*,
        Category.*,
        Supplier.supplierID, Supplier.supplierName
      FROM 
        Product 
      INNER JOIN Supplier ON Product.SupplierID = Supplier.SupplierID
      INNER JOIN Category ON Product.CategoryID = Category.CategoryID
      WHERE ProductID = ?
      `,
      [id]
    );

    if (rows.length <= 0)
      return res.status(404).json({
        message: "Error 404: Product not found",
      });

    res.json(rows[0]);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `something went wrong: ${error.message}` });
  }
};

export const createProduct = async (req, res) => {
  try {
    const {
      productName,
      productDescription,
      productUnit,
      productPrice,
      productStock,
      productPhoto,
      supplierID,
      categoryID,
    } = req.body;
    const [rows] = await pool.query(
      `
      INSERT INTO Product (ProductName, ProductDescription, ProductUnit, ProductPrice, ProductStock, ProductPhoto, SupplierID, CategoryID)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        productName,
        productDescription,
        productUnit,
        productPrice,
        productStock,
        productPhoto,
        supplierID,
        categoryID,
      ]
    );
    res.send({
      productID: rows.insertId,
      productName,
      productDescription,
      productPrice,
      productUnit,
      productStock,
      productPhoto,
      supplierID,
      categoryID,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `something went wrong: ${error.message}` });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const id = req.params.productId;
    const {
      productName,
      productDescription,
      productUnit,
      productPrice,
      productStock,
      productPhoto,
      supplierID,
      categoryID,
      deleted,
    } = req.body;

    const [result] = await pool.query(
      `
      UPDATE product SET 
        ProductName = IFNULL(?, ProductName), 
        ProductDescription = IFNULL(?, ProductDescription), 
        ProductUnit = IFNULL(?, ProductUnit), 
        ProductPrice = IFNULL(?, ProductPrice),
        ProductStock = IFNULL(?, ProductStock), 
        ProductPhoto = IFNULL(?, ProductPhoto), 
        SupplierID = IFNULL(?, SupplierID), 
        CategoryID = IFNULL(?, CategoryID), 
        deleted = IFNULL(?, deleted)  
      WHERE productId = ? 
      `,
      [
        productName,
        productDescription,
        productUnit,
        productPrice,
        productStock,
        productPhoto,
        supplierID,
        categoryID,
        deleted,
        id,
      ]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({
        message: "Producto not found",
      });

    const [rows] = await pool.query(
      `SELECT * FROM Product WHERE ProductId = ?`,
      [id]
    );

    res.json(rows[0]);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `something went wrong: ${error.message}` });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const id = req.params.productId;

    const [result] = await pool.query(
      `DELETE FROM Product WHERE ProductID = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: "Product not found",
      });
    }

    res.sendStatus(204);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `something went wrong: ${error.message}` });
  }
};
