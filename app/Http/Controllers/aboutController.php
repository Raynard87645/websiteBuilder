<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Validator;
use App\Team;

class aboutController extends Controller
{
	public function index()
	 {
       return view('about.index');		
	 }
    public function resources()
    {
      return view('about.resources');
    }
    public function payments()
    {
      return view('about.payments');
    }
    public function career()
    {
      return view('about.career');
    }

  
}
