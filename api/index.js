import express from "express";
import cookieParser from "cookie-parser";
import multer from "multer";

import postRouter from "./routes/posts.js";
import userRoutes from "./routes/users.js";
import authRoutes from "./routes/auth.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.get("/test", (req, res) => {
	res.send("Server works!");
});

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "./../client/public/uploads/");
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + file.originalname);
	},
});

const upload = multer({ storage });

app.use("/api/posts", postRouter);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.post("/api/upload", upload.single("file"), (req, res) => {
	console.log(req.file);
	const savedFile = req.file;
	if (savedFile) res.status(200).send(savedFile.filename);
	else res.status(500).send("Internal Server Error!");
});

app.listen(8080, () => {
	console.log("Server is running on port 8080");
});
