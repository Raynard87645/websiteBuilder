<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Validator;
use App\Team;

class teamController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        
        $teams = Team::orderBy('created_at', 'desc')->paginate(9);
        return view('team.index', compact('teams'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return view('team.create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //return $request->all();
         $validator = Validator::make($request->all(), [
           'first_name' => 'required|max:32|string',
           'last_name' => 'required|max:32|string',
           'title' => 'required',
           'bio' => 'required',

           ]);
         
        Team::create([ 
           'first_name' => $request->first_name,
           'last_name' => $request->last_name,
           'title' => $request->title,
           'email' => (isset($request->email)) ? $request->email : "team@inventivedesigns.com",
           'bio' => $request->bio,
           'my_image' => (isset($request->my_image)) ? $request->my_image : " ",
           'facebook' => (isset($request->facebook)) ? $request->facebook : " ",
           'linkedin' => (isset($request->linkedin)) ? $request->linkedin : " ",
           'twitter' => (isset($request->twitter)) ? $request->twitter : " "
             ]);
        
         return redirect('/team');
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $teams = Team::findOrFail($id);
         return view('team.show', compact('teams'));
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        return view('team.edit');
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
       
    }
}
