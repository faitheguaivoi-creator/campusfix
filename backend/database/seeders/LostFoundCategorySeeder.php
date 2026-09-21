<?php

namespace Database\Seeders;

use App\Models\LostFoundCategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class LostFoundCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            'ID Card', 'Phone', 'Laptop', 'Wallet', 'Keys',
            'Books', 'Bags', 'Clothing', 'Accessories',
            'Electronics', 'Other',
        ];

        foreach ($categories as $name) {
            LostFoundCategory::create([
                'name' => $name,
                'slug' => Str::slug($name),
                'is_active' => true,
            ]);
        }
    }
}