# Raagapella Website

This website specifically contains information about the a cappella group Stanford Raagapella.

Server-side connections to email notifications for auditionees (Mailgun), internal Slack notifications, and Airtable lookups are in the **/api** folder. Look at the **/api/index.js** file to see how the API handles requests, as this is the entry point for the API and all of your calls will reach this file. Look to existing code in there for examples.

The frontend code, in the **/client** folder, is written in React, which uses Javascript to manipulate HTML and display it on the browser. Common functions are placed in the **/client/utils** folder and the different elements of the website are placed in the **/client/components** section. React is very similar to a mix of HTML and Javascript, and the frontend codebase should be easy enough to edit and mess with.

A rundown of how the site works and how things are actually structured is below if you need more explanation. Follow installation and usage instructions below as well.

# React-Redux Express Template

A dead-simple template to demonstrate the use of React and Redux to render robust frontends that can communicate with an extensible backend API. This allows for an end-to-end full-stack application with maximum customizability and ease of use.

The directory structure for the app provides a location to provide frontend routes, React components, and Redux actions and reducers. It also provides a dead-simple boilerplate API from Express Router and shows how to work with an API in Redux on the most basic level.

## Purpose

Provide a React and Redux template that actually makes sense and doesn't have wild dependencies. This allows people to make robust web applications with React, communicating with any API that you want, even your own!

## How to Install

Clone this repository or download a .zip version of this repo to gain acces to this folder. Run the following commands into your terminal after navigating to this folder.

``` 
npm install
npm run dev
```

Work with the app and the components in the **src** folder to play with React and Redux. Have fun!

## Usage

Update the router in the **/api** folder to create any custom routes. Install MongoDB or Postgres or whatever data service your would like and integrate it into your API. 

Once you have more data to feed into your application, you can follow the Redux API communication made in the Redux **/client/actions** folder to figure out how to add information from the API into your state using the **redux-promise** package.

Then you can wire up any React components to React-Redux containers in order to render the data passed by your API.

Congratulations! You have a customizable backend that can talk to a customizable frontend. It's easy to build on this dead-simple template.

This template **fully supports ES6** features, on both the client and the server side. Enjoy!