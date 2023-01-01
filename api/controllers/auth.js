import { db } from "../db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const register = (req, res) => {
	//checking existing users
	// console.log(req.body);
	const q = "SELECT * from users WHERE email=? OR username=?";
	db.query(q, [req.body.email, req.body.username], (err, data) => {
		if (err) {
			return res.status(400).json(err);
		}
		if (data.length) return res.status(409).json("User Already Exists!");

		const salt = bcrypt.genSaltSync(5);
		const hash = bcrypt.hashSync(req.body.password, salt);

		const q =
			"INSERT INTO users(`username`, `email`, `password`) VALUES(?, ?, ?)";
		const values = [req.body.username, req.body.email, hash];
		db.query(q, values, (err, data) => {
			if (err) {
				return res.json(err);
			}
			return res.status(200).json("User has been created!!");
		});
	});
};
export const logout = (req, res) => {
	res.clearCookie("access-token", {
		sameSite: "none",
		secure: true,
	})
		.status(200)
		.json("Logout Successful!");
};
export const login = (req, res) => {
	// console.log(req.body);
	const q = "SELECT * from users WHERE username=?";
	db.query(q, [req.body.username], (err, data) => {
		if (err) {
			return res.status(400).json(err);
		}
		if (data.length === 0) {
			return res.status(409).json("Username or Email not found!");
		} else {
			// console.log(data);
			const match = bcrypt.compareSync(
				req.body.password,
				data[0].password
			);
			// const match = 1;
			if (match) {
				// req.session.user = data[0];
				const token = jwt.sign({ id: data[0].id }, "jwtKey");
				const { password, ...other } = data[0];
				return res
					.cookie("access-token", token, { httpOnly: true })
					.status(200)
					.json(other);
			} else {
				return res.status(409).json("Incorrect Password!");
			}
		}
	});
};
