const express = require("express");
const Users = require("./users-model");
const router = express.Router();
const bcrypt = require("bcryptjs");
const restrict = require("../middleware/restrict");

//---get---

router.get("/users", restrict(), async (req, res, next) => {
	try {
		const users = await Users.get();
		res.json(users);
	} catch (err) {
		next(err);
	}
});

router.get("/logout", async (req, res, next) => {
	try {
		req.session.destroy((err) => {
			if (err) {
				next(err);
			} else {
				res.status(204).end();
			}
		});
	} catch (err) {
		next(err);
	}
});

//---post/add---

router.post("/register", async (req, res, next) => {
	try {
		const { username, password } = req.body;
		const user = await Users.getBy({ username }).first();

		if (user) {
			return res.status(409).json({
				message: "Username is already exist",
			});
		}

		const newUser = await Users.add({
			username,
			password: await bcrypt.hash(password, 12), // hash the password with time complexity "12"
		});

		res.json(newUser);
	} catch (err) {
		next(err);
	}
});

router.post("/login", async (req, res, next) => {
	try {
		const { username, password } = req.body;
		const user = await Users.getBy({ username }).first();

		if (!user) {
			return res.status(401).json({
				message: "Invalid Credentials",
			});
		}

		// check if the password is valid before letting to log in
		// hash the password again and see if it matches what we have in the database
		const passwordValid = await bcrypt.compare(password, user.password);

		if (!passwordValid) {
			return res.status(401).json({
				message: "Invalid Credentials",
			});
		}

		// generate a new session for this user
		// and sends back a session ID
		req.session.user = user;

		res.json({
			message: `Welcome ${user.username}`,
		});
	} catch (err) {
		next(err);
	}
});

// extra routes

router.get("/users/:id", async (req, res, next) => {
	try {
		const user = await Users.getById(req.params.id);
		if (!user) {
			return res.status(404).json({
				message: "No user is found.",
			});
		}
		res.json(user);
	} catch (err) {
		next(err);
	}
});

router.delete("/users/:id", async (req, res, next) => {
	try {
		const user = await Users.remove(req.params.id);
		res.json({
			message: "The user was successfully removed.",
		});
	} catch (err) {
		next(err);
	}
});

router.put("/users/:id", async (req, res, next) => {
	try {
		const user = await Users.update(req.params.id, req.body);
		res.json(user);
	} catch (err) {
		next(err);
	}
});

module.exports = router;
