import React, { Component } from 'react'

import { Link } from 'react-router'

import axios from 'axios'
import moment from 'moment'

import Header from './header.jsx'
import { getPersonImageUrl, areAuditionsActive } from '../utils/index'

export default class Homepage extends Component {
	constructor(props) {
		super(props)
		this.state = {}
		axios.get('/api/roster').then(({data}) => this.setState({roster: data}))
		axios.get('/api/alumroster').then(({data}) => this.setState({alumroster: data}))
		axios.get('/api/auditionsactive').then(({data}) => this.setState({auditionsActive: data}))
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
			      			<iframe width="560" height="315" src="https://www.youtube.com/embed/zBX6bzN1rh0" frameBorder="0" allowFullScreen />
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
			        	<br> AUDITION FOR RAAG at:  https://www.stanfordacappella.com/raag </br>

Stanford Raagapella is Stanford’s all-gender South Asian focus a cappella group.  Since its founding in 2002, Raag has been creating music that explores everything including contemporary Bollywood, Indian classical music, and Western pop.  We take pride in bringing together audiences from around the world with our original musical arrangements.  In addition to singing on campus, Raag travels to perform at national competitions and live showcases around the country.  We have released three albums to date, which can be found on our Youtube and Spotify channels.
			      	</p>
			      	<div style={{marginTop:'1em'}}></div>
			      	<img src="/images/Raag.jpg" className="img img-responsive" />
			    </div>
			 </div>
		)
	}

	renderTeam() {
		let roster = this.state.roster
		if(!roster) return  (
			<div className="text-center">
				Our team is loading and will arrive soon. We're generally late to practice.
			</div>
		)
			
		return (
			<div className="row">
	    		<div className="col-md-8 col-md-offset-2">
	      			<h2 className="text-center">
	        			Who We Are
	      			</h2>
	      			<div style={{marginTop:'1em'}}></div>
	      			<div className="row">
	      			{roster.map(person => (
	        			<div key={person["Name"]} className="col-xs-3 col-sm-3 col-md-3 col-lg-3">
		          			<img src={getPersonImageUrl(person)} className="img img-responsive" />
		          			<div className="text-center">
			            		<h4 style={{marginBottom:0}}>
			              			{person["Name"]}
			            		</h4>
		              			{person["Title"] ? 
		              				<p style={{margin:0}}>
		              					<span>{person["Title"]}<br /></span>
		              					{person["Section"]} {person["Section Leader"] ? "Section Leader" : ""}
		              				</p> :
		              				<p style={{margin:0}}>
		              					<span>{person["Section"]} {person["Section Leader"] ? "Section Leader" : ""}<br /><br /></span>
		              				</p>}
			            		<div style={{marginTop:'1em'}}></div>
		          			</div>
		        		</div>
	        		))}
	        		</div>
   				</div>
  			</div>
		)
	}

	renderAlums() {
		let roster = this.state.alumroster
		if(!roster) return  (
			<div className="text-center">
				Our alums take a very long time to get to practice. Please be patient.
			</div>
		)
			
		return (
			<div className="row">
	    		<div className="col-md-8 col-md-offset-2">
	      			<h2 className="text-center">
	        			Our Alumni
	      			</h2>
	      			<div style={{marginTop:'1em'}}></div>
	      			<div className="row">
	      			{roster.map(person => (
	        			<div key={person["Name"]} className="col-xs-3 col-sm-3 col-md-3 col-lg-3">
		          			<img src={getPersonImageUrl(person)} className="img img-responsive" />
		          			<div className="text-center">
			            		<h4 style={{marginBottom:0}}>
			              			{person["Name"]}
			            		</h4>
		              			{person["Title"] ? 
		              				<p style={{margin:0}}>
		              					<span>{person["Title"]}<br /></span>
		              					{person["Section"]} {person["Section Leader"] ? "Section Leader" : ""}
		              				</p> :
		              				<p style={{margin:0}}>
		              					<span>{person["Section"]} {person["Section Leader"] ? "Section Leader" : ""}<br /><br /></span>
		              				</p>}
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
		if(!this.state.auditionsActive) return ""

		return (
			<div className="alert alert-success text-center">
				<h4 style={{marginBottom:0}}>
				<span style={{paddingRight:"4px"}}>Auditions are now open for {`${moment(new Date()).year().toString()}`}!</span>
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
					{this.renderAlums()}
					<hr />
				</div>
			</div>
		)
	}
}
