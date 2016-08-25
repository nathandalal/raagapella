import React, { Component } from 'react'

import { Link } from 'react-router'
import Select from 'react-select'
import { Modal, Button, FormGroup, FormControl, ControlLabel, HelpBlock } from 'react-bootstrap'

import axios from 'axios'
import moment from 'moment'

import Header from './header'

let FieldGroup = ({ id, label, help, ...props }) => (
    <FormGroup controlId={id}>
		<ControlLabel>{label}</ControlLabel>
		<FormControl {...props} />
		{help && <HelpBlock>{help}</HelpBlock>}
    </FormGroup>
)

export default class FormModal extends Component {
	constructor(props) {
		super(props)
		this.state = { errorText: "", failure: false, loading: false }
	}

	componentWillReceiveProps(nextProps) {
		this.setState({ errorText: "", failure: false, loading: false })
	}

	submitForm() {
		this.setState({errorText: "", failure: false, loading: true})
		if(this.props.name == "") return this.setState({failure: true, loading: false, errorText: "Please provide your name."})
		if(this.props.email == "") return this.setState({failure: true, loading: false, errorText: "Please provide an email."})
		axios.put(`/api/${this.props.type}s`, {
			id: this.props.currentSlot.id,
			name: this.props.name,
			email: this.props.email,
			references: this.props.type == "callback" ? undefined : this.props.references.map(x => x.label)
		})
		.then(success => {
			this.props.notifyFormSuccess()
			window.setTimeout(() => window.location.reload(), 4000)
			this.props.onHide()
		})
		.catch(e => this.setState({ failure: true, errorText: e.data.reason.errorString, loading: false }))
	}

	render() {
		let slot = this.props.currentSlot

		return (
		<Modal show={this.props.show} onHide={this.props.onHide} bsSize="large" aria-labelledby="contained-modal-title-lg">
			<Modal.Header closeButton>
		  		<h1 id="contained-modal-title-lg">{`${this.props.type[0].toUpperCase() + this.props.type.slice(1)} for Raagapella!`}</h1>
			</Modal.Header>
			<Modal.Body>
				{slot ? 
				<h3>
					You're signing up for a {slot.fields["Duration (Minutes)"]}-minute slot at {moment(slot.fields["Start Time"]).format("h:mm a")} on {moment(slot.fields["Start Time"]).format("dddd, MMMM Do")}.
				</h3> : ""}
				<hr />

				{this.props.type == "callback" ? "Please enter in your information exactly as you did for your audition." : ""}
				{this.state.failure ? 
				<div className="alert alert-danger">
					<span><strong>Form submission failed! </strong>{this.state.errorText || "An internal server error occured. Please try again later."}</span>
				</div> : ""}

		  		<FieldGroup
		  			label="Name"
					id="nameusertext"
					name="name"
					type="text"
					value={this.props.name}
					onChange={this.props.changeName}
					placeholder="Suhas Suresha"
			    />
		  		<FieldGroup
		  			label="Stanford Email"
					id="emailusertext"
					name="email"
					type="text"
					value={this.props.email}
					onChange={this.props.changeEmail}
					placeholder="genmaxx@stanford.edu"
			    />
		  		{this.props.type == "callback" ? "" : <h5>Where did you hear about us?</h5>}
		  		{this.props.type == "callback" ? "" : <Select
				    name="references"
				    id="referencesusertext"
				    placeholder="Choose as many as you want!"
				    value={this.props.references}
				    options={["White Plaza","Social Media","Mailing List","Word of Mouth"].map(str => ({value: str, label: str}))}
				    onChange={this.props.changeReferences}
				    multi={true}
				/>}
			</Modal.Body>
			<Modal.Footer>
		  		<Button onClick={this.props.onHide}>Close</Button>
		  		<Button bsStyle="primary" onClick={this.submitForm.bind(this)} disabled={this.state.loading}>Submit</Button>
			</Modal.Footer>
		</Modal>
      	)
	}
}