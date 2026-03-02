# Google Apps Script Deployment Instructions

Ikuti langkah-langkah berikut untuk memasang dashboard ini di Google Sheets Anda:

### 1. Persiapan Google Sheet
1. Buka Google Sheet yang berisi data Anda.
2. Pastikan nama kolom di baris pertama sesuai dengan data (Timestamp, Site Store, Nama Store, dll).

### 2. Memasang Google Apps Script
1. Di Google Sheet, buka menu **Extensions** > **Apps Script**.
2. Hapus semua kode di file `Code.gs` dan ganti dengan kode di bawah ini.
3. Simpan proyek (klik ikon disket).

#### Kode: Code.gs
```javascript
function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Store Request Dashboard')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function getSheetData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheets()[0]; // Mengambil sheet pertama
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const rows = data.slice(1);

  return rows.map(row => {
    const obj = {};
    headers.forEach((header, index) => {
      // Membersihkan nama header untuk dijadikan key JSON
      const key = header.toString().toLowerCase()
        .replace(/[^a-z0-9]/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_|_$/g, '');
      obj[key] = row[index];
    });
    return obj;
  });
}
```

### 3. Membuat File HTML
1. Di editor Apps Script, klik ikon **+** di sebelah "Files" dan pilih **HTML**.
2. Beri nama file tersebut `Index` (sehingga menjadi `Index.html`).
3. Hapus semua isi file `Index.html` dan ganti dengan kode dashboard yang telah dioptimalkan untuk mobile (Anda bisa menyalin kode dari preview aplikasi ini atau menggunakan versi CDN yang saya sediakan).

### 4. Deploy Sebagai Web App
1. Klik tombol **Deploy** > **New deployment**.
2. Pilih type: **Web app**.
3. Description: "Dashboard Store Request".
4. Execute as: **Me**.
5. Who has access: **Anyone** (atau sesuai kebutuhan organisasi Anda).
6. Klik **Deploy**.
7. Salin URL yang diberikan. Anda bisa membuka URL ini di browser HP Anda.

---

**Catatan:** Dashboard ini dirancang khusus untuk tampilan mobile (Mobile-First) dengan fitur:
- Ringkasan statistik (Total, Done, Pending, Rejected).
- Grafik kategori dan sebaran kota.
- Pencarian cepat dan filter status.
- Tampilan kartu yang informatif dan mudah diklik di layar sentuh.
