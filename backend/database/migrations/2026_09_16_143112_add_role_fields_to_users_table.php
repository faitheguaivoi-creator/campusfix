<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', ['student', 'admin', 'staff'])
                  ->default('student')
                  ->after('email');
            $table->string('phone', 20)->nullable()->after('role');
            $table->string('department', 100)->nullable()->after('phone');
            $table->string('specialty', 100)->nullable()->after('department');
            $table->string('matric_no', 30)->nullable()->unique()->after('specialty');
            $table->string('avatar_path')->nullable()->after('matric_no');
            $table->boolean('is_active')->default(true)->after('avatar_path');
            $table->index('role');
            $table->index('is_active');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'role', 'phone', 'department', 'specialty',
                'matric_no', 'avatar_path', 'is_active',
            ]);
        });
    }
};