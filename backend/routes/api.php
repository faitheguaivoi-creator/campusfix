<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ComplaintController;
use App\Http\Controllers\Api\LostFoundController;
use App\Http\Controllers\Api\MetaController;
use App\Http\Controllers\Api\Admin\ComplaintController as AdminComplaintController;
use App\Http\Controllers\Api\Admin\LostFoundController as AdminLostFoundController;
use App\Http\Controllers\Api\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Api\Admin\UserController as AdminUserController;
use App\Http\Controllers\Api\Admin\LocationController as AdminLocationController;
use App\Http\Controllers\Api\Admin\ComplaintCategoryController as AdminComplaintCategoryController;
use App\Http\Controllers\Api\Admin\LostFoundCategoryController as AdminLostFoundCategoryController;
use App\Http\Controllers\Api\Staff\ComplaintController as StaffComplaintController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| PUBLIC
|--------------------------------------------------------------------------
*/

Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register'])->middleware('throttle:5,1');
    Route::post('login', [AuthController::class, 'login'])->middleware('throttle:10,1');
});

Route::get('complaints/track/{reference}', [ComplaintController::class, 'track'])
    ->middleware('throttle:10,1');

/*
|--------------------------------------------------------------------------
| AUTHENTICATED
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {

    Route::prefix('auth')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('me', [AuthController::class, 'me']);
        Route::put('profile', [AuthController::class, 'updateProfile']);
        Route::put('password', [AuthController::class, 'updatePassword']);
    });

    Route::get('complaint-categories', [MetaController::class, 'complaintCategories']);
    Route::get('lost-found-categories', [MetaController::class, 'lostFoundCategories']);
    Route::get('departments', [MetaController::class, 'departments']);
    Route::get('locations', [MetaController::class, 'locations']);

    // Student complaints
    Route::get('complaints/stats', [ComplaintController::class, 'stats']);
    Route::apiResource('complaints', ComplaintController::class);
    Route::post('complaints/{complaint}/updates', [ComplaintController::class, 'storeUpdate']);

    // Lost & Found
    Route::prefix('lost-found')->group(function () {
        Route::get('/', [LostFoundController::class, 'index']);
        Route::post('/', [LostFoundController::class, 'store']);
        Route::post('lost', [LostFoundController::class, 'storeLost']);
        Route::post('found', [LostFoundController::class, 'storeFound']);
        Route::get('{lostFound}', [LostFoundController::class, 'show']);
        Route::put('{lostFound}', [LostFoundController::class, 'update']);
        Route::patch('{lostFound}/status', [LostFoundController::class, 'updateStatus']);
        Route::delete('{lostFound}', [LostFoundController::class, 'destroy']);
        Route::post('{lostFound}/contacts', [LostFoundController::class, 'storeContact']);
        Route::get('{lostFound}/contacts', [LostFoundController::class, 'itemContacts']);
    });

    Route::get('my/lost-found', [LostFoundController::class, 'myItems']);
    Route::get('my/contact-requests', [LostFoundController::class, 'mySentContacts']);
    Route::get('my/received-requests', [LostFoundController::class, 'myReceivedContacts']);
    Route::patch('contacts/{contact}', [LostFoundController::class, 'updateContact']);
});

/*
|--------------------------------------------------------------------------
| ADMIN
|--------------------------------------------------------------------------
*/

Route::middleware(['auth:sanctum', 'role:admin'])
    ->prefix('admin')
    ->group(function () {

        Route::get('dashboard', [AdminDashboardController::class, 'index']);

        // Complaints
        Route::get('complaints', [AdminComplaintController::class, 'index']);
        Route::get('complaints/{complaint}', [AdminComplaintController::class, 'show']);
        Route::patch('complaints/{complaint}/assign', [AdminComplaintController::class, 'assign']);
        Route::patch('complaints/{complaint}/status', [AdminComplaintController::class, 'updateStatus']);
        Route::post('complaints/{complaint}/updates', [AdminComplaintController::class, 'storeUpdate']);
        Route::delete('complaints/{complaint}', [AdminComplaintController::class, 'destroy']);

        // Lost & Found moderation
        Route::get('lost-found', [AdminLostFoundController::class, 'index']);
        Route::patch('lost-found/{lostFound}/status', [AdminLostFoundController::class, 'updateStatus']);
        Route::delete('lost-found/{lostFound}', [AdminLostFoundController::class, 'destroy']);

        // Users & Staff
        Route::get('staff', [AdminUserController::class, 'staff']);
        Route::get('users', [AdminUserController::class, 'index']);
        Route::post('users', [AdminUserController::class, 'store']);
        Route::put('users/{user}', [AdminUserController::class, 'update']);
        Route::delete('users/{user}', [AdminUserController::class, 'destroy']);

        // Categories & Locations
        Route::apiResource('locations', AdminLocationController::class);
        Route::apiResource('complaint-categories', AdminComplaintCategoryController::class);
        Route::apiResource('lost-found-categories', AdminLostFoundCategoryController::class);
    });

/*
|--------------------------------------------------------------------------
| STAFF
|--------------------------------------------------------------------------
*/

Route::middleware(['auth:sanctum', 'role:staff'])
    ->prefix('staff')
    ->group(function () {
        Route::get('dashboard', [\App\Http\Controllers\Api\Staff\DashboardController::class, 'index']);
        Route::get('complaints', [StaffComplaintController::class, 'index']);
        Route::get('complaints/{complaint}', [StaffComplaintController::class, 'show']);
        Route::patch('complaints/{complaint}/status', [StaffComplaintController::class, 'updateStatus']);
        Route::post('complaints/{complaint}/updates', [StaffComplaintController::class, 'storeUpdate']);
    });