import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'

import Homepage from './components/homepage'
import Auditions from './components/auditions'
import Callbacks from './components/callbacks'

ReactDOM.render(
    <Router history={browserHistory}>
        <Route path="/">
            <IndexRoute component={Homepage} />
            <Route path="audition" component={Auditions} />
            <Route path="auditions" component={Auditions} />
            <Route path="callback" component={Callbacks} />
            <Route path="callbacks" component={Callbacks} />
        </Route>
    </Router>,
    document.getElementById('app')
)


