<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Admin
        User::create([
            'name' => 'System Administrator',
            'email' => 'admin@campusfix.test',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'department' => 'ICT Directorate',
            'is_active' => true,
        ]);

        // Maintenance staff
        $staff = [
            ['name' => 'John Electrical', 'email' => 'electrical@campusfix.test', 'specialty' => 'Electrical'],
            ['name' => 'Mary Plumbing', 'email' => 'plumbing@campusfix.test', 'specialty' => 'Plumbing'],
            ['name' => 'David Furniture', 'email' => 'furniture@campusfix.test', 'specialty' => 'Furniture'],
            ['name' => 'Grace Cleaning', 'email' => 'cleaning@campusfix.test', 'specialty' => 'Cleaning'],
        ];

        foreach ($staff as $s) {
            User::create([
                ...$s,
                'password' => Hash::make('password'),
                'role' => 'staff',
                'department' => 'Works & Maintenance',
                'is_active' => true,
            ]);
        }

        // Students
        for ($i = 1; $i <= 12; $i++) {
            User::create([
                'name' => "Student {$i}",
                'email' => "student{$i}@campusfix.test",
                'password' => Hash::make('password'),
                'role' => 'student',
                'matric_no' => 'LCSMT/' . str_pad($i, 4, '0', STR_PAD_LEFT),
                'department' => 'Computer Software Engineering',
                'is_active' => true,
            ]);
        }
    }
}