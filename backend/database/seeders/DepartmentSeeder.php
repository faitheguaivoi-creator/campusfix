<?php

namespace Database\Seeders;

use App\Models\Department;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DepartmentSeeder extends Seeder
{
    public function run(): void
    {
        $departments = [
            ['name' => 'Computer Software Engineering', 'max_semesters' => 6],
            ['name' => 'Business',                      'max_semesters' => 6],
            ['name' => 'Mass Communication',            'max_semesters' => 6],
            ['name' => 'Psychology',                    'max_semesters' => 6],
            ['name' => 'Foundation of Nursing',         'max_semesters' => 2],
        ];

        foreach ($departments as $d) {
            Department::updateOrCreate(
                ['slug' => Str::slug($d['name'])],
                [
                    'name' => $d['name'],
                    'max_semesters' => $d['max_semesters'],
                    'is_active' => true,
                ]
            );
        }
    }
}