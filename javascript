<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Toolkit Work Design & Measurement</title>
<style>
  body { font-family: Arial, sans-serif; background: #f2f5f9; margin: 0; padding: 16px; color: #1f2933; }
  .wrap { max-width: 520px; margin: 0 auto; }
  h1 { font-size: 20px; margin: 0 0 4px; }
  .sub { font-size: 13px; color: #52606d; margin-bottom: 14px; }
  .tabs { display: flex; gap: 6px; margin-bottom: 12px; }
  .tabs button { flex: 1; padding: 10px 4px; border: 0; border-radius: 6px; background: #d9e2ec; cursor: pointer; font-size: 13px; }
  .tabs button.aktif { background: #1c5d99; color: #fff; }
  .panel { display: none; background: #fff; padding: 16px; border-radius: 8px; }
  .panel.aktif { display: block; }
  label { display: block; font-size: 13px; margin: 10px 0 4px; }
  input, textarea { width: 100%; box-sizing: border-box; padding: 8px; border: 1px solid #bcccdc; border-radius: 6px; font-size: 14px; }
  .hitung { margin-top: 14px; width: 100%; padding: 10px; border: 0; border-radius: 6px; background: #2f9e44; color: #fff; font-size: 15px; cursor: pointer; }
  pre { background: #102a43; color: #e6f0fa; padding: 12px; border-radius: 6px; font-size: 13px; white-space: pre-wrap; margin: 14px 0 0; min-height: 20px; }
  .galat { color: #ffb4a8; }
</style>
</head>
<body>
<div class="wrap">
  <h1>Toolkit Work Design &amp; Measurement</h1>
  <div class="sub">BoK 1 - IISE Body of Knowledge, Teknik Industri</div>

  <div class="tabs">
    <button id="tab1" class="aktif" onclick="pilihTab(1)">Studi Waktu</button>
    <button id="tab2" onclick="pilihTab(2)">Work Sampling</button>
    <button id="tab3" onclick="pilihTab(3)">Kapasitas</button>
  </div>

  <!-- MODUL 1 -->
  <div id="panel1" class="panel aktif">
    <label>Data waktu (detik), pisahkan dengan spasi atau koma</label>
    <textarea id="dataWaktu" rows="2">42 45 43 44 46 43 45 44 42 46</textarea>
    <label>Rating factor (%)</label>
    <input id="rating" type="number" value="110">
    <label>Allowance (%)</label>
    <input id="allowance" type="number" value="15">
    <button class="hitung" onclick="hitungStudiWaktu()">Hitung</button>
    <pre id="hasil1"></pre>
  </div>

  <!-- MODUL 2 -->
  <div id="panel2" class="panel">
    <label>Total pengamatan</label>
    <input id="totalObs" type="number" value="200">
    <label>Pengamatan produktif</label>
    <input id="produktif" type="number" value="160">
    <button class="hitung" onclick="hitungWorkSampling()">Hitung</button>
    <pre id="hasil2"></pre>
  </div>

  <!-- MODUL 3 -->
  <div id="panel3" class="panel">
    <label>Waktu baku (detik/unit)</label>
    <input id="wbaku" type="number" value="54.35">
    <label>Jam kerja efektif per hari</label>
    <input id="jamKerja" type="number" value="8">
    <label>Target produksi per hari (unit)</label>
    <input id="target" type="number" value="1000">
    <button class="hitung" onclick="hitungKapasitas()">Hitung</button>
    <pre id="hasil3"></pre>
  </div>
</div>

<script>
// ---------- FUNGSI BANTU ----------

function jumlah(data) {
  let total = 0;
  for (let i = 0; i < data.length; i++) total += data[i];
  return total;
}

function rataRata(data) {
  return jumlah(data) / data.length;
}

// Standar deviasi sampel (dibagi n-1)
function standarDeviasi(data) {
  if (data.length < 2) return 0;
  const rata = rataRata(data);
  let total = 0;
  for (let i = 0; i < data.length; i++) {
    total += (data[i] - rata) ** 2;
  }
  return Math.sqrt(total / (data.length - 1));
}

// Ambil angka dari kolom input, kembalikan NaN kalau kosong / bukan angka
function ambilAngka(id) {
  const teks = document.getElementById(id).value.trim().replace(",", ".");
  return teks === "" ? NaN : Number(teks);
}

function tampilkan(id, teks, galat) {
  const el = document.getElementById(id);
  el.className = galat ? "galat" : "";
  el.textContent = teks;
}

function pilihTab(no) {
  for (let i = 1; i <= 3; i++) {
    document.getElementById("tab" + i).className = (i === no) ? "aktif" : "";
    document.getElementById("panel" + i).className = (i === no) ? "panel aktif" : "panel";
  }
}

// ---------- MODUL 1: STUDI WAKTU ----------

function hitungStudiWaktu() {
  const teks = document.getElementById("dataWaktu").value;
  const potongan = teks.replace(/,/g, " ").split(/\s+/).filter(function (s) { return s !== ""; });
  const data =
