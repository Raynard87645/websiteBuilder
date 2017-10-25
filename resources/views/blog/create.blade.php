@extends('layouts.main')

@section('content')
    <header id="header">
		<div class="logo container">
			<div>
				<h1><a href="" id="logo"></a></h1>
				<p>Contact</p>
			</div>
		</div>
	</header>
	
	   <div class="container">
	      <form id="blogForm" action="/blog" method="post">
	          {{csrf_field()}}
	         <div class="col-md-8 col-md-offset-2">
	             <div class="panel panel-primary">
	                <div class="panel-heading">
	                	Make a post
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
			              <label>Title<span style="color: red"> * </span></label>
			           	  <input class="form-control" type="field" name="title" placeholder="Enter Title"/>
			   	  	   </div>
			   	  	   <div class="col-md-12">
			   	  	       <label>Categories<span style="color: red"> * </span></label>
			              <select class="form-control" name="category" form="blogForm" required="">
			   	  		    <option value=" " disabled selected>Select category</option>
						    <option>Web</option>
						    <option>Marketing</option>
						    <option>Seo</option>
						    <option>Services</option>
						  </select><br>
			   	  	   </div>
			   	  	   <div class="col-md-12">
			              <label>Message<span style="color: red"> * </span></label>
			           	  <textarea class="form-control" type="field" name="message" placeholder="Enter Your Request"></textarea> 
			   	  	   </div>
			   	  	   <div class="col-md-12">
	                   	  <button type="submit" class="btn btn-primary pull-right" style="margin-top: 30px">Submit Post</button>
	                  </div>
	                </div>
	             </div>
	          </div>  
	      </form>
	   </div>   
@endsection 