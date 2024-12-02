import sql from "mssql";
import dotenv from "dotenv";

dotenv.config();

const sqlConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

let pool;

export const connectSQLServer = async () => {
  try {
    if (!pool) {
      pool = await sql.connect(sqlConfig);
      console.log("Connected to SQL Server successfully!");
    }
    return pool;
  } catch (err) {
    console.error("Error connecting to SQL Server:", err.message);
    throw err;
  }
};

export const sqlQuery = async (query, params = {}) => {
  try {
    const pool = await connectSQLServer();
    const request = pool.request();
    Object.entries(params).forEach(([key, value]) => {
      request.input(key, value);
    });

    const result = await request.query(query);
    return result.recordset;
  } catch (error) {
    console.error("SQL Query Error:", error.message);
    throw error;
  }
};

