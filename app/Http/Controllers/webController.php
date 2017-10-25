<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class webController extends Controller
{
    public function index(){
       return view('web.index');
    }

    public function webdesign(){
      return view('web.webdesign');
    }
    public function landing(){
    	return view('web.landing');
    }
}
