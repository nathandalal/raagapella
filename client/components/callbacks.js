import React, { Component } from 'react'

import { Link } from 'react-router'
import Select from 'react-select'
import { Table, Button } from 'react-bootstrap'

import axios from 'axios'
import moment from 'moment'

import Header from './header'
import FormModal from './form-modal'

export default class Callbacks extends Component {
	constructor(props) {
		super(props)
		this.state = {
			modalShow: false,
			selectedId: "",

			//form modal data
			name: "",
			email: ""
		}
		axios.get('/api/callbacks').then(response => {
			this.setState({ slots: response.data })

		})
	}

	createSignupModal(slotid, event) {
		this.setState({ selectedId: slotid, modalShow: true })
	}

	renderSignup() {
		if(moment().isBefore('2016-09-29')) return "Check back later for callbacks!"
		return (
			<div>
				<div className="alert alert-info text-center">
					<strong>Quick Note:</strong> All callbacks are hosted in <a href={this.state.slots[0].fields["Google Maps Location"]}><span style={{textDecoration:"underline"}}>{this.state.slots[0].fields["Location"]}</span></a> and are {this.state.slots[0].fields["Duration (Minutes)"]} minutes long.
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
	notifyFormSuccess() { this.setState({formSuccess:true,name:"",email:''})}

	render() {
		let modalClose = () => this.setState({ modalShow: false })

		return (
			<div>
				<Header />
				<div className="row">
					<div style={{marginTop:'1em'}}></div>
			    	<div className="col-md-8 col-md-offset-2">
			      		<h1 className="text-center">
			        		Callbacks
			      		</h1>
			      		<center>
			      		{this.state.formSuccess? 
						<div className="alert alert-success text-center">
							<strong>Submitted!</strong> You'll receive an email confirmation soon.
						</div> : ""}
			      			<h4>Select from the following timeslots!</h4>
			      			<div>
			      				{this.state.slots ? 
			      				this.renderSignup() :
			      				<span>Loading callback timeslots...</span>}
			      			</div>
			      		</center>
			    	</div>
			  	</div>
			  	<FormModal 
			  		show={this.state.modalShow} onHide={modalClose} 
			  		currentSlot={this.state.slots ? this.state.slots.find(x => x.id == this.state.selectedId) : undefined}
			  		name={this.state.name} email={this.state.email}
			  		changeName={this.changeName.bind(this)} changeEmail={this.changeEmail.bind(this)}
			  		notifyFormSuccess={this.notifyFormSuccess.bind(this)}
			  		type="callback" />
			</div>
		)
	}
}