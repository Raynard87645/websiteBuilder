<?php

/*
|--------------------------------------------------------------------------
| Model Factories
|--------------------------------------------------------------------------
|
| Here you may define all of your model factories. Model factories give
| you a convenient way to create models for testing and seeding your
| database. Just tell the factory how a default model should look.
|
*/

/** @var \Illuminate\Database\Eloquent\Factory $factory */
$factory->define(App\Blog::class, function (Faker\Generator $faker) {
    static $password;

    return [
        'first_name' => $faker->word,
        'last_name' => $faker->word,
        'title' => $faker->sentence,
        'category' => $faker->word,
        'message' => $faker->paragraph(2),
    ];
});
