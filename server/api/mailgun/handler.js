import { MAILGUN } from '../env'
import moment from 'moment'
import 'moment-timezone'
import axios from 'axios'

import SlackHandler from '../slack/handler'

module.exports.validate = (email) => new Promise((resolve, reject) => {
	axios.get(`https://api.mailgun.net/v3/address/validate?address=${encodeURIComponent(email)}&api_key=${MAILGUN.PUBLIC_API_KEY}`)
	.then(res => {
		console.log(res.data)
		resolve(res.data.is_valid)
	})
	.catch(e => resolve(false))
})

module.exports.send = (person, event, type) => {
	var mailgun = require('mailgun-js')({apiKey: MAILGUN.API_KEY, domain: MAILGUN.DOMAIN})
	let rightmoment = moment(event["Start Date"])

	var data = {
		from: `Stanford Raagapella <no-reply@mailer.raagapella.com>`,
		to: person["Email"],
		subject: `Confirming Your Raagapella ${type[0].toUpperCase() + type.slice(1)}`,
		text: `Hey ${person['Name'].substr(0,person["Name"].indexOf(' '))}!\n\n` +
				`Your ${type} is confirmed for ${rightmoment.tz('America/Los_Angeles').format("M/D/YYYY")} at ${rightmoment.tz('America/Los_Angeles').format("h:mm A")}.\n` +
				`We'll meet you at ${event["Location"]}. If you're lost, you can call (510) 574-6653 for directions.\n\n` +
				(type == "audition" ? "Also, before your audition, please let us know a little more about you at this link: http://bit.ly/RaagapellaAuditionInfo2016.\n\n" : "") +
				`Looking forward to seeing you!\n` +
				`Stanford Raagapella`
	}

	mailgun.messages().send(data, function (error, body) {
		if(error) {
			console.error(error)
			return SlackHandler.write(`Error writing email to *${person["Name"]}* (_${person["Email"]}_).`)
		}
		console.log(body)
	})
}

module.exports.validate("fdadjfkljadjfkladjflkjadklfjkldajfkljdakldlfa@cs.stanford.edu")
.then(res => {
	if(res) console.log('yep')
	else console.log('nope')
})
