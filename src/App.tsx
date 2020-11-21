import React from 'react';
import { Switch, Route, Redirect, Link} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery/dist/jquery.min.js';
import LayoutComponent from './Components/LayoutComponent'


function App() {
  return (
      <div className="App">
          <div>
              <div className="container">
                  <div className="jumbotron">
                      <h1>User Scrapbook</h1>
                      <p>React, Mobx, Node, Express, MongoDB, TypeScript...</p>
                  </div>
              </div>

              <div className="container">
                  <div className="row">
                      <div className="col-lg-12">
                          <ul className="nav nav-tabs">
                              <li className="nav-item" >
                                  <Link className="nav-link active" to="/users">Users</Link>
                              </li>
                              {/* <li className="nav-item" >
                                  <Link className="nav-link" to="/tasks">Tasks</Link>
                              </li> */}
                          </ul>
                      </div>
                  </div>
                  <br />
                  <LayoutComponent></LayoutComponent>
              </div>
          </div>
      </div>
  );
}

export default App;
