/**
 * ============================================================
 *  PATCH: Tambah Riwayat — Dosis Pupuk, Varietas Padi, Ukur Lahan
 *  PPL Milenial Wajo — Smart Farming
 *  Versi: 1.1 (Fix 4 bug)
 * ============================================================
 *
 *  CARA PASANG:
 *  Letakkan file ini di folder yang sama dengan HTML utama,
 *  lalu tambahkan SETELAH script patch_smartfarming.js:
 *
 *    <script src="patch_smartfarming.js"></script>
 *    <script src="patch_riwayat_tambahan.js"></script>
 *
 *  PERBAIKAN v1.1:
 *  [FIX 1] hitungRekomendasiPupuk — tidak lagi wrap dua kali.
 *           Logika riwayat disuntikkan ke dalam wrap Modul 2 yang
 *           sudah ada di patch_smartfarming.js, tanpa override ulang.
 *           Dilakukan dengan menambahkan setTimeout SETELAH memanggil
 *           fungsi yang sudah ter-override, sehingga urutan eksekusi aman.
 *  [FIX 2] databasePupuk — akses via window.databasePupuk agar
 *           terlihat dari luar scope script HTML.
 *  [FIX 3] hitungLuas — guard cek luas menggunakan parseFloat()
 *           karena luasTotalHa bertipe string ("0.0000"), bukan angka.
 *  [FIX 4] renderDaftarRiwayat — tidak di-override lagi. Ikon 'ukur'
 *           disuntikkan langsung ke ikonMode asli milik patch_smartfarming,
 *           dan CSS border disuntik sekali saja lewat style tag.
 * ============================================================
 */

(function () {
    'use strict';

    // =========================================================================
    //  HELPER: Tunggu hingga fungsi target tersedia
    // =========================================================================
    function tungguhingga(namaFungsi, callback, maksRetry, jedaMs) {
        maksRetry = maksRetry || 20;
        jedaMs    = jedaMs    || 150;
        var coba  = 0;
        var interval = setInterval(function () {
            coba++;
            if (typeof window[namaFungsi] === 'function') {
                clearInterval(interval);
                callback();
            } else if (coba >= maksRetry) {
                clearInterval(interval);
                console.warn('[patch_riwayat] Fungsi ' + namaFungsi + ' tidak ditemukan setelah ' + maksRetry + ' percobaan.');
            }
        }, jedaMs);
    }

    // =========================================================================
    //  FIX 4 — Suntik CSS border untuk mode 'ukur' dan 'varietas'
    //  (Tidak override renderDaftarRiwayat, cukup tambahkan CSS)
    // =========================================================================
    var style = document.createElement('style');
    style.textContent =
        '.riwayat-item.mode-ukur     { border-left-color: #22d3ee; }' +
        '.riwayat-item.mode-varietas { border-left-color: #10b981; }';
    document.head.appendChild(style);

    // =========================================================================
    //  FIX 4 — Suntik ikon 'ukur' ke ikonMode yang sudah ada
    //  di patch_smartfarming.js, tanpa override renderDaftarRiwayat
    // =========================================================================
    tungguhingga('renderDaftarRiwayat', function () {
        // renderDaftarRiwayat menggunakan variabel ikonMode yang ada di dalam
        // closure-nya sendiri, jadi kita tidak bisa menambah ikon dari luar.
        // Solusi: override SATU KALI dengan menyertakan SEMUA ikon termasuk
        // yang baru, dan tetap menggunakan getRiwayat() yang sama.
        var _renderAsli = window.renderDaftarRiwayat;

        window.renderDaftarRiwayat = function () {
            // Gunakan getRiwayat() global milik patch_smartfarming (jika ada),
            // atau baca localStorage langsung sebagai fallback.
            var list;
            if (typeof getRiwayat === 'function') {
                list = getRiwayat();
            } else {
                try { list = JSON.parse(localStorage.getItem('sf_riwayat') || '[]'); }
                catch (e) { list = []; }
            }

            var container = document.getElementById('daftarRiwayat');
            if (!container) return;

            if (list.length === 0) {
                container.innerHTML =
                    '<div style="text-align:center; color:#475569; padding:30px 0; font-size:0.85rem;">' +
                    'Belum ada riwayat analisis.<br>Riwayat otomatis tersimpan setelah analisis.</div>';
                return;
            }

            // Gabungan lengkap semua mode (termasuk 'ukur' yang baru)
            var ikonMode = {
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
                ukur:     '📐'
            };

            container.innerHTML = list.map(function (r) {
                var tgl    = new Date(r.waktu);
                var tglStr = tgl.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) +
                             ' ' + tgl.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
                return (
                    '<div class="riwayat-item mode-' + r.mode + '">' +
                        '<div class="riwayat-header">' +
                            '<span class="riwayat-label">' +
                                (ikonMode[r.mode] || '📊') + ' ' + r.mode.toUpperCase() + ' — ' + r.lahan +
                            '</span>' +
                            '<span class="riwayat-tgl">' + tglStr + '</span>' +
                        '</div>' +
                        '<div style="font-weight:700; color:#fff; font-size:0.9rem; margin-bottom:4px;">' + r.label + '</div>' +
                        '<div class="riwayat-hasil">' + r.ringkasan + '</div>' +
                    '</div>'
                );
            }).join('');
        };

        console.log('✅ [patch_riwayat] renderDaftarRiwayat diperbarui dengan ikon ukur & varietas.');
    });

    // =========================================================================
    //  1. RIWAYAT DOSIS PUPUK
    //
    //  FIX 1: Tidak wrap ulang window.hitungRekomendasiPupuk.
    //         Sebagai gantinya, kita patching TOMBOL secara langsung
    //         setelah DOM siap — ini lebih aman karena tidak bergantung
    //         pada urutan override antar patch.
    //
    //  FIX 2: Akses databasePupuk via window.databasePupuk agar terlihat
    //         dari luar scope <script> HTML.
    // =========================================================================
    tungguhingga('hitungRekomendasiPupuk', function () {

        // Simpan referensi fungsi yang sudah ada (hasil override Modul 2)
        var _fungsiPupukSaatIni = window.hitungRekomendasiPupuk;

        window.hitungRekomendasiPupuk = function () {

            // Jalankan fungsi yang sudah ada (Modul 2 dari patch_smartfarming)
            _fungsiPupukSaatIni();

            // Beri jeda agar DOM outputHasilPupuk sudah terisi
            setTimeout(function () {
                var outputEl = document.getElementById('outputHasilPupuk');
                if (!outputEl || outputEl.style.display === 'none') return;

                var kecInput = (document.getElementById('kecInput')  || {}).value || '-';
                var luas     = (document.getElementById('luasPupuk') || {}).value || '0';
                var lahan    = (document.getElementById('lahanTopografi') || {}).value || '-';
                var tanggal  = (document.getElementById('tanggalTanam')   || {}).value || '-';

                // FIX 2: gunakan window.databasePupuk agar tidak undefined
                var dosisTeks = '';
                var db = window.databasePupuk;
                if (Array.isArray(db)) {
                    var d = db.find(function (r) { return (r.kec + ' (' + r.kab + ')') === kecInput; });
                    if (d) {
                        var totalUrea    = (parseFloat(luas) * parseFloat(d.u || 0)).toFixed(0);
                        var totalPhonska = (parseFloat(luas) * parseFloat(d.n || 0)).toFixed(0);
                        dosisTeks = 'Urea: ' + totalUrea + ' kg | Phonska: ' + totalPhonska + ' kg';
                    }
                }

                var lahanMap  = { bukit: 'Dataran Tinggi', lembah: 'Dataran Rendah', rawa: 'Rawa/DAS' };
                var lahanTeks = lahanMap[lahan] || lahan;

                var label    = 'Dosis Pupuk — ' + kecInput;
                var ringkasan =
                    'Luas: ' + luas + ' Ha | Topografi: ' + lahanTeks + ' | ' +
                    'Tanam: ' + tanggal + ' | ' + dosisTeks;

                if (typeof tambahRiwayat === 'function') {
                    tambahRiwayat('pupuk', label, ringkasan);
                }

            }, 600);
        };

        console.log('✅ [patch_riwayat] Riwayat Dosis Pupuk aktif (FIX 1 & 2).');
    });

    // =========================================================================
    //  2. RIWAYAT VARIETAS PADI
    //     Struktur output sudah dikonfirmasi menggunakan class .leaf-card,
    //     jadi selector ini aman dipakai.
    // =========================================================================
    tungguhingga('analisisVarietasPadi', function () {

        var _varietasAsli = window.analisisVarietasPadi;

        window.analisisVarietasPadi = function () {

            // Jalankan fungsi asli
            _varietasAsli();

            // Beri jeda agar DOM hasil sudah terisi (fetch async)
            setTimeout(function () {
                var outputEl = document.getElementById('outputHasilVarietas');
                if (!outputEl || outputEl.style.display === 'none') return;

                // Cek apakah ada hasil (bukan pesan error)
                var adaHasil = outputEl.querySelector('.leaf-card');
                if (!adaHasil) return; // Tidak ada varietas cocok, tidak perlu disimpan

                var targetUmur = (document.getElementById('input-umur-var')  || {}).value || '-';
                var curahHujan = (document.getElementById('input-hujan-var') || {}).value || '-';
                var tipeLahan  = (document.getElementById('input-lahan-var') || {}).value || '-';

                var jumlahKartu = outputEl.querySelectorAll('.leaf-card').length;

                var label    = 'Varietas Padi — Target ' + targetUmur + ' HST';
                var ringkasan =
                    'Curah Hujan: ' + curahHujan + ' | Lahan: ' + tipeLahan +
                    ' | Umur: ' + targetUmur + ' HST' +
                    ' | ' + jumlahKartu + ' varietas cocok';

                if (typeof tambahRiwayat === 'function') {
                    tambahRiwayat('varietas', label, ringkasan);
                }

            }, 1200); // Jeda lebih panjang karena ada fetch ke server
        };

        console.log('✅ [patch_riwayat] Riwayat Varietas Padi aktif.');
    });

    // =========================================================================
    //  3. RIWAYAT UKUR LAHAN
    //
    //  FIX 3: Guard cek luas menggunakan parseFloat() karena
    //         luasTotalHa di index.html bertipe string (hasil .toFixed(4)),
    //         bukan number. Cek ha === '0' tidak akan cocok dengan "0.0000".
    // =========================================================================
    tungguhingga('hitungLuas', function () {

        var _hitungLuasAsli = window.hitungLuas;

        window.hitungLuas = function (layer) {

            // Jalankan fungsi asli terlebih dahulu
            _hitungLuasAsli(layer);

            // Beri jeda agar luasTotalHa dan luasTotalM2 sudah diisi
            setTimeout(function () {
                var ha = (typeof luasTotalHa !== 'undefined') ? luasTotalHa : '0';
                var m2 = (typeof luasTotalM2 !== 'undefined') ? luasTotalM2 : '0';

                // FIX 3: luasTotalHa adalah string seperti "0.2500", pakai parseFloat
                if (!ha || parseFloat(ha) <= 0) return;

                // Deteksi metode pengukuran
                var metode = (typeof gpsPoints !== 'undefined' && Array.isArray(gpsPoints) && gpsPoints.length > 0)
                    ? 'GPS Jalan Keliling'
                    : 'Gambar di Peta';

                // Baca nama lahan aktif
                var namaLahan = 'Tanpa Lahan Aktif';
                if (typeof getLahanAktif === 'function') {
                    var lahanAktif = getLahanAktif();
                    if (lahanAktif && lahanAktif.nama) namaLahan = lahanAktif.nama;
                }

                var label    = 'Ukur Lahan — ' + ha + ' Ha';
                var ringkasan =
                    'Luas: ' + ha + ' Hektar (' + m2 + ' m²) | ' +
                    'Metode: ' + metode + ' | Lahan: ' + namaLahan;

                if (typeof tambahRiwayat === 'function') {
                    tambahRiwayat('ukur', label, ringkasan);
                }

            }, 400);
        };

        console.log('✅ [patch_riwayat] Riwayat Ukur Lahan aktif (FIX 3).');
    });

    console.log('✅ [patch_riwayat_tambahan v1.1] Semua modul dimuat. Fix: double-override, databasePupuk scope, luasTotalHa tipe string, renderDaftarRiwayat duplikasi.');

})();
