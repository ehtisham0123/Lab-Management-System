import { useState } from "react";
import { Link ,Switch ,Route} from "react-router-dom";
import {reactLocalStorage} from 'reactjs-localstorage';

import Home from "../Home";

import Chat from "./Chat/Chat";

import BookedTests from "./Tests/BookedTests";
import Tests from "./Tests/Tests";
import Test from "./Tests/Test";

import EditProfile from "./Profile/EditProfile"; 
import Profile from "./Profile/Profile";

import LabAdmin from "./LabAdmins/LabAdmin";

import logo from "../../logo.png";
import FileViewer from "./FileViewer";


function User({history,match,location}) {
  const checkUsers =  location.pathname.includes("user/users");
  const checkProfile =  location.pathname.includes("user/profile");
  const checkTests =  location.pathname.includes("user/tests");
  const checkChat =  location.pathname.includes("user/chat");
  const checkErollments =  location.pathname.includes("user/erollments");
  const [active, setActive] = useState(false);
  const avatar = reactLocalStorage.get('user_avatar')
const logout = () => {
    reactLocalStorage.remove('token');
    reactLocalStorage.remove('user_id');
    reactLocalStorage.remove('user_role');
    reactLocalStorage.remove('user_avatar');
    reactLocalStorage.remove('user_name');
    history.push("/user-login");
  }

  if (!reactLocalStorage.get('token')){
    history.push("/user-login");
   }
  else if (reactLocalStorage.get('user_role') != 'user'){
    logout();    
    history.push("/user-login");
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
               className={`${location.pathname === "/user"  ? "active" : ""}`} 
              >
                <a href="">
                  <span className="fa fa-home mr-3"></span> Home
                </a>
              </li>
            </Link>

             <Link to={`${match.url}/profile`}>
              <li 
              className={`${checkProfile ? "active" : ""}`} 
              >
                <a href="">
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
                <a href="">
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
             
          <Route exact path={`${match.path}/tests/booked-tests`} component={BookedTests} />
                       
          <Route
            path={`${match.path}/tests/booked-tests/reports/:id`}
            component={FileViewer}
          /> 
  
          <Route path={`${match.path}/tests/view/:id`} component={Test}/>
                      
          <Route path={`${match.path}/tests/userprofile/:id`} component={User}/> 

          <Route path={`${match.path}/tests/lab-admin-profile/:id`} component={LabAdmin}/> 


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

export default User;
