<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Blog extends Model
{
    protected $fillable = [
      'first_name', 'last_name', 'title', 'category', 'message'
    ];

     public function getShortContentAttribute(){
        return substr( $this->message, 0, random_int(80, 100));
      } 
}
