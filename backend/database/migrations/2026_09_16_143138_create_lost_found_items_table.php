<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lost_found_items', function (Blueprint $table) {
            $table->id();
            $table->string('reference_no', 20)->unique();
            $table->foreignId('user_id')
                  ->constrained('users')
                  ->cascadeOnDelete();
            $table->foreignId('category_id')
                  ->constrained('lost_found_categories')
                  ->restrictOnDelete();
            $table->foreignId('location_id')
                  ->constrained('locations')
                  ->restrictOnDelete();
            $table->enum('type', ['lost', 'found']);
            $table->string('title', 180);
            $table->text('description');
            $table->text('identifying_info')->nullable();
            $table->date('date_occurred');
            $table->string('image_path')->nullable();
            $table->enum('contact_preference', ['in_app', 'email', 'phone'])
                  ->default('in_app');
            $table->enum('status', ['active', 'matched', 'returned', 'closed'])
                  ->default('active');
            $table->timestamps();
            $table->softDeletes();

            $table->index(['type', 'status']);
            $table->index(['user_id', 'type']);
            $table->index(['category_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lost_found_items');
    }
};