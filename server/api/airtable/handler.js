import Airtable from 'airtable'
import { AIRTABLE } from '../env'
let base = new Airtable({ apiKey: AIRTABLE.API_KEY }).base(AIRTABLE.BASE)

import SlackHandler from '../slack/handler'
import MailgunHandler from '../mailgun/handler'

module.exports.getRoster = () => new Promise((resolve, reject) => {
	base('Members').select({
    	view: "Current Members"
	}).firstPage((error, records) => {
		if(error) reject(error)
	    resolve(records.map(record => record._rawJson.fields))
	})
})

module.exports.getAlumRoster = () => new Promise((resolve, reject) => {
	var alums = []
	base('Members').select({
    	view: "Alums"
	}).eachPage(function page(records, fetchNextPage) {
	    alums = alums.concat(records)
	    fetchNextPage()
	}, function done(error) {
	    if (error) reject(error)
	    resolve(alums.map(record => record._rawJson.fields))
	})
})

module.exports.getEvents = () => new Promise((resolve, reject) => {
	base('Events').select({
		maxRecords: 3,
		sort: [{field: "Time", direction: "desc"}],
    	view: "Main View"
	}).firstPage((error, records) => {
		if(error) reject(error)
	    resolve(records.map(record => record._rawJson.fields))
	})
})

module.exports.getAuditions = () => new Promise((resolve, reject) => {
	base('Auditions').select({
    	view: "Main View"
	}).firstPage((error, records) => {
		if(error) reject(error)
	    resolve(records.map(record => record._rawJson))
	})
})

module.exports.getCallbacks = () => new Promise((resolve, reject) => {
	base('Callbacks').select({
    	view: "Main View"
	}).firstPage((error, records) => {
		if(error) reject(error)
	    resolve(records.map(record => record._rawJson))
	})
})

module.exports.registerAudition = (auditionid, name, email, references) => new Promise((resolve, reject) => {
	console.log(`Registering ${name} (${email}) for an audition.`)
	checkIfPersonExists(name, email)
	.then(person => {
		if(person) {
			console.log("Person already exists in Airtable.")
			return reject({errorString: "You have already registered to sign up for an audition."})
		} else {
			console.log("Verified that person is not already in database.")
			return MailgunHandler.validate(email)
		}
	})
	.then(verified => {
		if(!verified) {
			console.log(`Person did not specify valid email address: ${email}.`)	
			return reject({errorString: "Please enter a valid email address."})
		} else { 
			console.log("Email address is valid, now adding person to Airtable.")
			return createPerson(name, email, references)
		}
	})
	.then(person => {
		return Promise.all([
			person,
			addPersonToBase('Auditions', auditionid, person.id)
		])
	})
	.then(airtabledone => {
		console.log("Person added to airtable, now sending email confirmation and Slack confirmation message.")
		let person = airtabledone[0].fields, audition = airtabledone[1].fields

		resolve(person) // go ahead and tell them the job is done, then send off Slack and emailing tasks
		SlackHandler.write(
			`*${person['Name']}* (_${person["Email"]}_) just signed up for an audition!\n` + 
			(person["Where did you hear about us?"] ? 
				`They found out about us through ${person["Where did you hear about us?"].join(" and ")}.` :
				"They didn't specify how they found out about us.")
		)
		MailgunHandler.send(person, audition, 'audition')
	})
	.catch(reject)
})

module.exports.registerCallback = (callbackid, name, email) => new Promise((resolve, reject) => {
	verifyPerson(name, email)
	.then(person => {
		if(!person) reject({errorString: "Unauthorized to sign up for a callback."})
		return Promise.all([
			person,
			addPersonToBase('Callbacks', callbackid, person.id)
		])
	})
	.then(airtabledone => {
		let person = airtabledone[0].fields, callback = airtabledone[1].fields
		SlackHandler.write(`*${person['Name']}* (_${person["Email"]}_) just signed up for a callback.`)
		MailgunHandler.send(person, callback, 'callback')
		return resolve(callback)
	})
	.catch(reject)
})

let addPersonToBase = (basename, recordid, personid) => new Promise((resolve, reject) => {
	base(basename).update(recordid, {
		"Person": [personid]
	}, (err, record) => {
		if(err) reject(err)
		resolve(record)
	})
})

let createPerson = (name, email, references) => new Promise((resolve, reject) => {
	let newPerson = {
		"Name": name,
		"Email": email
	}
	if(references) newPerson["Where did you hear about us?"] = references

	base('Auditioners').create(newPerson, (err, record) => {
		if(err) reject(err)
		resolve(record)
	})
})

let verifyPerson = (name, email) => new Promise((resolve, reject) => {
	base('Auditioners').select({
    	view: "Main View"
	}).firstPage((error, records) => {
		if(error) resolve(false)
	    let allpeople = records.map(record => record._rawJson)
		resolve(allpeople.find(person => person.fields["Name"] == name && person.fields["Email"] == email && person.fields["Call Them Back?"]))
	})
})

let checkIfPersonExists = (name, email) => new Promise((resolve, reject) => {
	base('Auditioners').select({
    	view: "Main View"
	}).firstPage((error, records) => {
		if(error) resolve(false)
	    let allpeople = records.map(record => record._rawJson)
		resolve(allpeople.find(person => person.fields["Name"] == name || person.fields["Email"] == email))
	})
})
