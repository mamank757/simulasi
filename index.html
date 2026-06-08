/**
 * PATCH: Tab "Risiko Cuaca"
 *
 * ATURAN:
 * - Cuaca (lokasi, prakiraan per jam, 7 hari, parameter satelit, radar)
 *   → tampil otomatis via IP seperti biasa
 * - Kotak analisis risiko (Fase Tanaman, Tikus, Penggerek Batang,
 *   Hawar Pelepah, Wereng, Tungro) dengan class .info-box-dynamic
 *   → HANYA tampil setelah tombol "Perbarui ke Lokasi Akurat (GPS)" ditekan
 */

(function () {

  var _gpsAktif = false;

  var style = document.createElement('style');
  style.id  = 'patch-risiko-style';
  style.textContent = '.info-box-dynamic { display: none !important; }';
  document.head.appendChild(style);

  function tampilkanKotakRisiko() {
    var el = document.getElementById('patch-risiko-style');
    if (el) el.remove();
  }

  window.addEventListener('load', function () {
    // FIX: Pastikan aktifkanGPS ada sebelum di-wrap
    if (typeof window.aktifkanGPS !== 'function') return;
    var _aktifkanGPSAsli = window.aktifkanGPS;

    window.aktifkanGPS = async function () {
      await _aktifkanGPSAsli();
      _gpsAktif = true;
      tampilkanKotakRisiko();
    };
  });

})();

/**
 * ============================================================
 *  PATCH: Perbaikan Kalkulasi & Jadwal Pemupukan E-RDKK
 *  PPL Milenial Wajo — Smart Farming
 *  Versi Patch: 3.1 (Fixed)
 * ============================================================
 */

// ── MODUL 1: ESTIMASI HASIL PANEN ────────────────────────────────────────────
(function () {

    const FAKTOR_SUSUT_COMBINE = 0.92;
    const FAKTOR_SUSUT_MANUAL  = 0.87;

    const PARAM_VARIETAS = {
        genjah: { b1000: 26.5, bernas: 0.86 },
        sedang: { b1000: 28.5, bernas: 0.88 },
        dalam:  { b1000: 30.0, bernas: 0.80 },
    };

    // FIX: Simpan referensi ORIGINAL tampilkanHasil di sini, sebelum ada yang override
    // Bagian I (riwayat) akan wrap SETELAH modul ini, rantai benar:
    // Bagian I wrapper → Modul 1 wrapper → fungsi asli HTML
    const _tampilkanHasilAsli = window.tampilkanHasil;

    window.tampilkanHasil = function (data) {

        if (typeof currentMode !== 'undefined' && currentMode !== 'malai') {
            if (typeof _tampilkanHasilAsli === 'function') return _tampilkanHasilAsli(data);
            return;
        }

        let out = data;
        out = Array.isArray(data) ? data[0] : data;
        if (out.outputs && out.outputs[0]) out = out.outputs[0];

        const listM      = document.getElementById('listMalai');
        const totalBulirFotoIni = out.count || 0;

        if (hasilSampelBulir.length < 3) {
            hasilSampelBulir.push(totalBulirFotoIni);
        }

        listM.innerHTML = "";
        hasilSampelBulir.forEach((val, index) => {
            listM.innerHTML +=
                `<div class="malai-counter-box">` +
                `<span>🌾 Foto Sampel Malai ke-${index + 1}</span>` +
                `<span style="color:var(--accent-green); font-weight:700;">${val} Bulir</span>` +
                `</div>`;
        });

        document.getElementById('result').style.display   = 'block';
        document.getElementById('resConf').style.display  = 'block';
        document.getElementById('boxMalai').style.display = 'block';
        document.getElementById('resLabel').innerText     = `Sampel ke-${hasilSampelBulir.length} Tersimpan`;

        const btnAnalisis = document.getElementById('btnAnalisis');

        if (hasilSampelBulir.length === 3) {

            const rataBulir = (hasilSampelBulir[0] + hasilSampelBulir[1] + hasilSampelBulir[2]) / 3;

            const metode = document.getElementById('metodeTanam').value;
            let rumpunPerMeter = 25;
            let namaMetode     = "Tapin Tradisional / Tegel";

            if (metode === 'legowo')              { rumpunPerMeter = 33; namaMetode = "Jajar Legowo 2:1 / 4:1"; }
            else if (metode === 'tabela_larikan') { rumpunPerMeter = 40; namaMetode = "Tabela Larikan / Drum Seeder"; }
            else if (metode === 'tabela_hambur')  { rumpunPerMeter = 60; namaMetode = "Tabela Hambur / Sere"; }
            else if (metode === 'custom') {
                rumpunPerMeter = parseInt(document.getElementById('manualRumpun').value) || 25;
                namaMetode     = `Kepadatan Manual (${rumpunPerMeter} rumpun/m²)`;
            }

            const varKunci = document.getElementById('jenisVarietas').value;
            const param    = PARAM_VARIETAS[varKunci] || PARAM_VARIETAS.sedang;
            const namaVarietas = varKunci === 'genjah'
                ? "Genjah (M70D, Cakrabuana, dll)"
                : (varKunci === 'dalam' ? "Dalam / Lokal" : "Sedang (Ciherang, Inpari, Mekongga, dll)");

            const malaiPerRumpun = parseInt(document.getElementById('malaiPerRumpun').value) || 16;

            const bulirBernas     = rataBulir * param.bernas;
            const totalRumpunHa   = rumpunPerMeter * 10000;
            const totalBulirHa    = totalRumpunHa * malaiPerRumpun * bulirBernas;
            const beratGramHa     = totalBulirHa * (param.b1000 / 1000);
            const produksiTonHa   = beratGramHa / 1_000_000;
            const hasilRiilTonHa  = produksiTonHa * FAKTOR_SUSUT_COMBINE;

            const hasilMin = (hasilRiilTonHa * 0.90).toFixed(2);
            const hasilMax = (hasilRiilTonHa * 1.10).toFixed(2);

            document.getElementById('resLabel').innerText = "Kalkulasi Hasil Panen";
            document.getElementById('resUbinanTeks').innerHTML = `
                <div style="background: rgba(0,0,0,0.15); border-radius: 12px; padding: 12px; margin-bottom: 12px; font-size: 0.8rem; line-height: 1.8; color: #cbd5e1;">
                    📊 <b>Rata-rata Cacah Bulir AI:</b> ${rataBulir.toFixed(1)} butir / malai<br>
                    🌱 <b>Jumlah Bernas:</b> ${bulirBernas.toFixed(1)} butir / malai (bernas ${(param.bernas * 100).toFixed(0)}%)<br>
                    ⚙️ <b>Sistem Lahan:</b> ${namaMetode} — ${rumpunPerMeter} rumpun/m² × ${malaiPerRumpun} malai/rumpun<br>
                    🌾 <b>Parameter Varietas:</b> ${namaVarietas} — Bobot 1000 butir: <b>${param.b1000}g</b><br>
                    📉 <b>Koreksi Susut Panen:</b> ${((1 - FAKTOR_SUSUT_COMBINE) * 100).toFixed(0)}% (mekanis + kadar air 14% GKG)<br>
                    <div style="margin-top:4px; padding-top:4px; border-top: 1px dashed rgba(255,255,255,0.1); font-size:0.72rem; opacity:0.65; font-style:italic;">
                        ✅ Tidak ada potongan pematang — rumpun/m² sudah merupakan populasi netto area tanam.
                    </div>
                </div>

                <div style="background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16,185,129,0.3); border-radius: 16px; padding: 16px; text-align: center;">
                    <div style="font-size: 0.72rem; color: #10b981; font-weight: 700; letter-spacing: 1px; margin-bottom: 6px;">ESTIMASI PRODUKSI GKG</div>
                    <div style="font-size: 2rem; font-weight: 800; color: var(--accent-green); line-height: 1.1;">
                        ${hasilRiilTonHa.toFixed(2)} <span style="font-size: 1rem;">Ton/Ha</span>
                    </div>
                    <div style="font-size: 0.8rem; color: #94a3b8; margin-top: 6px;">
                        Kisaran wajar: <b style="color:#fff;">${hasilMin} – ${hasilMax} Ton/Ha</b>
                    </div>
                    <div style="font-size: 0.7rem; color: #64748b; margin-top: 4px;">
                        (variasi ±10% sesuai kondisi lapangan & cuaca)
                    </div>
                </div>`;

            hasilSampelBulir = [];

            btnAnalisis.innerText        = "HITUNG LAHAN LAIN";
            btnAnalisis.style.background = "var(--accent-biaya)";
            btnAnalisis.onclick = () => {
                document.getElementById('preview').style.display    = 'none';
                document.getElementById('msg').style.display        = 'block';
                document.getElementById('result').style.display     = 'none';
                document.getElementById('btnCamera').style.display  = 'block';
                btnAnalisis.style.display = 'none';
                listM.innerHTML = "";
                document.getElementById('resUbinanTeks').innerHTML =
                    "Ambil 3 foto malai padi secara bergantian untuk memunculkan estimasi produktivitas lahan per Hektar.";
                btnAnalisis.onclick       = mulaiAnalisis;
                btnAnalisis.style.background = "#3b82f6";
            };

        } else {
            document.getElementById('resUbinanTeks').innerHTML =
                `⏳ <b>Antrean Sampel:</b> Baru terkumpul <b>${hasilSampelBulir.length} dari 3</b> foto sampel.<br>` +
                `Silakan ambil foto sampel malai berikutnya.`;

            if (hasilSampelBulir.length === 1)      btnAnalisis.innerText = "AMBIL FOTO KEDUA";
            else if (hasilSampelBulir.length === 2) btnAnalisis.innerText = "AMBIL FOTO KETIGA";

            btnAnalisis.onclick = () => window.mintaIzinKamera(bukaKamera);
            btnAnalisis.style.background = "#2563EB";
        }

        document.getElementById('resConf').innerText = `Tingkat Keyakinan: 100.0%`;
    };

    console.log("✅ [Modul 1] Patch Kalkulasi Hasil Panen v3.1 aktif.");

})();


// ============================================================
//  MODUL 2: PERBAIKAN JADWAL & PROPORSI PEMUPUKAN E-RDKK
// ============================================================
(function () {

    const _hitungRekomendasiPupukAsli = window.hitungRekomendasiPupuk;

    window.hitungRekomendasiPupuk = function () {

        const kecInput  = document.getElementById("kecInput").value;
        const luas      = parseFloat(document.getElementById("luasPupuk").value);
        const lahan     = document.getElementById("lahanTopografi").value;
        const tanggal   = document.getElementById("tanggalTanam").value;

        const d = databasePupuk.find(r => `${r.kec} (${r.kab})` === kecInput);

        if (!d || isNaN(luas) || !tanggal) {
            alert("Pilih kecamatan dari daftar & isi seluruh data dengan benar!");
            return;
        }

        function faktorTopo(nilaiKg) {
            if (lahan === "lembah") return nilaiKg * 0.7;
            if (lahan === "rawa")   return nilaiKg * 0.5;
            return nilaiKg;
        }

        function tglPlus(hari) {
            const t = new Date(tanggal);
            t.setDate(t.getDate() + hari);
            return t.toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' });
        }

        const HST_I   = 7;
        const HST_II  = 21;
        const HST_III = 45;

        const tgl1 = tglPlus(HST_I);
        const tgl2 = tglPlus(HST_II);
        const tgl3 = tglPlus(HST_III);

        const totalUrea = luas * faktorTopo(d.u);
        const u1 = totalUrea * (1/3);
        const u2 = totalUrea * (1/3);
        const u3 = totalUrea * (1/3);

        const totalPhonska = luas * faktorTopo(d.n);
        const p1 = totalPhonska * 0.50;
        const p2 = totalPhonska * 0.30;
        const p3 = totalPhonska * 0.20;

        const org = luas * faktorTopo(d.o);

        const sak = (kg) => (Math.round(kg / 25) / 2).toFixed(1);

        const warnaUrea = "#3b82f6";
        const warnaPhon = "#10b981";

        const hasilHTML = `
            <div style="font-size: 1rem; font-weight:800; color:var(--accent-pupuk); margin-bottom:12px; text-align:center; border-bottom: 1px dashed rgba(255,255,255,0.1); padding-bottom: 8px;">
                📋 HASIL REKOMENDASI DOSIS PEMUPUKAN
            </div>

            <b>📍 Wilayah Binaan:</b> ${kecInput}<br>
            <b>📐 Luas Hamparan:</b> ${luas} Ha<br><br>

            ${org > 0 ? `
            <div style="background: rgba(255,255,255,0.03); padding: 10px; border-radius: 8px; margin-bottom: 12px; border-left: 3px solid var(--accent-soil)">
                <b>📦 Pupuk Organik / Kompos Awal (Jika Tersedia):</b><br>
                <span style="color: #fff; font-weight:700;">${org.toFixed(0)} kg</span> (${sak(org)} Sak)
                <br><small style="opacity:0.6;">Diberikan saat pengolahan tanah, 5–7 hari sebelum tanam</small>
            </div>` : ''}

            <b>📅 JADWAL PEMUPUKAN BERIMBANG (3 TAHAP)</b>
            <div style="background:rgba(0,0,0,0.15); border-radius:12px; overflow:hidden; margin: 10px 0 16px 0;">

                <div style="padding:12px 14px; border-bottom:1px solid rgba(255,255,255,0.05);">
                    <div style="font-size:0.72rem; font-weight:700; letter-spacing:0.5px; color:#94a3b8; margin-bottom:6px;">
                        ⏱️ TAHAP I — 7–10 HST &nbsp;|&nbsp; ${tgl1}
                    </div>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
                        <div style="background:rgba(59,130,246,0.1); border:1px solid rgba(59,130,246,0.25); border-radius:8px; padding:10px; text-align:center;">
                            <div style="font-size:0.65rem; color:${warnaUrea}; font-weight:700; margin-bottom:4px;">UREA</div>
                            <div style="font-size:1rem; font-weight:800; color:#fff;">${u1.toFixed(0)} kg</div>
                            <div style="font-size:0.65rem; color:#64748b;">${sak(u1)} sak</div>
                        </div>
                        <div style="background:rgba(16,185,129,0.1); border:1px solid rgba(16,185,129,0.25); border-radius:8px; padding:10px; text-align:center;">
                            <div style="font-size:0.65rem; color:${warnaPhon}; font-weight:700; margin-bottom:4px;">PHONSKA/NPK</div>
                            <div style="font-size:1rem; font-weight:800; color:#fff;">${p1.toFixed(0)} kg</div>
                            <div style="font-size:0.65rem; color:#64748b;">${sak(p1)} sak</div>
                        </div>
                    </div>
                    <div style="font-size:0.7rem; color:#64748b; margin-top:6px; padding-left:2px;">
                        💡 Rangsang pertumbuhan akar & anakan. Sulfur Phonska penting untuk tunas muda.
                    </div>
                </div>

                <div style="padding:12px 14px; border-bottom:1px solid rgba(255,255,255,0.05);">
                    <div style="font-size:0.72rem; font-weight:700; letter-spacing:0.5px; color:#94a3b8; margin-bottom:6px;">
                        ⏱️ TAHAP II — 21–25 HST &nbsp;|&nbsp; ${tgl2}
                    </div>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
                        <div style="background:rgba(59,130,246,0.1); border:1px solid rgba(59,130,246,0.25); border-radius:8px; padding:10px; text-align:center;">
                            <div style="font-size:0.65rem; color:${warnaUrea}; font-weight:700; margin-bottom:4px;">UREA</div>
                            <div style="font-size:1rem; font-weight:800; color:#fff;">${u2.toFixed(0)} kg</div>
                            <div style="font-size:0.65rem; color:#64748b;">${sak(u2)} sak</div>
                        </div>
                        <div style="background:rgba(16,185,129,0.1); border:1px solid rgba(16,185,129,0.25); border-radius:8px; padding:10px; text-align:center;">
                            <div style="font-size:0.65rem; color:${warnaPhon}; font-weight:700; margin-bottom:4px;">PHONSKA/NPK</div>
                            <div style="font-size:1rem; font-weight:800; color:#fff;">${p2.toFixed(0)} kg</div>
                            <div style="font-size:0.65rem; color:#64748b;">${sak(p2)} sak</div>
                        </div>
                    </div>
                    <div style="font-size:0.7rem; color:#64748b; margin-top:6px; padding-left:2px;">
                        💡 Berikan setelah penyiangan I selesai. Fase anakan aktif maksimal.
                    </div>
                </div>

                <div style="padding:12px 14px;">
                    <div style="font-size:0.72rem; font-weight:700; letter-spacing:0.5px; color:#f59e0b; margin-bottom:6px;">
                        ⏱️ TAHAP III — 42–50 HST &nbsp;|&nbsp; ${tgl3} &nbsp;<span style="color:#ef4444;">(Cek BWD dulu!)</span>
                    </div>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
                        <div style="background:rgba(59,130,246,0.1); border:1px solid rgba(59,130,246,0.25); border-radius:8px; padding:10px; text-align:center;">
                            <div style="font-size:0.65rem; color:${warnaUrea}; font-weight:700; margin-bottom:4px;">UREA</div>
                            <div style="font-size:1rem; font-weight:800; color:#fff;">${u3.toFixed(0)} kg</div>
                            <div style="font-size:0.65rem; color:#64748b;">${sak(u3)} sak</div>
                        </div>
                        <div style="background:rgba(16,185,129,0.1); border:1px solid rgba(16,185,129,0.25); border-radius:8px; padding:10px; text-align:center;">
                            <div style="font-size:0.65rem; color:${warnaPhon}; font-weight:700; margin-bottom:4px;">PHONSKA/NPK</div>
                            <div style="font-size:1rem; font-weight:800; color:#fff;">${p3.toFixed(0)} kg</div>
                            <div style="font-size:0.65rem; color:#64748b;">${sak(p3)} sak</div>
                        </div>
                    </div>
                    <div style="font-size:0.7rem; margin-top:8px; padding:8px 10px; background:rgba(239,68,68,0.08); border-left:3px solid #ef4444; border-radius:6px;">
                        ⚠️ <b>KONDISIONAL:</b> Berikan Urea III <b>hanya jika</b> hasil ukur BWD menunjukkan skala &lt; 4
                        (daun kuning/hijau muda). Jika daun sudah hijau tua (BWD ≥ 4), lewati Urea tahap III
                        untuk mencegah ledakan hama WBC dan penyakit Blast.
                    </div>
                </div>
            </div>

            <div class="rekap-pupuk-box">
                <b>📊 REKAP TOTAL KEBUTUHAN MUSIM INI:</b><br>
                • <b>Urea (Subsidi):</b> ${totalUrea.toFixed(0)} kg
                  (<span class="rekap-sak-text">${sak(totalUrea)} sak</span>)<br>
                • <b>Phonska/NPK:</b> ${totalPhonska.toFixed(0)} kg
                  (<span class="rekap-sak-text">${sak(totalPhonska)} sak</span>)
            </div>

            <div style="margin-top:14px; padding:10px 12px; background:rgba(100,116,139,0.08); border-radius:10px; border:1px solid rgba(255,255,255,0.04); font-size:0.7rem; color:#64748b; line-height:1.7;">
                📚 <b style="color:#94a3b8;">Referensi:</b> Jadwal & proporsi sesuai rekomendasi
                <b>BB Padi Kementan</b> (7–10 / 21–25 / 42–50 HST) dan
                panduan <b>Pemupukan Berimbang Berbasis BWD</b> (Kementan RI).
                Dosis total mengacu data <b>e-RDKK wilayah</b> setempat.
            </div>`;

        hasilTeksWA = `*SMART FARMING - PPL MILENIAL WAJO*\n` +
            `*REKOMENDASI DOSIS PUPUK E-RDKK*\n\n` +
            `📍 Wilayah: ${kecInput}\n` +
            `📐 Luas Lahan: ${luas} Ha\n` +
            (org > 0 ? `📦 Organik (sebelum tanam): ${org.toFixed(0)} kg (${sak(org)} sak)\n\n` : '\n') +
            `*JADWAL PEMUPUKAN 3 TAHAP (BB Padi Kementan):*\n\n` +
            `1️⃣ Tahap I — 7–10 HST (${tgl1})\n` +
            `   • Urea : ${u1.toFixed(0)} kg (${sak(u1)} sak)\n` +
            `   • Phonska : ${p1.toFixed(0)} kg (${sak(p1)} sak)\n\n` +
            `2️⃣ Tahap II — 21–25 HST (${tgl2})\n` +
            `   • Urea : ${u2.toFixed(0)} kg (${sak(u2)} sak)\n` +
            `   • Phonska : ${p2.toFixed(0)} kg (${sak(p2)} sak)\n\n` +
            `3️⃣ Tahap III — 42–50 HST (${tgl3}) ⚠️ Cek BWD!\n` +
            `   • Urea : ${u3.toFixed(0)} kg (${sak(u3)} sak) — hanya jika BWD < 4\n` +
            `   • Phonska : ${p3.toFixed(0)} kg (${sak(p3)} sak)\n\n` +
            `*REKAP TOTAL:*\n` +
            `• Total Urea: ${totalUrea.toFixed(0)} kg (${sak(totalUrea)} sak)\n` +
            `• Total Phonska: ${totalPhonska.toFixed(0)} kg (${sak(totalPhonska)} sak)\n\n` +
            `_Diproduksi Otomatis oleh Sistem Aplikasi Penyuluh Milenial Wajo_`;

        const div = document.getElementById("outputHasilPupuk");
        div.style.display = "block";
        div.innerHTML = hasilHTML;
    };

    console.log("✅ [Modul 2] Patch Jadwal Pemupukan E-RDKK v3.1 aktif.");

})();

// ============================================================
// PATCH SMART FARMING - PPL MILENIAL WAJO
// Berisi: Riwayat, Multi-Lahan, Notifikasi, Harga Pupuk, Fix GPS
// ============================================================

// ============================================================
// BAGIAN A: CSS TAMBAHAN
// ============================================================
(function injectCSS() {
    const style = document.createElement('style');
    style.textContent = `
/* ── PANEL MULTI-LAHAN ── */
#panelMultiLahan {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.7);
    backdrop-filter: blur(8px);
    z-index: 9000;
    align-items: flex-end;
    justify-content: center;
}
#panelMultiLahan.aktif { display: flex; }
#panelMultiLahanInner {
    background: #1b273a;
    border-radius: 24px 24px 0 0;
    padding: 20px;
    width: 100%;
    max-width: 480px;
    max-height: 85vh;
    overflow-y: auto;
}
.lahan-item {
    background: #111c2e;
    border-radius: 14px;
    padding: 14px;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 2px solid transparent;
    cursor: pointer;
    transition: all 0.2s;
}
.lahan-item.aktif-dipilih {
    border-color: #3b82f6;
    background: rgba(59,130,246,0.1);
}
.lahan-item .lahan-info h4 { margin: 0 0 4px; font-size: 0.95rem; color: #fff; }
.lahan-item .lahan-info small { color: #64748b; font-size: 0.75rem; }
.lahan-item .lahan-actions { display: flex; gap: 8px; }
.btn-lahan-kecil {
    padding: 6px 12px;
    border: none;
    border-radius: 8px;
    font-size: 0.75rem;
    font-weight: 700;
    cursor: pointer;
}
.btn-pilih { background: #3b82f6; color: #fff; }
.btn-hapus { background: rgba(239,68,68,0.2); color: #ef4444; }

/* ── FORM TAMBAH LAHAN ── */
.form-tambah-lahan {
    background: rgba(0,0,0,0.2);
    border-radius: 16px;
    padding: 16px;
    margin-top: 16px;
    border: 1px dashed rgba(59,130,246,0.4);
}
.form-tambah-lahan input,
.form-tambah-lahan select {
    width: 100%;
    background: #111c2e;
    border: 1px solid rgba(255,255,255,0.05);
    border-radius: 12px;
    padding: 12px;
    color: #fff;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.85rem;
    box-sizing: border-box;
    margin-bottom: 10px;
}

/* ── PANEL RIWAYAT ── */
#panelRiwayat {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.7);
    backdrop-filter: blur(8px);
    z-index: 9000;
    align-items: flex-end;
    justify-content: center;
}
#panelRiwayat.aktif { display: flex; }
#panelRiwayatInner {
    background: #1b273a;
    border-radius: 24px 24px 0 0;
    padding: 20px;
    width: 100%;
    max-width: 480px;
    max-height: 85vh;
    overflow-y: auto;
}
.riwayat-item {
    background: #111c2e;
    border-radius: 14px;
    padding: 14px;
    margin-bottom: 10px;
    border-left: 4px solid #3b82f6;
}
.riwayat-item.mode-daun { border-left-color: #ff4a5a; }
.riwayat-item.mode-hama { border-left-color: #ef4444; }
.riwayat-item.mode-gulma { border-left-color: #38b6ff; }
.riwayat-item.mode-tanah { border-left-color: #f59e0b; }
.riwayat-item.mode-cuaca { border-left-color: #3b82f6; }
.riwayat-item.mode-pupuk { border-left-color: #10b981; }
.riwayat-item.mode-biaya { border-left-color: #8b5cf6; }
.riwayat-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; }
.riwayat-label { font-size: 0.7rem; font-weight: 700; color: #64748b; letter-spacing: 1px; text-transform: uppercase; }
.riwayat-tgl { font-size: 0.7rem; color: #475569; }
.riwayat-hasil { font-size: 0.85rem; color: #cbd5e1; line-height: 1.5; }

/* ── PANEL HARGA PUPUK ── */
#panelHarga {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.7);
    backdrop-filter: blur(8px);
    z-index: 9000;
    align-items: flex-end;
    justify-content: center;
}
#panelHarga.aktif { display: flex; }
#panelHargaInner {
    background: #1b273a;
    border-radius: 24px 24px 0 0;
    padding: 20px;
    width: 100%;
    max-width: 480px;
    max-height: 85vh;
    overflow-y: auto;
}
.harga-field { margin-bottom: 14px; }
.harga-field label { display: block; font-size: 0.75rem; color: #8da2be; font-weight: 600; margin-bottom: 6px; }
.harga-field input {
    width: 100%;
    background: #111c2e;
    border: 1px solid rgba(255,255,255,0.05);
    border-radius: 12px;
    padding: 12px;
    color: #fff;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.9rem;
    font-weight: 600;
    box-sizing: border-box;
}
.harga-badge-subsidi {
    font-size: 0.7rem;
    color: #10b981;
    margin-top: 4px;
    display: block;
}

/* ── PANEL NOTIFIKASI ── */
#panelNotif {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.7);
    backdrop-filter: blur(8px);
    z-index: 9000;
    align-items: flex-end;
    justify-content: center;
}
#panelNotif.aktif { display: flex; }
#panelNotifInner {
    background: #1b273a;
    border-radius: 24px 24px 0 0;
    padding: 20px;
    width: 100%;
    max-width: 480px;
    max-height: 85vh;
    overflow-y: auto;
}
.notif-jadwal-item {
    background: #111c2e;
    border-radius: 14px;
    padding: 14px;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.notif-jadwal-item .hari-info { font-size: 0.8rem; color: #fff; font-weight: 600; }
.notif-jadwal-item .hari-sub { font-size: 0.72rem; color: #64748b; margin-top: 3px; }
.notif-status { font-size: 0.75rem; font-weight: 700; padding: 4px 10px; border-radius: 6px; }
.notif-lewat { background: rgba(100,116,139,0.2); color: #64748b; }
.notif-hari-ini { background: rgba(239,68,68,0.2); color: #ef4444; animation: kedip 1s ease infinite; }
.notif-akan-datang { background: rgba(59,130,246,0.2); color: #3b82f6; }
@keyframes kedip { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }

/* ── INDIKATOR LAHAN AKTIF ── */
#indikasiLahanAktif {
    background: rgba(59,130,246,0.1);
    border: 1px solid rgba(59,130,246,0.3);
    border-radius: 12px;
    padding: 10px 14px;
    margin-bottom: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
}
#indikasiLahanAktif .nama-lahan { font-size: 0.85rem; font-weight: 700; color: #3b82f6; }
#indikasiLahanAktif .ganti-lahan { font-size: 0.72rem; color: #64748b; }

/* ── BOTTOM NAVIGATION BAR ── */
#btnFloatingAksi {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 500;
    display: flex;
    flex-direction: row;
    gap: 0;
    background: #1b273a;
    border-top: 1px solid rgba(255,255,255,0.08);
    padding-bottom: env(safe-area-inset-bottom, 0px);
}
.fab-kecil {
    flex: 1;
    background: transparent;
    border: none;
    border-top: 2px solid transparent;
    color: #64748b;
    padding: 10px 0 12px;
    font-size: 0.62rem;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    white-space: nowrap;
    transition: color 0.15s, border-color 0.15s;
    letter-spacing: 0.3px;
}
.fab-kecil .fab-icon {
    font-size: 1.25rem;
    line-height: 1;
    display: block;
}
.fab-kecil:active { opacity: 0.7; }
.fab-lahan.fab-aktif   { color: #3b82f6; border-top-color: #3b82f6; }
.fab-riwayat.fab-aktif { color: #10b981; border-top-color: #10b981; }
.fab-notif.fab-aktif   { color: #f59e0b; border-top-color: #f59e0b; }
.fab-harga.fab-aktif   { color: #8b5cf6; border-top-color: #8b5cf6; }

/* ── BADGE NOTIF BARU ── */
.badge-notif {
    position: absolute;
    top: 6px;
    right: calc(50% - 18px);
    background: #ef4444;
    color: #fff;
    font-size: 0.55rem;
    font-weight: 800;
    border-radius: 50%;
    width: 14px;
    height: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
}
#fabNotifBtn { position: relative; }

/* ── TOAST NOTIFIKASI ── */
.toast-notif {
    position: fixed;
    top: 16px;
    left: 50%;
    transform: translateX(-50%) translateY(-100px);
    background: #1b273a;
    border: 1px solid #f59e0b;
    border-radius: 14px;
    padding: 14px 18px;
    z-index: 9999;
    max-width: 320px;
    width: 90%;
    box-shadow: 0 8px 24px rgba(0,0,0,0.4);
    transition: transform 0.4s cubic-bezier(0.34,1.56,0.64,1);
    display: flex;
    align-items: flex-start;
    gap: 12px;
}
.toast-notif.tampil { transform: translateX(-50%) translateY(0); }
.toast-notif .toast-icon { font-size: 1.5rem; flex-shrink: 0; }
.toast-notif .toast-teks h4 { margin: 0 0 4px; font-size: 0.85rem; color: #f59e0b; }
.toast-notif .toast-teks p { margin: 0; font-size: 0.78rem; color: #94a3b8; line-height: 1.4; }

/* LIGHT MODE OVERRIDES */
body.light-mode #panelMultiLahanInner,
body.light-mode #panelRiwayatInner,
body.light-mode #panelHargaInner,
body.light-mode #panelNotifInner { background: #f1f5f9; }
body.light-mode .lahan-item,
body.light-mode .riwayat-item,
body.light-mode .notif-jadwal-item { background: #e2e8f0; }
body.light-mode .lahan-item .lahan-info h4 { color: #0f172a; }
body.light-mode .riwayat-hasil { color: #334155; }
body.light-mode .harga-field input,
body.light-mode .form-tambah-lahan input,
body.light-mode .form-tambah-lahan select { background: #e2e8f0; color: #0f172a; border-color: #94a3b8; }
body.light-mode #btnFloatingAksi { background: #ffffff; border-top-color: #e2e8f0; }
body.light-mode .fab-kecil { color: #94a3b8; }
body.light-mode #panelMultiLahanInner h3,
body.light-mode #panelRiwayatInner h3,
body.light-mode #panelHargaInner h3,
body.light-mode #panelNotifInner h3 { color: #0f172a !important; }
body.light-mode #panelMultiLahanInner .ganti-lahan,
body.light-mode #panelMultiLahanInner .lahan-info small,
body.light-mode #panelMultiLahanInner .form-tambah-lahan > div { color: #475569 !important; }
#panelMultiLahanInner h3, #daftarLahan { color: #ffffff; }
body.light-mode #panelMultiLahanInner h3,
body.light-mode #daftarLahan { color: #64748b !important; }
body.light-mode .form-tambah-lahan > div[style*="color: #3b82f6"] { color: #1d4ed8 !important; }
body.light-mode #indikasiLahanAktif { background: rgba(59,130,246,0.08); }
body.light-mode .toast-notif { background: #ffffff; }
`;
    document.head.appendChild(style);
})();

// ============================================================
// BAGIAN B: HTML PANEL-PANEL
// ============================================================
(function injectHTML() {
    document.body.insertAdjacentHTML('beforeend', `
        <div id="btnFloatingAksi">
            <button class="fab-kecil fab-lahan" onclick="bukaPanel('multiLahan')">
                <span class="fab-icon">🌾</span>
                <span>Daftar Sawah</span>
            </button>
            <button class="fab-kecil fab-riwayat" onclick="bukaPanel('riwayat')">
                <span class="fab-icon">📋</span>
                <span id="fabRiwayatLabel">Riwayat Deteksi</span>
            </button>
            <button class="fab-kecil fab-notif" onclick="bukaPanel('notif')" id="fabNotifBtn">
                <span class="fab-icon">🔔</span>
                <span>Pengingat</span>
            </button>
            <button class="fab-kecil fab-harga" onclick="bukaPanel('harga')">
                <span class="fab-icon">💰</span>
                <span>Atur Harga</span>
            </button>
        </div>

        <div id="panelMultiLahan">
            <div id="panelMultiLahanInner">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:18px;">
                    <h3 style="margin:0; font-size:1.05rem; color:#fff;">🌾 Daftar Sawah Saya</h3>
                    <button onclick="tutupPanel('multiLahan')" style="background:rgba(239,68,68,0.2); color:#ef4444; border:none; padding:6px 14px; border-radius:8px; font-weight:700; cursor:pointer; font-size:0.8rem;">TUTUP</button>
                </div>
                <div id="daftarLahan"></div>
                <div class="form-tambah-lahan">
                    <div id="formLahanTitle" style="font-size:0.8rem; font-weight:700; color:#3b82f6; margin-bottom:12px;">➕ Tambah Petak Sawah Baru</div>
                    <input type="text" id="inputNamaLahan" placeholder="Nama Lahan (cth: Sawah Depan, Lahan Belakang)">
                    <input type="date" id="inputTglTanamLahan" placeholder="Tanggal Tanam">
                    <select id="inputVarietasLahan">
                        <option value="">-- Pilih Varietas/Umur --</option>
                        <option value="genjah">Genjah (&lt; 95 Hari)</option>
                        <option value="sedang">Sedang (95-115 Hari)</option>
                        <option value="dalam">Dalam (&gt;= 116 Hari)</option>
                    </select>
                    <input type="text" id="inputVarietasNamaLahan" placeholder="Nama Varietas (cth: Ciherang, Mekongga)">
                    <input type="number" id="inputLuasLahan" placeholder="Luas Lahan (Ha, cth: 1.5)" step="0.01" min="0">
                    <button id="btnSimpanLahan" onclick="simpanLahan()" style="background:#3b82f6; color:#fff; border:none; padding:12px; border-radius:12px; font-weight:700; width:100%; cursor:pointer; font-size:0.85rem;">
                        💾 TAMBAH DAN SIMPAN LAHAN
                    </button>
                    <button id="btnBatalEdit" onclick="batalEditLahan()" style="display:none; background:rgba(255,255,255,0.1); color:#fff; border:none; padding:12px; border-radius:12px; font-weight:700; width:100%; cursor:pointer; font-size:0.85rem; margin-top:8px;">
                        ❌ BATAL EDIT
                    </button>
                </div>
            </div>
        </div>

        <div id="panelRiwayat">
            <div id="panelRiwayatInner">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:18px;">
                    <h3 style="margin:0; font-size:1.05rem; color:#fff;">📋 Riwayat Analisis</h3>
                    <div style="display:flex; gap:8px;">
                        <button onclick="hapusSemuaRiwayat()" style="background:rgba(239,68,68,0.15); color:#ef4444; border:none; padding:6px 12px; border-radius:8px; font-weight:700; cursor:pointer; font-size:0.75rem;">HAPUS SEMUA</button>
                        <button onclick="tutupPanel('riwayat')" style="background:rgba(239,68,68,0.2); color:#ef4444; border:none; padding:6px 14px; border-radius:8px; font-weight:700; cursor:pointer; font-size:0.8rem;">TUTUP</button>
                    </div>
                </div>
                <div id="daftarRiwayat"></div>
            </div>
        </div>

        <div id="panelNotif">
            <div id="panelNotifInner">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:18px;">
                    <h3 style="margin:0; font-size:1.05rem; color:#fff;">🔔 Pengingat Musim Tanam</h3>
                    <button onclick="tutupPanel('notif')" style="background:rgba(239,68,68,0.2); color:#ef4444; border:none; padding:6px 14px; border-radius:8px; font-weight:700; cursor:pointer; font-size:0.8rem;">TUTUP</button>
                </div>
                <div id="kontenNotif"></div>
            </div>
        </div>

        <div id="panelHarga">
            <div id="panelHargaInner">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:18px;">
                    <h3 style="margin:0; font-size:1.05rem; color:#fff;">💰 Harga Aktual Saprotan</h3>
                    <button onclick="tutupPanel('harga')" style="background:rgba(239,68,68,0.2); color:#ef4444; border:none; padding:6px 14px; border-radius:8px; font-weight:700; cursor:pointer; font-size:0.8rem;">TUTUP</button>
                </div>
                <div style="background:rgba(59,130,246,0.08); border:1px solid rgba(59,130,246,0.2); border-radius:12px; padding:12px; margin-bottom:16px; font-size:0.8rem; color:#94a3b8; line-height:1.5;">
                    ℹ️ Ubah harga sesuai kondisi di toko/kios Anda. Perubahan otomatis tersimpan dan dipakai di <b>Analisis Usaha Tani</b>.
                </div>
                <div style="font-size:0.8rem; font-weight:700; color:#10b981; margin-bottom:12px; letter-spacing:0.5px;">🌱 BENIH</div>
                <div class="harga-field">
                    <label>Harga Benih (Rp / kg)</label>
                    <input type="text" id="hargaBenih" placeholder="18.500" oninput="formatHargaInput(this)" onblur="simpanHargaSilent()">
                    <span class="harga-badge-subsidi">📌 Harga subsidi referensi: Rp 18.500/kg (Permentan 2024)</span>
                </div>
                <div style="font-size:0.8rem; font-weight:700; color:#10b981; margin: 16px 0 12px; letter-spacing:0.5px;">🧪 PUPUK SUBSIDI</div>
                <div class="harga-field">
                    <label>Harga Urea Subsidi (Rp / kg)</label>
                    <input type="text" id="hargaUrea" placeholder="1.800" oninput="formatHargaInput(this)" onblur="simpanHargaSilent()">
                    <span class="harga-badge-subsidi">📌 HET Urea Subsidi: Rp 1.800/kg (Permentan No.10/2022)</span>
                </div>
                <div class="harga-field">
                    <label>Harga NPK/Phonska Subsidi (Rp / kg)</label>
                    <input type="text" id="hargaNPK" placeholder="1.840" oninput="formatHargaInput(this)" onblur="simpanHargaSilent()">
                    <span class="harga-badge-subsidi">📌 HET NPK Subsidi: Rp 1.840/kg (Permentan No.10/2022)</span>
                </div>
                <div style="font-size:0.8rem; font-weight:700; color:#f59e0b; margin: 16px 0 12px; letter-spacing:0.5px;">📦 PUPUK NON-SUBSIDI (Jika Subsidi Habis)</div>
                <div class="harga-field">
                    <label>Harga Urea Non-Subsidi (Rp / kg)</label>
                    <input type="text" id="hargaUreaNonSub" placeholder="6.000" oninput="formatHargaInput(this)" onblur="simpanHargaSilent()">
                </div>
                <div class="harga-field">
                    <label>Harga NPK Non-Subsidi (Rp / kg)</label>
                    <input type="text" id="hargaNPKNonSub" placeholder="7.500" oninput="formatHargaInput(this)" onblur="simpanHargaSilent()">
                </div>
                <div style="font-size:0.8rem; font-weight:700; color:#8b5cf6; margin: 16px 0 12px; letter-spacing:0.5px;">🚜 UPAH & JASA</div>
                <div class="harga-field">
                    <label>Upah Olah Lahan Traktor (Rp / Ha)</label>
                    <input type="text" id="hargaTraktor" placeholder="600.000" oninput="formatHargaInput(this)" onblur="simpanHargaSilent()">
                </div>
                <div class="harga-field">
                    <label>Upah Combine Harvester (Rp / Ha)</label>
                    <input type="text" id="hargaCombine" placeholder="1.200.000" oninput="formatHargaInput(this)" onblur="simpanHargaSilent()">
                </div>
                <button onclick="simpanHargaManual()" style="background:#3b82f6; color:#fff; border:none; padding:12px; border-radius:12px; font-weight:700; width:100%; cursor:pointer; font-size:0.85rem; margin-bottom:8px;">
                    💾 SIMPAN HARGA
                </button>
                <button onclick="resetHargaDefault()" style="background:rgba(255,255,255,0.06); color:#fff; border:1px solid rgba(255,255,255,0.1); padding:12px; border-radius:12px; font-weight:700; width:100%; cursor:pointer; font-size:0.85rem; margin-top:4px;">
                    🔄 Reset ke Harga Default Subsidi
                </button>
            </div>
        </div>

        <div class="toast-notif" id="toastNotif">
            <div class="toast-icon" id="toastIcon">🔔</div>
            <div class="toast-teks">
                <h4 id="toastJudul">Pengingat Pemupukan</h4>
                <p id="toastPesan">Waktunya pemupukan tahap 1</p>
            </div>
        </div>
    `);
})();

// ── PATCH: Sinkronisasi koordinat GPS ────────────────────────────────────────
(function patchKoordinatGlobal() {
    window._koordinatTerakhir = null;

    // FIX: Patch getCurrentPosition dengan aman
    if (navigator.geolocation && navigator.geolocation.getCurrentPosition) {
        const _asliGet = navigator.geolocation.getCurrentPosition.bind(navigator.geolocation);
        navigator.geolocation.getCurrentPosition = function(sukses, gagal, opsi) {
            _asliGet(function(pos) {
                window._koordinatTerakhir = pos;
                sukses(pos);
            }, gagal || function(){}, opsi);
        };
    }
})();

// ============================================================
// GERBANG IZIN KAMERA TUNGGAL
// FIX: Tidak lagi menggunakan modal.querySelector('button') yang rawan salah target.
//      Sekarang menggunakan customAlertOkBtn dengan ID spesifik.
// ============================================================
window.mintaIzinKamera = function(callbackBerhasil) {
    if (localStorage.getItem('izin_kamera_diberikan') === 'true') {
        callbackBerhasil();
        return;
    }

    const modal = document.getElementById('customAlertModal');
    if (!modal) { callbackBerhasil(); return; }

    // FIX: Simpan konten modal asli agar bisa dipulihkan
    const iconEl = document.getElementById('customAlertIcon');
    const msgEl  = document.getElementById('customAlertMessage');

    iconEl.innerHTML = '📸';
    msgEl.innerHTML =
        "Aplikasi memerlukan akses kamera untuk mengambil foto sampel padi, daun, atau hama. " +
        "Silakan pilih <b>'IZINKAN'</b> pada konfirmasi sistem berikutnya." +
        `<br><br><button id="customAlertOkBtn" style="background:#3b82f6; color:#fff; border:none; padding:10px 24px; border-radius:8px; font-weight:700; cursor:pointer; width:100%; font-size:0.9rem;">OKE, IZINKAN KAMERA</button>`;

    // FIX: Pasang onclick ke elemen spesifik, bukan sembarang button
    document.getElementById('customAlertOkBtn').onclick = function() {
        modal.style.display = 'none';

        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
            .then(function(stream) {
                localStorage.setItem('izin_kamera_diberikan', 'true');
                stream.getTracks().forEach(track => track.stop());
                callbackBerhasil();
            })
            .catch(function(err) {
                console.warn('Izin kamera ditolak:', err);
                tampilkanToast('❌', 'Kamera Ditolak', 'Fitur analisis AI tidak bisa digunakan tanpa akses kamera.', '#ef4444');
            });
        } else {
            localStorage.setItem('izin_kamera_diberikan', 'true');
            callbackBerhasil();
        }
    };

    modal.style.display = 'flex';
};

// ============================================================
// BAGIAN C: MANAJEMEN PANEL (OPEN/CLOSE)
// ============================================================
function bukaPanel(nama) {
    const map = {
        multiLahan: 'panelMultiLahan',
        riwayat: 'panelRiwayat',
        notif: 'panelNotif',
        harga: 'panelHarga'
    };
    const panelEl = document.getElementById(map[nama]);
    if (!panelEl) return;
    panelEl.classList.add('aktif');

    document.querySelectorAll('.fab-kecil').forEach(b => b.classList.remove('fab-aktif'));
    const tabMap = { multiLahan: 'fab-lahan', riwayat: 'fab-riwayat', notif: 'fab-notif', harga: 'fab-harga' };
    const tabEl = document.querySelector('.' + tabMap[nama]);
    if (tabEl) tabEl.classList.add('fab-aktif');

    if (nama === 'multiLahan') renderDaftarLahan();
    if (nama === 'riwayat')    renderDaftarRiwayat();
    if (nama === 'notif')      renderJadwalNotif();
    if (nama === 'harga')      muatHarga();
}

function tutupPanel(nama) {
    const map = {
        multiLahan: 'panelMultiLahan',
        riwayat: 'panelRiwayat',
        notif: 'panelNotif',
        harga: 'panelHarga'
    };
    const panelEl = document.getElementById(map[nama]);
    if (!panelEl) return;
    panelEl.classList.remove('aktif');

    const tabMap = { multiLahan: 'fab-lahan', riwayat: 'fab-riwayat', notif: 'fab-notif', harga: 'fab-harga' };
    const tabEl = document.querySelector('.' + tabMap[nama]);
    if (tabEl) tabEl.classList.remove('fab-aktif');
}

// ============================================================
// BAGIAN D: MULTI-LAHAN
// ============================================================
window.lahanEditId = null;

function getLahanList() {
    try { return JSON.parse(localStorage.getItem('sf_lahan_list') || '[]'); }
    catch(e) { return []; }
}
function saveLahanList(list) {
    try { localStorage.setItem('sf_lahan_list', JSON.stringify(list)); }
    catch(e) { console.error('Gagal simpan lahan:', e); }
}
function getLahanAktif() {
    try { return JSON.parse(localStorage.getItem('sf_lahan_aktif') || 'null'); }
    catch(e) { return null; }
}

window.simpanLahan = function() {
    const nama        = document.getElementById('inputNamaLahan').value.trim();
    const tglTanam    = document.getElementById('inputTglTanamLahan').value;
    const varietasUmur= document.getElementById('inputVarietasLahan').value;
    const varietasNama= document.getElementById('inputVarietasNamaLahan').value.trim();
    const luas        = parseFloat(document.getElementById('inputLuasLahan').value);

    if (!nama || !tglTanam) {
        tampilkanToast('⚠️', 'Data Belum Lengkap', 'Nama lahan dan tanggal tanam wajib diisi!', '#ef4444');
        return;
    }

    let list = getLahanList();

    if (window.lahanEditId) {
        const idx = list.findIndex(l => l.id === window.lahanEditId);
        if (idx !== -1) {
            list[idx].nama         = nama;
            list[idx].tglTanam     = tglTanam;
            list[idx].varietasUmur = varietasUmur || 'sedang';
            list[idx].varietasNama = varietasNama || '-';
            list[idx].luas         = isNaN(luas) ? 0 : luas;
        }
        saveLahanList(list);

        const aktif = getLahanAktif();
        if (aktif && aktif.id === window.lahanEditId) {
            localStorage.setItem('sf_lahan_aktif', JSON.stringify(list[idx]));
            terapkanLahanAktif(list[idx]);
        }

        tampilkanToast('✅', 'Lahan Diperbarui!', `Data "${nama}" berhasil diupdate.`, '#10b981');
        batalEditLahan();

    } else {
        const lahanBaru = {
            id: Date.now(),
            nama,
            tglTanam,
            varietasUmur: varietasUmur || 'sedang',
            varietasNama: varietasNama || '-',
            luas: isNaN(luas) ? 0 : luas,
            dibuatPada: new Date().toISOString()
        };
        list.push(lahanBaru);
        saveLahanList(list);

        if (list.length === 1) pilihLahan(lahanBaru.id);

        document.getElementById('inputNamaLahan').value         = '';
        document.getElementById('inputTglTanamLahan').value     = '';
        document.getElementById('inputVarietasLahan').value     = '';
        document.getElementById('inputVarietasNamaLahan').value = '';
        document.getElementById('inputLuasLahan').value         = '';

        tampilkanToast('✅', 'Lahan Disimpan!', `"${nama}" berhasil ditambahkan.`, '#10b981');
    }

    renderDaftarLahan();
};

window.editLahan = function(id) {
    const list  = getLahanList();
    const lahan = list.find(l => l.id === id);
    if (!lahan) return;

    document.getElementById('inputNamaLahan').value         = lahan.nama;
    document.getElementById('inputTglTanamLahan').value     = lahan.tglTanam;
    document.getElementById('inputVarietasLahan').value     = lahan.varietasUmur || '';
    document.getElementById('inputVarietasNamaLahan').value = lahan.varietasNama === '-' ? '' : lahan.varietasNama;
    document.getElementById('inputLuasLahan').value         = lahan.luas || '';

    window.lahanEditId = id;

    // FIX: Konsistenkan teks tombol simpan
    document.getElementById('formLahanTitle').innerHTML          = '✏️ Edit Petak Sawah';
    document.getElementById('formLahanTitle').style.color        = '#f59e0b';
    document.getElementById('btnSimpanLahan').innerHTML          = '🔄 UPDATE DAN SIMPAN LAHAN';
    document.getElementById('btnSimpanLahan').style.background   = '#f59e0b';
    document.getElementById('btnBatalEdit').style.display        = 'block';

    document.querySelector('.form-tambah-lahan').scrollIntoView({ behavior: 'smooth' });
};

window.batalEditLahan = function() {
    window.lahanEditId = null;

    document.getElementById('inputNamaLahan').value         = '';
    document.getElementById('inputTglTanamLahan').value     = '';
    document.getElementById('inputVarietasLahan').value     = '';
    document.getElementById('inputVarietasNamaLahan').value = '';
    document.getElementById('inputLuasLahan').value         = '';

    // FIX: Teks konsisten dengan HTML awal
    document.getElementById('formLahanTitle').innerHTML          = '➕ Tambah Petak Sawah Baru';
    document.getElementById('formLahanTitle').style.color        = '#3b82f6';
    document.getElementById('btnSimpanLahan').innerHTML          = '💾 TAMBAH DAN SIMPAN LAHAN';
    document.getElementById('btnSimpanLahan').style.background   = '#3b82f6';
    document.getElementById('btnBatalEdit').style.display        = 'none';
};

function pilihLahan(id) {
    const list  = getLahanList();
    const lahan = list.find(l => l.id === id);
    if (!lahan) return;
    localStorage.setItem('sf_lahan_aktif', JSON.stringify(lahan));
    terapkanLahanAktif(lahan);
    renderDaftarLahan();
    tutupPanel('multiLahan');
    tampilkanToast('🌾', 'Lahan Dipilih!', `Aktif: "${lahan.nama}"`, '#3b82f6');
}

window.hapusLahan = function(id) {
    const modal = document.getElementById('customAlertModal');
    if (!modal) return;

    const iconEl = document.getElementById('customAlertIcon');
    const msgEl  = document.getElementById('customAlertMessage');

    iconEl.innerHTML = '🗑️';
    // FIX: Inline onclick diganti ID spesifik untuk menghindari konflik dengan mintaIzinKamera
    msgEl.innerHTML = `
        <span style="display:block; font-size:1.2rem; font-weight:800; color:#ef4444; margin-bottom:10px;">HAPUS LAHAN?</span>
        <span style="display:block; color:#cbd5e1; font-size:0.9rem; margin-bottom:15px; line-height:1.5;">
            Data petak sawah dan jadwal pemupukannya akan dihapus permanen dari HP ini.
        </span>
        <div style="display:flex; gap:10px;">
            <button id="btnKonfirmasiHapusLahan" style="background:#ef4444; color:#fff; border:none; padding:10px; border-radius:8px; font-weight:700; cursor:pointer; flex:1;">YA, HAPUS</button>
            <button id="btnBatalHapusLahan" style="background:transparent; border:1px solid #64748b; color:#cbd5e1; padding:10px; border-radius:8px; font-weight:700; cursor:pointer; flex:1;">BATAL</button>
        </div>`;

    document.getElementById('btnKonfirmasiHapusLahan').onclick = function() { prosesHapusLahan(id); };
    document.getElementById('btnBatalHapusLahan').onclick      = function() { modal.style.display = 'none'; };

    modal.style.display = 'flex';
};

window.prosesHapusLahan = function(id) {
    const modal = document.getElementById('customAlertModal');
    if (modal) modal.style.display = 'none';

    let list = getLahanList();
    list = list.filter(l => l.id !== id);
    saveLahanList(list);

    const aktif = getLahanAktif();
    if (aktif && aktif.id === id) {
        localStorage.removeItem('sf_lahan_aktif');
        terapkanLahanAktif(null);
    }

    if (window.lahanEditId === id) batalEditLahan();

    renderDaftarLahan();
    tampilkanToast('🗑️', 'Lahan Dihapus', 'Data lahan berhasil dihapus.', '#ef4444');
};

function terapkanLahanAktif(lahan) {
    if (!lahan) {
        const el = document.getElementById('indikasiLahanAktif');
        if (el) el.remove();
        return;
    }

    const fields = ['tglTanamCuaca', 'inputTglTanam', 'tanggalTanam'];
    fields.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = lahan.tglTanam;
    });

    const varFields = ['umurVarietasCuaca', 'umurVarietasKalender'];
    varFields.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = lahan.varietasUmur;
    });

    const luasEl      = document.getElementById('luas');
    const luasPupukEl = document.getElementById('luasPupuk');
    if (luasEl      && lahan.luas > 0) luasEl.value      = lahan.luas;
    if (luasPupukEl && lahan.luas > 0) luasPupukEl.value = lahan.luas;

    let indikasi = document.getElementById('indikasiLahanAktif');
    if (!indikasi) {
        const card = document.querySelector('.card');
        if (card) {
            card.insertAdjacentHTML('afterbegin', `
                <div id="indikasiLahanAktif" onclick="bukaPanel('multiLahan')">
                    <div>
                        <div class="nama-lahan">🌾 ${lahan.nama}</div>
                        <div class="ganti-lahan">Varietas: ${lahan.varietasNama} | ${lahan.luas} Ha • Ketuk untuk ganti</div>
                    </div>
                    <span style="color:#3b82f6; font-size:1.2rem;">⟳</span>
                </div>`);
        }
    } else {
        indikasi.querySelector('.nama-lahan').textContent  = '🌾 ' + lahan.nama;
        indikasi.querySelector('.ganti-lahan').textContent = `Varietas: ${lahan.varietasNama} | ${lahan.luas} Ha • Ketuk untuk ganti`;
    }
}

function renderDaftarLahan() {
    const list   = getLahanList();
    const aktif  = getLahanAktif();
    const container = document.getElementById('daftarLahan');
    if (!container) return;

    if (list.length === 0) {
        const warnaKosong = document.body.classList.contains('light-mode') ? '#64748b' : '#ffffff';
        container.innerHTML = `<div style="text-align:center; color:${warnaKosong}; padding:30px 0; font-size:0.85rem;">Belum ada lahan tersimpan.<br>Tambahkan petak sawah Anda di bawah.</div>`;
        return;
    }

    const hitungUmur = (tgl) => {
        const diff = new Date() - new Date(tgl);
        const hari = Math.floor(diff / 86400000);
        return hari < 0 ? '(Belum tanam)' : `Hari ke-${hari}`;
    };

    container.innerHTML = list.map(l => `
        <div class="lahan-item ${aktif && aktif.id === l.id ? 'aktif-dipilih' : ''}">
            <div class="lahan-info">
                <h4>${l.nama} ${aktif && aktif.id === l.id ? '<span style="color:#3b82f6; font-size:0.7rem;">● AKTIF</span>' : ''}</h4>
                <small>📅 Tanam: ${new Date(l.tglTanam).toLocaleDateString('id-ID', {day:'numeric',month:'short',year:'numeric'})} | ${hitungUmur(l.tglTanam)}</small><br>
                <small>🌱 ${l.varietasNama} (${l.varietasUmur}) | 📐 ${l.luas} Ha</small>
            </div>
            <div class="lahan-actions">
                ${aktif && aktif.id === l.id ? '' : `<button class="btn-lahan-kecil btn-pilih" onclick="pilihLahan(${l.id})">Pilih</button>`}
                <button class="btn-lahan-kecil btn-edit" style="background:rgba(245,158,11,0.2); color:#f59e0b;" onclick="editLahan(${l.id})">EDIT</button>
                <button class="btn-lahan-kecil btn-hapus" onclick="hapusLahan(${l.id})">HAPUS</button>
            </div>
        </div>`).join('');
}

// ============================================================
// BAGIAN E: RIWAYAT ANALISIS
// ============================================================
function getRiwayat() {
    try { return JSON.parse(localStorage.getItem('sf_riwayat') || '[]'); }
    catch(e) { return []; }
}

function tambahRiwayat(mode, label, ringkasan) {
    const list      = getRiwayat();
    const lahanAktif = getLahanAktif();
    list.unshift({
        id: Date.now(),
        mode,
        label,
        ringkasan: ringkasan.substring(0, 200),
        lahan: lahanAktif ? lahanAktif.nama : 'Tidak ada lahan aktif',
        waktu: new Date().toISOString()
    });
    if (list.length > 50) list.splice(50);
    try { localStorage.setItem('sf_riwayat', JSON.stringify(list)); } catch(e) {}
    updateBadgeRiwayat();
}

window.hapusSemuaRiwayat = function() {
    const modal = document.getElementById('customAlertModal');
    if (!modal) return;

    const iconEl = document.getElementById('customAlertIcon');
    const msgEl  = document.getElementById('customAlertMessage');

    iconEl.innerHTML = '🧹';
    // FIX: Gunakan ID spesifik, bukan inline onclick global
    msgEl.innerHTML = `
        <span style="display:block; font-size:1.2rem; font-weight:800; color:#ef4444; margin-bottom:10px;">BERSIHKAN RIWAYAT?</span>
        <span style="display:block; color:#cbd5e1; font-size:0.9rem; margin-bottom:15px; line-height:1.5;">
            Seluruh riwayat deteksi hama, kalkulasi panen, dan biaya tani akan dihapus.
        </span>
        <div style="display:flex; gap:10px;">
            <button id="btnKonfirmasiHapusRiwayat" style="background:#ef4444; color:#fff; border:none; padding:10px; border-radius:8px; font-weight:700; cursor:pointer; flex:1;">YA, BERSIHKAN</button>
            <button id="btnBatalHapusRiwayat" style="background:transparent; border:1px solid #64748b; color:#cbd5e1; padding:10px; border-radius:8px; font-weight:700; cursor:pointer; flex:1;">BATAL</button>
        </div>`;

    document.getElementById('btnKonfirmasiHapusRiwayat').onclick = function() { prosesHapusRiwayat(); };
    document.getElementById('btnBatalHapusRiwayat').onclick      = function() { modal.style.display = 'none'; };

    modal.style.display = 'flex';
};

window.prosesHapusRiwayat = function() {
    const modal = document.getElementById('customAlertModal');
    if (modal) modal.style.display = 'none';
    localStorage.removeItem('sf_riwayat');
    renderDaftarRiwayat();
    updateBadgeRiwayat();
    tampilkanToast('🧹', 'Riwayat Bersih', 'Seluruh data riwayat telah dihapus.', '#ef4444');
};

function renderDaftarRiwayat() {
    const list      = getRiwayat();
    const container = document.getElementById('daftarRiwayat');
    if (!container) return;

    if (list.length === 0) {
        container.innerHTML = `<div style="text-align:center; color:#475569; padding:30px 0; font-size:0.85rem;">Belum ada riwayat analisis.<br>Riwayat otomatis tersimpan setelah analisis.</div>`;
        return;
    }

    const ikonMode = { daun:'🍃', hama:'🐛', gulma:'🌿', tanah:'🟫', cuaca:'🌤️', pupuk:'🧪', biaya:'💰', malai:'🌾', bwd:'🎨', varietas:'🌱' };
    container.innerHTML = list.map(r => {
        const tgl    = new Date(r.waktu);
        const tglStr = tgl.toLocaleDateString('id-ID', {day:'numeric', month:'short'}) + ' ' +
                       tgl.toLocaleTimeString('id-ID', {hour:'2-digit', minute:'2-digit'});
        return `
        <div class="riwayat-item mode-${r.mode}">
            <div class="riwayat-header">
                <span class="riwayat-label">${ikonMode[r.mode] || '📊'} ${r.mode.toUpperCase()} — ${r.lahan}</span>
                <span class="riwayat-tgl">${tglStr}</span>
            </div>
            <div style="font-weight:700; color:#fff; font-size:0.9rem; margin-bottom:4px;">${r.label}</div>
            <div class="riwayat-hasil">${r.ringkasan}</div>
        </div>`;
    }).join('');
}

function updateBadgeRiwayat() {
    const list = getRiwayat();
    const el   = document.getElementById('fabRiwayatLabel');
    if (el) el.textContent = list.length > 0 ? `Riwayat Deteksi (${list.length})` : 'Riwayat Deteksi';
}

// ============================================================
// BAGIAN F: PENGINGAT / NOTIFIKASI
// ============================================================
const JADWAL_PEMUPUKAN = [
    { hari: 7,  judul: '🌱 Pemupukan Tahap I',    pesan: 'Waktunya aplikasi Urea + Phonska (7-10 HST). Cek Menu Dosis untuk takarannya.', warna: '#10b981' },
    { hari: 21, judul: '🧪 Pemupukan Tahap II',   pesan: 'Fase anakan aktif. Waktunya pemupukan kedua (21-25 HST).', warna: '#3b82f6' },
    { hari: 45, judul: '🌾 Pemupukan Tahap III',  pesan: 'Padi memasuki fase primordia/bunting awal. Cek BWD! Jika skala < 4, berikan Urea.', warna: '#f59e0b' },
    { hari: 60, judul: '🌸 Fase Bunting Dimulai', pesan: 'Padi bunting. Jaga ketersediaan air tanah maksimal dan waspada hama.', warna: '#d946ef' },
    { hari: 90, judul: '🚜 Persiapan Panen',      pesan: 'Kurangi pengairan lahan, persiapkan jadwal Combine Harvester.', warna: '#10b981' },
];

window.renderJadwalNotif = function() {
    const container = document.getElementById('kontenNotif');
    if (!container) return;

    const lahan = getLahanAktif();
    if (!lahan || !lahan.tglTanam) {
        container.innerHTML = `
            <div style="text-align:center; padding:30px 20px; color:#475569;">
                <div style="font-size:2rem; margin-bottom:12px;">🌾</div>
                <div style="font-size:0.85rem; line-height:1.6;">Pilih lahan aktif terlebih dahulu di menu Daftar Sawah.</div>
            </div>`;
        return;
    }

    const awal = new Date(lahan.tglTanam);
    awal.setHours(0,0,0,0);
    const sekarang = new Date();
    sekarang.setHours(0,0,0,0);
    const hariSekarang = Math.round((sekarang - awal) / 86400000);

    const tglStr = (hari) => {
        const d = new Date(awal);
        d.setDate(d.getDate() + hari);
        return d.toLocaleDateString('id-ID', { day:'numeric', month:'long', year:'numeric' });
    };

    let html = `
        <div style="background:rgba(59,130,246,0.08); border:1px solid rgba(59,130,246,0.2); border-radius:12px; padding:12px; margin-bottom:16px;">
            <div style="font-size:0.8rem; color:#3b82f6; font-weight:700; margin-bottom:4px;">🌾 ${lahan.nama}</div>
            <div style="font-size:0.78rem; color:#94a3b8;">Tanam: ${new Date(lahan.tglTanam).toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'})} | Hari ke-<b style="color:#fff">${hariSekarang}</b></div>
        </div>`;

    JADWAL_PEMUPUKAN.forEach(j => {
        const selisih = j.hari - hariSekarang;
        let statusClass = 'notif-akan-datang';
        let statusTeks  = `${selisih} hari lagi`;
        if (selisih < 0)       { statusClass = 'notif-lewat';     statusTeks = 'Selesai'; }
        else if (selisih === 0){ statusClass = 'notif-hari-ini';  statusTeks = 'HARI INI!'; }
        else if (selisih <= 3) { statusClass = 'notif-akan-datang'; statusTeks = `${selisih}hr lagi ⚠️`; }

        html += `
            <div class="notif-jadwal-item">
                <div>
                    <div class="hari-info" style="color:${j.warna}">${j.judul}</div>
                    <div class="hari-sub">📅 ${tglStr(j.hari)} (Hari ke-${j.hari})</div>
                    <div class="hari-sub" style="margin-top:4px; color:#94a3b8;">${j.pesan}</div>
                </div>
                <div class="notif-status ${statusClass}">${statusTeks}</div>
            </div>`;
    });

    container.innerHTML = html;
};

window.cekPengingatHariIni = function() {
    const lahan = getLahanAktif();
    if (!lahan || !lahan.tglTanam) return;

    const awal = new Date(lahan.tglTanam);
    awal.setHours(0,0,0,0);
    const sekarang = new Date();
    sekarang.setHours(0,0,0,0);
    const hariIni = Math.round((sekarang - awal) / 86400000);

    const jadwalHariIni = JADWAL_PEMUPUKAN.find(j => j.hari === hariIni);

    if (jadwalHariIni) {
        const modal = document.getElementById('customAlertModal');
        if (modal) {
            const icon    = document.getElementById('customAlertIcon');
            const message = document.getElementById('customAlertMessage');

            icon.innerHTML = '🚨';
            message.innerHTML = `
                <span style="display:block; font-size:1.2rem; font-weight:800; color:${jadwalHariIni.warna}; margin-bottom:10px; letter-spacing:1px;">
                    ${jadwalHariIni.judul.toUpperCase()}
                </span>
                <span style="display:block; color:#cbd5e1; font-size:0.9rem; line-height:1.6; margin-bottom:15px;">
                    Tabe', untuk lahan <strong>"${lahan.nama}"</strong> hari ini memasuki umur <b style="color:#fff;">${hariIni} HST</b>.<br><br>
                    ${jadwalHariIni.pesan}
                </span>
                <button id="btnTutupPengingatHariIni" style="background:transparent; border:1px solid ${jadwalHariIni.warna}; color:${jadwalHariIni.warna}; padding:10px 20px; border-radius:8px; font-weight:700; cursor:pointer; width:100%;">
                    TUTUP PENGINGAT
                </button>`;

            document.getElementById('btnTutupPengingatHariIni').onclick = function() {
                modal.style.display = 'none';
            };

            modal.style.display = 'flex';
            if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
        }

        const fabNotif = document.getElementById('fabNotifBtn');
        if (fabNotif && !fabNotif.querySelector('.badge-notif')) {
            const badge = document.createElement('span');
            badge.className  = 'badge-notif';
            badge.textContent = '!';
            fabNotif.appendChild(badge);
        }
    }
};

// ============================================================
// BAGIAN G: HARGA PUPUK DINAMIS
// ============================================================
const HARGA_DEFAULT = {
    benih: 18500, urea: 1800, npk: 1840,
    ureaNonSub: 6000, npkNonSub: 7500,
    traktor: 600000, combine: 1200000
};

function getHarga() {
    try {
        const saved = JSON.parse(localStorage.getItem('sf_harga') || '{}');
        return { ...HARGA_DEFAULT, ...saved };
    } catch(e) { return { ...HARGA_DEFAULT }; }
}

// FIX: Pisahkan simpan senyap (onblur) vs simpan dengan konfirmasi (tombol)
function simpanHargaSilent() {
    const harga = {
        benih:     parseAngka(document.getElementById('hargaBenih')?.value)     || HARGA_DEFAULT.benih,
        urea:      parseAngka(document.getElementById('hargaUrea')?.value)      || HARGA_DEFAULT.urea,
        npk:       parseAngka(document.getElementById('hargaNPK')?.value)       || HARGA_DEFAULT.npk,
        ureaNonSub:parseAngka(document.getElementById('hargaUreaNonSub')?.value)|| HARGA_DEFAULT.ureaNonSub,
        npkNonSub: parseAngka(document.getElementById('hargaNPKNonSub')?.value) || HARGA_DEFAULT.npkNonSub,
        traktor:   parseAngka(document.getElementById('hargaTraktor')?.value)   || HARGA_DEFAULT.traktor,
        combine:   parseAngka(document.getElementById('hargaCombine')?.value)   || HARGA_DEFAULT.combine,
    };
    try { localStorage.setItem('sf_harga', JSON.stringify(harga)); } catch(e) {}
    // Tidak tampilkan toast agar tidak spam
}

function simpanHargaManual() {
    simpanHargaSilent();
    tampilkanToast('💾', 'Harga Tersimpan', 'Kalkulasi usaha tani akan menggunakan harga baru.', '#10b981');
}

// FIX: simpanHarga tetap ada untuk backward compatibility (dipakai hitungBiayaTani)
function simpanHarga() { simpanHargaSilent(); }

function muatHarga() {
    const h = getHarga();
    const set = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.value = Number(val).toLocaleString('id-ID');
    };
    set('hargaBenih',     h.benih);
    set('hargaUrea',      h.urea);
    set('hargaNPK',       h.npk);
    set('hargaUreaNonSub',h.ureaNonSub);
    set('hargaNPKNonSub', h.npkNonSub);
    set('hargaTraktor',   h.traktor);
    set('hargaCombine',   h.combine);
}

function resetHargaDefault() {
    localStorage.removeItem('sf_harga');
    muatHarga();
    tampilkanToast('🔄', 'Harga Direset', 'Kembali ke harga subsidi resmi.', '#3b82f6');
}

function formatHargaInput(el) {
    const raw = el.value.replace(/[^0-9]/g, '');
    // FIX: Izinkan field kosong agar bisa dihapus sepenuhnya
    el.value = raw === '' ? '' : parseInt(raw).toLocaleString('id-ID');
}

function parseAngka(str) {
    if (!str) return 0;
    return parseInt(str.replace(/[^0-9]/g, '')) || 0;
}

// ============================================================
// BAGIAN H: OVERRIDE hitungBiayaTani
// ============================================================
window.hitungBiayaTaniAsli = window.hitungBiayaTani;
window.hitungBiayaTani = function() {
    const h = getHarga();

    let luas = parseFloat(document.getElementById("luas").value);
    if (isNaN(luas) || luas <= 0) {
        const errEl = document.getElementById("errLuas");
        if (errEl) errEl.style.display = "block";
        return;
    } else {
        const errEl = document.getElementById("errLuas");
        if (errEl) errEl.style.display = "none";
    }

    let hasil = parseFloat(document.getElementById("hasil").value);
    let harga = parseFloat((document.getElementById("harga").value || '').replace(/\./g,""));
    if (!hasil || !harga) { alert("❗ Isi produksi & harga terlebih dahulu!"); return; }

    let benih       = parseFloat(document.getElementById("sistem").value) || 30;
    let totalBenih  = luas * benih;
    let biayaBenih  = totalBenih * h.benih;

    let urea        = luas * parseFloat(document.getElementById("dosisUrea").value);
    let npk         = luas * parseFloat(document.getElementById("dosisNPK").value);
    let biayaUrea   = urea * h.urea;
    let biayaNPK    = npk  * h.npk;

    let pest          = parseFloat((document.getElementById("pestisida").value || '').replace(/\./g,""))          || 0;
    let olah          = parseFloat((document.getElementById("tenaga_olah").value || '').replace(/\./g,""))        || 0;
    let panen         = parseFloat((document.getElementById("tenaga_panen").value || '').replace(/\./g,""))       || 0;
    let biayaLain     = parseFloat((document.getElementById("lain").value || '').replace(/\./g,""))               || 0;
    let pengairan     = parseFloat((document.getElementById("biaya_pengairan").value || '').replace(/\./g,""))    || 0;
    let tenagaKerja   = parseFloat((document.getElementById("biaya_tenaga_kerja").value || '').replace(/\./g,"")) || 0;
    let angkutPanen   = parseFloat((document.getElementById("biaya_angkut").value || '').replace(/\./g,""))       || 0;

    let totalBiaya  = biayaBenih + biayaUrea + biayaNPK + pest + olah + panen + pengairan + tenagaKerja + angkutPanen + biayaLain;
    let pendapatan  = hasil * harga;
    let untung      = pendapatan - totalBiaya;
    let rc          = totalBiaya > 0 ? (pendapatan / totalBiaya).toFixed(2) : '0.00';
    let bepProduksi = harga > 0    ? totalBiaya / harga  : 0;
    let bepHarga    = hasil  > 0   ? totalBiaya / hasil  : 0;

    let status = rc < 1 ? "❌ Rugi" : rc < 2 ? "⚠️ Rendah" : rc < 4 ? "✅ Layak" : "🔥 Sangat Menguntungkan";

    const rupiah = (x) => "Rp " + Math.round(x).toLocaleString("id-ID");

    const infoHarga = (h.urea !== HARGA_DEFAULT.urea || h.npk !== HARGA_DEFAULT.npk)
        ? `<div style="background:rgba(245,158,11,0.1); border:1px solid rgba(245,158,11,0.3); border-radius:8px; padding:8px; margin-bottom:12px; font-size:0.75rem; color:#f59e0b;">⚠️ Menggunakan harga custom: Urea Rp${h.urea.toLocaleString('id-ID')}/kg | NPK Rp${h.npk.toLocaleString('id-ID')}/kg</div>`
        : `<div style="background:rgba(16,185,129,0.08); border-radius:8px; padding:8px; margin-bottom:12px; font-size:0.75rem; color:#10b981;">✅ Menggunakan harga subsidi resmi</div>`;

    let htmlOut = `
        ${infoHarga}
        <div style="font-size:1.1rem; font-weight:800; color:var(--accent-biaya); margin-bottom:12px; text-align:center;">📊 Hasil Analisis Usaha Tani</div>
        🌾 <b>Benih:</b> ${totalBenih.toFixed(1)} kg<br>Biaya: ${rupiah(biayaBenih)}<br><br>
        🧪 <b>Pupuk Urea:</b> ${urea.toFixed(0)} kg<br>Harga: Rp ${h.urea.toLocaleString('id-ID')}/kg<br>Biaya: ${rupiah(biayaUrea)}<br><br>
        🧪 <b>Pupuk NPK:</b> ${npk.toFixed(0)} kg<br>Harga: Rp ${h.npk.toLocaleString('id-ID')}/kg<br>Biaya: ${rupiah(biayaNPK)}<br><br>
        💧 <b>Pengairan:</b> ${rupiah(pengairan)}<br><br>
        👥 <b>Tenaga Kerja:</b> ${rupiah(tenagaKerja)}<br><br>
        🚚 <b>Angkut Panen:</b> ${rupiah(angkutPanen)}<br><br>
        🐛 <b>Pestisida:</b> ${rupiah(pest)}<br><br>
        🚜 <b>Olah Lahan:</b> ${rupiah(olah)}<br><br>
        🌾 <b>Combine Harvester:</b> ${rupiah(panen)}<br><br>
        📌 <b>Lainnya:</b> ${rupiah(biayaLain)}<br><br>
        <div style="border-top:1px solid rgba(255,255,255,0.1); margin-top:10px; padding-top:10px;">
            💰 <b>Total Biaya (Modal):</b><br>
            <span style="color:#ef5350; font-weight:700; font-size:1.1rem;">${rupiah(totalBiaya)}</span>
        </div><br>
        💵 <b>Pendapatan:</b> <span style="color:#10b981; font-weight:700; font-size:1.1rem;">${rupiah(pendapatan)}</span><br><br>
        💵 <b>Keuntungan Netto:</b><br>
        <span style="color:${untung >= 0 ? '#10b981' : '#ef4444'}; font-weight:800; font-size:1.4rem;">${rupiah(untung)}</span><br><br>
        📈 <b>R/C Ratio:</b> <b style="color:var(--accent-soil); font-size:1.1rem;">${rc}</b> — ${status}<br><br>
        <div style="border-top:1px dashed rgba(255,255,255,0.15); margin-top:10px; padding-top:12px;">
            <div style="font-size:0.9rem; font-weight:700; color:var(--accent-soil); margin-bottom:8px;">⚖️ Titik Impas (BEP)</div>
            <p>📉 <b>Produksi minimal:</b> <span style="font-weight:700;">${Math.ceil(bepProduksi).toLocaleString("id-ID")} Kg</span></p>
            <p>🏷️ <b>Harga jual minimal:</b> <span style="font-weight:700;">${rupiah(bepHarga)}/Kg</span></p>
        </div>`;

    const out = document.getElementById("outputBiaya");
    if (out) { out.style.display = "block"; out.innerHTML = htmlOut; }

    tambahRiwayat('biaya', `Luas ${luas} Ha — R/C ${rc}`,
        `Modal: ${rupiah(totalBiaya)} | Pendapatan: ${rupiah(pendapatan)} | Untung: ${rupiah(untung)} | Status: ${status}`);
};

// ============================================================
// BAGIAN I: INTERCEPT tampilkanHasil UNTUK SIMPAN RIWAYAT
// FIX: Wrap di sini SETELAH Modul 1, rantai benar:
//      BagianI → Modul1 → fungsi asli HTML
// ============================================================
(function() {
    const _tampilkanSebelumnya = window.tampilkanHasil; // = Modul 1 wrapper

    window.tampilkanHasil = function(data) {
        // Panggil rantai sebelumnya (Modul 1 → asli)
        if (typeof _tampilkanSebelumnya === 'function') _tampilkanSebelumnya(data);

        // Simpan riwayat setelah DOM terupdate
        setTimeout(() => {
            const mode    = window.currentMode;
            const labelEl = document.getElementById('resLabel');
            const label   = labelEl ? labelEl.innerText : '-';

            let ringkasan = '';
            if (mode === 'daun') {
                const g = document.getElementById('resGejala');
                const s = document.getElementById('resSolusi');
                ringkasan = `Gejala: ${g?.innerText || '-'} | Solusi: ${s?.innerText?.substring(0,100) || '-'}`;
            } else if (mode === 'hama') {
                const g = document.getElementById('resGejalaHama');
                ringkasan = `Gejala: ${g?.innerText?.substring(0,150) || '-'}`;
            } else if (mode === 'tanah') {
                const p = document.getElementById('resPenjelasan');
                ringkasan = p?.innerText?.substring(0,150) || '-';
            } else if (mode === 'gulma') {
                const c = document.getElementById('containerListGulma');
                ringkasan = c?.innerText?.substring(0,150) || '-';
            } else if (mode === 'bwd') {
                const o = document.getElementById('outputBWD');
                ringkasan = o?.innerText?.substring(0,150) || '-';
            } else if (mode === 'malai') {
                const u = document.getElementById('resUbinanTeks');
                ringkasan = u?.innerText?.substring(0,150) || '-';
            }

            if (label && label !== '-' && ringkasan && mode !== 'cuaca') {
                tambahRiwayat(mode, label, ringkasan);
            }
        }, 500);
    };
})();

// ============================================================
// GERBANG IZIN GPS TUNGGAL
// FIX: Gunakan ID tombol spesifik agar tidak konflik dengan modal lain
// ============================================================
window.mintaIzinGPS = function(callbackBerhasil) {
    if (localStorage.getItem('izin_gps_diberikan') === 'true') {
        callbackBerhasil();
        return;
    }

    const modal = document.getElementById('customAlertModal');
    if (!modal) { callbackBerhasil(); return; }

    const iconEl = document.getElementById('customAlertIcon');
    const msgEl  = document.getElementById('customAlertMessage');

    iconEl.innerHTML = '📍';
    msgEl.innerHTML =
        "Aplikasi memerlukan akses lokasi (GPS) untuk mengukur luas petak sawah. " +
        "Silakan pilih <b>'IZINKAN'</b> pada konfirmasi sistem berikutnya." +
        `<br><br><button id="customAlertGpsOkBtn" style="background:#10b981; color:#fff; border:none; padding:10px 24px; border-radius:8px; font-weight:700; cursor:pointer; width:100%; font-size:0.9rem;">OKE, IZINKAN LOKASI</button>`;

    document.getElementById('customAlertGpsOkBtn').onclick = function() {
        modal.style.display = 'none';

        navigator.geolocation.getCurrentPosition(
            function(pos) {
                localStorage.setItem('izin_gps_diberikan', 'true');
                window._koordinatTerakhir = pos;
                callbackBerhasil();
            },
            function(err) {
                console.warn('Izin GPS ditolak:', err);
                tampilkanToast('❌', 'Lokasi Ditolak', 'Pengukuran lahan tidak bisa dilakukan tanpa GPS.', '#ef4444');
            },
            { enableHighAccuracy: true, timeout: 15000 }
        );
    };

    modal.style.display = 'flex';
};

// ============================================================
// BAGIAN J: FIX GPS DRIFT — OVERRIDE modeJalan()
// FIX: resetPengukuranAsli diambil di dalam load event agar
//      fungsi asli sudah pasti terdefinisi
// ============================================================
window.addEventListener('load', function() {
    // FIX: Wrap modeJalan hanya jika sudah ada di halaman
    if (typeof window.modeJalan === 'function') {
        const _modeJalanAsli = window.modeJalan;

        window.modeJalan = function() {
            window.mintaIzinGPS(function() {

                if (typeof window.resetPengukuran === 'function') resetPengukuran();
                if (typeof window.resetKalman === 'function')     resetKalman();

                const btnSelesai = document.getElementById('btnSelesaiJalan');
                if (btnSelesai) btnSelesai.style.display = 'block';

                if (!navigator.geolocation) {
                    if (typeof tampilkanPesan === 'function')
                        tampilkanPesan("❌ Browser tidak mendukung GPS.", "error");
                    return;
                }

                let gpsMonitor = document.getElementById('gpsMonitor');
                if (!gpsMonitor) {
                    gpsMonitor = document.createElement('div');
                    gpsMonitor.id = 'gpsMonitor';
                    gpsMonitor.style.cssText =
                        'position:fixed; top:50%; left:50%; transform:translate(-50%,-50%);' +
                        'background:rgba(0,0,0,0.85); color:#22d3ee; padding:12px 20px;' +
                        'border-radius:20px; z-index:1000; font-size:14px; font-weight:bold;' +
                        'border:1px solid #22d3ee; white-space:nowrap; text-align:center;';
                    document.body.appendChild(gpsMonitor);
                }

                const AKURASI_MAX  = 10;
                const JARAK_MIN    = 5;
                const WARMUP_DETIK = 6;
                const SPEED_MIN    = 0.4;

                let warmupSelesai = false;
                let waktuMulai    = Date.now();

                gpsMonitor.innerHTML = `⏳ Menunggu sinyal stabil... (${WARMUP_DETIK}s)`;

                const intervalWarmup = setInterval(() => {
                    const sisa = WARMUP_DETIK - Math.floor((Date.now() - waktuMulai) / 1000);
                    if (sisa <= 0) {
                        clearInterval(intervalWarmup);
                        warmupSelesai = true;
                        gpsMonitor.innerHTML = '🚶 MULAI BERJALAN — GPS Aktif';
                        if (typeof tampilkanPesan === 'function')
                            tampilkanPesan("✅ GPS siap! Mulai berjalan mengelilingi batas lahan.", "info");
                    } else {
                        gpsMonitor.innerHTML = `⏳ Stabilisasi GPS... ${sisa}s (Jangan bergerak dulu)`;
                    }
                }, 1000);

                // FIX: Simpan watchId ke variabel global yang dipakai halaman asli
                if (typeof window.watchId !== 'undefined') {
                    navigator.geolocation.clearWatch(window.watchId);
                }

                window.watchId = navigator.geolocation.watchPosition(
                    (pos) => {
                        if (!warmupSelesai) return;

                        const akurasi = pos.coords.accuracy;
                        const speed   = pos.coords.speed;

                        if (akurasi > AKURASI_MAX) {
                            gpsMonitor.style.color   = '#f87171';
                            gpsMonitor.textContent   = `📡 Sinyal lemah ±${Math.round(akurasi)}m — tunggu...`;
                            return;
                        }

                        if (speed !== null && speed < SPEED_MIN) {
                            gpsMonitor.style.color   = '#fbbf24';
                            gpsMonitor.textContent   = `⚠️ Terlalu lambat (${speed.toFixed(1)} m/s) — terus berjalan`;
                            return;
                        }

                        // FIX: Periksa kalman sebelum dipakai
                        let latSmooth, lngSmooth;
                        if (typeof kalman !== 'undefined' && kalman.lat && kalman.lng) {
                            latSmooth = kalman.lat.filter(pos.coords.latitude);
                            lngSmooth = kalman.lng.filter(pos.coords.longitude);
                        } else {
                            latSmooth = pos.coords.latitude;
                            lngSmooth = pos.coords.longitude;
                        }

                        // FIX: Periksa L (Leaflet) tersedia
                        if (typeof L === 'undefined') return;

                        const latlng = L.latLng(latSmooth, lngSmooth);

                        if (typeof gpsPoints !== 'undefined' && gpsPoints.length > 0) {
                            const last = gpsPoints[gpsPoints.length - 1];
                            if (typeof haversineM === 'function' && haversineM(last, latlng) < JARAK_MIN) return;
                        }

                        if (typeof gpsPoints !== 'undefined') gpsPoints.push(latlng);

                        gpsMonitor.style.color = '#4ade80';
                        const speedTeks = speed !== null ? ` | ${speed.toFixed(1)} m/s` : '';
                        gpsMonitor.textContent = `📍 Titik: ${typeof gpsPoints !== 'undefined' ? gpsPoints.length : '?'} | ±${Math.round(akurasi)}m${speedTeks}`;

                        if (typeof userMarker !== 'undefined') {
                            if (!userMarker) {
                                window.userMarker = L.circleMarker(latlng, {
                                    radius: 7, color: 'white', weight: 2,
                                    fillColor: '#eab308', fillOpacity: 1
                                }).addTo(map);
                            } else {
                                userMarker.setLatLng(latlng);
                            }
                        }

                        if (typeof gpsPoints !== 'undefined' && gpsPoints.length > 1) {
                            if (typeof currentLine !== 'undefined') {
                                if (!currentLine) {
                                    window.currentLine = L.polyline(gpsPoints, { color: '#eab308', weight: 6, opacity: 0.9 }).addTo(map);
                                } else {
                                    currentLine.setLatLngs(gpsPoints);
                                }
                            }
                        }

                        if (typeof map !== 'undefined' && map)
                            map.panTo(latlng, { animate: true, duration: 0.5 });
                    },
                    (err) => {
                        clearInterval(intervalWarmup);
                        gpsMonitor.style.color   = '#f87171';
                        gpsMonitor.textContent   = `❌ GPS Error: ${['','Izin ditolak','Posisi tidak tersedia','Timeout'][err.code] || 'Tidak diketahui'}`;
                    },
                    { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 }
                );

                window._warmupInterval = intervalWarmup;
            });
        };
    }

    // FIX: Wrap resetPengukuran di sini agar fungsi asli pasti sudah ada
    if (typeof window.resetPengukuran === 'function') {
        const _resetAsli = window.resetPengukuran;
        window.resetPengukuran = function() {
            if (window._warmupInterval) {
                clearInterval(window._warmupInterval);
                window._warmupInterval = null;
            }
            _resetAsli();
        };
    }

    // Muat lahan aktif
    const lahanAktif = getLahanAktif();
    if (lahanAktif) {
        setTimeout(() => terapkanLahanAktif(lahanAktif), 500);
    }

    updateBadgeRiwayat();
    setTimeout(cekPengingatHariIni, 2000);
});

// ============================================================
// BAGIAN K: TOAST HELPER
// ============================================================
function tampilkanToast(ikon, judul, pesan, warna) {
    warna = warna || '#f59e0b';
    // FIX: Tunggu DOM siap jika toast dipanggil sangat awal
    const _show = function() {
        const toast = document.getElementById('toastNotif');
        if (!toast) return;
        document.getElementById('toastIcon').textContent  = ikon;
        document.getElementById('toastJudul').textContent = judul;
        document.getElementById('toastJudul').style.color = warna;
        document.getElementById('toastPesan').textContent = pesan;
        toast.style.borderColor = warna;
        toast.classList.add('tampil');
        clearTimeout(window._toastTimer);
        window._toastTimer = setTimeout(() => toast.classList.remove('tampil'), 5000);
    };

    // Jika toastNotif belum ada di DOM (dipanggil sebelum Bagian B selesai), tunda
    if (document.getElementById('toastNotif')) {
        _show();
    } else {
        setTimeout(_show, 300);
    }
}

console.log('✅ Patch Smart Farming v3.1 (Fixed) berhasil dimuat: Multi-Lahan, Riwayat, Notifikasi, Harga Pupuk, Fix GPS Drift, Bottom Nav Bar');
