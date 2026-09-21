<?php

namespace Database\Seeders;

use App\Models\Location;
use App\Models\LostFoundCategory;
use App\Models\LostFoundItem;
use App\Models\User;
use App\Services\ReferenceGenerator;
use Illuminate\Database\Seeder;

class LostFoundItemSeeder extends Seeder
{
    public function run(): void
    {
        $students = User::where('role', 'student')->get();
        $categories = LostFoundCategory::all();
        $locations = Location::all();

        $types = ['lost', 'found'];
        $statuses = ['active', 'matched', 'returned', 'closed'];

        for ($i = 1; $i <= 27; $i++) {
            $type = $types[array_rand($types)];
            LostFoundItem::create([
                'reference_no' => ReferenceGenerator::forLostFound(),
                'user_id' => $students->random()->id,
                'category_id' => $categories->random()->id,
                'location_id' => $locations->random()->id,
                'type' => $type,
                'title' => ($type === 'lost' ? 'Lost' : 'Found') . " item #{$i}",
                'description' => "Description for {$type} item number {$i}.",
                'identifying_info' => 'Colour: Black, distinguishing mark: scratch on the back.',
                'date_occurred' => now()->subDays(rand(1, 60)),
                'contact_preference' => 'in_app',
                'status' => $statuses[array_rand($statuses)],
            ]);
        }
    }
}