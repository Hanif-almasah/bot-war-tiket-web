import express from 'express';
import bodyParser from 'body-parser';
import puppeteer from 'puppeteer-core';

const app = express();
app.use(bodyParser.json());

// 🔥 UBAH MENJADI ARRAY: Menyimpan daftar session bot yang sedang aktif
let activeSessions = []; 
let clickCounter = 0;

app.post('/api/start-war', async (req, res) => {
    const { urlTarget, selector, targetIndex = 2 } = req.body; // ✅ Fix #2: tambah targetIndex dari req.body

    if (!urlTarget || !selector) {
        return res.status(400).json({ status: 'error', message: 'Data kurang lengkap!' });
    }

    // Buat ID unik untuk session browser ini berdasarkan timestamp mikro
    const sessionId = Date.now();
    
    // Objek pengontrol untuk session spesifik ini
    const sessionControl = {
        id: sessionId,
        isRunning: true,
        browser: null
    };
    
    // Masukkan ke dalam daftar antrean aktif
    activeSessions.push(sessionControl);

    // Kirim respon sukses ke HP tanpa menunggu proses loop selesai
    res.json({ status: 'success', message: `Bot session #${sessionId} berhasil dipicu!` });

    try {
        clickCounter++; // Naikkan hitungan setiap tombol di HP diklik
        
        let targetFolder = '';

        // JIKA MASIH DI BAWAH ATAU SAMA DENGAN 15 KLIK
        if (clickCounter <= 15) {
            targetFolder = `D:/bot-warTiket-edge/PuppeteerProfile_WarTiket_Slot_${clickCounter}`;
            console.log(`🚀 [Klik #${clickCounter}] Menggunakan Slot Login Terpaku: Slot ${clickCounter}`);
        } 
        // JIKA SUDAH BRUTAL (KLIK KE-16 DAN SETERUSNYA)
        else {
            targetFolder = `D:/bot-warTiket-edge/PuppeteerProfile_${sessionId}`;
            console.log(`🔥 [Klik #${clickCounter}] Slot Utama Penuh! Pindah ke Mode Timestamp: Profil #${sessionId}`);
        }

        console.log(`📁 Lokasi Folder Cache: ${targetFolder}`);

        // Jalankan Puppeteer dengan folder yang sudah ditentukan di atas
        const browser = await puppeteer.launch({
            headless: false,
            executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
            ignoreDefaultArgs: ['--enable-automation'], 
            args: [
                '--start-maximized',
                `--user-data-dir=${targetFolder}`, 
                '--disable-blink-features=AutomationControlled',
                '--no-first-run',                 // Lewati halaman "Selamat Datang" pertama kali install
                '--no-default-browser-check',      // Jangan tanya apakah mau dijadikan browser utama
                '--disable-features=Translate',    // Matikan pop-up auto-translate bahasa
                '--disable-extensions',            // Matikan extension yang mungkin bikin lemot/blocking
                '--disable-component-extensions-with-background-pages'
            ]
        });
        
        sessionControl.browser = browser;
        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0); 
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0');

        console.log(`[Session #${sessionId}] Membuka halaman: ${urlTarget}`);
        
        let halamanTerbuka = false;
        while (!halamanTerbuka && sessionControl.isRunning) {
            try {
                await page.goto(urlTarget, { waitUntil: 'domcontentloaded', timeout: 5000 });
                halamanTerbuka = true;
            } catch (err) {
                console.log(`⚠️ [Session #${sessionId}] RTO halaman awal. Mengulang...`);
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        let tiketTersedia = false;
        let counterRefresh = 0;

        // Gunakan page.$ daripada waitForSelector untuk pengecekan instan tanpa delay timeout
        while (!tiketTersedia && sessionControl.isRunning) {
            try {
                counterRefresh++;

                // Optimasi Log: Jangan clear terminal, tapi timpa barisnya saja (Khas CLI profesional)
                if (counterRefresh % 20 === 0) {
                    process.stdout.write(`[Session #${sessionId}] Telah melakukan ${counterRefresh} kali pengecekan...\r`);
                }

                // Pengecekan instan (Non-blocking). Jika tidak ada, langsung mengembalikan nilai null dalam hitungan milidetik
                const semuaTombol = await page.$$(selector);
                const tombolTarget = semuaTombol[targetIndex]; 

                if (tombolTarget) {
                    const classList = await page.evaluate(el => el.className, tombolTarget);
                    const isButtonDisabled = classList.includes('disabled');

                    if (!isButtonDisabled) {
                        tiketTersedia = true;
                        sessionControl.isRunning = false;
                        
                        console.log(`\n🔥 [BOOM] [Session #${sessionId}] TOMBOL AKTIF PADA CEK KE-${counterRefresh}! LANGSUNG KLIK!!!`);
                        await tombolTarget.click();
                        break;
                    }
                }
                
                // STRATEGI WAR: Daripada reload satu halaman penuh (yang bikin Cloudflare curiga & RTO),
                // Kita cukup berikan jeda micro-seconds untuk melakukan loop pengecekan ulang elemen DOM HTML
                await new Promise(resolve => setTimeout(resolve, 100)); 

            } catch (err) {
                // Manajemen jika halaman crash / RTO penuh
                console.log(`\n⚠️ [Session #${sessionId}] Kendala pada DOM, mencoba reload halaman...`);
                if (sessionControl.isRunning) {
                    try {
                        // Hanya reload jika benar-benar terjadi eror struktural
                        await page.reload({ waitUntil: 'domcontentloaded', timeout: 4000 });
                    } catch (retryErr) {}
                }
            }
        }

    } catch (err) { // ✅ Fix #1: penutup try block start-war
        console.log(`\n💀 [Session #${sessionId}] Error fatal: ${err.message}`);
    } finally {
        // Bersihkan session dari array setelah selesai
        activeSessions = activeSessions.filter(s => s.id !== sessionId);
    }
});

// 🔥 ENDPOINT STOP: Sekarang akan menutup SEMUA browser yang sedang aktif sekaligus
app.post('/api/stop-war', async (req, res) => {
    console.log(`🛑 Menerima perintah STOP. Membersihkan ${activeSessions.length} browser aktif...`);

    for (const session of activeSessions) {
        session.isRunning = false; // Matikan loop internalnya
        try {
            if (session.browser) {
                await session.browser.close(); // Tutup jendela browsernya
            }
        } catch (err) {
            console.log(`Gagal menutup browser session #${session.id}`);
        }
    }

    // 🔥 RESET HITUNGAN JADI NOL KEMBALI 🔥
    clickCounter = 0; 
    console.log("🛑 Semua browser dimatikan. Counter klik di-reset ke 0.");
    
    res.json({ status: 'success', message: 'Semua browser berhasil dihentikan.' });
});

app.listen(3000, () => console.log('API Bot Multi-Session standby di port 3000...'));