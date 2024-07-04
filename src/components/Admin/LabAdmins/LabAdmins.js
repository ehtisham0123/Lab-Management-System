import { useState, useEffect } from "react";
import LabAdminsTableRow from "./LabAdminsTableRow";
import { reactLocalStorage } from "reactjs-localstorage";
import axios from "axios";
import { Link } from "react-router-dom";
import Pagination from "./Pagination";
import Spinner from '../../Spinner.png';

function LabAdmins({ match, location }) {
  const token = reactLocalStorage.get("token");
  const [loading, setLoading] = useState(false);
  const [labAdmins, setLabAdmins] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [labAdminsPerPage, setLabAdminsPerPage] = useState(5);
  const indexOfLastLabAdmin = currentPage * labAdminsPerPage;
  const indexOfFirstLabAdmin = indexOfLastLabAdmin - labAdminsPerPage;
  const currentLabAdmins = labAdmins.slice(
    indexOfFirstLabAdmin,
    indexOfLastLabAdmin
  );

  useEffect(() => {
    setLoading(true);
    let getUsersData = async () => {
      await axios
        .get(`http://localhost:5000/admin/lab-admins/`,{
          headers: {
            token: token,
          },
        })
        .then((response) => {
          if (response.data) {
            setLabAdmins(response.data.result);
            setLoading(false);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getUsersData();
  }, []);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const deleteLabAdmin = async (id) => {
    await axios.delete(`http://localhost:5000/admin/lab-admins/${id}`,{
          headers: {
            token: token,
          },
        }).then((res) => {
      const newLabAdmins = labAdmins.filter((labAdmin) => labAdmin.id !== id);
      setLabAdmins(newLabAdmins);
    });
  };

  const searchLabAdmin = async (name) => {
    setLoading(true);
    await axios
      .get(`http://localhost:5000/admin/lab-admins/${name}`,{
          headers: {
            token: token,
          }
        })
      .then((response) => {
        if (response.data) {
          setLabAdmins(response.data.result);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div id="content" className="p-4">
      <div className="card-body">
        <h3 className="card-title text-center">Lab Admins table</h3>
        <div className="row d-flex align-items-center justify-content-between mr-1">
          <div>
            <input
              type="search"
              className="form-control"
              placeholder="Search"
              onChange={(e) => searchLabAdmin(e.target.value)}
            />
          </div>
          <Link to={`${match.url}/create`}>
            <button className="btn btn-outline-primary mr-1">
              <i className="fa fa-user-plus"></i> Add Lab Admin
            </button>
          </Link>
        </div>

        <table
          className="table table-responsive dataTable mt-3"
          role="grid"
          style={{ minHeight: "350px"}}
        >
          <thead>
            <tr role="row">
              <th style={{ minWidth: "70px" }}>#</th>
              <th style={{ minWidth: "100px" }}>Name</th>
              <th style={{ minWidth: "270px" }}>Email</th>
              <th style={{ minWidth: "100px" }}>City</th>
              <th style={{ minWidth: "50px" }}>Gender</th>
              <th style={{ minWidth: "100px" }}>Contact</th>
              <th style={{ minWidth: "100px" }}>Actions</th>
            </tr>
          </thead>
           {loading ? (
              <div className="loading">
                  <img src={Spinner} className="loader" alt="loader" />
                  <h2>Loading</h2>
              </div>
            ) : (
          <tbody>
           
              {currentLabAdmins.map((labAdmin) => (
                <LabAdminsTableRow match={match} labAdmin={labAdmin} deleteLabAdmin={deleteLabAdmin}/>
              ))}
          </tbody>
            )}
        </table>

        <div className="row d-flex align-items-center">
          <div className="col-8 col-md-3 ">
            Showing {indexOfFirstLabAdmin + 1} to {indexOfLastLabAdmin} of{" "}
            {labAdmins.length} entities
          </div>
          <div class="col-4">
            <label>
              <select
                class="form-control"
                onChange={(e) => {
                  setLabAdminsPerPage(e.target.value);
                }}
                value={labAdminsPerPage}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
              </select>
            </label>
          </div>
          <div className="col-12 col-md-4 d-flex justify-content-center">
            <Pagination
              labAdminsPerPage={labAdminsPerPage}
              totalLabAdmins={labAdmins.length}
              paginate={paginate}
              currentPage={currentPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LabAdmins;
