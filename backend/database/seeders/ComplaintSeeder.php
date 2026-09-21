<?php

namespace Database\Seeders;

use App\Models\Complaint;
use App\Models\ComplaintCategory;
use App\Models\Location;
use App\Models\User;
use App\Services\ReferenceGenerator;
use Illuminate\Database\Seeder;

class ComplaintSeeder extends Seeder
{
    public function run(): void
    {
        $students = User::where('role', 'student')->get();
        $staff = User::where('role', 'staff')->get();
        $categories = ComplaintCategory::all();
        $locations = Location::all();

        $statuses = ['submitted', 'under_review', 'assigned', 'in_progress', 'resolved', 'closed'];
        $priorities = ['low', 'medium', 'high', 'urgent'];

        for ($i = 1; $i <= 25; $i++) {
            $status = $statuses[array_rand($statuses)];
            $isAnonymous = $i <= 10; // first 10 are anonymous
            $assigned = in_array($status, ['assigned', 'in_progress', 'resolved', 'closed'])
                ? $staff->random()->id
                : null;

            Complaint::create([
                'tracking_reference' => ReferenceGenerator::forComplaint(),
                'user_id' => $students->random()->id,
                'category_id' => $categories->random()->id,
                'location_id' => $locations->random()->id,
                'assigned_to' => $assigned,
                'title' => "Sample complaint #{$i}",
                'description' => "This is a detailed description for complaint number {$i}. It explains the issue clearly.",
                'priority' => $priorities[array_rand($priorities)],
                'status' => $status,
                'is_anonymous' => $isAnonymous,
                'resolved_at' => in_array($status, ['resolved', 'closed']) ? now()->subDays(rand(1, 10)) : null,
                'closed_at' => $status === 'closed' ? now()->subDays(rand(1, 5)) : null,
            ]);
        }
    }
}