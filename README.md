# Covaid

A mutual aid platform for local aid efforts to organize/match volunteers to those in need of support.

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
git clone https://github.com/debanik1997/covaid
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
npm run client
```

End with an example of getting some data out of the system or using it for a little demo


### General Project Breakdown

Generally, the project is broken down into the client and server. The server runs locally on localhost:5000 and the client runs on localhost:3000. To access the front end, just paste the client url into your browser. 

### Detailed Project Breakdown
    
    ├── package.json                   # Packages being used for backend
    ├── client                         # Frontend for Coviad
    │   ├── package.json               # Packages being used for frontend
    │   ├── public                     # Files being served in deployed version
    │   ├── src                        # React files
    │       ├── App.js                 # Main file for frontend
    │       ├── VolunteerPortal.js     # Main volunteer page 
    │       ├── OrganizationPortal.js  # Main organization page 
    │       ├── location_tools         # Location related components


## Code Change Process

The Covaid repo is broken down into master, staging, and prestaging. Any should be made off of prestaging and tested in staging/prestaging before merging into master. 


## Deployment

Add additional notes about how to deploy this on a live system