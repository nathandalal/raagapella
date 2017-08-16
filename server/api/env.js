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
	},
	IMPORTANT_PEOPLE: [
		{
			name: process.env.PERSON1_NAME || "Nathan Dalal",
			email: process.env.PERSON1_EMAIL || "nathanhdalal@gmail.com",
			phone: process.env.PERSON1_PHONE || "(510) 574-6653"
		},
		{
			name: process.env.PERSON2_NAME || "Ronald Tep",
			email: process.env.PERSON2_EMAIL || "rtep@stanford.edu",
			phone: process.env.PERSON2_PHONE || "(864) 202-2733"
		}
	]
}