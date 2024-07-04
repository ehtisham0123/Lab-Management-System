import Home from "../Home";
import Users from "./Users/Users";
import CreateUser from "./Users/CreateUser";
import EditUser from "./Users/EditUser"; 
import User from "./Users/User";

import LabAdmins from "./LabAdmins/LabAdmins";
import CreateLabAdmin from "./LabAdmins/CreateLabAdmin";
import EditLabAdmin from "./LabAdmins/EditLabAdmin"; 
import LabAdmin from "./LabAdmins/LabAdmin";

import Tests from "./Tests/Tests";
import EditTest from "./Tests/EditTest"; 
import Test from "./Tests/Test";

import {useState} from "react";
import { Link ,Switch ,Route} from "react-router-dom";
import {reactLocalStorage} from 'reactjs-localstorage';

import logo from "../../logo.png";


function Admin({history,match,location}) {
  
  const checkUsers =  location.pathname.includes("admin/users");
  const checkLabAdmins =  location.pathname.includes("admin/lab-admins");
  const checkTests =  location.pathname.includes("admin/tests");
  const [active, setActive] = useState(false);

  const logout = ()=>{
    reactLocalStorage.remove('token');
    reactLocalStorage.remove('user_id');
    reactLocalStorage.remove('user_name');
    reactLocalStorage.remove('user_role');
    history.push("/admin-login");
  }

  const toggleClass = () => {
      const currentState = active;
      setActive(!currentState );
  };

  if (!reactLocalStorage.get('token')){
    history.push("/admin-login");
   }
  else if (reactLocalStorage.get('user_role') !== 'admin'){
    logout();    
    history.push("/admin-login");
   
   }


  return (
      <div className="wrAdminer d-flex align-items-stretch">
        <nav id="sidebar" className={active ? 'active': null}>
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
            <Link to={`${match.url}`}>
              <li 
               className={`${location.pathname === "/admin"  ? "active" : ""}`} 
              >
                <a>
                  <span className="fa fa-home mr-3"></span> Home
                </a>
              </li>
            </Link>


           <Link to={`${match.url}/lab-admins`}>
              <li
              className={`${checkLabAdmins ? "active" : ""}`} 
              >
                <a>
                  <span className="fa fa-user mr-3"></span>
                  Lab Admins
                </a>
              </li>
            </Link>              


           <Link to={`${match.url}/users`}>
              <li
              className={`${checkUsers ? "active" : ""}`} 
              >
                <a>
                  <span className="fa fa-user mr-3"></span>
                  Users
                </a>
              </li>
            </Link>   
            <Link to={`${match.url}/tests`}>
              <li
              className={`${checkTests ? "active" : ""}`} 
              >
                <a href="#">
                  <span className="fa fa-book mr-3" aria-hidden="true"></span>
                  Tests
                </a>
              </li>
            </Link>   
            <Link onClick={logout}>
              <li>
                <a>
                   <span className="fa fa-sign-out mr-3" aria-hidden="true"></span>
                    Logout
                </a>  
              </li>
            </Link>    
          </ul>
        </nav>
        <Switch>

          <Route exact path={`${match.path}`}  component={Home} />
    
          <Route exact path={`${match.path}/users`} component={Users} />
          
          <Route path={`${match.path}/users/create`} component={CreateUser}/>
             
          <Route path={`${match.path}/users/profile/:id`} component={User}/>
                      
          <Route path={`${match.path}/users/edit/:id`} component={EditUser}/>
          
          

          <Route exact path={`${match.path}/lab-admins`} component={LabAdmins} />
          
          <Route path={`${match.path}/lab-admins/create`} component={CreateLabAdmin}/>
             
          <Route path={`${match.path}/lab-admins/profile/:id`} component={LabAdmin}/>
                      
          <Route path={`${match.path}/lab-admins/edit/:id`} component={EditLabAdmin}/>



          <Route exact path={`${match.path}/tests`} component={Tests} />
             
          <Route path={`${match.path}/tests/view/:id`} component={Test}/>
                      
          <Route path={`${match.path}/tests/edit/:id`} component={EditTest}/>
             
        </Switch>
      </div>
  );
}

export default Admin;
