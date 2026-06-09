/**
 * ============================================================
 *  PATCH: Tambah Riwayat — Dosis Pupuk, Varietas Padi, Ukur Lahan
 *  PPL Milenial Wajo — Smart Farming
 *  Versi: 1.1  (bugfix Ukur Lahan)
 * ============================================================
 *
 *  CARA PASANG:
 *  Letakkan file ini di folder yang sama dengan HTML utama,
 *  lalu tambahkan SETELAH script patch_smartfarming.js:
 *
 *    <script src="patch_smartfarming.js"></script>
 *    <script src="patch_riwayat_tambahan.js"></script>
 *
 *  YANG DITAMBAHKAN:
 *  1. Riwayat Dosis Pupuk   — tersimpan saat klik HITUNG DOSIS PUPUK
 *  2. Riwayat Varietas Padi — tersimpan saat hasil rekomendasi muncul
 *  3. Riwayat Ukur Lahan    — tersimpan saat:
 *       a) selesaiJalan() dipanggil (GPS keliling lahan), ATAU
 *       b) event draw:created / draw:edited Leaflet-Draw (gambar polygon manual)
 *     TIDAK lagi melalui override hitungLuas() agar:
 *       • Deteksi metode selalu akurat (GPS vs Gambar)
 *       • Tidak ada riwayat duplikat saat polygon diedit
 *       • Tidak tersimpan saat hitungLuas dipanggil internal (mis. reset)
 *
 *  CHANGELOG v1.1:
 *  - [FIX] Deteksi metode "GPS" vs "Gambar" sebelumnya selalu salah
 *    karena gpsPoints tidak dikosongkan oleh selesaiJalan() — kini
 *    riwayat disimpan LANGSUNG di titik pemanggil yang benar.
 *  - [FIX] Riwayat duplikat saat user mengedit polygon telah dihilangkan
 *    dengan memisahkan hook draw:created dan draw:edited.
 *  - [FIX] Guard nilai luas diperkuat: cek parseFloat > 0, bukan string '0'.
 *  - [FIX] Guard tambahRiwayat & getLahanAktif aman meski load terlambat.
 * ============================================================
 */

(function () {
    'use strict';

    // =========================================================================
    //  HELPER: Tunggu hingga fungsi target tersedia (menghindari race condition
    //  dengan patch_smartfarming.js yang mungkin belum selesai load)
    // =========================================================================
    function tungguhingga(namafungsi, callback, maksRetry = 20, jedaMs = 150) {
        let coba = 0;
        const interval = setInterval(() => {
            coba++;
            if (typeof window[namafungsi] === 'function') {
                clearInterval(interval);
                callback();
            } else if (coba >= maksRetry) {
                clearInterval(interval);
                console.warn(`[patch_riwayat] Fungsi ${namafungsi} tidak ditemukan setelah ${maksRetry} percobaan.`);
            }
        }, jedaMs);
    }

    // =========================================================================
    //  1. RIWAYAT DOSIS PUPUK
    //     Override window.hitungRekomendasiPupuk
    //     (fungsi ini sudah di-override oleh patch_smartfarming.js — kita
    //      wrap lagi di atasnya agar tidak merusak logika sebelumnya)
    // =========================================================================
    tungguhingga('hitungRekomendasiPupuk', function () {

        const _pupukAsli = window.hitungRekomendasiPupuk;

        window.hitungRekomendasiPupuk = function () {

            // Jalankan fungsi asli (dari patch sebelumnya)
            _pupukAsli();

            // Beri jeda agar DOM hasil sudah terisi
            setTimeout(function () {
                const outputEl = document.getElementById('outputHasilPupuk');
                if (!outputEl || outputEl.style.display === 'none') return;

                // Ambil data dari form untuk ringkasan riwayat
                const kecInput  = document.getElementById('kecInput')?.value     || '-';
                const luas      = document.getElementById('luasPupuk')?.value    || '0';
                const lahan     = document.getElementById('lahanTopografi')?.value || '-';
                const tanggal   = document.getElementById('tanggalTanam')?.value  || '-';

                // Cari data dosis dari databasePupuk
                let dosisTeks = '';
                if (typeof databasePupuk !== 'undefined' && Array.isArray(databasePupuk)) {
                    const d = databasePupuk.find(r => `${r.kec} (${r.kab})` === kecInput);
                    if (d) {
                        const totalUrea    = (parseFloat(luas) * parseFloat(d.u || 0)).toFixed(0);
                        const totalPhonska = (parseFloat(luas) * parseFloat(d.n || 0)).toFixed(0);
                        dosisTeks = `Urea: ${totalUrea} kg | Phonska: ${totalPhonska} kg`;
                    }
                }

                const lahanMap = { bukit: 'Dataran Tinggi', lembah: 'Dataran Rendah', rawa: 'Rawa/DAS' };
                const lahanTeks = lahanMap[lahan] || lahan;

                const label    = `Dosis Pupuk — ${kecInput}`;
                const ringkasan =
                    `Luas: ${luas} Ha | Topografi: ${lahanTeks} | ` +
                    `Tanam: ${tanggal} | ${dosisTeks}`;

                if (typeof tambahRiwayat === 'function') {
                    tambahRiwayat('pupuk', label, ringkasan);
                }

            }, 600);
        };

        console.log('✅ [patch_riwayat] Riwayat Dosis Pupuk aktif.');
    });

    // =========================================================================
    //  2. RIWAYAT VARIETAS PADI
    //     Override window.analisisVarietasPadi
    // =========================================================================
    tungguhingga('analisisVarietasPadi', function () {

        const _varietasAsli = window.analisisVarietasPadi;

        window.analisisVarietasPadi = function () {

            // Jalankan fungsi asli
            _varietasAsli();

            // Beri jeda agar DOM hasil sudah terisi
            setTimeout(function () {
                const outputEl = document.getElementById('outputHasilVarietas');
                if (!outputEl || outputEl.style.display === 'none') return;

                // Ambil parameter input
                const targetUmur  = document.getElementById('input-umur-var')?.value   || '-';
                const curahHujan  = document.getElementById('input-hujan-var')?.value  || '-';
                const tipeLahan   = document.getElementById('input-lahan-var')?.value  || '-';

                // Hitung berapa varietas yang muncul
                const jumlahKartu = outputEl.querySelectorAll('.leaf-card, [style*="border-left"]').length;
                const ringkasanEl = outputEl.innerText?.substring(0, 200) || '-';

                const label    = `Varietas Padi — Target ${targetUmur} HST`;
                const ringkasan =
                    `Curah Hujan: ${curahHujan} | Lahan: ${tipeLahan} | ` +
                    `Umur: ${targetUmur} HST | ` +
                    ringkasanEl.replace(/\n+/g, ' ').substring(0, 120);

                if (typeof tambahRiwayat === 'function') {
                    tambahRiwayat('varietas', label, ringkasan);
                }

            }, 800);
        };

        console.log('✅ [patch_riwayat] Riwayat Varietas Padi aktif.');
    });

    // =========================================================================
    //  3. RIWAYAT UKUR LAHAN
    //
    //  DESAIN BARU (v1.1) — TIDAK lagi override hitungLuas().
    //
    //  Masalah dengan pendekatan lama (override hitungLuas):
    //  ① gpsPoints TIDAK dikosongkan oleh selesaiJalan(), hanya oleh
    //    resetPengukuran(). Akibatnya, setelah jalan keliling, jika user
    //    kemudian menggambar polygon manual, gpsPoints masih berisi titik
    //    lama → metode selalu terbaca "GPS Jalan Keliling" meski sebenarnya
    //    "Gambar di Peta". Deteksi metode 100% tidak akurat.
    //  ② Setiap kali user mengedit polygon yang sudah ada (draw:edited),
    //    hitungLuas dipanggil lagi → riwayat tersimpan duplikat.
    //  ③ hitungLuas juga dipanggil saat reset internal — bisa menyimpan
    //    nilai yang tidak diminta.
    //
    //  Solusi: simpan riwayat di DUA titik yang tepat dan sudah punya
    //  konteks metode yang benar:
    //  A) Override window.selesaiJalan() → metode pasti "GPS Jalan Keliling"
    //  B) Hook event Leaflet-Draw 'draw:created' pada map → metode pasti
    //     "Gambar di Peta" (hanya dipanggil saat polygon BARU dibuat,
    //     bukan saat diedit)
    //
    //  Riwayat tidak disimpan pada draw:edited agar tidak ada duplikat.
    // =========================================================================

    // ── Helper internal: simpan satu entri riwayat ukur ──────────────────────
    function simpanRiwayatUkur(metode) {
        // Beri jeda singkat agar hitungLuas asli sudah selesai mengisi
        // variabel global luasTotalHa & luasTotalM2
        setTimeout(function () {
            const ha = (typeof luasTotalHa !== 'undefined') ? luasTotalHa : '0';
            const m2 = (typeof luasTotalM2 !== 'undefined') ? luasTotalM2 : '0';

            // Guard ketat: nilai harus berupa angka positif
            // luasTotalHa dari hitungLuas asli berformat "x.xxxx" (toFixed(4))
            if (!ha || parseFloat(ha) <= 0) return;

            // Guard: pastikan fungsi riwayat sudah tersedia
            if (typeof tambahRiwayat !== 'function') return;

            const lahanAktif = (typeof getLahanAktif === 'function') ? getLahanAktif() : null;
            const namaLahan  = (lahanAktif && lahanAktif.nama) ? lahanAktif.nama : 'Tanpa Lahan Aktif';

            const label    = `Ukur Lahan — ${ha} Ha`;
            const ringkasan =
                `Luas: ${ha} Hektar (${m2} m²) | ` +
                `Metode: ${metode} | Lahan: ${namaLahan}`;

            tambahRiwayat('ukur', label, ringkasan);

        }, 450); // 450ms: cukup untuk hitungLuas selesai isi DOM + variabel global
    }

    // ── A) Override selesaiJalan — metode GPS pasti benar di sini ────────────
    tungguhingga('selesaiJalan', function () {

        const _selesaiJalanAsli = window.selesaiJalan;

        window.selesaiJalan = function () {
            // Jalankan fungsi asli (stop watchPosition, buat polygon, panggil hitungLuas)
            _selesaiJalanAsli();

            // Saat tiba di sini, konteks metode sudah PASTI GPS karena
            // selesaiJalan hanya bisa dipanggil via tombol "SELESAI BERKELILING LAHAN"
            simpanRiwayatUkur('GPS Jalan Keliling');
        };

        console.log('✅ [patch_riwayat] Riwayat Ukur Lahan (GPS) aktif via selesaiJalan.');
    });

    // ── B) Hook draw:created Leaflet-Draw — dipanggil hanya saat polygon BARU ─
    //  Kita tidak bisa pakai tungguhingga() di sini karena 'map' bukan window.*
    //  Gunakan strategi polling ringan yang berhenti sendiri.
    (function hookLeafletDraw() {
        let coba = 0;
        const maxCoba = 40; // 40 × 250ms = 10 detik
        const interval = setInterval(function () {
            coba++;
            // 'map' adalah variabel global di index.html (bukan window.map secara eksplisit,
            // tapi berjalan di scope global sehingga window.map = map)
            if (typeof window.map !== 'undefined' && window.map &&
                typeof window.map.on === 'function') {
                clearInterval(interval);

                window.map.on('draw:created', function (/* e */) {
                    // Saat draw:created: polygon baru selesai digambar manual di peta.
                    // hitungLuas sudah dipanggil oleh handler asli di index.html
                    // (listener draw:created lama), jadi kita hanya perlu simpan riwayat.
                    simpanRiwayatUkur('Gambar di Peta');
                });

                // SENGAJA tidak hook draw:edited agar tidak ada duplikat riwayat.
                // Edit polygon hanya memperbarui luas di layar, bukan aksi baru.

                console.log('✅ [patch_riwayat] Riwayat Ukur Lahan (Gambar Peta) aktif via draw:created.');
            } else if (coba >= maxCoba) {
                clearInterval(interval);
                console.warn('[patch_riwayat] window.map tidak ditemukan — hook draw:created dilewati.');
            }
        }, 250);
    })();

    // =========================================================================
    //  4. IKON & WARNA MODE BARU di renderDaftarRiwayat
    //     Tambahkan ikon untuk mode 'varietas' dan 'ukur' yang belum ada
    //     di ikonMode pada patch_smartfarming.js
    //     (patch_smartfarming.js sudah punya 'pupuk' dan 'varietas',
    //      tapi belum ada 'ukur')
    // =========================================================================
    tungguhingga('renderDaftarRiwayat', function () {

        const _renderAsli = window.renderDaftarRiwayat;

        // Hanya patch jika fungsi asli ada
        if (typeof _renderAsli !== 'function') return;

        // Inject CSS untuk border warna mode ukur & varietas
        const style = document.createElement('style');
        style.textContent = `
            .riwayat-item.mode-ukur     { border-left-color: #22d3ee; }
            .riwayat-item.mode-varietas { border-left-color: #10b981; }
        `;
        document.head.appendChild(style);

        // Override renderDaftarRiwayat untuk menambahkan ikon 'ukur'
        // (ikon 'varietas' sudah ada di patch_smartfarming.js)
        window.renderDaftarRiwayat = function () {
            const list = (function getRiwayat() {
                try { return JSON.parse(localStorage.getItem('sf_riwayat') || '[]'); }
                catch(e) { return []; }
            })();

            const container = document.getElementById('daftarRiwayat');
            if (!container) return;

            if (list.length === 0) {
                container.innerHTML =
                    `<div style="text-align:center; color:#475569; padding:30px 0; font-size:0.85rem;">` +
                    `Belum ada riwayat analisis.<br>Riwayat otomatis tersimpan setelah analisis.</div>`;
                return;
            }

            // Peta ikon — gabungkan semua mode termasuk yang baru
            const ikonMode = {
                daun:     '🍃',
                hama:     '🐛',
                gulma:    '🌿',
                tanah:    '🟫',
                cuaca:    '🌤️',
                pupuk:    '🧪',
                biaya:    '💰',
                malai:    '🌾',
                bwd:      '🎨',
                varietas: '🌱',
                ukur:     '📐',   // ← BARU
            };

            container.innerHTML = list.map(function (r) {
                const tgl    = new Date(r.waktu);
                const tglStr = tgl.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) +
                               ' ' + tgl.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

                return `
                <div class="riwayat-item mode-${r.mode}">
                    <div class="riwayat-header">
                        <span class="riwayat-label">
                            ${ikonMode[r.mode] || '📊'} ${r.mode.toUpperCase()} — ${r.lahan}
                        </span>
                        <span class="riwayat-tgl">${tglStr}</span>
                    </div>
                    <div style="font-weight:700; color:#fff; font-size:0.9rem; margin-bottom:4px;">${r.label}</div>
                    <div class="riwayat-hasil">${r.ringkasan}</div>
                </div>`;
            }).join('');
        };

        console.log('✅ [patch_riwayat] Ikon & warna mode ukur/varietas diperbarui.');
    });

    console.log('✅ [patch_riwayat_tambahan v1.1] Semua modul dimuat: Dosis Pupuk, Varietas Padi, Ukur Lahan.');

})();
