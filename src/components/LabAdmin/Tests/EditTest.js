import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { reactLocalStorage } from "reactjs-localstorage";

function EditTest() {
  const token = reactLocalStorage.get("token");
  const [formdata, setFormData] = useState({
    id:"",
    name: "",
    details: "",
    cost: "",
    delivery_time: "",
    thumbnail: "",
    lab_admin_id: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    details: "",
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [file, setFile] = useState('');

  let { id } = useParams();

  useEffect(() => {
    let getTestData = async () => {
      await axios
        .get(`http://localhost:5000/lab-admin/tests/edit/${id}`, {
        headers: {
            token: token,
          },
        })
        .then((response) => {
          if (response.data) {
            setFormData(response.data.result[0]);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getTestData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    switch (name) {
      // checking test name
      case "name":
        if (value.length < 3) {
          setErrors((prevState) => ({
            ...prevState,
            [name]: "Test Name length must be atleast 3 characters",
          }));
        } else if (value.length > 100) {
          setErrors((prevState) => ({
            ...prevState,
            [name]: "Test Name must not exceed 25 characters",
          }));
        } else {
          setErrors((prevState) => ({
            ...prevState,
            [name]: "",
          }));
        }
        break;
      // checking test details
      case "details":
        if (value.length < 8) {
          setErrors((prevState) => ({
            ...prevState,
            [name]: "Test Details length must be atleast 8 characters",
          }));
        } else if (value.length > 1000) {
          setErrors((prevState) => ({
            ...prevState,
            [name]: "Test Details must not exceed 500 characters",
          }));
        } else {
          setErrors((prevState) => ({
            ...prevState,
            [name]: "",
          }));
        }
        break;
      default:
        break;
    }
  };

 const handlePhoto = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    if (errors.name == "" && errors.details == "") {
      const fd = new FormData();
      fd.append("id", formdata.id);
      fd.append("name", formdata.name);
      fd.append("details", formdata.details);
      fd.append("cost", formdata.cost);
      fd.append("delivery_time", formdata.delivery_time);
      fd.append("thumbnail", formdata.thumbnail);
      fd.append("lab_admin_id", formdata.lab_admin_id);
      fd.append('file', file);

      await axios.put(`http://localhost:5000/lab-admin/tests/update`, fd, {
        headers: {
          token: token,
          "Content-Type": "multipart/form-data",
        },
      }).then(
        (response) => {
          if (response.data.success) {
            setSuccess(response.data.success);
            setFormData((prevState) => ({
              ...prevState,
              thumbnail: response.data.thumbnail,
            }));
          }
          else if (response.data.error) {
            setError(response.data.error);
          }
        },
        (error) => {
          console.log(error);
        }
      );
    }
  };

  return (
    <div id="content" className="mx-5">
      <div className="text-center my-5 ">
        <h2>Edit Test</h2>
      </div>
      <form onSubmit={handleSubmit} className="needs-validation">
        <div className="row">
          <div className="form-group col-md-12">
            <label for="name">Test Name</label>
            <input
              type="text"
              name="name"
              className={`form-control input ${errors.name ? "is-invalid" : ""}`}
              id="name"
              placeholder="Test Name"
              onChange={handleChange}
              value={formdata.name}
              required
            />
            {errors.name && (
              <div className="invalid-feedback">{errors.name}</div>
            )}
          </div>
          <div className="form-group col-md-12">
            <label for="details">Details</label>
            <textarea
              name="details"
              className={`form-control input ${errors.details ? "is-invalid" : ""}`}
              id="details"
              placeholder="Details"
              onChange={handleChange}
              value={formdata.details}
              rows="5"
            ></textarea>
            {errors.details && (
              <div className="invalid-feedback">{errors.details}</div>
            )}
          </div>
          <div className="form-group col-md-6">
            <label for="cost">Test Cost</label>
            <input
              type="number"
              name="cost"
              className={`form-control input`}
              id="cost"
              placeholder="Test Cost"
              onChange={handleChange}
              value={formdata.cost}
              required
            />
          </div>
          <div className="form-group col-md-6">
            <label for="delivery_time">Delivery Time</label>
            <input
              type="text"
              name="delivery_time"
              className={`form-control input`}
              id="delivery_time"
              placeholder="Delivery Time"
              onChange={handleChange}
              value={formdata.delivery_time}
              required
            />
          </div>
             <div className="d-flex align-items-center">
            <div className="form-group col-md-6 mt-1">
              <div className="row d-flex align-items-center">
                <div className="form-group col-md-5">
                  <div style={{ width: "100%" }}>
                    <img src={`/uploads/${formdata.thumbnail}`} alt={formdata.name} style={{width:"100%"}}/>        
                  </div>
                </div>
                <div className="form-group col-md-7 mt-5">
                  <label for="thumbnail"> Test Thumbnail </label>
                  <br />
                  <input
                    id="thumbnail"
                    type="file"
                    name="thumbnail"
                    className="form-control-file input"
                    onChange={handlePhoto}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
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
          <div className="form-group col-md-12">
            <button type="submit" className="form-control input btn btn-outline-dark">
              Submit
            </button>
          </div>
        </div>
      </form>>
    </div>
  );
}

export default EditTest;
