import { Link } from "react-router-dom";
function UsersTableRow({match,user,deleteUser}) {
  return (
      <tr role="row">
      <td>{user.id}</td>
      <td>{user.firstname} {user.lastname}</td>
      <td>{user.email}</td>
      <td>{user.city}</td>
      <td>{user.gender}</td>
      <td>{user.contact}</td>
      <td style={{ display: "flex" }}>
        <Link to={`${match.url}/profile/${user.id}`}>
          <button className="btn btn-sm btn-outline-primary mr-1">
            View
          </button>
        </Link>
        <Link to={`${match.url}/edit/${user.id}`}>
          <button className="btn btn-sm btn-outline-secondary mr-1">
            Edit
          </button>
        </Link>
        <button
          className="btn btn-sm btn-outline-danger"
          onClick={(e) => deleteUser(user.id)}
        >
          Delete
        </button>
      </td>
    </tr>
  );
}

export default UsersTableRow;
