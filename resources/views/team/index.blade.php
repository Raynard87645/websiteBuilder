@extends('layouts.main')

@section('content')
    <div id="header-wrapper">
          <section id="banner">
            <h2>Team</h2>
            <p>Brining you value for your time</p>
            <a href="#" class="button">Get Started</a>
	      </section>
	</div>
	<div id="main-wrapper">
	  <div class="container">
	    <div id="Team">
	    @foreach($teams as $team)
	     <div class="col-md-4">
	       <div class="panel panel-primary">
	          <div class="panel-heading">
	            <div class="headings">
	          	  {{ $team->first_name }} {{ $team->last_name }}
	          	</div>
	          </div>
	          <div class="panel-body">
	            <div class="col-md-12">
	              <div class="size">
	              	<a href=""><i class="fa fa-user"></i></a>
	              </div>
	               <div class="social-network">
	          	 	<a href="{{ $team->facebook }}" class="facebook"><i class="fa fa-facebook"></i></a>
	          	 	<a href="{{ $team->linkedin }}" class="linkedin"><i class="fa fa-linkedin"></i></a>
	          	 	<a href="{{ $team->twitter }}" class="twitter"><i class="fa fa-twitter"></i></a>
	          	 	<a href="{{ $team->email }}" class="envelope"><i class="fa fa-envelope"></i></a>
	          	   </div>
	             </div>
	               <div class="title">
		             <div class="col-md-12">
		              {{ $team->title }} 
		           	 </div>
		           	 <button class="btn btn-primary" data-toggle="modal" data-target="#{{ $team->first_name}}">
		           	 View</button>
		           	 <div class="modal fade" id="{{ $team->first_name}}" role="dialog">
				        <div class="modal-dialog">
				           <div class="modal-content">
			                  <div class="modal-header">
			                     <button type="button" class="close" data-dismiss="modal"></button>
			                       <div class="headings">
						          	  {{ $team->first_name }} {{ $team->last_name }}
						          	</div>
			                    
			                    <div class="modal-body">
			                       <div class="col-md-12">
						              <div class="size">
						              	<a href=""><i class="fa fa-user"></i></a>
						              </div>
						               <div class="social-network">
						          	 	<a href="{{ $team->facebook }}" class="facebook"><i class="fa fa-facebook"></i></a>
						          	 	<a href="{{ $team->linkedin }}" class="linkedin"><i class="fa fa-linkedin"></i></a>
						          	 	<a href="{{ $team->twitter }}" class="twitter"><i class="fa fa-twitter"></i></a>
						          	 	<a href="{{ $team->email }}" class="envelope"><i class="fa fa-envelope"></i></a>
						          	   </div>
						           </div>
						           <div class="title">
							           <div class="col-md-12">
							              {{ $team->title }} 
							            </div>
							       </div>
							       <div class="bio">
							       	   {{ $team->bio }}
							       </div>
			                   </div>
			                  </div>
			               </div>  
				        </div>
					</div>
		          </div> 	 
	            </div>
	  	   </div>
	     </div>
	  	 @endforeach
	     <div class="col-md-4">
	       <div class="addButton">
	     	 <a href="/team/create"><button type="button"><i class="fa fa-plus" ></i></button></a>
	       </div>
	   </div>
	 </div>
	</div>
   </div>

@endsection