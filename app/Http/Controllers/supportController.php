<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Support;
use Validator;

class supportController extends Controller
{
  
    public function index()
    {
        return view('support.index');
    }

   
    public function create()
    {
        return view('support.create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
           'name' => 'required|max:32|string',
           'company' => 'required|max:32|string',
           'email' => 'email|max:255|unique:supports',
           'phone' => 'required',
           'domain' => 'required|max:32|string',
           'message' => 'required|max:32|string',

           ]);

        Support::create([ 
           'name' => $request->name,
           'company' => $request->company,
           'email' => $request->email,
           'phone' => $request->phone,
           'domain' => $request->domain,
           'message' => $request->message,
           'file' => (!isset($request->file)) ? "N/A" : $request->file
             ]);

         return back();
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        
       
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
