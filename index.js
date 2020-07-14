const express = require("express");
const helmet = require("helmet"); //?
const cors = require("cors");
const session = require("express-session");
const KnexSessionStore = require("connect-session-knex")(session);
const db = require("./database/config");

const welcomeRouter = require("./database/welcome/welcome");
const usersRouter = require("./users/users-router");

const server = express();
const port = process.env.PORT || 5000;

server.use(helmet());
server.use(cors());
server.use(express.json());
server.use(
	session({
		resave: false, // avaoids recreating sessions that have not changed
		saveUninitialized: false, // comply with GDPR laws
		secret: "keep it secret, keep it safe",
		store: new KnexSessionStore({
			knex: db, // configured instance of Knex, or the live database connection
			createtable: true, // if the session table does not exist, create it
		}),
	})
);

server.use("/", welcomeRouter);
server.use(usersRouter);

server.use((req, res, next) => {
	console.log(err);
	res.status(500).json({
		message: "Something went wrong",
	});
});

server.listen(port, () => {
	console.log(`Running at http://localhost:${port}`);
});
