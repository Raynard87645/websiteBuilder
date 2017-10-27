<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('index');
});

Route::get('about', 'aboutController@index');
Route::get('about/resources', 'aboutController@resources');
Route::get('about/payments', 'aboutController@payments');
Route::get('about/career', 'aboutController@career');
Route::get('faq', 'faqController@index');
Route::get('download', 'downloadController@index');

Route::get('ourwork', 'ourworkController@index');
Route::get('ourwork/websites', 'ourworkController@websites');
Route::get('ourwork/logos', 'ourworkController@logos');


Route::get('web', 'webController@index');
Route::get('web/webdesign', 'webController@webdesign');
Route::get('web/landing', 'webController@landing');


Route::get('marketing', 'marketingController@index');
Route::get('marketing/social', 'marketingController@social');
Route::get('marketing/logo', 'marketingController@logo');
Route::get('marketing/card', 'marketingController@card');

Route::get('seo', 'seoController@index');

Route::resource('team', 'teamController');
Route::resource('blog', 'blogController');
Route::resource('support', 'supportController');
Route::resource('contact', 'contactController');