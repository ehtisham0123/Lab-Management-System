import { useState, useEffect } from "react";
import { reactLocalStorage } from "reactjs-localstorage";
import axios from "axios";
import { Link } from "react-router-dom";

import TestsTableRow from "./TestsTableRow";
import Pagination from "./Pagination";
import Spinner from "../../Spinner.png";

function Tests({ match, location }) {
  const token = reactLocalStorage.get("token");
  let user_id = reactLocalStorage.get("user_id");
  const [loading, setLoading] = useState(false);
  const [tests, setTests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [testsPerPage, setTestsPerPage] = useState(5);
  const indexOfLastTest = currentPage * testsPerPage;
  const indexOfFirstTest = indexOfLastTest - testsPerPage;
  const currentTests = tests.slice(indexOfFirstTest, indexOfLastTest);

  useEffect(() => {
    setLoading(true);
    let getTestsData = async () => {
      await axios
        .get(`http://localhost:5000/lab-admin/tests/`,{
          headers: {
            token: token,
          } 
        })
        .then((response) => {
          if (response.data) {
            setTests(response.data.result);
            setLoading(false);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getTestsData();
  }, []);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const deleteTest = async (id) => {
    await axios
      .delete(`http://localhost:5000/lab-admin/tests/${id}`,{
        headers: {
          token: token,
        },
      })
      .then((res) => {
        const newTests = tests.filter((test) => test.id !== id);
        setTests(newTests);
      });
  };

  const searchTest = async (name) => {
    setLoading(true);
    await axios
      .get(`http://localhost:5000/lab-admin/tests/${name}`, {
        headers: {
          token: token,
        },
      })
      .then((response) => {
        if (response.data) {
          setTests(response.data.result);
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
        <h3 className="card-title text-center">Tests table</h3>
        <div className="row d-flex align-items-center justify-content-between mr-1">
          <div>
            <input
              type="search"
              className="form-control"
              placeholder="Search"
              onChange={(e) => searchTest(e.target.value)}
            />
          </div>
          <Link to={`${match.url}/create`}>
            <button className="btn btn-outline-primary mr-1">
              <i className="fa fa-user-plus"></i> Add Test
            </button>
          </Link>
        </div>

        <table
          className="table table-responsive dataTable mt-3"
          role="grid"
          style={{ minHeight: "350px" }}
        >
          <thead>
            <tr role="row">
              <th style={{ minWidth: "50px" }}>#</th>
              <th style={{ minWidth: "200px" }}>Name</th>
              <th style={{ minWidth: "500px" }}>Details</th>
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
              {currentTests.map((test) => (
                <TestsTableRow
                  match={match}
                  test={test}
                  deleteTest={deleteTest}
                />
              ))}
            </tbody>
          )}
        </table>

        <div className="row d-flex align-items-center">
          <div className="col-8 col-md-3 ">
            Showing {indexOfFirstTest + 1} to {indexOfLastTest} of{" "}
            {Tests.length} entities
          </div>
          <div class="col-4">
            <label>
              <select
                class="form-control"
                onChange={(e) => {
                  setTestsPerPage(e.target.value);
                }}
                value={testsPerPage}
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
              testsPerPage={testsPerPage}
              totalTests={tests.length}
              paginate={paginate}
              currentPage={currentPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tests;
