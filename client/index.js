import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'

import Homepage from './components/homepage'
import Auditions from './components/auditions'

ReactDOM.render(
    <Router history={browserHistory}>
        <Route path="/">
            <IndexRoute component={Homepage} />
            <Route path="auditions" component={Auditions} />
        </Route>
    </Router>,
    document.getElementById('app')
)


