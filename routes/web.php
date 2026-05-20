<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BotController;


Route::get('/', [BotController::class, 'index']);
Route::post('/start-war', [BotController::class, 'startWar']);
Route::post('/stop-war', [BotController::class, 'stopwar']);

Route::get('/nct', function () {
    return view('nct');
});

Route::get('/tweekend', function () {
    return view('tweekend');
});
Route::get('/westlife', function () {
    return view('westlife');
});