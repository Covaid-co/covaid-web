import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import Home from './Home'
import CompleteOffer from './CompleteOffer'

function App() {

  return (
  	<Router>
        <Switch>
          <Route exact path="/completeOffer" component={CompleteOffer}/>
          <Route path="/" component={Home}/>
          <Route path="*" component={Home}/>
        </Switch>
    </Router>
  );
}

export default App;