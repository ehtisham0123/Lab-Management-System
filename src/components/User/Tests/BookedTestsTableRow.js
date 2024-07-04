import { Link } from "react-router-dom";
function BookedTestsTableRow({ deleteBooking , match, test   }) {
  return (
    <tr role="row">
      <td>{test.id}</td>
      <td>{test.name}</td>
      <td>{test.details}</td>
      <td style={{ display: "flex" }}>
        <Link to={`/user/tests/view/${test.id}`}>
          <button className="btn btn-sm btn-outline-primary mr-1">View</button>
        </Link>   
           <Link to={`/user/tests/booked-tests/reports/${test.id}`}>
          <button className="btn btn-sm btn-outline-primary mr-1">View Report</button>
        </Link>   
          <button
          className="btn btn-sm btn-outline-danger"
          onClick={(e) => deleteBooking(test.id)}
        >
          Drop Test
        </button>  
      </td>
    </tr>
  );
}

export default BookedTestsTableRow;
