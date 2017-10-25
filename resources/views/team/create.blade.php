@extends('layouts.main')

@section('content')
  <header id="header">
    <div class="logo container">
      <div>
        <h1><a href="" id="logo"></a></h1>
        <p>Team</p>
      </div>
    </div>
  </header>
  <div id="main-wrapper">
    <div class="container">
      <div class="col-md-8 col-md-offset-2" >

                <form id="addteamMember" action="/team" method="post" enctype="multipart/form-data">
                           {{csrf_field()}}
                     
                      <div class="col-md-12">
                             <label >First Name<span style="color: red"> * </span></label>
                              <input type="field" name="first_name" class="form-control" value="" /><br>
                      </div>
                      <div class="col-md-12">
                             <label >Last Name<span style="color: red"> * </span></label>
                              <input type="field" name="last_name" class="form-control" value="" /><br>
                      </div>
                      <div class="col-md-12">
                             <label >Image<span style="color: red"> * </span></label>
                              <input type="file" name="my_image" class="form-control" value="" /><br>
                      </div>
                      <div class="col-md-12">
                             <label >Title<span style="color: red"> * </span></label>
                              <input type="field" name="title" class="form-control" value="" /><br>
                      </div> 
                      <div class="col-md-12">
                             <label >FaceBook</label>
                              <input type="field" name="facebook" class="form-control" value="" /><br>
                      </div>
                      <div class="col-md-12">
                             <label >Linkedin</label>
                              <input type="field" name="linkedin" class="form-control" value="" /><br>
                      </div> 
                      <div class="col-md-12">
                             <label >Twitter</label>
                              <input type="field" name="twitter" class="form-control" value="" /><br>
                      </div> 
                      <div class="col-md-12">
                             <label >Email Address</label>
                              <input type="field" name="email" class="form-control" value="" /><br>
                      </div>
                      <div class="col-md-12">
                             <label >Bio<span style="color: red"> * </span></label>
                              <textarea type="field" name="bio" class="form-control" value="" /></textarea><br>
                      </div>               
                       <div >
                           <button class="btn btn-success" type="submit">Add Employee</button>
                           
                       </div>
                     </form>
           </div>          
       </div>
    </div>                 

@endsection