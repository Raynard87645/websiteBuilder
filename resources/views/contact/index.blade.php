@extends('layouts.main')

@section('content')
    <div id="header-wrapper">
				<section id="banner">
					<h2>Contact</h2>
					<p>Get intouch now for great deals</p>
				<a href="#" class="button">Get Started</a>
			</section>
		</div>
	  <div id="main-wrapper">
	    <div id="subheader">
	  	  <div class="container">
	  	    <h1>Do you need a website or an upgrade?</h1>
	      	<h4>Call or contact us for the best values in website degigning and many more to drive customers to your business.</h4>
	  	  </div>
	  	</div>
	     <div class="container">
	       <div class="col-md-5">
	      	 <ul id="contactForm">
	      	    <li><div id="map"> </div></li>
	      	    <li><span class="openhour">Mon-Fri. 8:00am-8:00pm</span></li>
	      	 	<li><i class="fa fa-phone "></i> (876) 434-0989 / (876) 459-5798</li>
	      	 	<li><i class="fa fa-skype "></i> Kgkinggeorge@gmail.com</li>
	      	 	<li><i class="fa fa-envelope-o "></i><a href=""><span class="email"> Kgkinggeorge@gmail.com</span></a></li>
	      	 	<li><i class="glyphicon glyphicon-map-marker"></i><span class="word">Top Albion Mandeville Manchester Jamaica W.I JMDMR17</span></li>
	      	 </ul>
	      </div>
	      <div class="col-md-7">
	        <form id="contactForm" action="/contact" method="post">
	          {{csrf_field()}}
	             <div class="panel panel-primary">
	                <div class="panel-heading">
	                	Drop us a message
	                </div>
	                <div class="panel-body">
	                   <div class="col-md-12">
			              <label>First Name <span style="color: red"> * </span></label>
			           	  <input class="form-control" type="field" name="first_name" placeholder="Enter First Name"/>
			   	  	   </div>
			   	  	   <div class="col-md-12">
			              <label>Last Name <span style="color: red"> * </span></label>
			           	  <input class="form-control" type="field" name="last_name" placeholder="Enter Last Name"/>
			   	  	   </div>
			   	  	   <div class="col-md-12">
			              <label>Email<span style="color: red"> * </span></label>
			           	  <input class="form-control" type="email" name="email" placeholder="Enter Email"/>
			   	  	   </div>
			   	  	   <div class="col-md-12">
			              <label>Phone</span></label>
			           	  <input class="form-control" type="field" name="phone" placeholder="Enter Phone"/>
			   	  	   </div>
			   	  	   <div class="col-md-12">
			              <label>Message<span style="color: red"> * </span></label>
			           	  <textarea class="form-control" type="field" name="message" placeholder="Enter Message"></textarea> 
			   	  	   </div>
			   	  	   <div class="col-md-12">
	                   	  <button type="submit" class="btn btn-primary pull-right" style="margin-top: 30px">Submit Message</button>
	                  </div>
	                </div>
	             </div>
	          </form>
	        </div>
	      </div>
	   </div>  

   <script>
      function initMap() {
        var uluru = {lat: 18.0325717, lng: -77.52137599999999};
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 14,
          center: uluru
        });
        var marker = new google.maps.Marker({
          position: uluru,
          map: map
        });
      }
    </script>
    <script async defer
    src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAGymma2mbEJPB22HODuzlvyBk30g8UuZY&callback=initMap">
    </script>
@endsection