import { Link } from "react-router-dom";
function TestsTableRow({ match, test, deleteTest }) {
  return (
    <tr role="row">
      <td>{test.id}</td>
      <td>{test.name}</td>
      <td>{test.details}</td>
      <td style={{ display: "flex" }}>
        <Link to={`${match.url}/view/${test.id}`}>
          <button className="btn btn-sm btn-outline-primary mr-1">View</button>
        </Link>
        <Link to={`${match.url}/edit/${test.id}`}>
          <button className="btn btn-sm btn-outline-secondary mr-1">
            Edit
          </button>
        </Link>
        <button
          className="btn btn-sm btn-outline-danger"
          onClick={(e) => deleteTest(test.id)}
        >
          Delete
        </button>
      </td>
    </tr>
  );
}

export default TestsTableRow;
