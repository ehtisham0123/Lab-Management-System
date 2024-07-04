import Home from "../Home";
import Chat from "./Chat/Chat";
import Tests from "./Tests/Tests";
import CreateTest from "./Tests/CreateTest";
import EditTest from "./Tests/EditTest"; 
import Test from "./Tests/Test";
import EditProfile from "./Profile/EditProfile"; 
import Profile from "./Profile/Profile";
import User from "./Users/User";

import { useState } from "react";
import { Link ,Switch ,Route} from "react-router-dom";
import {reactLocalStorage} from 'reactjs-localstorage';


import logo from "../../logo.png";


function LabAdmin({history,match,location}) {
  const checkUsers =  location.pathname.includes("lab-admin/users");
  const checkProfile =  location.pathname.includes("lab-admin/profile");
   const checkChat =  location.pathname.includes("lab-admin/chat");
  
  const checkTests =  location.pathname.includes("lab-admin/tests");
  const checkErollments =  location.pathname.includes("lab-admin/erollments");
  const [active, setActive] = useState(false);
  const avatar = reactLocalStorage.get('user_avatar')

   const logout = ()=>{
    reactLocalStorage.remove('token');
    reactLocalStorage.remove('user_id');
    reactLocalStorage.remove('user_name');
    reactLocalStorage.remove('user_role');
    reactLocalStorage.remove('user_avatar');
    history.push("/lab-admin-login");
  }

  if (!reactLocalStorage.get('token')){
    history.push("/lab-admin-login");
   }
  else if (reactLocalStorage.get('user_role') != 'lab_admin'){
    logout();    
    history.push("/lab-admin-login");
   }

  const toggleClass = () => {
      const currentState = active;
      setActive(!currentState );
  };


  return (
      <div className="wrapper d-flex align-items-stretch">
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
               className={`${location.pathname === "/labAdmin"  ? "active" : ""}`} 
              >
                <a>
                  <span className="fa fa-home mr-3"></span> Home
                </a>
              </li>
            </Link>

             <Link to={`${match.url}/profile`}>
              <li 
              className={`${checkProfile ? "active" : ""}`} 
              >
                <a>
                  <span className="fa fa-user mr-3"></span> Profile
                </a>
              </li>
            </Link>
                     <Link to={`${match.url}/chat`}>
              <li 
              className={`${checkChat ? "active" : ""}`} 
              >
                <a href="">
                  <span className="fa fa-comment mr-3"></span> Chat
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

          <Route exact path={`${match.path}/chat/:id?`}  component={Chat} />  


          <Route path={`${match.path}/profile/edit/`} component={EditProfile}/>
          
          <Route path={`${match.path}/profile/`} component={Profile}/>
                      
             

          <Route exact path={`${match.path}/tests`} component={Tests} />
          
          <Route path={`${match.path}/tests/create`} component={CreateTest}/>
             
          <Route path={`${match.path}/tests/view/:id`} component={Test}/>
                      
          <Route path={`${match.path}/tests/edit/:id`} component={EditTest}/> 
          
          <Route path={`${match.path}/tests/userprofile/:id/:test_id`} component={User}/> 

        </Switch>
        
       <div class="bio-ride">
          <div class="row">
            <div class="col-lg-3 col-md-4 col-sm-4 col-4 ride">
           <img
              src={`/uploads/${avatar}`}
              className=" profile_img"
            />
            </div>
            <div class="col-lg-9 col-md-8 col-sm-8 col-8 ">
                <p>{reactLocalStorage.get('user_name')}</p>   
            </div>
          </div>
          </div>
          
      
      </div>
  );
}

export default LabAdmin;
