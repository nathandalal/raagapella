if (process.env.NODE_ENV != 'production') require('dotenv').load()
module.exports = {
	MONGO: {
		URL: process.env.MONGODB_URI || "mongodb://localhost/raagapella-dev"
	},
	AIRTABLE: {
		API_KEY: process.env.AIRTABLE_API_KEY,
		BASE: process.env.AIRTABLE_BASE
	},
	SLACK: {
		WEBHOOK: process.env.SLACK_WEBHOOK
	},
	MAILGUN: {
		API_KEY: process.env.MAILGUN_API_KEY,
		PUBLIC_API_KEY: process.env.MAILGUN_PUBLIC_API_KEY,
		DOMAIN: process.env.MAILGUN_DOMAIN
	}
}