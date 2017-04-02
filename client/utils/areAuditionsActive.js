import moment from 'moment'

module.exports.areAuditionsActive = () => {
	let now = moment(new Date())
	let currentYear = moment(new Date()).year()
	let auditionsActive =   (
								(now.isAfter(new Date(`4-01-${currentYear}`))
								&& now.isBefore(new Date(`4-15-${currentYear}`)))
							|| (now.isAfter(new Date(`9-01-${currentYear}`))
								&& now.isBefore(new Date(`10-01-${currentYear}`)))
							)
	return auditionsActive
}