<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PlayerController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Route::get('/', function () {
//     return Inertia::render('Welcome', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });

Route::get('/', fn () => redirect('/players'));

Route::get('/players', [PlayerController::class, 'index'])->name('player.index');
Route::post('/players', [PlayerController::class, 'store'])->name('player.store');
Route::post('/players/{player}/balance', [PlayerController::class, 'updateBalance'])->name('players.updateBalance');
Route::post('/players/{player}/property', [PlayerController::class, 'addProperty'])->name('players.addProperty');
Route::post('/players/{player}/property/update', [PlayerController::class, 'updateProperty'])->name('players.updateProperty');
Route::post('/players/{player}/property/delete', [PlayerController::class, 'deleteProperty'])->name('players.deleteProperty');
Route::post('/players/transfer', [PlayerController::class, 'transfer'])->name('players.transfer');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
