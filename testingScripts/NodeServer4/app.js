const express = require('express');
const app = express();

app.use(function(req, res, next){
	res.status(200);
	res.json({
		message: "Yes",
	});
});

module.exports = app;