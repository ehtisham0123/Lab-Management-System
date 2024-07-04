import "./Home.css";
function Home() {
  return (
  <div id="content" className="p-4 p-md-5" >
      <h2 className="text-center mb-2">Online Diagnostic Hub</h2>
      <div class="container">
        <div class="row bg-color align-items-center block -berry edge--bottom">
          <div class="col-md-6">
            <h4>
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took
            </h4>
            <br />
          </div>
          <div class="col-md-6 about-picture">
            <img
              src="1.JPG"
              height="100%"
              width="100%"
            />
          </div>
        </div>
      </div>

        <div class="container">
        <div class="row bg-color align-items-center block -berry edge--bottom">
         
          <div class="col-md-6 about-picture">
            <img
              src="2.JPG"
              height="100%"
              width="100%"
            />
          </div>
           <div class="col-md-6">
            <h4>
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took
            </h4>
            <br />
          </div>
        </div>
      </div>
    </div>
  );
}
export default Home;



