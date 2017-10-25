<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Support extends Model
{
   protected $fillable = [
      'name', 'company', 'email', 'phone', 'domain', 'message', 'file'
    ];
    
}
