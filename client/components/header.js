import React from 'react'
import { Link } from 'react-router'

const Header = (props) => (
	<div className="row" style={{backgroundColor:"black",color:"white"}}>
		<div className="col-xs-3 col-xs-offset-1 col-sm-3 col-sm-offset-1 col-md-3 col-md-offset-1 col-lg-3 col-lg-offset-1">
			<center>
				<h4 className="text-center">
					Check out our music!
				</h4>
				<ul style={{listStyleType:"none","margin":0,"padding":0}}>
					<a href="http://youtube.com/user/stanfordraagapella/">
						<img width="48px" height="48px" src="/images/social-media-icons/youtube.png" />
					</a>
					<a href="https://play.spotify.com/artist/5Q6bZAB4lnENIQK22rGJu1" style={{margin:0}}>
						<img width="48px" height="48px" src="/images/social-media-icons/spotify.png" />
					</a>
					<a href="http://soundcloud.com/stanfordraagapella">
						<img width="48px" height="48px" src="/images/social-media-icons/soundcloud.png" />
					</a>
				</ul>
			</center>
		</div>
		<div className="col-xs-4 col-sm-4 col-md-4 col-lg-4">
			<Link to="/">
				<img src="/images/logo.png" className="img img-responsive"/>
			</Link>
		</div>
		<div className="col-xs-3 col-sm-3 col-md-3 col-lg-3">
			<center>
				<h4 className="text-center">
					Get in touch with us!
				</h4>
	  			<ul style={{listStyleType:"none","margin":0,"padding":0}}>
	        		<a href="mailto:business@raagapella.com" style={{margin:0}}>
	          			<img width="48px" height="48px" src="/images/social-media-icons/email.png" />
	        		</a>
			        <a href="http://facebook.com/stanfordraagapella">
			          	<img width="48px" height="48px" src="/images/social-media-icons/facebook.png" />
			        </a>
			        <a href="http://twitter.com/raagapella">
			          	<img width="48px" height="48px" src="/images/social-media-icons/twitter.png" />
			        </a>
				</ul>
			</center>
		</div>
	</div>
)

export default Header
