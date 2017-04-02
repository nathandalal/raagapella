import { MAILGUN } from '../env'

import moment from 'moment'
//import 'moment-timezone'
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

module.exports.send = (person, event, type) => new Promise((resolve, reject) => {
	console.log(MAILGUN, event)
	var mailgun = require('mailgun-js')({apiKey: MAILGUN.API_KEY, domain: MAILGUN.DOMAIN})
	let rightmoment = moment.utc(new Date(event["Start Time"]))
	console.log(rightmoment)
	//let date = rightmoment.tz('America/Los_Angeles').format("M/D/YYYY")
	//let time = rightmoment.tz('America/Los_Angeles').format("h:mm A")
	let date = "4/5/2019"
	let time = "3:23 PM"

	var options = {
		eventName: `${type[0].toUpperCase() + type.slice(1)} for Raagapella`,
		filename: `${type}.ics`,
		dtstart: rightmoment.toDate(),
		dtend: rightmoment.toDate(),//moment.utc(rightmoment).add(event["Duration (Minutes)"], "minutes").toDate(),
		location: event["Location"],
		organizer: {
			name: 'Stanford Raagapella',
			email: 'business@raagapella.com'
		}
	}
	console.log(options)

	ical.createEvent(options, null, (err, filepath) => {
		console.log("aqui en ical")
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
					`Please arrive 5 minutes early with a 30-60 second vocal piece that plays to your strengths.\n\n` +

					(type == "audition" ? "Also, before your audition, please let us know a little more about you at this link: http://bit.ly/RaagapellaAuditionInfo2016\n\n" : "") +

					`We've included a calendar event attachment so you don't forget your ${type}.\n` +
					`If you have any other questions, you can contact:\n` +
					`	• Ronald Tep → (864) 202-2733 (email cc'ed)\n` +
					`	• Kuhan Jeyapragasan → (650) 284-6611 (email cc'ed)\n\n` +

					`Looking forward to seeing you!\n` +
					`Stanford Raagapella`,

			html: `<h3>Hey ${person["First Name"]}!</h3>` +

					`<h4>${type[0].toUpperCase() + type.slice(1)} Details</h4>` +
					`<p>` +
						`Your ${type} is confirmed for <strong>${date}</strong> at <strong>${time}</strong>.<br>` +
						`We'll meet you at ${event["Location"]}. Here's a <a href="${event["Google Maps Location"]}">Google Maps link</a>.<br>` +
						"Please arrive 5 minutes early with a <strong>30-60 second vocal piece</strong> that plays to your strengths." +
						"<br><br>" + 

						(type == "audition" ? `Also, before your audition, please let us know a little more about you <a href="http://bit.ly/RaagapellaAuditionInfo2016">at this link</a>.` : "") +
					`</p>` +

					`<h4>Other Logistics</h4>` +
					`<p>` +
						`We've included a calendar event attachment so you don't forget your ${type}.<br>` +
						`If you have any other questions, you can contact:<br>` +
					`</p>` +
					`<ul>` + 
						`<li>Ronald Tep → (864) 202-2733 (email cc'ed)</li>` +
						`<li>Kuhan Jeyapragasan → (650) 284-6611 (email cc'ed)</li>` +
					`</ul>` +

					`Looking forward to seeing you!<br>` +
					`Stanford Raagapella`,
			attachment: filepath
		}
		//if(process.env.NODE_ENV == 'production') data.cc = ["Ronald Tep <rtep@stanford.edu>", "Kuhan Jeyapragasan <kuhanj@stanford.edu>", "Nathan Dalal <nathanhd@stanford.edu>"]

		mailgun.messages().send(data, function (error, body) {
			console.log("aqui en mailgun")
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
