import { useState, useEffect } from "react";
import { reactLocalStorage } from "reactjs-localstorage";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import StarRatings from "react-star-ratings";


function Test() {
  const token = reactLocalStorage.get("token");
  const [reviews, setReviews] = useState([]);
  const [test, setTest] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [newBookings, SetNewBookings] = useState([]);
  
  let { id } = useParams();
  useEffect(() => {
    let getUserData = async () => {
      await axios
        .get(`http://localhost:5000/admin/tests/show/${id}`, {
          headers: {
            token: token,
          },
        })
        .then((response) => {
          if (response.data) {
            setTest(response.data.result[0]);
            setReviews(response.data.reviews);
            setBookings(response.data.bookings);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getUserData();
  }, [newBookings]);
  const deleteReview = async (id) => {
    await axios
      .delete(`http://localhost:5000/user/tests/reviews/${id}`, {
        headers: {
          token: token,
        },
      })
      .then((res) => {
        const newReviews = reviews.filter((review) => review.id !== id);
        setReviews(newReviews);
      });
  };
    const deleteBooking = async (id,user_id) => {
    await axios
      .delete(`http://localhost:5000/admin/tests/booking/test/${id}/user/${user_id}`,
      {
        headers: {
          token: token,
        },
      }
      )
      .then((res) => {
        SetNewBookings(bookings.filter((booking) => booking.id !== id));
        setBookings(newBookings);
      });
  };



  return (
    <div id="content" className="mx-3">
      <div className="container">
        <h3 className="card-title text-center my-5">Test Details</h3>
        <div className="row">
          <div className="col-md-3">
            <div className="card mb-3">
              <div className="card-header">
                <h5 className="card-title mb-0 text-center">Profile</h5>
              </div>
              <div className="card-body text-center">
                <img
                  src={`/uploads/${test.lab_admin_photo}`}
                  alt={test.lab_admin_name}
                  className="img-fluid  mb-2"
                  width="100%"
                />
                <h4 className="card-title mb-0">
                  {test.lab_admin_firstname + " " + test.lab_admin_lastname}
                </h4>
                <div className="text-muted mb-2">Lab Admin</div>

                <div>
                  <Link to={`../../lab-admins/profile/${test.lab_admin_id}`}>
                    <button className="btn btn-outline-primary btn-sm mr-1">
                      View Profile
                    </button>
                  </Link>
                </div>
              </div>
              <hr className="my-0" />
              <div className="card-body">
                <h5 className=" card-title text-center mb-3">Bookings</h5>         

              {bookings.map((booking) => (
              <div>
                <div className="d-flex justify-content-between m-0 p-0">
                  <Link to={`/admin/users/profile/${booking.id}`}>
                    <img
                      src={`/uploads/${booking.avatar}`}
                      alt={test.user_name}
                      width="36"
                      height="36"
                      className="rounded-circle mr-2"
                    />
                   {booking.name}
                  </Link>
                  <Link onClick={(e) => deleteBooking(test.id,booking.id)}>
                  <i class="fa fa-times"></i>
                  </Link>                            
                </div>
                <hr/>
              </div>
               ))}
           

              </div>
              <hr className="my-0" />
            </div>
          </div>
          <div className="col-md-9">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">{test.name}</h5>
              </div>
              <div className="card-body h-100">
                <p className="no-margin-bottom">{test.details} </p>
                <div class="row my-5">
                  <div class="col-6">
                    <div class="row mt-4">
                      <div class="col-6">
                        <p class="mb-0">Cost</p>
                      </div>
                      <div class="col-6">
                        {test.cost}
                      </div>
                    </div>
                    <div class="row mt-4">
                      <div class="col-6">
                        <p class="mb-0">Delivery Time</p>
                      </div>
                      <div class="col-6 mb-5">
                        {test.delivery_time}
                      </div>
                    </div>
                  </div>
                  <div class="col-6">
                    <a href={`http://localhost:3000/uploads/${test.thumbnail}`} target="_blank" >
                      <img
                        src={`/uploads/${test.thumbnail}`}        
                        alt={test.name}
                        height="190"
                        style={{ marginTop: '-20px' }}
                      />
                    </a>
                  </div>
                </div>
                {reviews.map((review) => (
                  <div className="media mb-4">
                    <img
                      src={`/uploads/${review.user_photo}`}
                      alt={test.user_name}
                      width="36"
                      height="36"
                      className="rounded-circle mr-2"
                    />
                    <div className="media-body">
                      <strong>
                        {review.user_firstname} {review.user_Lastname}
                      </strong>{" "}
                      added a review on <strong>{test.name}</strong>'s Test
                         <span
                    className="btn float-right my-2"
                    onClick={(e) => deleteReview(review.id)}
                    >
                    <i className="fa fa-times text-primary"></i>
                  </span>

                      <br />
                      <small className="text-muted">{review.created_at}</small>
                      <div className="row">
                        <div className="col-md-6 text-warning font-weight-bold">
                          <StarRatings
                            rating={review.reviews}
                            starRatedColor="#0275d8"
                            starDimension="20px"
                            starSpacing="2px"
                            numberOfStars={5}
                          />
                        </div>
                      </div>
                      <div className="border text-sm text-muted p-2 mt-1">
                        {review.reviews_details}
                      </div>
                    </div>
                    <hr />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Test;

