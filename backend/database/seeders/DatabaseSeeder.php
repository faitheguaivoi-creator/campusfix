<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            LocationSeeder::class,
            ComplaintCategorySeeder::class,
            LostFoundCategorySeeder::class,
            DepartmentSeeder::class,
            UserSeeder::class,
            ComplaintSeeder::class,
            LostFoundItemSeeder::class,
        ]);
    }
}