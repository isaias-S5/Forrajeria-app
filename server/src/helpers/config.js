import { config } from 'dotenv';

config()

export const PORT = process.env.PORT || 3000

export const BD_HOST = process.env.BD_HOST || 'localhost'
export const DB_USER = process.env.DB_USER || 'root'
export const DB_PORT = process.env.DB_PORT || 3306
export const DB_PASSWORD = process.env.DB_PASSWORD || ',j4?2k^8Cn\M'
export const DB_NAME = process.env.DB_NAME || 'db_fdm'

export const TOKEN_SECRET = process.env.TOKEN_SECRET || 'Secret123'

export const EMAIL  = process.env.EMAIL || 'email@gmail.com'
export const EMAIL_PASSWORD  = process.env.EMAIL_PASSWORD || 'Secret123'

console.log(process.env.PORT)

