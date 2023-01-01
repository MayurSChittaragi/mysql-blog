import { db } from "../db.js";
import jwt from "jsonwebtoken";

export const getPosts = (req, res) => {
	const category = req.query.cat;
	// console.log(req);
	const q = category
		? "SELECT * from posts WHERE category = ?"
		: "SELECT * from posts";
	db.query(q, [category], (err, result) => {
		if (err) return res.json(err);
		// console.log(result);
		res.status(200).send(result);
	});
};
export const getPost = (req, res) => {
	// console.log(req);
	const q =
		"SELECT `username`, `title`, `desc`, p.img, p.category, p.date, profileImg, uid FROM users u, posts p WHERE u.id = p.uid AND p.id=?";
	db.query(q, [req.params.id], (err, result) => {
		if (err) return res.json(err);
		// console.log(result);
		res.status(200).send(result[0]);
	});
};
export const deletePost = (req, res) => {
	const token = req.cookies.access_token;
	if (!token) return res.status(401).send("Unauthorized");
	const postId = req.params.id;
	jwt.verify(token, "jwtKey", (err, userInfo) => {
		if (err) res.status(403).json("The token is not valid!");
		const q = "DELETE FROM posts WHERE id = ? AND uid = ?";
		db.query(q, [postId, userInfo.id], (err, result) => {
			if (err) return res.json("You can only delete your own post");
			// console.log(result);
			res.status(200).send(result);
		});
	});
};
export const addPost = (req, res) => {
	const token = req.cookies.access_token;
	console.log(token, req.body);
	if (!token) return res.status(401).send("Unauthorized");
	jwt.verify(token, "jwtKey", (err, userInfo) => {
		if (err) res.status(403).json("The token is not valid!");
		const q =
			"INSERT INTO posts(`title`, `desc`, `img`, `category`, `uid`, `date`) VALUES(?, ?, ?, ?, ?, ?)";
		const values = [
			req.body.title,
			req.body.desc,
			req.body.img,
			req.body.category,
			userInfo.id,
			req.body.date,
		];
		db.query(q, values, (err, result) => {
			if (err) return res.json(err);
			// console.log(result);
			res.status(200).send(result);
		});
	});
};

export const updatePost = (req, res) => {
	const token = req.cookie.access_token;
	if (!token) return res.status(401).send("Unauthorized");
	const postId = req.params.id;
	jwt.verify(token, "jwtKey", (err, userInfo) => {
		if (err) res.status(403).json("The token is not valid!");
		const q = "UPDATE posts SET ? WHERE id = ? AND uid = ?";
		const values = [
			{
				title: req.body.title,
				desc: req.body.desc,
				img: req.body.img,
				category: req.body.category,
			},
			postId,
			userInfo.id,
		];
		db.query(q, values, (err, result) => {
			if (err) return res.json("You can only update your own post");
			// console.log(result);
			res.status(200).send(result);
		});
	});
};
