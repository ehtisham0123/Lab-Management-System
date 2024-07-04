import { Link } from "react-router-dom";
function TestsTableRow({ match, test }) {
  return (
    <tr role="row">
      <td>{test.id}</td>
      <td>{test.name}</td>
      <td>{test.details}</td>
      <td style={{ display: "flex" }}>
        <Link to={`/user/tests/view/${test.id}`}>
          <button className="btn btn-sm btn-outline-primary mr-1">View</button>
        </Link>   
      </td>
    </tr>
  );
}

export default TestsTableRow;
