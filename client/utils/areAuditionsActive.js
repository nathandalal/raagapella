import moment from 'moment'

module.exports.areAuditionsActive = () => {
	let now = moment(new Date())
	let currentYear = now.year()

	let validDateRanges = [
		[moment.utc(new Date(currentYear, 3, 1)), moment.utc(new Date(currentYear, 3, 15))], //spring
		[moment.utc(new Date(currentYear, 8, 1)), moment.utc(new Date(currentYear, 9, 1))]  //fall
	]

	console.log(validDateRanges)

	var auditionsActive = false

	validDateRanges.forEach(dateTuple => {
		console.log(dateTuple)
		if (now.isAfter(dateTuple[0]) && now.isBefore(dateTuple[1])) {
			auditionsActive = true
		}
	})

	return auditionsActive
}