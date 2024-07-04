import { useState, useEffect } from "react";
import { reactLocalStorage } from "reactjs-localstorage";
import LocationShowModal from "../../LocationShowModal";

import axios from "axios";
import { Link, useParams } from "react-router-dom";

function User() {
  const token = reactLocalStorage.get("token");
  const [user, setUser] = useState([]);
  const [tests, setTests] = useState([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  let { id,test_id} = useParams();


  const [formdata, setFormData] = useState({
    file: "",
  });

  useEffect(() => {
    let getUserData = async () => {
      await axios
        .get(`http://localhost:5000/lab-admin/users/profile/${id}`, {
          headers: {
            token: token,
          },
        })
        .then((response) => {
          if (response.data) {
            setUser(response.data.result[0]);
            setTests(response.data.tests);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getUserData();
  }, []);

   const handlePhoto = (e) => {
    setFormData({ ...formdata, file: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("file", formdata.file);
    fd.append("test_id", test_id);
    fd.append("user_id", id);

    await axios
      .post("http://localhost:5000/lab-admin/tests/reports/create", fd, {
        headers: {
          token: token,
          "Content-Type": "multipart/form-data",
        },
      })
      .then(
        (response) => {
          if (response.data.success) {
            setSuccess(response.data.success);
          } else if (response.data.error) {
            setError(response.data.error);
          }
        },
        (error) => {
          console.log(error);
        }
      );
  };

  return (
    <div id="content" className="mx-5">
      <div className="text-center my-5 ">
        <h2>User Information</h2>
      </div>
      <div className="row">
        <div className="col-md-4 mb-5">
          <div className="profile-img">
            <img src={`/uploads/${user.avatar}`} alt={user.name} />
          </div>
        </div>
        <div className="col-md-8">
          <div className="row">
            <div className="col-md-10">
              <div className="profile-head">
                <h2 className="text-primary d-flex justify-content-between align-items-center">
                  {user.name}
                  <Link to={`../../chat/${user.id}`}>
                    <button className="btn btn-outline-primary">
                      <i class="fa fa-message"></i> Massage
                    </button>
                  </Link>
                </h2>
                <ul className="list-unstyled mb-0">
                  <li className="mt-4">
                    <i className="fa fa-home mr-2"></i>
                    Lives in
                    <span className="ml-1 text-primary"> {user.city}</span>
                  </li>

                  <li className="mt-2">
                    <i className="fa fa-map-marker mr-2"></i>
                    From
                    <span className="ml-1 text-primary">
                      {" "}
                      {user.country}
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
                  Registered Tests
                </a>
              </li>  
              <li className="nav-item">
                <a
                  className="nav-link"
                  id="reports-tab"
                  data-toggle="tab"
                  href="#reports"
                  role="tab"
                  aria-controls="reports"
                  aria-selected="true"
                >
                 Reports
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
                      {user.firstname} {user.lastname}
                    </p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <h5 className="headings">Email</h5>
                  </div>
                  <div className="col-md-6">
                    <p>{user.email}</p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <h5 className="headings">Phone</h5>
                  </div>
                  <div className="col-md-6">
                    <p>{user.contact}</p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <h5 className="headings">Gender</h5>
                  </div>
                  <div className="col-md-6">
                    <p>{user.gender}</p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <h5 className="headings">House Number</h5>
                  </div>
                  <div className="col-md-6">
                    <p>
                      {user.housenumber ? user.housenumber : <p>Null </p>}
                    </p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <h5 className="headings">Street Number</h5>
                  </div>
                  <div className="col-md-6">
                    <p>
                      {user.streetnumber ? (
                        user.streetnumber
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
                    <p>{user.state ? user.state : <p>Null </p>}</p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <h5 className="headings">Postal Code</h5>
                  </div>
                  <div className="col-md-6">
                    <p>{user.postalcode}</p>
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
                      latitude={user.latitude}
                      longitude={user.longitude}
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
                    <div className="col-12">
                      <h5 className="headings">{test.name}</h5>
                    </div>
                  </div>
                ))}
              </div>
              <div
                className="tab-pane fade"
                id="reports"
                role="tabpanel"
                aria-labelledby="reports-tab"
              >
                

            <form onSubmit={handleSubmit} className="border p-5">
              <div className="row">
                <div className="form-group col-md-12 mt-1">
                  <label for="file"> Attach File </label>
                  <br />
                  <input
                    id="file"
                    type="file"
                    name="file"
                    className="form-control-file input"
                    onChange={handlePhoto}
                  />
                </div>
                {success && (
              <div className="form-group col-md-12">
                <div class="alert alert-success" role="alert">
                  {success}
                </div>
              </div>
            )}
            {error && (
              <div className="form-group col-md-12">
                <div class="alert alert-da" role="alert">
                  {error}
                </div>
              </div>
            )}
                <div className="form-group col-md-12 mt-1">
                  <button type="submit" className="form-control input btn btn-primary">
                    Submit
                  </button>
                </div>
              </div>
            </form>



                  
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default User;
