<?php

namespace App\Providers;

use App\Models\Complaint;
use App\Models\LostFoundItem;
use App\Policies\ComplaintPolicy;
use App\Policies\LostFoundItemPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        Gate::policy(Complaint::class, ComplaintPolicy::class);
        Gate::policy(LostFoundItem::class, LostFoundItemPolicy::class);
    }
}