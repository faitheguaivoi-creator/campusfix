<?php

namespace Database\Seeders;

use App\Models\Location;
use Illuminate\Database\Seeder;

class LocationSeeder extends Seeder
{
    public function run(): void
    {
        $locations = [
            ['name' => 'Administrative Block',   'building' => 'Admin Block',       'type' => 'administrative'],
            ['name' => 'Computer Laboratory',    'building' => 'ICT Building',      'type' => 'academic'],
            ['name' => 'Engineering Building',   'building' => 'Engineering Complex','type' => 'academic'],
            ['name' => 'Female Hostel',          'building' => 'Hostel Block C',    'type' => 'hostel'],
            ['name' => 'Library',                'building' => 'Library Complex',   'type' => 'library'],
            ['name' => 'Main Hall',              'building' => 'Main Hall',         'type' => 'academic'],
            ['name' => 'Male Hostel',            'building' => 'Hostel Block B',    'type' => 'hostel'],
            ['name' => 'Sports Complex',         'building' => 'Sports Centre',     'type' => 'sports'],
            ['name' => 'Student Cafeteria',      'building' => 'Cafeteria',         'type' => 'cafeteria'],
            ['name' => 'Student Hostel',         'building' => 'Hostel Block A',    'type' => 'hostel'],
            ['name' => 'Volleyball Court',       'building' => 'Sports Centre',     'type' => 'sports'],
            ['name' => 'Football Field',         'building' => 'Sports Centre',     'type' => 'sports'],
            ['name' => 'Reception',              'building' => 'Admin Block',       'type' => 'administrative'],
            ['name' => 'Student Affairs',        'building' => 'Admin Block',       'type' => 'administrative'],
            ['name' => 'Registrar\'s Office',    'building' => 'Admin Block',       'type' => 'administrative'],
            ['name' => 'Lecturers\' Offices',    'building' => 'Academic Block',    'type' => 'academic'],
        ];

        foreach ($locations as $loc) {
            Location::create($loc);
        }
    }
}