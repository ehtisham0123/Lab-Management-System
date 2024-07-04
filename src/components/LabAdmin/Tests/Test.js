import { useState, useEffect } from "react";
import { reactLocalStorage } from "reactjs-localstorage";
import StarRatings from "react-star-ratings";

import axios from "axios";
import { Link, useParams } from "react-router-dom";

function Test() {
  
  const token = reactLocalStorage.get("token");
  const [reviews, setReviews] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [test, setTest] = useState([]);
  let { id } = useParams();
  useEffect(() => {
    let getUserData = async () => {
      await axios
        .get(`http://localhost:5000/lab-admin/tests/show/${id}`, {
        headers: {
          token: token,
        },
      })
        .then((response) => {
          if (response.data) {
            setTest(response.data.result[0]);
            setReviews(response.data.reviews)
            setBookings(response.data.bookings)
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getUserData();
  }, []);

   const deleteBooking = async (id) => {
    await axios
      .delete(`http://localhost:5000/lab-admin/tests/booking/${id}`, {
        headers: {
          token: token,
        },
      })
      .then((res) => {
        const newBookings = bookings.filter((booking) => booking.id !== id);
        setReviews(newBookings);
      });
  };



  return (
    <div id="content" className="mx-3">
   <div className="container">
<h3 className="card-title text-center my-5">Test Details</h3>
<div className="row">
    <div className="col-md-8">
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
                        <img src={`/uploads/${review.user_photo}`} alt={test.user_name} width="36" height="36" className="rounded-circle mr-2"/>
                        <div className="media-body">                 
                            <strong>{review.user_firstname} {review.user_lastname}</strong> added a review on <strong>{test.name}</strong>'s Test
                            <br/>
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
                    <hr/> 
                    </div>
                ))}
            </div>
        </div>
    </div>
    <div className="col-md-4">
            <div className="card mb-3">
              <div className="card-header">
                <h5 className="card-title mb-0 text-center">Bookings</h5>
              </div>
              <div className="card-body">
              {bookings.map((booking) => (
              <div>
                <div className="d-flex justify-content-between m-0 p-0">
                  <Link to={`/lab-admin/tests/userprofile/${booking.id}/${test.id}/`}>
                    <img
                      src={`/uploads/${booking.avatar}`}
                      alt={test.user_name}
                      width="36"
                      height="36"
                      className="rounded-circle mr-2"
                    />
                   {booking.name}
                  </Link>
                  <Link onClick={(e) => deleteBooking(test.id)}>
                  <i class="fa fa-times"></i>
                  </Link>                            
                </div>
                <hr/>
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
