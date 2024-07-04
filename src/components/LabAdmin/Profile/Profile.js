import { useState, useEffect } from "react";
import { reactLocalStorage } from "reactjs-localstorage";
import LocationShowModal from "../../LocationShowModal";

import axios from "axios";
import { Link, useParams } from "react-router-dom";

function Profile() {
  const token = reactLocalStorage.get("token");
  const [labAdmin, setLabAdmin] = useState([]);
  const [tests, setTests] = useState([]);
  let { id } = useParams();
  useEffect(() => {
    let getUserData = async () => {
      await axios
        .get(`http://localhost:5000/lab-admin/`, {
          headers: {
            token: token,
          },
        })
        .then((response) => {
          if (response.data) {
            setLabAdmin(response.data.result[0]);
            setTests(response.data.tests);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getUserData();
  }, []);
  return (
    <div id="content" className="mx-5">
      <div className="text-center my-5 ">
        <h2>Lab Admin Profile</h2>
      </div>
      <div className="row">
        <div className="col-md-4 mb-5">
          <div className="profile-img">
            <img src={`/uploads/${labAdmin.avatar}`} alt={labAdmin.name} />
          </div>
        </div>
        <div className="col-md-8">
          <div className="row">
            <div className="col-md-11">
              <div className="profile-head">
                <h2 className="text-primary d-flex justify-content-between align-items-center">
                  {labAdmin.name}
                  <Link to={`../../lab-admin/profile/edit/`}>
                    <button className="btn btn-outline-primary">
                      <i class="fa fa-edit"></i> Edit
                    </button>
                  </Link>
                </h2>
                <ul className="list-unstyled mb-0">
                  <li className="mt-4">
                    <i className="fa fa-home mr-2"></i>
                    Lives in
                    <span className="ml-1 text-primary"> {labAdmin.city}</span>
                  </li>

                  <li className="mt-2">
                    <i className="fa fa-map-marker mr-2"></i>
                    From
                    <span className="ml-1 text-primary">
                      {" "}
                      {labAdmin.country}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-md-12 mt-4">
            <ul className="nav nav-tabs mb-4" id="myTab" role="tablist">
              <li className="nav-item">
                <a
                  className="nav-link active"
                  id="location-tab"
                  data-toggle="tab"
                  href="#location"
                  role="tab"
                  aria-controls="location"
                  aria-selected="true"
                >
                  About
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  id="profile-tab"
                  data-toggle="tab"
                  href="#profile"
                  role="tab"
                  aria-controls="profile"
                  aria-selected="false"
                >
                  Location
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  id="tests-tab"
                  data-toggle="tab"
                  href="#tests"
                  role="tab"
                  aria-controls="tests"
                  aria-selected="true"
                >
                  Tests
                </a>
              </li>
            </ul>

            <div className="tab-content profile-tab mt-2" id="myTabContent">
              <div
                className="tab-pane fade show active"
                id="location"
                role="tabpanel"
                aria-labelledby="location-tab"
              >
                <div className="row">
                  <div className="col-md-6">
                    <h5 className="headings">Name</h5>
                  </div>
                  <div className="col-md-6">
                    <p>
                      {labAdmin.firstname} {labAdmin.lastname}
                    </p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <h5 className="headings">Email</h5>
                  </div>
                  <div className="col-md-6">
                    <p>{labAdmin.email}</p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <h5 className="headings">Phone</h5>
                  </div>
                  <div className="col-md-6">
                    <p>{labAdmin.contact}</p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <h5 className="headings">Gender</h5>
                  </div>
                  <div className="col-md-6">
                    <p>{labAdmin.gender}</p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <h5 className="headings">House Number</h5>
                  </div>
                  <div className="col-md-6">
                    <p>
                      {labAdmin.housenumber ? labAdmin.housenumber : <p>Null </p>}
                    </p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <h5 className="headings">Street Number</h5>
                  </div>
                  <div className="col-md-6">
                    <p>
                      {labAdmin.streetnumber ? (
                        labAdmin.streetnumber
                      ) : (
                        <p>Null</p>
                      )}
                    </p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <h5 className="headings">state</h5>
                  </div>
                  <div className="col-md-6">
                    <p>{labAdmin.state ? labAdmin.state : <p>Null </p>}</p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <h5 className="headings">Postal Code</h5>
                  </div>
                  <div className="col-md-6">
                    <p>{labAdmin.postalcode}</p>
                  </div>
                </div>
              </div>

              <div
                className="tab-pane fade"
                id="profile"
                role="tabpanel"
                aria-labelledby="profile-tab"
              >
                <div className="row">
                  <div className="col-md-12">
                    <LocationShowModal
                      latitude={labAdmin.latitude}
                      longitude={labAdmin.longitude}
                    />
                  </div>
                </div>
              </div>

              <div
                className="tab-pane fade"
                id="tests"
                role="tabpanel"
                aria-labelledby="tests-tab"
              >
                {tests.map((test) => (
                  <div className="row">
                    <div className="col-10">
                      <h5 className="headings">{test.name}</h5>
                    </div>
                    <div className="col-2">
                      <p>
                        <Link to={`/labAdmin/tests/view/${test.id}`}>
                          <button className="btn btn-sm btn-outline-primary mr-1">
                            View
                          </button>
                        </Link>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
