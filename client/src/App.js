import React from 'react';
import {ToastProvider} from 'react-toast-notifications'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Home from './Home'
import CompleteOffer from './CompleteOffer'
import InternalRequests from './InternalRequests'
import Verify from './Verify'
import Welcome from './Welcome'
import ResetPassword from './ResetPassword'
import ResetAssociationPassword from './ResetAssociationPassword'
import OrganizationPortal from './OrganizationPortal'
import VolunteerPortal from './VolunteerPortal'

function App() {

  return (
    <ToastProvider>
  	<Router>
        <Switch>
          <Route exact path="/completeOffer" component={CompleteOffer}/>
          <Route exact path="/internal/requests" component={InternalRequests}/>
          <Route exact path="/organizationPortal" component={OrganizationPortal}/>
          <Route exact path="/volunteerPortal" component={VolunteerPortal}/>
          <Route exact path="/verify" component={Verify}/>
          <Route exact path="/welcome" component={Welcome}/>
          <Route exact path="/resetPassword" component={ResetPassword}/>
          <Route exact path="/resetAssociationPassword" component={ResetAssociationPassword}/>
          <Route path="/" component={Home}/>
          <Route path="*" component={Home}/>
        </Switch>
    </Router>
    </ToastProvider>
  );
}

export default App;