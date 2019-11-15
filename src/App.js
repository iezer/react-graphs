import React from 'react';
import './App.css';
import QuickStartGraph from './components/graph';
import Europe from './components/europe';
import WorldMap from './components/WorldMap';
import TestForce from './components/TestForce';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import markers from './data';

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/europe">Europe</Link>
            </li>
            <li>
              <Link to="/test">Test Force</Link>
            </li>
          </ul>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
           renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/europe">
            <Europe />
          </Route>

          <Route path="/test">
            <TestForce />
          </Route>

        </Switch>
      </div>
    </Router>
  );
}

export default App;
