<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Team extends Model
{
    protected $fillable = [
      'first_name', 'last_name', 'email', 'bio', 'my_image', 'title', 'facebook', 'linkedin', 'twitter'
    ];
}
