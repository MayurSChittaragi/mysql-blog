import mysql from "mysql";

export const db = mysql.createPool({
	host: "localhost",
	user: "root",
	password: "password",
	database: "blog",
	connectionLimit: 10,
});
