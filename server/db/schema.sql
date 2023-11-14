  CREATE DATABASE IF NOT EXISTS my_db;

  -- Uso de la base de datos
  USE my_db;

  -- Tabla de Proveedores
  CREATE TABLE Supplier (
  supplierID INT NOT NULL AUTO_INCREMENT,
  supplierName VARCHAR(100) NOT NULL,
  supplierPhone VARCHAR(20),
  supplierEmail VARCHAR(100),
  PRIMARY KEY (supplierID)
  );

  -- Tabla de Categorías
  CREATE TABLE Category (
  categoryID INT NOT NULL AUTO_INCREMENT,
  categoryName VARCHAR(100) NOT NULL,
  PRIMARY KEY (categoryID)
  );

  -- Tabla de Productos
  CREATE TABLE Product (
  productID INT NOT NULL AUTO_INCREMENT,
  productName VARCHAR(100) NOT NULL,
  productDescription VARCHAR(255),
  productUnit ENUM('L', 'KG', 'UD') NOT NULL DEFAULT 'UD',
  productPrice DECIMAL(10, 2) NOT NULL,
  productStock DECIMAL(10,2) NOT NULL,
  productPhoto TEXT,
  supplierID INT,
  categoryID INT,
  deleted TINYINT NOT NULL DEFAULT 0,
  PRIMARY KEY (productID),
  FOREIGN KEY (supplierID) REFERENCES Supplier(supplierID),
  FOREIGN KEY (categoryID) REFERENCES Category(categoryID)
  );
  
  
  -- Tabla de Usuarios
  CREATE TABLE User (
  userID INT NOT NULL AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL UNIQUE,
  userName VARCHAR(60) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  realName VARCHAR(60),
  userPhone VARCHAR(20),
  userPhoto TEXT, 
  role ENUM('Administrador', 'Empleado') NOT NULL DEFAULT 'Empleado',
  active TINYINT NOT NULL DEFAULT 1
  PRIMARY KEY (userID)
  );


  -- Tabla de Ventas
  CREATE TABLE Sale (
  saleID INT NOT NULL AUTO_INCREMENT,
  saleDate DATETIME NOT NULL,
  totalSale DECIMAL(10, 2) NOT NULL,
  employeeID INT NOT NULL,
  canceled TINYINT NOT NULL DEFAULT 1,
  PRIMARY KEY (saleID),
  FOREIGN KEY (employeeID) REFERENCES User(userID)
  );

  -- Tabla de Detalles de Venta
  CREATE TABLE SaleDetails (
  detailID INT NOT NULL AUTO_INCREMENT,
  saleID INT NOT NULL,
  productID INT NOT NULL,
  quantity DECIMAL(10, 2) NOT NULL,
  unit ENUM('ML', 'L', 'KG', 'G', 'UD') NOT NULL DEFAULT 'UD',
  unitPrice DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  PRIMARY KEY (detailID),
  FOREIGN KEY (saleID) REFERENCES Sale(saleID) ON DELETE CASCADE,
  FOREIGN KEY (productID) REFERENCES Product(productID)
  );


