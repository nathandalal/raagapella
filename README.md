# Raagapella Website

This website specifically contains information about the a cappella group Stanford Raagapella.

Server-side connections to email notifications for auditionees (Mailgun), internal Slack notifications, and Airtable lookups are in the **/api** folder. Look at the **/api/index.js** file to see how the API handles requests, as this is the entry point for the API and all of your calls will reach this file. Look to existing code in there for examples.

The frontend code, in the **/client** folder, is written in React, which uses Javascript to manipulate HTML and display it on the browser. Common functions are placed in the **/client/utils** folder and the different elements of the website are placed in the **/client/components** section. React is very similar to a mix of HTML and Javascript, and the frontend codebase should be easy enough to edit and mess with.

A rundown of how the site works and how things are actually structured is below if you need more explanation. Follow installation and usage instructions below as well.

## How to Install Locally

Clone this repository or download a .zip version of this repo to gain acces to this folder. Run the following commands into your terminal after navigating to this folder.

``` 
npm install
npm run dev
```

Contact me for environmental variable access.
