import React, { Component } from 'react'

import { Link } from 'react-router'

import Header from './header'
import roster from '../utils/roster'

export default class Homepage extends Component {
	constructor(props) {
		super(props)
	}

	renderYoutubeVideo() {
		return (
			<div className="row">
				<div style={{marginTop:'1em'}}></div>
		    	<div className="col-md-8 col-md-offset-2">
		      		<h2 className="text-center">
		        		Listen to us!
		      		</h2>
		      		<center>
			      		<div className="video-container">
			      			<iframe width="560" height="315" src="https://www.youtube.com/embed/2jdosaY897w" frameBorder="0" allowFullScreen />
			      		</div>
		      		</center>
		    	</div>
		  	</div>
		)
	}

	renderAboutUs() {
		return (
			<div className="row">
			    <div className="col-md-8 col-md-offset-2">
			      	<h2 className="text-center">
			        	About Us
			      	</h2>
			      	<p>
			        	Raagapella is Stanford University's all-male South Asian a cappella group. With a repertoire of Bollywood pop, traditional cultural music, and original fusion pieces, Raagapella has sung in venues ranging from dorms to stadiums including the Hollywood Bowl and has toured across the United States and India. Two-time winners of the National South Asian A Cappella Championship, the group has also received critical acclaim for its debut album Raags to Riches, and performed several times alongside composer A.R. Rahman and other stars of Indian film music.
			      	</p>
			      	<div style={{marginTop:'1em'}}></div>
			      	<img src="/images/group-2015-2016.jpg" className="img img-responsive" />
			    </div>
			 </div>
		)
	}

	renderTeam() {
		return (
			<div className="row">
	    		<div className="col-md-8 col-md-offset-2">
	      			<h2 className="text-center">
	        			Who We Are
	      			</h2>
	      			<div style={{marginTop:'1em'}}></div>
	      			<div className="row">
	      			{roster.map(person => (
	        			<div key={person.name} className="col-xs-3 col-sm-3 col-md-3 col-lg-3">
		          			<img src={`/images/people/${person.name.split(" ").join("-").toLowerCase()}.jpg`} className="img img-responsive" />
		          			<div className="text-center">
			            		<h4 style={{marginBottom:0}}>
			              			{person.name}
			            		</h4>
			            		<p style={{margin:0}}>
			              			{person.position ? <span>{person.position}<br /></span> : ""}
			             			{person.section} {person.sectionLeader ? "Section Leader" : ""}
			            		</p>
			            		<div style={{marginTop:'1em'}}></div>
		          			</div>
		        		</div>
	        		))}
	        		</div>
   				</div>
  			</div>
		)
	}

	renderAuditionsAreLive() {
		return (
			<div className="alert alert-success text-center">
				<h4 style={{marginBottom:0}}>
				<span style={{paddingRight:"4px"}}>Auditions are now open for 2016!</span>
				<Link to="/auditions">Sign up here.</Link>
				</h4>
			</div>
		)
	}

	render() {
		return (
			<div>
				<Header />
				{this.renderAuditionsAreLive()}
				<div className="container">
					{this.renderYoutubeVideo()}
					<hr />
					{this.renderAboutUs()}
					<hr />
					{this.renderTeam()}
					<hr />
				</div>
			</div>
		)
	}
}