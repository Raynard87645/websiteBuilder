@extends('layouts.main')

@section('content')
    <div id="header-wrapper">
				<section id="banner">
					<h2>Support</h2>
					<p>Make a great change for the better</p>
				<a href="#" class="button">Get Started</a>
			</section>
		</div>
	<div id="main-wrapper">
	   <div id="subheader">
	  	  <div class="container">
	  	    <h1>Do you have an update or change to make?</h1>
	      	<h4>Submit your request for the changes you need for your site. Fill out the form with the required information.</h4>
          </div>
	   </div>	  
	   <div class="container">
	      <form id="supportForm" action="/support" method="post">
	          {{csrf_field()}}
	         <div class="col-md-8 col-md-offset-2">
	             <div class="panel panel-primary">
	                <div class="panel-heading">
	                	Enter Details To Request Change
	                </div>
	                <div class="panel-body">
	                   <div class="col-md-12">
			              <label>Name <span style="color: red"> * </span></label>
			           	  <input class="form-control" type="field" name="name" placeholder="Enter Your Name"/>
			   	  	   </div>
			   	  	   <div class="col-md-12">
			              <label>Company <span style="color: red"> * </span></label>
			           	  <input class="form-control" type="field" name="company" placeholder="Company Name"/>
			   	  	   </div>
			   	  	   <div class="col-md-12">
			              <label>Email<span style="color: red"> * </span></label>
			           	  <input class="form-control" type="email" name="email" placeholder="Enter Email"/>
			   	  	   </div>
			   	  	   <div class="col-md-12">
			              <label>Phone<span style="color: red"> * </span></label>
			           	  <input class="form-control" type="field" name="phone" placeholder="Enter Phone"/>
			   	  	   </div>
			   	  	   <div class="col-md-12">
			              <label>Domain/Url<span style="color: red"> * </span></label>
			           	  <input class="form-control" type="field" name="domain" placeholder="Enter Domain Or Url"/>
			   	  	   </div>
			   	  	   <div class="col-md-12">
			              <label>Message<span style="color: red"> * </span></label>
			           	  <textarea class="form-control" type="field" name="message" placeholder="Enter Your Request"></textarea> 
			   	  	   </div>
			   	  	   <div class="col-md-12">
			              <label>File</label>
			           	  <input class="form-control" type="file" name="file" />
			   	  	   </div>
			   	  	   <div class="col-md-12">
	                   	  <button type="submit" class="btn btn-primary pull-right" style="margin-top: 30px">Submit Request</button>
	                  </div>
	                </div>
	             </div>
	          </div>  
	      </form>
	   </div>  
	</div>    
@endsection