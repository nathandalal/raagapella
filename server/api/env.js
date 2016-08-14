if (process.env.NODE_ENV != 'production') require('dotenv').load()
module.exports = {
	MONGO: {
		URL: process.env.MONGODB_URI || "mongodb://localhost/raagapella-dev"
	},
	GOOGLE: {
		FIREBASE: {
			apiKey: process.env.FIREBASE_API_KEY,
		    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
		    databaseURL: process.env.FIREBASE_DATABASE_URL,
		    storageBucket: process.env.FIREBASE_STORAGE_BUCKET
		}
	}
}