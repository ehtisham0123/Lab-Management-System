import { useState, useEffect } from "react";
import { reactLocalStorage } from "reactjs-localstorage";
import axios from "axios";
import { Link } from "react-router-dom";

import BookedTestsTableRow from "./BookedTestsTableRow";
import Pagination from "./Pagination";
import Spinner from "../../Spinner.png";

function BookedTests({ match, location }) {
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
        .get(`http://localhost:5000/user/tests/booked`,{
          headers: {
            token: token,
          } 
        })
        .then((response) => {
          if (response.data) {
            console.log(response.data.tests)
            setTests(response.data.tests);
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

  const deleteBooking = async (id) => {
    await axios
      .delete(`http://localhost:5000/user/tests/booking/${id}`,{
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
      .get(`http://localhost:5000/user/tests/booked/${name}`, {
        headers: {
          token: token,
        },
      })
      .then((response) => {
        if (response.data) {
          setTests(response.data.tests);
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
        <h3 className="card-title text-center">Booked Tests table</h3>
        <div className="row d-flex align-items-center justify-content-between mr-1">
          <div>
            <input
              type="search"
              className="form-control"
              placeholder="Search"
              onChange={(e) => searchTest(e.target.value)}
            />
          </div>
          <Link to={`/user/tests`}>
            <button className="btn btn-outline-primary mr-1">
              <i className="fa fa-book mr-1"></i>All Tests
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
              <th style={{ minWidth: "60px" }}>#</th>
              <th style={{ minWidth: "200px" }}>Name</th>
              <th style={{ minWidth: "300px" }}>Details</th>
              <th style={{ minWidth: "100px" }}>Actions</th>
            </tr>
          </thead>
          {loading ? (
            <div className="loading">
              <img src={Spinner} className="loader" alt="Loader" />
              <h2>Loading</h2>
            </div>
          ) : (
            <tbody>
              {currentTests.map((test) => (
                <BookedTestsTableRow
                  deleteBooking={deleteBooking}
                  match={match}
                  test={test}
                />
              ))}
            </tbody>
          )}
        </table>

        <div className="row d-flex align-items-center">
          <div className="col-8 col-md-3 ">
            Showing {indexOfFirstTest + 1} to {indexOfLastTest} of{" "}
            {tests.length} entities
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

export default BookedTests;
