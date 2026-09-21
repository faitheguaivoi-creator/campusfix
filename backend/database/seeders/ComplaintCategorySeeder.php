<?php

namespace Database\Seeders;

use App\Models\ComplaintCategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ComplaintCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            'Electrical', 'Plumbing', 'Furniture', 'Classroom',
            'Hostel', 'Internet/Wi-Fi', 'Cleaning', 'Security',
            'Building/Facility', 'Other',
        ];

        foreach ($categories as $name) {
            ComplaintCategory::create([
                'name' => $name,
                'slug' => Str::slug($name),
                'is_active' => true,
            ]);
        }
    }
}