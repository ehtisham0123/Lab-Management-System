import FileViewer from "react-file-viewer";
import { useState, useEffect } from "react";
import Spinner from "../Spinner.png";
import { useParams } from "react-router-dom";
import axios from "axios";
import { reactLocalStorage } from "reactjs-localstorage";

function ReportViewer() {
  const [loading, setLoading] = useState(false);
  let { id } = useParams();
  const token = reactLocalStorage.get("token");

    const [booking,setBooking] = useState([])

    useEffect(() => {
    setLoading(true);
    let getUserData = async () => {
      await axios
        .get(`http://localhost:5000/user/tests/reports/${id}`, {
          headers: {
            token: token,
          },
        })
        .then((response) => {
          if (response.data) {
            setBooking(response.data.booking);
            console.log(response.data.booking);
            setLoading(false);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getUserData();
  }, []);







  return (
    <div id="content" className="mx-3 my-5">
      <div className="container">
        {loading ? (
          <div className="loading">
            <img src={Spinner} className="loader" alt="loader" />
            <h2>Loading</h2>
          </div>
        ) : (
          <div className="card my-5">
            <div className="card-body h-100 view_file">

              {booking.file_name ? (
                <FileViewer
                    fileType={booking.file_type}
                    filePath={`/uploads/${booking.file_name}`}
                  />
                ):(
                <div className="my-5">
                    <h3 className="mt-5 text-center">No Report added Yet</h3> 
                </div>         
                )
              }


            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReportViewer;
