import React from 'react';
import './App.css';
import QuickStartGraph from './components/graph';
import Europe from './components/europe';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
          </ul>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
           renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/">
            <Europe />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
