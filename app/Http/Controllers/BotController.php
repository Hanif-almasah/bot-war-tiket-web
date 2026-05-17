<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http; // Library Laravel untuk menembak API/URL lain

class BotController extends Controller
{
    // 1. Fungsi untuk menampilkan halaman dashboard
    public function index()
    {
        return view('dashboard'); // ini akan memanggil file dashboard.blade.php
    }

    // 2. Fungsi untuk memproses tombol "Mulai War" dari HP
    public function startWar(Request $request)
    {
        // Validasi: Memastikan input dari HP beneran format URL dan tidak kosong
        $request->validate([
            'url_loket' => 'required|url',
            'selector_tombol' => 'required|string', // validasi class
            'targetIndex' => 'required|integer|min:0|max:6'
        ]);

        // Mengambil data URL yang diketik di HP
        $urlInput = $request->input('url_loket');
        $selector_tombol = $request->input('selector_tombol');
        $targetIndex = $request->input('targetIndex');

        try {
            // Menembak API Node.js yang stand-by di laptop port 3000
            $response = Http::timeout(5)->post('http://localhost:3000/api/start-war', [
                'urlTarget' => $urlInput,
                'selector' => $selector_tombol, // Selector tombol konser NCT kemarin
                'targetIndex' => $targetIndex
            ]);
            
            // Jika sukses, kembali ke halaman sebelumnya membawa pesan sukses
            return back()->with('success', '🔥 Bot Berhasil Dijalankan di Laptop!');
            
        } catch (\Exception $e) {
            // Jika Node.js belum dinyalakan, tangkap error-nya agar web tidak crash
            return back()->with('error', 'Gagal terhubung ke Engine Bot. Pastikan "node server.js" sudah aktif!');
        }
    }

    public function stopwar(){
        try{
            $response = Http::timeout(5)->post('http://localhost:3000/api/stop-war');
            return back()->with('success', 'Bot Berhasil Dihentikan!');
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal terhubung ke Engine Bot. Pastikan "node server.js" sudah aktif!');
        }
    }
}