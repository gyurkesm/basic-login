import mysql, { ConnectionOptions } from "mysql2";

const access: ConnectionOptions = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "testDB",
};

export const connectionPool = mysql.createPool(access).promise();
