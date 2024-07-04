import { useState, useEffect } from "react";
import { reactLocalStorage } from "reactjs-localstorage";
import axios from "axios";

function Home() {
  const token = reactLocalStorage.get("token");
  const [response, setResponse] = useState([]);
  useEffect(() => {
    let getUserData = async () => {
      await axios
        .get(`http://localhost:5000/admin/`, {
        headers: {
          token: token,
        },
      })
        .then((response) => {
          if (response.data) {
            setResponse(response.data.result[0]);    
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getUserData();
  }, []);
  return (
   <div id="content" className="p-4 p-md-5 pt-5">
   <h2 className="text-center mb-4">Online Diagnostic Hub</h2>
        <div class="container mt-5">
          <div class="row">
            <div class="col-lg-4 col-md-4 col-sm-6 col-12 mb-2 mt-4">
                <div class="inforide">
                  <div class="row">
                    <div class="col-lg-3 col-md-4 col-sm-4 col-4 ride" style={{backgroundColor: "#6CC785"}}>
                      <span className="fa fa-3x fa-user mr-3"></span>
                    </div>
                    <div class="col-lg-9 col-md-8 col-sm-8 col-8 fontsty">
                        <h4>Users</h4>
                        <h2>{response.users}</h2>
                    </div>
                  </div>
                </div>
            </div>
            <div class="col-lg-4 col-md-4 col-sm-6 col-12 mb-2 mt-4">
                <div class="inforide">
                  <div class="row">
                    <div class="col-lg-3 col-md-4 col-sm-4 col-4 ride" style={{backgroundColor: "#4EBCE5"}}>
                        <span className="fa fa-3x fa-users mr-3"></span>
                   </div>
                    <div class="col-lg-9 col-md-8 col-sm-8 col-8 fontsty">
                        <h4>Lab Admins</h4>
                        <h2>{response.lab_admins}</h2>
                    </div>
                  </div>
                </div>
            </div>
            <div class="col-lg-4 col-md-4 col-sm-6 col-12 mb-2 mt-4">
                <div class="inforide">
                  <div class="row">
                    <div class="col-lg-3 col-md-4 col-sm-4 col-4 ride" style={{backgroundColor: "gray"}}>
                      <span className="fa fa-book fa-3x mr-3" aria-hidden="true"></span>
                    </div>
                    <div class="col-lg-9 col-md-8 col-sm-8 col-8 fontsty">
                        <h4>Tests</h4>
                       <h2>{response.tests}</h2>
                    </div>
                  </div>
                </div>
            </div>
          </div>  
        </div>
      </div>
  );
}

export default Home;



