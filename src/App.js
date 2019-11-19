import React from 'react';
import './App.css';
import Europe from './components/europe';
import TestForce from './components/TestForce';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

function App() {
  return (
    <Router>
      <div>

        {/* A <Switch> looks through its children <Route>s and
           renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/test">
            <TestForce />
          </Route>

          <Route path="/">
            <Europe />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
