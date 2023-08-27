import React from 'react';
import './App.css';

import {
  BrowserRouter as Router,
//  Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import Home from './Home';
import MariaDBAccount from './MariaDBAccount';
import MatrixAccount from './MatrixAccount';
import MariaDBAccountVerify from './MariaDBAccountVerify';
import MatrixAccountVerify from './MatrixAccountVerify';

function App() {
  return (
    <Router>
      <main>
        <nav className="navbar navbar-expand navbar-dark bg-dark" aria-label="Second navbar example">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">Accounts</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarsExample02" aria-controls="navbarsExample02" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarsExample02">
              <ul className="navbar-nav me-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/create-MariaDB-account">
                    MariaDB</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <Switch>
          <Route path="/verify-MariaDB-account/:token" component={MariaDBAccountVerify} />
          <Route path="/verify-Matrix-account/:token" component={MatrixAccountVerify} />
          <Route path="/create-MariaDB-account">
            <MariaDBAccount />
          </Route>
          <Route path="/create-matrix-account">
            <MatrixAccount />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </main>
    </Router>
  );
}

export default App;
