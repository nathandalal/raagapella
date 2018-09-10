import { MAILGUN, IMPORTANT_PEOPLE } from '../env'

import moment from 'moment'
import 'moment-timezone'
import ical from 'ics'
import axios from 'axios'
import fs from 'fs'

import SlackHandler from '../slack/handler'

// can no longer use mailgun api for email validation as is only a paid feature
module.exports.validate = (email) => new Promise((resolve, reject) => {
	let emailregex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
	resolve(emailregex.test(email))
})

module.exports.send = (person, event, type) => new Promise((resolve, reject) => {
	var mailgun = require('mailgun-js')({apiKey: MAILGUN.API_KEY, domain: MAILGUN.DOMAIN})

	let rightmoment = moment.utc(event["Start Time"])

	let date = rightmoment.tz('America/Los_Angeles').format("M/D/YYYY")
	let time = rightmoment.tz('America/Los_Angeles').format("h:mm A")

	var options = {
		eventName: `${type[0].toUpperCase() + type.slice(1)} for Raagapella`,
		filename: `${type}.ics`,
		dtstart: rightmoment.toDate(),
		dtend: moment.utc(rightmoment).add(event["Duration (Minutes)"], "minutes").toDate(),
		location: event["Location"],
		organizer: {
			name: 'Stanford Raagapella',
			email: 'business@raagapella.com'
		}
	}

	ical.createEvent(options, null, (err, filepath) => {
		if(err) reject({type: "ical formatting error", error: err})
		person["First Name"] = 
		(person["Name"].indexOf(' ') !== -1) ?
			person['Name'].substr(0,person["Name"].indexOf(' ')) :
			person["Name"]
		var data = {
			from: `Stanford Raagapella <no-reply@raagapella.com>`,
			to: `${person["Name"]} <${person["Email"]}>`,
			subject: `Confirming Your Raagapella ${type[0].toUpperCase() + type.slice(1)} on ${date} at ${time}`,
			text: `Hey ${person["First Name"]}!\n\n` +

					`Your ${type} is confirmed for ${date} at ${time}.\n\n` +
					`We'll meet you at ${event["Location"]}.\n` +
					`A Google Maps link is here for your convenience: ${event["Google Maps Location"]}\n` +
					`We'll need you there 15 minutes early to check into your audition.\n` +
					`Please prepare a 60 second vocal piece that demonstrates your strengths!\n\n` +

					(type == "audition" ? "Also, before your audition, please let us know a little more about you at this link: http://bit.ly/RaagapellaAuditionInfo2016\n\n" : "") +

					`We've included a calendar event attachment so you don't forget your ${type}.\n` +
					`If you have any other questions, you can contact:\n` +
					`	• ${IMPORTANT_PEOPLE[0].name} → ${IMPORTANT_PEOPLE[0].phone} (email cc'ed)\n` +
					`	• ${IMPORTANT_PEOPLE[1].name} → ${IMPORTANT_PEOPLE[1].phone} (email cc'ed)\n\n` +

					`Looking forward to seeing you!\n` +
					`Stanford Raagapella`,

			html: `<h3>Hi ${person["First Name"]}! </h3>` +

					`<p>` +
						"Thank you for signing up to audition with Stanford Raagapella! " +
					`</p>` +
					
					`<h4>Scheduled ${type[0].toUpperCase() + type.slice(1)} Time</h4>` +
					`<p>` +
						`Your ${type} is scheduled for <strong>${date}</strong> at <strong>${time}</strong> in <strong>${event["Location"]}</strong> (<a href="${event["Google Maps Location"]}">Google Maps link</a>). <br>` +
						"Please arrive <strong>15 minutes early</strong> to check in. <br>" +
						"<br>" + 

					`<h4>Information Form</h4>` +

					`<p>` +
						`Before your audition, please fill out this <a href="http://bit.ly/RaagapellaAuditionInfo2016">form</a> so that we can learn more about you! ` +
					`</p>` +


					`<h4>${type[0].toUpperCase() + type.slice(1)} Details</h4>` +
					`<p>` +
						"The audition itself will take about <strong>15 minutes</strong>, and we ask that you prepare an approximately <strong>one minute vocal solo</strong> in any style showcasing your strengths. <br><br>" +
						"We intend for auditions to provide an accurate and holistic evaluation of your musical and vocal ability. Among the things we consider are tone, intonation, clarity, and rhythmic accuracy." +
					
					`<h4>Other Logistics</h4>` +
					`<p>` +
						`A calendar event is attached for your convenience.<br><br>` +
						`If you have any questions or concerns, please contact:<br>` +
					`</p>` +
					`<ul>` + 
						`<li>${IMPORTANT_PEOPLE[0].name} → ${IMPORTANT_PEOPLE[0].phone} (email cc'ed)</li>` +
						`<li>${IMPORTANT_PEOPLE[1].name} → ${IMPORTANT_PEOPLE[1].phone} (email cc'ed)</li>` +
					`</ul>` +

					`We look forward to seeing you!<br>` +
					`Stanford Raagapella`,
			attachment: filepath
		}
		if(process.env.NODE_ENV == 'production') {
			data.cc = IMPORTANT_PEOPLE.map(person => `${person.name} <${person.email}>`)
			data.cc.push(`Raagapella Business <business@raagapella.com>`)
		}

		mailgun.messages().send(data, function (error, body) {
			if(error) {
				SlackHandler.write(`Error writing email to *${person["Name"]}* (_${person["Email"]}_). When this happens, my overlord tells me to bring <@U0BFHB2RL> and <@U0BGMJK0F> in to resolve the problem.`)
				reject({type: "mailgun error", error: error})
			}
			console.log(body)
			resolve(data)
		})
	})
})

//MAKESHIFT TESTING CODE - ADD YOUR OWN EMAIL AND UNDO THE COMMENT
let testemailaddress = "nathanhdalal@gmail.com"
//if(process.env.NODE_ENV != "production") module.exports.send({"Name": "Bruh","Email": testemailaddress}, {"Start Time": new Date("2073-8-30"),"Duration (Minutes)": 17,"Location": "A3C Couchroom","Google Maps Location": `https://goo.gl/maps/5X6r8XNwbyo`},'audition')
