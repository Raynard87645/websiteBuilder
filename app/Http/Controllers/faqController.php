<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Faq;

class faqController extends Controller
{
    public function index(){
    	$faqs = Faq::orderBy('created_at', 'desc')->paginate(9);
    	return view('faq.index', compact('faqs'));
    }
}
