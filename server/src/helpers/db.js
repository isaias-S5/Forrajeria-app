import { createPool } from "mysql2/promise";
import { BD_HOST, DB_USER, DB_PORT, DB_PASSWORD, DB_NAME } from "./config.js";

export const pool = createPool({
  host: BD_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  port: DB_PORT,
  database: DB_NAME,
});
