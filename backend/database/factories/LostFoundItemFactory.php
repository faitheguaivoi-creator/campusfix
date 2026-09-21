<?php

namespace Database\Factories;

use App\Models\Location;
use App\Models\LostFoundCategory;
use App\Models\LostFoundItem;
use App\Models\User;
use App\Services\ReferenceGenerator;
use Illuminate\Database\Eloquent\Factories\Factory;

class LostFoundItemFactory extends Factory
{
    protected $model = LostFoundItem::class;

    public function definition(): array
    {
        $statuses = ['active', 'matched', 'returned', 'closed'];
        $type = $this->faker->randomElement(['lost', 'found']);

        return [
            'reference_no' => ReferenceGenerator::forLostFound(),
            'user_id' => User::where('role', 'student')->inRandomOrder()->first()?->id ?? User::factory(),
            'category_id' => LostFoundCategory::inRandomOrder()->first()?->id ?? LostFoundCategory::factory(),
            'location_id' => Location::inRandomOrder()->first()?->id ?? Location::factory(),
            'type' => $type,
            'title' => ($type === 'lost' ? 'Lost ' : 'Found ') . $this->faker->words(2, true),
            'description' => $this->faker->paragraph(2),
            'identifying_info' => $this->faker->optional()->sentence(),
            'date_occurred' => $this->faker->dateTimeBetween('-60 days', 'now'),
            'contact_preference' => 'in_app',
            'status' => $this->faker->randomElement($statuses),
        ];
    }
}