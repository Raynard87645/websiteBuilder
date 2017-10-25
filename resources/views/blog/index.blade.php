@extends('layouts.main')

@section('content')
    <div id="header-wrapper">
				<section id="banner">
					<h2>Blogs</h2>
					<p>See What others say about us</p>
				<a href="#" class="button">Get Started</a>
			</section>
		</div>
	<div id="main-wrapper">
	</div><br>



    <div class="row 200%">
							<div class="12u">

								<!-- Blog -->
									<section class="box blog">
										
										<div>
											<div class="row">
												<div class="9u 12u(mobile)">
													<div class="content content-left">
                                                       
														<!-- Featured Post -->

															<article class="box post">
																<header>
																	<h2><a href="#">LATEST STORIES</a></h4>
																	<p>{{ $blogs[3]->title }}</p>
																	<ul class="meta">
																		<li class="icon fa-clock-o">{{ $blogs[3]->created_at->diffForHumans() }}</li>
																		<li class="icon fa-comments"><a href="#">8</a></li>
																	</ul>
																</header>
																<a href="#" class="image featured"><img src="images/next.jpg" alt="" /></a>
																<p>
																	{{ $blogs[3]->message }}
																</p>
																<a href="#" class="button">Continue Reading</a>
															</article>
                                                        
													</div>
												</div>
												<div class="3u 12u(mobile)">
													<div class="sidebar"><br></br>

														<!-- Archives -->
														<ul>
															<article class="box post-summary">
																		<h3><a href="#">{{ $blogs[1]->title }}</a></h3>
																		{{ $blogs[1]->created_at->diffForHumans() }}
																			<span class="icon fa-comments"><a href="#">34</a></span>
																		
																	</article>
														
		     												 
															<article class="box post-summary">
																		<h3><a href="#">{{ $blogs[2]->title }}</a></h3>
																		{{ $blogs[2]->created_at->diffForHumans() }}
																			<span class="icon fa-comments"><a href="#">34</a></span>
																		
																	</article>
																<article class="box post-summary">
																		<h3><a href="#">{{ $blogs[3]->title }}</a></h3>
																		{{ $blogs[3]->created_at->diffForHumans() }}
																			<span class="icon fa-comments"><a href="#">34</a></span>
																		
																	</article>
																	<article class="box post-summary">
																		<h3><a href="#">{{ $blogs[4]->title }}</a></h3>
																		{{ $blogs[4]->created_at->diffForHumans() }}
																			<span class="icon fa-comments"><a href="#">34</a></span>
																		
																	</article>			
																	
		   												 
															</ul>	
															<a href="#" class="button alt">Browse Archives</a>

													</div>
												</div>
											</div>
										</div>
									</section>

							</div>
						</div>

		<div class="row">
	    <div class="col-md-12">
	    <div class="panel panel-success" style="margin-top: 50px">
	      <div class="panel-body">
		    @if($blogs)
		      @foreach($blogs as $blog)
		        <div class="col-md-4"> 
		        <div class="panel panel-success">
		           <div class="panel-heading" style="padding: 0px;">
				     	 <img src="../../images/next.jpg" style="width: 100%; height: 150px; ">
				     
		           </div>
		           <div class="panel-heading " >
                 	 <b> Post by</b> {{ $blog->first_name }} {{ $blog->last_name }}
                 	 <span class="content pull-right">{{ $blog->created_at->diffForHumans() }}</span>
                   </div>	
              	   <div class="panel-body hover">
                         
                    	   <a href="">{{ $blog->shortContent }} ... </a>
                    	
                    </div>
                 </div>
                 </div>
		      @endforeach	 
		    @endif
	    </div>
	    </div>
	       <span class="col-md-5"></span>{{ $blogs->links() }}
	    </div>
    </div>
@endsection