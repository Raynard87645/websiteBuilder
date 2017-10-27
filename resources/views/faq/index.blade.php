@extends('layouts.main')

@section('content')
	<div id="header-wrapper">
      <section id="banner">
        <h2>FAQ - Frequently Asked Questions</h2>
        <p>Let us do the heavy lifting for you</p>
        <a href="#" class="button">Get Started</a>
      </section>
    </div>
    <div id="main-wrapper">
       <div class="container">
       	  @foreach($faqs as $faq)
       	    <div class="col-md-12">
       	      <h2>{{ $faq->title }}</h2>
       	      <h5>{{ $faq->question }}</h5>
       	      <p>{{ $faq->answer }}</p>
       	    </div>
       	  @endforeach
       </div>
    </div>

@endsection