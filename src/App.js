import "./App.css";
import {reactLocalStorage} from 'reactjs-localstorage';

import Home from "./Home";
import Admin from "./components/Admin/Admin";
import LabAdmin from "./components/LabAdmin/LabAdmin";
import User from "./components/User/User";

import AdminLogin from "./components/Admin/AdminLogin";
import LabAdminLogin from "./components/LabAdmin/LabAdminLogin";
import LabAdminSignup from "./components/LabAdmin/LabAdminSignup";
import UserLogin from "./components/User/UserLogin";
import UserSignup from "./components/User/UserSignup";

import { Link, Switch, Route } from "react-router-dom";
import { useState } from "react";

import logo from "./logo.png";

function App({ location,history }) {



  const [active, setActive] = useState(false);
  const toggleClass = () => {
    const currentState = active;
    setActive(!currentState);
  };
  return (
    <div className="App">
      <Switch>
        <Route path="/admin" component={Admin} />
        <Route path="/lab-admin" component={LabAdmin} />
        <Route path="/user" component={User} />

        <div className="wrapper d-flex align-items-stretch"  >
          <nav id="sidebar" className={active ? "active" : null}>
            <div className="custom-menu">
              <button
                type="button"
                id="sidebarCollapse"
                className="btn btn-primary"
                onClick={toggleClass}
              ></button>
            </div>
            <div
              className="img bg-wrap text-center py-4"
            >
              <div className="user-logo">
                <div
                  className="img"
                  style={{ backgroundImage: "url(" + logo + ")" }}
                ></div>
                <h3>Online Diagnostic Hub</h3>
              </div>
            </div>
            <ul className="list-unstyled components mb-5">
              <Link to={`/`}>
                <li className={`${location.pathname === "/" ? "active" : ""}`}>
                  <a href="">
                    <span className="fa fa-home mr-3"></span>
                    Home
                  </a>
                </li>
              </Link>
              <Link to={`/admin-login`}>
                <li
                  className={`${
                    location.pathname === "/admin-login" ? "active" : ""
                  }`}
                >
                  <a href="">
                    <span className="fa fa-sign-in mr-3"></span>
                    Admin Login
                  </a>
                </li>
              </Link>
              
                <Link to={`/user-signup`}>
                <li
                  className={`${
                    location.pathname === "/user-signup" ? "active" : ""
                  }`}
                >
                  <a href="">
                    <span className="fa fa-user-plus mr-3"></span>
                    User Registration
                  </a>
                </li>
              </Link>
              <Link to={`/user-login`}>
                <li
                  className={`${
                    location.pathname === "/user-login" ? "active" : ""
                  }`}
                >
                  <a href="">
                    <span className="fa fa-sign-in mr-3"></span>
                    User Login
                  </a>
                </li>
              </Link>
              <Link to={`/lab-admin-signup`}>
                <li
                  className={`${
                    location.pathname === "/lab-admin-signup" ? "active" : ""
                  }`}
                >
                  <a href="">
                    <span className="fa fa-user-plus mr-3"></span>
                    Lab Admin Registration
                  </a>
                </li>
              </Link>
              <Link to={`/lab-admin-login`}>
                <li
                  className={`${
                    location.pathname === "/lab-admin-login" ? "active" : ""
                  }`}
                >
                  <a href="">
                    <span className="fa fa-sign-in mr-3"></span>
                    Lab Admin Login
                  </a>
                </li>
              </Link>

              
            </ul>
          </nav>

          <Route exact path="/" component={Home} />
          <Route path="/admin-login" component={AdminLogin} />
          <Route path="/lab-admin-login" component={LabAdminLogin} />
          <Route path="/lab-admin-signup/" component={LabAdminSignup} />
          <Route path="/user-login" component={UserLogin} />
          <Route path="/user-signup" component={UserSignup} />
        </div>
      </Switch>
    </div>
  );
}

export default App;
