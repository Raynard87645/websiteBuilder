<?php

use Illuminate\Database\Seeder;
use App\Blog;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        factory(App\Blog::class, 10) -> create();
    }
}
