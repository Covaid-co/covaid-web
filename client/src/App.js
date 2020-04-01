import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Home from './Home'
import CompleteOffer from './CompleteOffer'
import InternalRequests from './InternalRequests'
import Verify from './Verify'
import OrganizationPortal from './OrganizationPortal'

function App() {

  return (
  	<Router>
        <Switch>
          <Route exact path="/completeOffer" component={CompleteOffer}/>
          <Route exact path="/internal/requests" component={InternalRequests}/>
          <Route exact path="/organizationPortal" component={OrganizationPortal}/>
          <Route exact path="/verify" component={Verify}/>
          <Route path="/" component={Home}/>
          <Route path="*" component={Home}/>
        </Switch>
    </Router>
  );
}

export default App;