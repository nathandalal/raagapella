if (process.env.NODE_ENV != 'production') require('dotenv').load()
module.exports = {
	MONGO: {
		URL: process.env.MONGODB_URI || "mongodb://localhost/raagapella-dev"
	}
}