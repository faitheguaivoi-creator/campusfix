<?php

namespace Database\Factories;

use App\Models\Complaint;
use App\Models\ComplaintCategory;
use App\Models\Location;
use App\Models\User;
use App\Services\ReferenceGenerator;
use Illuminate\Database\Eloquent\Factories\Factory;

class ComplaintFactory extends Factory
{
    protected $model = Complaint::class;

    public function definition(): array
    {
        $statuses = ['submitted', 'under_review', 'assigned', 'in_progress', 'resolved', 'closed'];
        $priorities = ['low', 'medium', 'high', 'urgent'];
        $status = $this->faker->randomElement($statuses);
        $isAnonymous = $this->faker->boolean(30); // 30% anonymous

        return [
            'tracking_reference' => ReferenceGenerator::forComplaint(),
            'user_id' => User::where('role', 'student')->inRandomOrder()->first()?->id ?? User::factory(),
            'category_id' => ComplaintCategory::inRandomOrder()->first()?->id ?? ComplaintCategory::factory(),
            'location_id' => Location::inRandomOrder()->first()?->id ?? Location::factory(),
            'assigned_to' => in_array($status, ['assigned', 'in_progress', 'resolved', 'closed'])
                ? User::where('role', 'staff')->inRandomOrder()->first()?->id
                : null,
            'title' => $this->faker->sentence(6),
            'description' => $this->faker->paragraph(3),
            'priority' => $this->faker->randomElement($priorities),
            'status' => $status,
            'is_anonymous' => $isAnonymous,
            'resolved_at' => in_array($status, ['resolved', 'closed']) ? now()->subDays(rand(1, 10)) : null,
            'closed_at' => $status === 'closed' ? now()->subDays(rand(1, 5)) : null,
        ];
    }
}