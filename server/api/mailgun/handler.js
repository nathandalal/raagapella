import { MAILGUN } from '../env'

import moment from 'moment'
import 'moment-timezone'
import ical from 'ics'
import axios from 'axios'
import fs from 'fs'

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

	let rightmoment = moment(event["Start Time"])
	let date = rightmoment.tz('America/Los_Angeles').format("M/D/YYYY")
	let time = rightmoment.tz('America/Los_Angeles').format("h:mm A")

	var options = {
		eventName: `${type[0].toUpperCase() + type.slice(1)} for Raagapella`,
		filename: `${type}.ics`,
		dtstart: rightmoment.toDate(),
		dtend: moment(rightmoment).add(event["Duration (Minutes)"], "minutes").toDate(),
		location: event["Location"],
		organizer: {
			name: 'Stanford Raagapella',
			email: 'business@raagapella.com'
		}
	};
	ical.createEvent(options, null, (err, filepath) => {
		if(err) console.error(err)
		var data = {
			from: `Stanford Raagapella <no-reply@mailer.raagapella.com>`,
			to: `${person["Name"]} <${person["Email"]}>`,
			subject: `Confirming Your Raagapella ${type[0].toUpperCase() + type.slice(1)} on ${date} at ${time}`,
			text: `Hey ${person['Name'].substr(0,person["Name"].indexOf(' '))}!\n\n` +
					`Your ${type} is confirmed for ${date} at ${time}.\n\n` +
					`We'll meet you at ${event["Location"]}.\n` +
					`A Google Maps link is here for your convenience: ${event["Google Maps Location"]}\n` +
					`If you get lost, you can call Nathan Dalal at (510) 574-6653 for directions.\n\n` +
					(type == "audition" ? "Also, before your audition, please let us know a little more about you at this link: http://bit.ly/RaagapellaAuditionInfo2016\n\n" : "") +
					`We've included a calendar event attachment so you don't forget your ${type}.\nIf you have any other questions, contact Ronald Tep (cc'ed).\n\n` +
					`Looking forward to seeing you!\n` +
					`Stanford Raagapella`,
			html: `<h3>Hey ${person['Name'].substr(0,person["Name"].indexOf(' '))}!</h3>` +
					`Your ${type} is confirmed for <strong>${date}</strong> at <strong>${time}</strong>.<br><br>` +
					`We'll meet you at ${event["Location"]}. Here's a <a href="${event["Google Maps Location"]}">Google Maps link</a>.<br>` +
					`If you get lost, you can call Nathan Dalal at (510) 574-6653 for directions.` +
					"<br><br>" + 
					(type == "audition" ? `Also, before your audition, please let us know a little more about you <a href="http://bit.ly/RaagapellaAuditionInfo2016">at this link</a>.<br><br>` : "") +
					`We've included a calendar event attachment so you don't forget your ${type}.<br>If you have any other questions, contact Ronald Tep (cc'ed).<br><br>Looking forward to seeing you!<br>` +
					`Stanford Raagapella`,
			attachment: filepath
		}
		if(process.env.NODE_ENV == "production") data['cc'] = "Ronald Tep <rtep@stanford.edu>"
		else data['cc'] = "Nathan Dalal <nathanhd@stanford.edu>"

		mailgun.messages().send(data, function (error, body) {
			if(error) {
				console.error(error)
				return SlackHandler.write(`Error writing email to *${person["Name"]}* (_${person["Email"]}_). When this happens, my overlord tells me to bring @ronaldtep in to resolve the problem.`)
			}
			console.log(body)
		})
	})
}

//module.exports.send({"Name": "Nathan Dalal","Email": "nathanhdalal@gmail.com"}, {"Start Time": new Date("2016-8-30"),"Duration (Minutes)": 30,"Location": "A3C Couchroom","Google Maps Location": `https://goo.gl/maps/5X6r8XNwbyo`},'audition')
