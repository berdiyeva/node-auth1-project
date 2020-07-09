const db = require("../database/config")

async function add(user){
    const [id] = await db("users").insert(user)
}

function get() {
	return db("users").select("id", "username")
}

function getById(id) {
	return db("users")
		.select("id", "username")
		.where({ id })
		.first()
}

function remove(id) {
    return db("users").where("users.id", id).del()
}

function update(id, changed) {
    return db("users").where("users.id", id).update(changed)
}

module.exports = {
	add,
	get,
    getById,
    remove, 
    update
}
