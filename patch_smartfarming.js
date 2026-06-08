/**
 * ============================================================
 *  PATCH: Menu Risiko Cuaca Langsung Tampil (Lokasi Umum)
 *  PPL Milenial Wajo — Smart Farming
 * ============================================================
 *
 *  CARA PASANG:
 *  Letakkan file ini di folder yang sama dengan HTML utama,
 *  lalu tambahkan SETELAH script patch_smartfarming.js:
 *
 *    <script src="patch_cuaca_langsung.js"></script>
 *
 *  CARA KERJA:
 *  1. Saat klik menu "RISIKO CUACA" → langsung muat data cuaca
 *     menggunakan koordinat umum Kab. Wajo (tanpa minta GPS)
 *  2. Semua section tampil otomatis:
 *     - 📍 Lokasi Koordinat
 *     - 🔮 Prediksi Atmosfer (1 Jam Kedepan)
 *     - 🕒 Prakiraan Cuaca Per Jam
 *     - 📅 Prakiraan 7 Hari Kedepan
 *     - 📊 Real-Time Parameter Lahan (Satelit)
 *     - 🛰️ Analisis Satelit Mikro Spasial Lahan
 *  3. Setelah tekan tombol "SINKRONKAN GPS" → GPS aktif,
 *     data refresh pakai lokasi akurat, BARU MUNCUL:
 *     - ⚠️ Risiko Penyakit (Blast, Sheath Blight)
 *     - 🐛 Peringatan Hama (WBC, Penggerek, Tungro, Tikus)
 *     - 🌱 Fase Tanaman Saat Ini
 *     - 🔮 Proyeksi Iklim Makro (ENSO/IOD/SST)
 * ============================================================
 */
(function () {
    'use strict';

    // ── Koordinat umum default: Pusat Kab. Wajo, Sulsel ────────────────────────
    const LOK_UMUM = { lat: -3.9264, lon: 120.0275, label: 'Kab. Wajo, Sulawesi Selatan' };

    // ── State ───────────────────────────────────────────────────────────────────
    let koordinatSaatIni = { ...LOK_UMUM, akurat: false };
    let dataCuacaTerakhir = null;   // Simpan hasil fetch untuk dipakai saat GPS aktif
    let sedangMemuat = false;

    // =========================================================================
    //  1. OVERRIDE switchMode → langsung tampil saat mode 'cuaca'
    // =========================================================================
    const _switchModeAsli = window.switchMode;

    window.switchMode = function (mode) {
        _switchModeAsli(mode);
        if (mode === 'cuaca') {
            setTimeout(initTampilanCuaca, 80);
        }
    };

    // ── Inisialisasi tampilan cuaca ─────────────────────────────────────────────
    function initTampilanCuaca() {
        // Paksa weatherData & result langsung tampil
        const gpsPrompt   = document.getElementById('gpsPrompt');
        const weatherData = document.getElementById('weatherData');
        const result      = document.getElementById('result');
        const resConf     = document.getElementById('resConf');

        if (gpsPrompt)   gpsPrompt.style.display   = 'none';
        if (weatherData) weatherData.style.display = 'block';
        if (result)      result.style.display      = 'block';
        if (resConf)     resConf.style.display     = 'block';

        // Ganti isi gpsPrompt dengan UI baru (tombol GPS baru fungsinya)
        renderUITombolGPS();

        // Tampilkan lokasi umum dulu
        setLabelLokasi(false);

        // Sembunyikan semua box risiko & peringatan dulu
        sembunyikanBoxRisiko();

        // Muat data cuaca pakai lokasi umum langsung
        if (!sedangMemuat) {
            muatCuaca(koordinatSaatIni.lat, koordinatSaatIni.lon, false);
        }
    }

    // =========================================================================
    //  2. RENDER UI TOMBOL GPS BARU (menggantikan form lama di gpsPrompt)
    // =========================================================================
    function renderUITombolGPS() {
        const gpsPrompt = document.getElementById('gpsPrompt');
        if (!gpsPrompt) return;

        gpsPrompt.style.display = 'block';
        gpsPrompt.innerHTML = `
            <!-- Info lokasi yang sedang dipakai -->
            <div id="infoLokasiCuaca" style="
                background: rgba(59,130,246,0.08);
                border: 1px solid rgba(59,130,246,0.2);
                border-radius: 14px;
                padding: 12px 14px;
                margin-bottom: 12px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 10px;
            ">
                <div>
                    <div style="font-size:0.68rem; font-weight:700; color:#64748b;
                                letter-spacing:1px; margin-bottom:3px;">📡 LOKASI AKTIF</div>
                    <div id="namaLokasiCuaca"
                         style="font-size:0.85rem; font-weight:700; color:#3b82f6;">
                        ${LOK_UMUM.label}
                    </div>
                    <div id="statusLokasiCuaca"
                         style="font-size:0.7rem; color:#f59e0b; font-weight:600; margin-top:3px;">
                        ⚠️ Data umum wilayah — tekan GPS untuk lokasi sawah akurat
                    </div>
                </div>
                <span id="ikonStatusLokasi" style="font-size:1.6rem; flex-shrink:0;">📡</span>
            </div>

            <!-- Input tanggal tanam & varietas (untuk analisis risiko nanti) -->
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:12px;">
                <div>
                    <label style="font-size:0.68rem; color:#64748b; font-weight:700;
                                  display:block; margin-bottom:4px;">📅 TGL TANAM</label>
                    <input type="date" id="tglTanamCuaca" class="form-input"
                           style="margin-bottom:0; padding:10px; font-size:0.8rem;">
                </div>
                <div>
                    <label style="font-size:0.68rem; color:#64748b; font-weight:700;
                                  display:block; margin-bottom:4px;">🌱 VARIETAS</label>
                    <select id="umurVarietasCuaca" class="form-select"
                            style="margin-bottom:0; padding:10px; font-size:0.8rem;">
                        <option value="genjah">Genjah (&lt;95 HST)</option>
                        <option value="sedang" selected>Sedang (95-115)</option>
                        <option value="dalam">Dalam (≥116 HST)</option>
                    </select>
                </div>
            </div>

            <!-- Tombol GPS -->
            <button id="btnGPSAkurat" onclick="sinkronGPS()"
                style="
                    width: 100%;
                    padding: 14px 16px;
                    background: linear-gradient(135deg, #3b82f6, #2563eb);
                    color: #fff;
                    border: none;
                    border-radius: 14px;
                    font-weight: 700;
                    font-size: 0.88rem;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    letter-spacing: 0.3px;
                    transition: all 0.2s;
                    margin-bottom: 8px;
                ">
                <span id="ikonBtnGPS" style="font-size:1.1rem;">🛰️</span>
                <span id="teksBtnGPS">SINKRONKAN GPS & SATELIT</span>
            </button>

            <!-- Keterangan tombol -->
            <div style="font-size:0.7rem; color:#475569; text-align:center; line-height:1.5;
                        padding: 0 8px; margin-bottom:4px;">
                Setelah GPS tersinkron, risiko penyakit dan peringatan hama
                akan muncul berdasarkan lokasi sawah Anda yang akurat.
            </div>
        `;

        // Sinkronkan nilai dari lahan aktif jika tersimpan
        try {
            const la = JSON.parse(localStorage.getItem('sf_lahan_aktif') || 'null');
            if (la) {
                const tglEl = document.getElementById('tglTanamCuaca');
                const varEl = document.getElementById('umurVarietasCuaca');
                if (tglEl && la.tglTanam)     tglEl.value = la.tglTanam;
                if (varEl && la.varietasUmur) varEl.value = la.varietasUmur;
            }
        } catch (e) {}
    }

    // ── Set label lokasi di info box atas ──────────────────────────────────────
    function setLabelLokasi(akurat) {
        const lokasiEl  = document.getElementById('lokasiSawah');
        const alamatEl  = document.getElementById('alamatDesa');
        const resLabel  = document.getElementById('resLabel');
        const resConf   = document.getElementById('resConf');

        if (lokasiEl) {
            lokasiEl.innerText = akurat
                ? `${koordinatSaatIni.lat.toFixed(5)}, ${koordinatSaatIni.lon.toFixed(5)}`
                : `${LOK_UMUM.lat.toFixed(5)}, ${LOK_UMUM.lon.toFixed(5)} (Lokasi Umum)`;
        }

        if (alamatEl) {
            alamatEl.innerHTML = akurat
                ? `<b>${koordinatSaatIni.label}</b>`
                : `<span style="color:#f59e0b; font-size:0.82rem;">
                       📡 ${LOK_UMUM.label} — Data cuaca umum wilayah
                   </span>`;
        }

        if (resLabel) resLabel.innerText = akurat
            ? '🛰️ Data Cuaca Lokasi Sawah Anda'
            : `☁️ Data Cuaca — ${LOK_UMUM.label}`;

        if (resConf) {
            resConf.style.display = 'block';
            resConf.innerText = akurat
                ? '✅ GPS Akurat • Risiko penyakit & hama aktif'
                : '📡 Data cuaca umum wilayah • Tekan GPS untuk analisis risiko sawah';
        }
    }

    // ── Sembunyikan semua box risiko ────────────────────────────────────────────
    function sembunyikanBoxRisiko() {
        document.querySelectorAll('#weatherData .info-box-dynamic').forEach(el => el.remove());

        const boxBlast = document.getElementById('boxBlastRisk');
        if (boxBlast) boxBlast.style.display = 'none';

        const predHujan = document.getElementById('prediksiHujan');
        if (predHujan) predHujan.style.display = 'none';

        const lokal = document.getElementById('localSstBox');
        if (lokal) lokal.style.display = 'none';
    }

    // =========================================================================
    //  3. MUAT DATA CUACA (bisa pakai koordinat umum atau GPS akurat)
    // =========================================================================
    async function muatCuaca(lat, lon, tampilkanRisiko) {
        if (sedangMemuat) return;
        sedangMemuat = true;

        // Tampilkan skeleton sementara data dimuat
        tampilkanSkeleton();

        try {
            const urlForecast =
                `https://api.open-meteo.com/v1/forecast` +
                `?latitude=${lat}&longitude=${lon}` +
                `&current=rain,temperature_2m,relative_humidity_2m,dew_point_2m,` +
                `wind_speed_10m,wind_direction_10m,surface_pressure,weather_code` +
                `&hourly=precipitation_probability,precipitation,temperature_850hPa,` +
                `cape,temperature_2m,weather_code` +
                `&daily=weather_code,temperature_2m_max,temperature_2m_min` +
                `&timezone=auto`;

            const urlArchive =
                `https://archive-api.open-meteo.com/v1/archive` +
                `?latitude=${lat}&longitude=${lon}` +
                `&start_date=${tanggalMinus(30)}&end_date=${tanggalMinus(1)}` +
                `&daily=precipitation_sum&timezone=auto`;

            const [dataForecast, dataArchive] = await Promise.all([
                fetchDenganRetry(urlForecast),
                fetchDenganRetry(urlArchive).catch(() => ({ daily: { precipitation_sum: [] } }))
            ]);

            // Simpan untuk nanti dipakai saat GPS aktif
            dataCuacaTerakhir = { dataForecast, dataArchive, lat, lon };

            // Render semua data ke UI
            renderCuaca(dataForecast, dataArchive, lat, lon);

            // Tampilkan/sembunyikan risiko sesuai status GPS
            if (tampilkanRisiko) {
                renderSemuaRisiko(dataForecast.current, lat, lon);
            } else {
                tampilkanBannerRisikoGPS();
            }

        } catch (err) {
            console.error('[cuaca_langsung] Gagal fetch:', err.message);
            tampilkanGagal(err.message);
        } finally {
            sedangMemuat = false;
        }
    }

    // ── Skeleton loading ────────────────────────────────────────────────────────
    function tampilkanSkeleton() {
        const hourlyContainer = document.getElementById('hourlyForecastContainer');
        if (hourlyContainer) {
            hourlyContainer.innerHTML = Array(8).fill(0).map(() => `
                <div class="hourly-card" style="min-width:75px; opacity:0.6;">
                    <div style="background:#1e2f45; border-radius:6px; height:11px;
                                width:36px; margin:0 auto 8px;"></div>
                    <div style="background:#1e2f45; border-radius:50%; height:28px;
                                width:28px; margin:0 auto 8px;"></div>
                    <div style="background:#1e2f45; border-radius:6px; height:13px;
                                width:34px; margin:0 auto;"></div>
                </div>`).join('');
        }

        const dailyContainer = document.getElementById('dailyForecastContainer');
        if (dailyContainer) {
            dailyContainer.innerHTML = Array(7).fill(0).map(() => `
                <div class="daily-item">
                    <div style="background:#1e2f45; border-radius:6px; height:13px;
                                width:55px;"></div>
                    <div style="background:#1e2f45; border-radius:6px; height:18px;
                                width:22px; margin:0 auto;"></div>
                    <div style="background:#1e2f45; border-radius:6px; height:13px;
                                width:65px; margin-left:auto;"></div>
                </div>`).join('');
        }

        ['rainNow','rainMonthly','suhuNow','humidityNow','windNow','pressNow',
         'tempUpper','dpSpread','capeVal','windDir'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.innerHTML =
                `<span style="background:#1e2f45; border-radius:4px;
                              display:inline-block; width:65px; height:13px;"></span>`;
        });
    }

    // ── Render data cuaca ke semua section ─────────────────────────────────────
    function renderCuaca(dataForecast, dataArchive, lat, lon) {
        const cur    = dataForecast.current;
        const hourly = dataForecast.hourly;
        const daily  = dataForecast.daily;

        // Cari index jam sekarang
        const now = new Date();
        const waktuStr =
            `${now.getFullYear()}-` +
            `${String(now.getMonth()+1).padStart(2,'0')}-` +
            `${String(now.getDate()).padStart(2,'0')}T` +
            `${String(now.getHours()).padStart(2,'0')}:00`;

        let idx = hourly.time.findIndex(t => t.startsWith(waktuStr));
        if (idx === -1) idx = hourly.time.findIndex(t => new Date(t) >= now);
        if (idx === -1) idx = 0;

        // Fungsi ikon cuaca
        const cuacaDari = (code) => {
            if (code === 0)                      return { ikon:'☀️', teks:'Cerah' };
            if ([1,2,3].includes(code))          return { ikon:'☁️', teks:'Berawan' };
            if ([45,48].includes(code))          return { ikon:'🌫️', teks:'Berkabut' };
            if ([51,53,55,61,63,80,81].includes(code)) return { ikon:'🌧️', teks:'Hujan Ringan' };
            if ([65,82].includes(code))          return { ikon:'🌧️', teks:'Hujan Lebat' };
            if ([95,96,99].includes(code))       return { ikon:'⛈️', teks:'Badai Petir' };
            return { ikon:'⛅', teks:'Berawan' };
        };

        // ── Prakiraan Per Jam ──────────────────────────────────────────────────
        const hourlyBox = document.getElementById('hourlyForecastContainer');
        if (hourlyBox) {
            hourlyBox.innerHTML = '';
            for (let i = idx; i < idx + 12 && i < hourly.time.length; i++) {
                const jam   = hourly.time[i].split('T')[1].substring(0,5);
                const cuaca = cuacaDari(hourly.weather_code[i]);
                const suhu  = hourly.temperature_2m[i].toFixed(0);
                hourlyBox.innerHTML +=
                    `<div class="hourly-card">` +
                    `<div class="time">${jam}</div>` +
                    `<div class="icon" title="${cuaca.teks}">${cuaca.ikon}</div>` +
                    `<div class="temp">${suhu}°C</div>` +
                    `</div>`;
            }
        }

        // ── Prakiraan 7 Hari ──────────────────────────────────────────────────
        const dailyBox = document.getElementById('dailyForecastContainer');
        if (dailyBox) {
            dailyBox.innerHTML = '';
            const HARI = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
            daily.time.forEach((tgl, j) => {
                const d    = new Date(tgl);
                const hari = j === 0 ? 'Hari Ini' : HARI[d.getDay()];
                const c    = cuacaDari(daily.weather_code[j]);
                const maks = daily.temperature_2m_max[j].toFixed(0);
                const min  = daily.temperature_2m_min[j].toFixed(0);
                dailyBox.innerHTML +=
                    `<div class="daily-item">` +
                    `<div class="day">${hari}</div>` +
                    `<div class="icon" title="${c.teks}">${c.ikon}</div>` +
                    `<div class="temp-range">${min}°/${maks}°C</div>` +
                    `</div>`;
            });
        }

        // ── Parameter Real-Time ────────────────────────────────────────────────
        const dp   = (cur.temperature_2m - cur.dew_point_2m).toFixed(1);
        const cape = hourly.cape ? (hourly.cape[idx] || 0) : 0;
        const t850 = hourly.temperature_850hPa ? hourly.temperature_850hPa[idx] : '-';

        document.getElementById('dpSpread').innerText    = `${dp} °C`;
        document.getElementById('suhuNow').innerText     = `${cur.temperature_2m} °C`;
        document.getElementById('humidityNow').innerText = `${cur.relative_humidity_2m}%`;
        document.getElementById('windNow').innerText     = `${cur.wind_speed_10m} km/jam`;
        document.getElementById('pressNow').innerText    = `${cur.surface_pressure} hPa`;
        document.getElementById('tempUpper').innerText   = `${t850} °C`;

        const capeEl = document.getElementById('capeVal');
        if (capeEl) {
            const st = cape > 2500 ? '‼️ EKSTREM' : (cape > 1000 ? '⚠️ WASPADA' : '✅ STABIL');
            capeEl.innerHTML = `${cape} J/kg<br><small>Status: ${st}</small>`;
        }

        // Hujan bulanan
        const listHujan   = (dataArchive.daily || {}).precipitation_sum || [];
        const totalBulanan = listHujan.reduce((t, v) => t + (v || 0), 0);
        document.getElementById('rainNow').innerHTML      = `${(cur.rain || 0).toFixed(1)} mm/jam`;
        document.getElementById('rainMonthly').innerHTML  = `<b>${totalBulanan.toFixed(1)} mm</b>`;

        // Arah angin
        const ARAH = ['Utara','Timur Laut','Timur','Tenggara','Selatan','Barat Daya','Barat','Barat Laut'];
        const dirEl = document.getElementById('windDir');
        if (dirEl) dirEl.innerHTML =
            `<div style="display:flex;align-items:center;justify-content:flex-end;gap:5px;">` +
            `<span style="transform:rotate(${cur.wind_direction_10m+180}deg)">⬆️</span>` +
            `<span>Dari ${ARAH[Math.round(cur.wind_direction_10m/45)%8]}</span></div>`;

        // ── Prediksi Atmosfer (1 Jam Kedepan) ─────────────────────────────────
        let rainScore = 0;
        const prob = hourly.precipitation_probability;
        if (prob && prob[idx+1] >= 30) rainScore += 40;
        if (cape >= 1000) rainScore += 30;
        if (parseFloat(dp) <= 2) rainScore += 20;
        if (cur.relative_humidity_2m >= 90) rainScore += 10;

        const boxHujan = document.getElementById('prediksiHujan');
        const txtHujan = document.getElementById('hujanNext');
        if (boxHujan && txtHujan) {
            boxHujan.style.display = 'block';
            if (rainScore >= 70) {
                txtHujan.innerHTML = `⛈️ <b>Hujan Sangat Mungkin</b><br><small>(Skor: ${rainScore}/100)</small>`;
                boxHujan.style.borderLeftColor = 'var(--red-alert)';
            } else if (rainScore >= 40) {
                txtHujan.innerHTML = `🌦️ <b>Potensi Hujan Lokal</b><br><small>(Skor: ${rainScore}/100)</small>`;
                boxHujan.style.borderLeftColor = 'var(--accent-soil)';
            } else {
                txtHujan.innerHTML = `🌤️ <b>Cerah / Berawan</b><br><small>(Skor: ${rainScore}/100)</small>`;
                boxHujan.style.borderLeftColor = 'var(--accent-green)';
            }
        }

        // ── Radar Satelit ─────────────────────────────────────────────────────
        const radarEl = document.getElementById('radarMap');
        if (radarEl) radarEl.src = `https://mamank757.github.io/peta?lat=${lat}&lon=${lon}`;

        // Label & confidence
        setLabelLokasi(koordinatSaatIni.akurat);
    }

    // ── Banner info GPS sebelum ditekan ────────────────────────────────────────
    function tampilkanBannerRisikoGPS() {
        const lama = document.getElementById('bannerRisikoGPS');
        if (lama) lama.remove();
        document.querySelectorAll('#weatherData .info-box-dynamic').forEach(el => el.remove());

        const weatherData = document.getElementById('weatherData');
        if (!weatherData) return;

        weatherData.insertAdjacentHTML('beforeend', `
            <div id="bannerRisikoGPS" class="info-box" style="
                border-left-color: #3b82f6;
                background: rgba(59,130,246,0.05);
                margin-top: 16px;
                text-align: center;
                animation: fadeInUp 0.5s ease;
            ">
                <div style="font-size:2rem; margin-bottom:10px;">🛰️</div>
                <div style="font-size:0.9rem; font-weight:700; color:#3b82f6; margin-bottom:8px;">
                    Analisis Risiko Penyakit & Hama
                </div>
                <div style="font-size:0.8rem; color:#64748b; line-height:1.8; margin-bottom:14px;">
                    Tekan <b style="color:#3b82f6;">SINKRONKAN GPS & SATELIT</b> di atas
                    untuk mengaktifkan:<br>
                    <span style="color:#ef4444;">⚠️ Risiko Blast Padi</span> &nbsp;•&nbsp;
                    <span style="color:#ef4444;">⚠️ Hawar Pelepah</span><br>
                    <span style="color:#f59e0b;">🐛 Penggerek Batang</span> &nbsp;•&nbsp;
                    <span style="color:#f59e0b;">🪳 Wereng Batang Coklat</span><br>
                    <span style="color:#10b981;">🌾 Tungro (Virus)</span> &nbsp;•&nbsp;
                    <span style="color:#10b981;">🐀 Tikus Sawah</span><br>
                    <span style="color:#d946ef;">🌱 Fase Tanaman Saat Ini</span><br>
                    <span style="color:#38b6ff;">📈 Proyeksi Iklim ENSO / IOD / SST</span>
                </div>
                <div style="font-size:0.7rem; color:#475569;">
                    GPS diperlukan agar analisis disesuaikan dengan
                    kondisi iklim dan cuaca di lokasi sawah Anda secara tepat.
                </div>
            </div>
        `);
    }

    // ── Tampilkan semua risiko setelah GPS akurat ───────────────────────────────
    function renderSemuaRisiko(cur, lat, lon) {
        // Hapus banner & box risiko lama
        const banner = document.getElementById('bannerRisikoGPS');
        if (banner) banner.remove();
        document.querySelectorAll('#weatherData .info-box-dynamic').forEach(el => el.remove());

        // Tampilkan box blast
        const boxBlast = document.getElementById('boxBlastRisk');
        if (boxBlast) {
            boxBlast.style.display = 'block';
            if (typeof window.analyzeDiseaseRisk === 'function') {
                const dp = (cur.temperature_2m - cur.dew_point_2m).toFixed(1);
                window.analyzeDiseaseRisk(cur, dp);
            }
        }

        const weatherData = document.getElementById('weatherData');
        if (!weatherData) return;

        // Fase tanaman
        let fase = { fase: 'Belum diset — isi tanggal tanam', umurHari: 0, musim: '-' };
        if (typeof window.analisisFaseTanaman === 'function') {
            fase = window.analisisFaseTanaman();
        }

        weatherData.insertAdjacentHTML('beforeend', `
            <div class="info-box info-box-dynamic"
                 style="border-left-color:var(--accent-bwd); margin-top:15px;
                        animation: fadeInUp 0.4s ease;">
                <strong>🌱 Fase Tanaman Saat Ini</strong><br>
                <div style="font-size:1rem; font-weight:700; color:var(--accent-bwd);">
                    ${fase.fase}
                </div>
                <small>${fase.musim} • ± ${fase.umurHari} hari</small>
            </div>`);

        // Fungsi helper buat box risiko
        const boksRisiko = (judul, r) => `
            <div class="info-box info-box-dynamic"
                 style="border-left-color:${r.warna}; margin-top:15px;
                        animation: fadeInUp 0.4s ease;">
                <strong>${judul}</strong><br>
                <div style="font-size:1.1rem; font-weight:800; color:${r.warna};">${r.level}</div>
                <p style="margin:5px 0; opacity:0.9;">${r.detail}</p>
                <div style="background:rgba(255,255,255,0.02); padding:8px; border-radius:6px;">
                    <b>💡 Rekomendasi:</b> ${r.saran}
                </div>
            </div>`;

        // Tikus
        if (typeof window.hitungRisikoTikus === 'function') {
            weatherData.insertAdjacentHTML('beforeend',
                boksRisiko('🐀 Peringatan Dini Tikus Sawah',
                    window.hitungRisikoTikus(cur.rain || 0, fase)));
        }

        // Penggerek Batang
        if (typeof window.hitungRisikoHamaPBP === 'function') {
            weatherData.insertAdjacentHTML('beforeend',
                boksRisiko('🐛 Peringatan Dini Penggerek Batang',
                    window.hitungRisikoHamaPBP(cur.temperature_2m, cur.relative_humidity_2m, fase)));
        }

        // Sheath Blight
        if (typeof window.hitungRisikoSheathBlight === 'function') {
            weatherData.insertAdjacentHTML('beforeend',
                boksRisiko('🍂 Hawar Pelepah (Sheath Blight)',
                    window.hitungRisikoSheathBlight(cur.temperature_2m, cur.relative_humidity_2m, fase)));
        }

        // Wereng Batang Coklat
        if (typeof window.hitungRisikoWereng === 'function') {
            weatherData.insertAdjacentHTML('beforeend',
                boksRisiko('🪳 Wereng Batang Coklat',
                    window.hitungRisikoWereng(cur.temperature_2m, cur.relative_humidity_2m, cur.rain || 0, fase)));
        }

        // Tungro
        if (typeof window.hitungRisikoTungro === 'function') {
            weatherData.insertAdjacentHTML('beforeend',
                boksRisiko('🌾 Tungro (Virus)',
                    window.hitungRisikoTungro(cur.temperature_2m, cur.relative_humidity_2m, cur.rain || 0, fase)));
        }

        // Iklim global (ENSO/IOD/SST) — tampilkan lokal SST juga
        const lokal = document.getElementById('localSstBox');
        if (lokal) lokal.style.display = 'block';
        if (typeof window.loadGlobalClimateIndices === 'function') {
            window.loadGlobalClimateIndices();
        }
    }

    // ── Pesan gagal ─────────────────────────────────────────────────────────────
    function tampilkanGagal(pesan) {
        const resLabel = document.getElementById('resLabel');
        const resConf  = document.getElementById('resConf');
        if (resLabel) resLabel.innerText = '⚠️ Gagal Memuat Data Cuaca';
        if (resConf)  resConf.innerText  = pesan || 'Periksa koneksi internet';
    }

    // =========================================================================
    //  4. TOMBOL GPS DITEKAN → SINKRONISASI → REFRESH + TAMPILKAN RISIKO
    // =========================================================================
    window.sinkronGPS = async function () {
        const btnGPS  = document.getElementById('btnGPSAkurat');
        const ikonBtn = document.getElementById('ikonBtnGPS');
        const teksBtn = document.getElementById('teksBtnGPS');

        // UI loading
        if (btnGPS)  { btnGPS.disabled = true; btnGPS.style.opacity = '0.75'; }
        if (ikonBtn) ikonBtn.textContent = '⏳';
        if (teksBtn) teksBtn.textContent = 'MENCARI SINYAL GPS...';

        try {
            // Minta koordinat GPS dari perangkat
            const pos = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve,
                    () => {
                        // Fallback akurasi rendah
                        navigator.geolocation.getCurrentPosition(resolve, reject, {
                            enableHighAccuracy: false,
                            timeout: 20000,
                            maximumAge: 60000
                        });
                    },
                    { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
                );
            });

            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;

            // Simpan koordinat akurat ke state
            koordinatSaatIni = { lat, lon, label: `${lat.toFixed(5)}, ${lon.toFixed(5)}`, akurat: true };
            window._koordinatTerakhir = pos;

            // Update UI tombol
            if (teksBtn) teksBtn.textContent = 'MENDAPATKAN NAMA LOKASI...';

            // Reverse geocoding
            try {
                const geoRes = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`,
                    { headers: { 'User-Agent': 'SmartFarming-PPLWajo/1.0' } }
                );
                if (geoRes.ok) {
                    const d    = await geoRes.json();
                    const addr = d.address;
                    const desa = addr.village || addr.suburb || addr.hamlet || addr.town || 'Lokasi GPS';
                    const kab  = addr.county  || addr.city   || addr.municipality || '';
                    koordinatSaatIni.label = `${desa}, Kab. ${kab}`;

                    const alamatEl = document.getElementById('alamatDesa');
                    if (alamatEl) alamatEl.innerHTML = `<b>${desa}</b>, Kab. ${kab}`;
                }
            } catch (e) { /* geocoding gagal, pakai koordinat saja */ }

            // Update label info lokasi di panel tombol
            const namaLokEl = document.getElementById('namaLokasiCuaca');
            const statusLokEl = document.getElementById('statusLokasiCuaca');
            const ikonStatEl  = document.getElementById('ikonStatusLokasi');

            if (namaLokEl)   namaLokEl.textContent   = koordinatSaatIni.label;
            if (statusLokEl) {
                statusLokEl.textContent = '✅ GPS Akurat — Analisis risiko penyakit & hama aktif';
                statusLokEl.style.color = '#10b981';
            }
            if (ikonStatEl) ikonStatEl.textContent = '🛰️';

            // Ubah tombol jadi hijau berhasil
            if (btnGPS) {
                btnGPS.disabled = false;
                btnGPS.style.opacity = '1';
                btnGPS.style.background = 'linear-gradient(135deg, #10b981, #059669)';
            }
            if (ikonBtn) ikonBtn.textContent = '✅';
            if (teksBtn) teksBtn.textContent = 'GPS TERSINKRON — KLIK UNTUK PERBARUI';

            // Refresh data cuaca dengan koordinat GPS + tampilkan risiko
            sedangMemuat = false;
            await muatCuaca(lat, lon, true);

        } catch (err) {
            console.error('[cuaca_langsung] GPS gagal:', err);

            // Reset tombol
            if (btnGPS) {
                btnGPS.disabled = false;
                btnGPS.style.opacity = '1';
                btnGPS.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
            }
            if (ikonBtn) ikonBtn.textContent = '❌';
            if (teksBtn) teksBtn.textContent = 'GPS GAGAL — KLIK UNTUK COBA LAGI';

            // Balik ke biru normal setelah 4 detik
            setTimeout(() => {
                if (btnGPS) btnGPS.style.background = 'linear-gradient(135deg, #3b82f6, #2563eb)';
                if (ikonBtn) ikonBtn.textContent = '🛰️';
                if (teksBtn) teksBtn.textContent = 'SINKRONKAN GPS & SATELIT';
                if (btnGPS) btnGPS.disabled = false;
            }, 4000);
        }
    };

    // Override aktifkanGPS lama agar tidak bentrok
    window.aktifkanGPS = async function () {
        await window.sinkronGPS();
    };

    // =========================================================================
    //  5. HELPERS
    // =========================================================================
    async function fetchDenganRetry(url, coba = 3, jeda = 1500) {
        for (let i = 0; i < coba; i++) {
            try {
                const ctrl = new AbortController();
                const t    = setTimeout(() => ctrl.abort(), 12000);
                const res  = await fetch(url, { signal: ctrl.signal });
                clearTimeout(t);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return await res.json();
            } catch (e) {
                if (i < coba - 1) await new Promise(r => setTimeout(r, jeda));
                else throw e;
            }
        }
    }

    function tanggalMinus(hari) {
        const d = new Date();
        d.setDate(d.getDate() - hari);
        return d.toISOString().split('T')[0];
    }

    // =========================================================================
    //  6. CSS ANIMASI TAMBAHAN
    // =========================================================================
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(10px); }
            to   { opacity: 1; transform: translateY(0); }
        }
        .info-box-dynamic { animation: fadeInUp 0.45s ease; }
        #bannerRisikoGPS  { animation: fadeInUp 0.5s ease; }

        #btnGPSAkurat { transition: background 0.3s ease, opacity 0.2s; }
        #btnGPSAkurat:active { transform: scale(0.98); opacity: 0.85; }

        /* Pastikan weatherData langsung tampil */
        #weatherData { display: block !important; }

        /* Sembunyikan tombol btn-live lama agar tidak double */
        #gpsPrompt > button.btn-main.btn-live { display: none !important; }

        /* Light mode override untuk panel info lokasi */
        body.light-mode #infoLokasiCuaca {
            background: rgba(59,130,246,0.06) !important;
            border-color: rgba(59,130,246,0.2) !important;
        }
        body.light-mode #namaLokasiCuaca { color: #1d4ed8 !important; }
        body.light-mode #statusLokasiCuaca { color: #b45309 !important; }
        body.light-mode #btnGPSAkurat { color: #fff !important; }
        body.light-mode #bannerRisikoGPS {
            background: rgba(59,130,246,0.04) !important;
        }
    `;
    document.head.appendChild(style);

    console.log('✅ [patch_cuaca_langsung] Aktif: cuaca langsung tampil, GPS hanya untuk risiko penyakit.');

})();
