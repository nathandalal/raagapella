import express from 'express'
import favicon from 'serve-favicon'
import http from 'http'

import apiRoutes from './api/index'

const app = express()
const port = process.env.PORT || 7777

app.use('/api', apiRoutes)

app.use(favicon(__dirname + '/../public/favicon.ico'))
app.use(express.static('public'))
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')

app.get('*', (req, res) => {
    res.render('pages/index', {
        
    })
})

const server = http.createServer(app)

server
    .listen(port)
    .on('listening', () => {
        console.log(`Server listening on http://localhost:${port}`)
    })
