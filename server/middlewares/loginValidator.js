const { regexEmail, regexPassword } = require("../helpers");
const loginValidator = async (req, res, next) => {
	try {
		console.log(req.body);
		const { user, password } = req.body;
		if (!user.match(regexEmail)) return res.status(202).send({ status: "Success", message: "Unvalid email" });
		if (!password.match(regexPassword)) return res.status(202).send({ status: "Success", message: "Unvalid password" });
		next();
	} catch (err) {
		next(err);
	}
};

module.exports = loginValidator;
