# Covaid

A mutual aid platform for local aid efforts to organize/match volunteers with those in need of support.

Live site: [here](https://covaid.co)!

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

Packages to install

```
brew install node
npm install -g create-react-app

```

### Installing

Copy the repo

```
git clone https://github.com/Covaid-co/covaid-web
cd covaid
```

Create a .env file (Contact team for contents of file)
Install npm packages and running the server

```
npm i
npm run dev
```

Install npm packages and running the client

```
cd client
npm i
npm start
```

### General Project Breakdown

Generally, the project is broken down into the client and server. The server runs locally on localhost:5000 and the client runs on localhost:3000. To access the front end, just paste the client url into your browser. 

### Detailed Project Breakdown (Important Files)
    
    ├── package.json                   # Packages being used for server
    ├── client                         # Frontend for Coviad
    │   ├── package.json               # Packages being used for client
    │   ├── public                     # Files being served in deployed version
    │   ├── src                        # React files
    │       ├── App.js                 # Main file for frontend
    │       ├── Homepage.js            # Main landing page
    │       ├── components_homepage    # Components used in landing page
    │       ├── OrganizationPortal.js  # Main organization page 
    │       ├── components_orgpage     # Components used in organization page
    │       ├── VolunteerPortal.js     # Main volunteer page 
    │       ├── location_tools         # Frontend tools to assist with location
    ├── config                         # Necessary server config files
    ├── controllers                    # Backend controllers
    ├── models                         # Models with information regarding 'business logic'
    ├── repositories                   # DB commands
    ├── routes                         # API endpoints
    ├── scheduler                      # Node-Cron jobs 
    ├── services                       # Relevant services for managing workflows
    ├── util                           # Utility files (Emailer, Google Sheets integration)
    ├── index.js                       # Main server file

## Code Change Process

The Covaid repo is broken down into master, staging, and prestaging. Any changes should be made off of prestaging. Create PRs when to prestaging when you are done with a feature. Someone will respond shortly with feedback.
