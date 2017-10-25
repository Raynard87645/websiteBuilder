<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class marketingController extends Controller
{
    public function index(){
       return view('marketing.index');
    }

    public function logo(){
      return view('marketing.logo');
    }
    public function card(){
    	return view('marketing.card');
    }
    public function social(){
    	return view('marketing.social');
    }
    
}
