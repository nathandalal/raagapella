import moment from 'moment'
import axios from 'axios'

module.exports.areAuditionsActive = () => {
	axios.get('/api/auditionsactive')
	.then(({data}) => {
		console.log(data)
		return data 
	})
	.catch(e => console.error(e))
}