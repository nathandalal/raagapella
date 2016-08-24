import { MAILGUN } from '../env'
import moment from 'moment'
import axios from 'axios'

import SlackHandler from '../slack/handler'

module.exports.send = (person, event, type) => {
	var mailgun = require('mailgun-js')({apiKey: MAILGUN.API_KEY, domain: MAILGUN.DOMAIN})
	var data = {
		from: `No-Reply Stanford Raagapella <${type}s@mailer.raagapella.com>`,
		to: person["Email"],
		subject: `Confirming Your Raagapella ${type[0].toUpperCase() + type.slice(1)}`,
		text: `Hey ${person['Name'].substr(person["Name"].indexOf(' ')+1)}!\n\n` +
				`Your ${type} is confirmed for ${moment(event["Start Date"]).format("M/D/YYYY")} at ${moment(event["Start Date"]).format("h:mm A")}.\n` +
				`We'll meet you at ${event["Location"]}. If you're lost, you can call (510) 574-6653 for directions.\n\n` +
				`Looking forward to seeing you!\n` +
				`Stanford Raagapella`
	}

	mailgun.messages().send(data, function (error, body) {
		if(error) {
			console.log(error)
			return SlackHandler.write(`Error writing email to ${person["Name"]} (${person["Email"]})`)
		}
		console.log(body)
	})
}