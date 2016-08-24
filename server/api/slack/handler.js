import { SLACK } from '../env'
import axios from 'axios'

module.exports.write = (text) => axios.post(SLACK.WEBHOOK, {text: text})