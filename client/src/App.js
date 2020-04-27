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
import NeedAHand from './NeedAHand'
import ResetPassword from './ResetPassword'
import ResetAssociationPassword from './ResetAssociationPassword'
import OrganizationPortal from './OrganizationPortal'
import VolunteerPortal from './VolunteerPortal'
import OrgAdminRegister from './OrgAdminRegister'
import OrgReset from './OrgReset';

function App() {

  return (
    <ToastProvider>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
      <link href="https://fonts.googleapis.com/css?family=Baloo+Chettan+2:400&display=swap" rel="stylesheet"></link>
      <Router>
          <Switch>
            <Route exact path="/completeOffer" component={CompleteOffer}/>
            <Route exact path="/internal/requests" component={InternalRequests}/>
            <Route exact path="/organizationPortal" component={OrganizationPortal}/>
            <Route exact path="/volunteerPortal" component={VolunteerPortal}/>
            <Route exact path="/verify" component={Verify}/>
            <Route exact path="/welcome" component={Welcome}/>
            <Route exact path="/request-support" component={NeedAHand}/>
            <Route exact path="/resetPassword" component={ResetPassword}/>
            <Route exact path="/resetAssociationPassword" component={ResetAssociationPassword}/>
            <Route exact path="/orgAdmin" component={OrgAdminRegister} />
            <Route exact path="/orgPasswordReset" component={OrgReset} />
            <Route path="/" component={Home}/>
            <Route path="*" component={Home}/>
          </Switch>
      </Router>
    </ToastProvider>
  );
}

export default App;