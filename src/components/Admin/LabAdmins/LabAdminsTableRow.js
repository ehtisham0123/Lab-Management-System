import { Link } from "react-router-dom";
function labAdminsTableRow({match,labAdmin,deleteLabAdmin}) {
  return (
      <tr role="row">
      <td>{labAdmin.id}</td>
      <td>{labAdmin.firstname} {labAdmin.lastname}</td>
      <td>{labAdmin.email}</td>
      <td>{labAdmin.city}</td>
      <td>{labAdmin.gender}</td>
      <td>{labAdmin.contact}</td>
      <td style={{ display: "flex" }}>
        <Link to={`${match.url}/profile/${labAdmin.id}`}>
          <button className="btn btn-sm btn-outline-primary mr-1">
            View
          </button>
        </Link>
        <Link to={`${match.url}/edit/${labAdmin.id}`}>
          <button className="btn btn-sm btn-outline-secondary mr-1">
            Edit
          </button>
        </Link>
        <button
          className="btn btn-sm btn-outline-danger"
          onClick={(e) => deleteLabAdmin(labAdmin.id)}
        >
          Delete
        </button>
      </td>
    </tr>
  );
}

export default labAdminsTableRow;
