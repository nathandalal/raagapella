import React, { Component } from 'react'
import Header from './header'

import { Link } from 'react-router'

export default class Auditions extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		return (
			<div>
				<Header />
				<div className="row">
					<div style={{marginTop:'1em'}}></div>
			    	<div className="col-md-8 col-md-offset-2">
			      		<h2 className="text-center">
			        		Auditions
			      		</h2>
			      		<center>
				      		Audition signups will be live soon. Check back before school begins.<br />
				      		<Link to="/" className="btn btn-primary">Back to Main Site</Link>
			      		</center>
			    	</div>
			  	</div>
			</div>
		)
	}
}