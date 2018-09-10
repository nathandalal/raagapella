import React, { Component } from 'react'

import { Link } from 'react-router'
import Select from 'react-select'
import { Table, Button } from 'react-bootstrap'

import axios from 'axios'
import moment from 'moment-timezone'

import Header from './header.jsx'
import FormModal from './form-modal.jsx'

import { areAuditionsActive } from '../utils/index'

export default class Auditions extends Component {
	constructor(props) {
		super(props)
		this.state = {
			modalShow: false,
			selectedId: "",

			//form modal data
			name: "",
			email: "",
			references: [],
			phone: ""
		}
		axios.get('/api/auditions').then(response => {
			this.setState({ slots: response.data })
		})

		axios.get('/api/auditionsactive')
		.then(({data}) => this.setState({auditionsActive: data}))
	}

	createSignupModal(slotid, event) {
		this.setState({ selectedId: slotid, modalShow: true })
	}

	renderSignup() {
		let { auditionsActive } = this.state
		return (
			<div>
				{auditionsActive ? <div className="alert alert-info text-center">
					<strong>Quick Note:</strong> Auditions are hosted in <a href={this.state.slots[0].fields["Google Maps Location"]}><span style={{textDecoration:"underline"}}>{this.state.slots[0].fields["Location"]}</span></a> and are {this.state.slots[0].fields["Duration (Minutes)"]} minutes long.<br/><br />
					Please prepare an approximately one minute vocal solo (in any style) that showcases your strengths!<br />
					For questions or concerns, email business@raagapella.com!
				</div> :
				<div className="alert alert-warning text-center">
					Auditions are closed right now. Please check back at the start of the next school year!
				</div>}
				{auditionsActive ? <Table striped bordered condensed hover>
				    <thead>
						<tr>
							<th style={{textAlign: "center"}}>Date</th>
							<th style={{textAlign: "center"}}>Time (PST)</th>
							<th style={{textAlign: "center"}}>Book Your Audition</th>
						</tr>
				    </thead>
				    <tbody>
					{this.state.slots.map(slot => {
						let data = slot.fields
						let time = moment(data["Start Time"])
						
						return (
							<tr key={JSON.stringify(data)}>
								<td style={{textAlign: "center"}}>{time.tz('America/Los_Angeles').format("dddd, M/D/YY")}</td>
								<td style={{textAlign: "center"}}>{time.format("h:mm a")}</td>
								<td style={{textAlign: "center"}}>
									{data["Person"] ?
									<span style={{color:"#d43f3a"}}>Taken</span> :
									<Button 
										bsStyle="primary"
										style={{lineHeight:0.4}}
										onClick={this.createSignupModal.bind(this, slot.id)}>
										Sign Up
									</Button>}
								</td>
							</tr>
						)
					})}
				    </tbody>
				  </Table> : ""}
			</div>
		)
	}

	changeName(event) { this.setState({name:event.target.value})}
	changePhone(event) { this.setState({phone:event.target.value})}
	changeEmail(event) { this.setState({email:event.target.value})}
	changeReferences(values) { this.setState({references:values}) }
	notifyFormSuccess() { this.setState({formSuccess:true,name:"",email:'',references:[]})}

	render() {
		let modalClose = () => this.setState({ modalShow: false })

		return (
			<div>
				<Header />
				<div className="row">
					<div style={{marginTop:'1em'}}></div>
			    	<div className="col-md-8 col-md-offset-2">
			    		{this.state.formSuccess? 
						<div className="alert alert-success text-center">
							<strong>Submitted!</strong> You'll receive an email confirmation soon.
						</div> : ""}
			      		<h1 className="text-center">
			        		Auditions
			      		</h1>
			      		<h3 className="text-center">
			      			Raagapella is an <u>all-gender</u> South Asian focus a cappella group.
			      		</h3>
			      		<center>
			      			<h4>Select from the following timeslots!</h4>
			      			<div>
			      				{this.state.slots ? 
			      				this.renderSignup() :
			      				<span>Loading audition timeslots...</span>}
			      			</div>
			      		</center>
			    	</div>
			  	</div>
			  	<FormModal 
			  		show={this.state.modalShow} onHide={modalClose} 
			  		currentSlot={this.state.slots ? this.state.slots.find(x => x.id == this.state.selectedId) : undefined}
			  		name={this.state.name} email={this.state.email} references={this.state.references} phone={this.state.phone}
			  		changeName={this.changeName.bind(this)} changeEmail={this.changeEmail.bind(this)} changeReferences={this.changeReferences.bind(this)} changePhone={this.changePhone.bind(this)}
			  		notifyFormSuccess={this.notifyFormSuccess.bind(this)}
			  		type="audition" />
			</div>
		)
	}
}