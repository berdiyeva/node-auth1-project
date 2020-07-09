const express = require("express");
const Users = require("./users-model");
const router = express.Router();

router.get("/users", async (req, res, next) => {
	try {
		const users = await Users.get();
		res.json(users);
	} catch (err) {
		next(err);
	}
});

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

router.post("/users", async (req, res, next) => {
	try {
		const newUser = await Users.add(req.body);
		res.json(newUser);
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
