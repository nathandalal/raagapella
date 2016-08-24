import Airtable from 'airtable'
import { AIRTABLE } from '../env'
let base = new Airtable({ apiKey: AIRTABLE.API_KEY }).base(AIRTABLE.BASE)

import SlackHandler from '../slack/handler'
import MailgunHandler from '../mailgun/handler'

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
	createPerson(name, email, references)
	.then(person => {
		return Promise.all([
			person,
			addPersonToBase('Auditions', auditionid, person.id)
		])
	})
	.then(airtabledone => {
		let person = airtabledone[0].fields, audition = airtabledone[1].fields
		SlackHandler.write(
			`*${person['Name']}* (_${person["Email"]}_) just signed up for an audition!\n` + 
			(person["Where did you hear about us?"] ? 
				`They found out about us through ${person["Where did you hear about us?"].join(" and ")}.` :
				"They didn't specify how they found out about us.")
		)
		MailgunHandler.send(person, audition, 'audition')
		return resolve(audition)
	})
	.catch(reject)
})

module.exports.registerCallback = (auditionid, name, email) => new Promise((resolve, reject) => {
	base('Callbacks').select({
    	view: "Main View"
	}).firstPage((error, records) => {
		if(error) reject(error)
	    resolve(records.map(record => record._rawJson))
	})
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

	base('People').create(newPerson, (err, record) => {
		if(err) reject(err)
		resolve(record)
	})
})

