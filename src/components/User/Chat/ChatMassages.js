import { useState, useEffect } from "react";
import { reactLocalStorage } from "reactjs-localstorage";
import {useParams } from "react-router-dom";
import axios from "axios";
import Pusher from 'pusher-js';

function ChatMassages() {

  const token = reactLocalStorage.get("token");
  const user_id = reactLocalStorage.get("user_id");
  const [labAdmin, setLabAdmin] = useState([]);
  const [user, setUser] = useState([]);
  let [messages, setMassages] = useState([]);
  const [input , setInput] = useState('');
  let { id } = useParams();

    useEffect(() => {
     var pusher = new Pusher('ea25a3949b7662bf5669', {
      cluster: 'ap2'
    });

    const channel = pusher.subscribe('messages');
    channel.bind('inserted', function(newMassage) {
      if(user_id == newMassage.user_id && id == newMassage.lab_admin_id){
      setMassages([...messages, newMassage])
        }
    });

    return() => {
      channel.unbind_all();
      channel.unsubscribe();
    }
  },[messages]);

  useEffect(() => {
    let getLabAdminData = async () => {
      await axios
        .get(`http://localhost:5000/user/chat/lab-admin/${id}`, {
          headers: {
            token: token,
          },
        })
        .then((response) => {
          if (response.data) {
            setLabAdmin(response.data.result[0]);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getLabAdminData();

      let getUserData = async () => {
      await axios
        .get(`http://localhost:5000/user/chat/avatar`, {
          headers: {
            token: token,
          },
        })
        .then((response) => {
          if (response.data) {
            setUser(response.data.result[0]);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getUserData();

      let getMassages = async () => {
      await axios
        .get(`http://localhost:5000/user/chat/messages/${id}`,{
          headers: {
            token: token,
          },
        })
        .then((response) => {
          if (response.data) {
            setMassages(response.data.messages);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getMassages();



  }, [id]);

  const handleMassage = (e) => {

      console.log(e)
    
  
    setInput(e.target.value);
  }       
  const handleSubmit = (e) => {
  e.preventDefault()
  axios.post('http://localhost:5000/user/chat/messages/new',
  {
    message: input,
    lab_admin_id:id,
  },{
          headers: {
            token: token,
          },
        })
.then(function (response) {
    setInput('');
  })
 .catch(function (error) {
    console.log(error);
  });
  }



  return (
      !labAdmin?
        <div className="col-7 col-md-8 chat">
          <div className="card chat_card">
            <div className="card-body welcome_card_body">     
                <h2 className="mt-2">Welcome To Chat</h2>
                <p>Hare You can chat with LabAdmins </p>
            </div>
          </div>   
        </div>
        :<div className="col-7 col-md-8 chat">
          <div className="card chat_card">
            <div className="card-header card_header msg_head">
              <div className="d-flex bd-highlight">
                <div className="img_cont">
                  <img
                     src={`/uploads/${labAdmin.avatar}`} alt={labAdmin.name}
                     className="rounded-circle user_img"
                  />
                </div>
                <div className="user_info">
                  <span>{labAdmin.firstname} {labAdmin.lastname}</span>
                  <p>{labAdmin.name}</p>
                </div>
              </div>
            </div>
            <div className="card-body msg_card_body">
              
             {messages.map((message) => (
              message.status != 1 ?
              <div className="d-flex justify-content-start mb-4">
                <div className="img_cont_msg">
                  <img
                    src={`/uploads/${labAdmin.avatar}`} alt={labAdmin.name}
                    className="rounded-circle user_img_msg"
                  />
                </div>
                <div className="msg_cotainer">
                 {message.message}
                </div>
              </div>
              :
              <div className="d-flex justify-content-end mb-4">
                <div className="msg_cotainer_send">
                 {message.message}
                </div>
                <div className="img_cont_msg">
                  <img
                    src={`/uploads/${user.avatar}`} alt={user.name}
                    className="rounded-circle user_img_msg"
                  />
                </div>
              </div>
              ))}
            </div>
            <div className="card-footer">
                 <form onSubmit={handleSubmit} >
              <div className="input-group">
                <input
                  className="form-control type_msg"
                  placeholder="Type your message..."
                  value={input} 
                  onChange={handleMassage}
                  required
                />
                <div className="input-group-append">
                  <button type="submit" className="input-group-text send_btn"
                    ><i className="fa fa-location-arrow text-dark"></i
                  ></button>
                </div>
              </div>
                </form>
            </div>
          </div>   
        </div>
  
  );

 
 


}
export default ChatMassages;



