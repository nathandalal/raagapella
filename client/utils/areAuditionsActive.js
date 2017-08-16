import moment from 'moment'

module.exports.areAuditionsActive = () => {
	let now = moment(new Date())
	let currentYear = now.year()

	let validDateRanges = [
		//spring -> apr is 3
		[moment.utc(new Date(currentYear, 3, 1)), moment.utc(new Date(currentYear, 3, 15))],
		//fall -> sep is 8, oct is 9
		[moment.utc(new Date(currentYear, 8, 1)), moment.utc(new Date(currentYear, 9, 1))]   
	]

	var auditionsActive = false

	validDateRanges.forEach(dateTuple => {
		if (now.isAfter(dateTuple[0]) && now.isBefore(dateTuple[1])) {
			auditionsActive = true
		}
	})

	return auditionsActive
}