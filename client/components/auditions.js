import React, { Component } from 'react'

import { Link } from 'react-router'
import Select from 'react-select'
import { Table, Button } from 'react-bootstrap'

import axios from 'axios'
import moment from 'moment'

import Header from './header'
import FormModal from './form-modal'

export default class Auditions extends Component {
	constructor(props) {
		super(props)
		this.state = {
			modalShow: false,
			selectedId: "",

			//form modal data
			name: "",
			email: "",
			references: []
		}
		axios.get('/api/auditions').then(response => {
			this.setState({ slots: response.data })
		})
	}

	createSignupModal(slotid, event) {
		this.setState({ selectedId: slotid, modalShow: true })
	}

	renderSignup() {
		return (
			<div>
				<div className="alert alert-info text-center">
					<strong>Quick Note:</strong> All auditions are hosted in <a href={this.state.slots[0].fields["Google Maps Location"]}><span style={{textDecoration:"underline"}}>{this.state.slots[0].fields["Location"]}</span></a> and are {this.state.slots[0].fields["Duration (Minutes)"]} minutes long.<br/><br />
					Please arrive 5 minutes early with a 30-60 second vocal piece that plays to your strengths!<br />
					We want to see your ability as best as possible. Thank you!
				</div>
				<Table striped bordered condensed hover>
				    <thead>
						<tr>
							<th style={{textAlign: "center"}}>Date</th>
							<th style={{textAlign: "center"}}>Time</th>
							<th style={{textAlign: "center"}}>Book Your Audition</th>
						</tr>
				    </thead>
				    <tbody>
					{this.state.slots.map(slot => {
						let data = slot.fields
						return (
							<tr key={JSON.stringify(data)}>
								<td style={{textAlign: "center"}}>{moment(data["Start Time"]).format("M/D/YYYY")}</td>
								<td style={{textAlign: "center"}}>{moment(data["Start Time"]).format("h:mm a")}</td>
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
				  </Table>
			</div>
		)
	}

	changeName(event) { this.setState({name:event.target.value})}
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
			      			Raagapella is an <u>all-male</u> South Asian themed a cappella group.
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
			  		name={this.state.name} email={this.state.email} references={this.state.references}
			  		changeName={this.changeName.bind(this)} changeEmail={this.changeEmail.bind(this)} changeReferences={this.changeReferences.bind(this)}
			  		notifyFormSuccess={this.notifyFormSuccess.bind(this)}
			  		type="audition" />
			</div>
		)
	}
}