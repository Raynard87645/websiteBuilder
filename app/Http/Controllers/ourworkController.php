<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ourworkController extends Controller
{
    public function index(){
       return view('ourwork.index');
    }

    public function websites(){
      return view('ourwork.websites');
    }
    public function logos(){
    	return view('ourwork.logos');
    }

}
