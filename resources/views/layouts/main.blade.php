<!DOCTYPE HTML>
<!--
	TXT by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
-->
<html>
	<head>
		<title>Inventive Designs</title>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<!--[if lte IE 8]><script src="assets/js/ie/html5shiv.js"></script><![endif]-->
		<link rel="stylesheet" href="{{ URL::asset('assets/css/main.css') }}" />
		<link rel="stylesheet" href="{{ URL::asset('assets/css/footer.css') }}" />
		<!--[if lte IE 8]><link rel="stylesheet" href="assets/css/ie8.css" /><![endif]-->
		<!-- Latest compiled and minified CSS -->
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">


	</head>
	<body class="homepage">
		<div id="page-wrapper">

			

			<!-- Nav -->
				<nav id="nav">
					<ul>
						<li class="current"><a href="/">Home</a></li>
						<li>
							<a href="/about">About</a>
							<ul>
								<li><a href="/team">Who We Are</a></li>
								<li><a href="/about/resources">Resources</a></li>
								<li><a href="/about/payments">Payments</a></li>
								<li><a href="/about/career">Career</a></li>
							</ul>
						</li>
						<li>
							<a href="/ourwork">Our Work</a>
							<ul>
								<li><a href="/ourwork/websites">Websites</a></li>
								<li><a href="/ourwork/logos">Logos</a></li>
								<li><a href="/ourwork/logos">Business Card</a></li>
							</ul>
						</li>
                        <li>
							<a href="/web">Web</a>
							<ul>
								<li><a href="/web/webdesign">Web Designs & Development</a></li>
								<li><a href="/web/landing">Landing Pages</a></li>
							</ul>
						</li>
						<li>
							<a href="/marketing">Marketing</a>
							<ul>
								<li><a href="/seo">SEO</a></li>
								<li><a href="/marketing/social">Social Media</a></li>
								<li><a href="/marketing/logo">logo</a></li>
								<li><a href="/marketing/card">Business Card</a></li>
							</ul>
						</li>
						<li><a href="/blog">Blog</a></li>
						<li><a href="/support">Support</a></li>
						<li><a href="/contact">Contact</a></li>
					</ul>
				</nav>

			@yield('content')

			

			<!-- Footer -->
			<footer id="myFooter">
		        <div class="container">
		            <div class="row">
		                <div class="col-sm-3">
		                    <h2 class="logo"><a href="/"> Inventive Designs </a></h2>
		                </div>
		                <div class="col-sm-2">
		                    <h5>Get started</h5>
		                    <ul>
		                        <li><a href="/">Home</a></li>
		                        <li><a href="/about/resources">Resources</a></li>
		                        <li><a href="/downloads">Downloads</a></li>
		                    </ul>
		                </div>
		                <div class="col-sm-2">
		                    <h5>About us</h5>
		                    <ul>
		                        <li><a href="/about">Company Information</a></li>
		                        <li><a href="/contact">Contact us</a></li>
		                        <li><a href="/ourwork">Our Work</a></li>
		                        <li><a href="/team">Who We Are</a></li>
		                    </ul>
		                </div>
		                <div class="col-sm-2">
		                    <h5>Support</h5>
		                    <ul>
		                        <li><a href="/faq">FAQ</a></li>
		                        <li><a href="/support">Help desk</a></li>
		                        <li><a href="/blog">Forums</a></li>
		                    </ul>
		                </div>
		                <div class="col-sm-3">
		                    <div class="social-networks">
		                        <a href="#" class="twitter"><i class="fa fa-twitter"></i></a>
		                        <a href="#" class="linkedin"><i class="fa fa-linkedin"></i></a>
		                        <a href="#" class="facebook"><i class="fa fa-facebook"></i></a>
		                        <a href="#" class="google"><i class="fa fa-google-plus"></i></a>
		                        <a href="#" class="instagram"><i class="fa fa-instagram"></i></a>
		                    </div>
		                    <button type="button" class="btn btn-default">Contact us</button>
		                </div>

		            </div>
		        </div>
		        <div class="footer-copyright">
		            <p>© 2016 Copyright <a href="/">Inventive Designs</a></p>
		        </div>
		    </footer>
             
			</div>
          
		<!-- Scripts -->
			<script src="{{ URL::asset('assets/js/jquery.min.js') }}"></script>
			<script src="{{ URL::asset('assets/js/jquery.dropotron.min.js') }}"></script>
			<script src="{{ URL::asset('assets/js/skel.min.js') }}"></script>
			<script src="{{ URL::asset('assets/js/skel-viewport.min.js') }}"></script>
			<script src="{{ URL::asset('assets/js/util.js') }}"></script>
			<!--[if lte IE 8]><script src="assets/js/ie/respond.min.js"></script><![endif]-->
			<script src="{{ URL::asset('assets/js/main.js') }}"></script>

			<!-- jQuery library -->
			<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>

			<!-- Latest compiled JavaScript -->
			<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>

	</body>
</html>