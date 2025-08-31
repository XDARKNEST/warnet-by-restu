let uang = 50000;
let listrik = 100;
let reputasi = 50; // reputasi 0-100
let upgrades = [];
let passiveIncome = 0;
let cheatMode = false;
let pelangganBoost = 1;

// Kompetitor
let kompetitorStrength = 30; // kekuatan kompetitor (0-100)

// Varian PC
const pcVariants = {
  "murah": { harga: 15000, pendapatan: 1500, listrik: 10, npc: "anak sekolah" },
  "standar": { harga: 20000, pendapatan: 2000, listrik: 15, npc: "pelanggan biasa" },
  "gaming": { harga: 40000, pendapatan: 4000, listrik: 25, npc: "gamer hardcore" },
  "ultra": { harga: 70000, pendapatan: 7000, listrik: 40, npc: "streamer" }
};

// Daftar PC dimiliki
let pcs = [{ type: "standar" }];

function updateStatus() {
  let pcInfo = pcs.map(p => p.type).join(", ");
  document.getElementById("status").innerText =
    `Uang: Rp${uang} | PC: ${pcs.length} (${pcInfo}) | Reputasi: ${reputasi} | ⚡ Listrik:`;
  document.getElementById("powerBar").style.width = listrik + "%";
  document.getElementById("upgrade").innerText =
    "Upgrade: " + (upgrades.length > 0 ? upgrades.join(", ") : "-");
}

function showMessage(msg) {
  document.getElementById("message").innerText = msg;
}

function bukaWarnet() {
  if (listrik <= 0) { showMessage("⚡ Listrik habis! Bayar dulu!"); return; }

  let totalPendapatan = 0;
  let totalListrik = 0;
  let npcHadir = [];

  pcs.forEach(pc => {
    let pelanggan = Math.floor(Math.random() * 5) + 1;
    let pendapatan = pelanggan * pcVariants[pc.type].pendapatan * pelangganBoost;

    if (pc.type === "murah") {
      pelanggan += 2; reputasi += 1;
      pendapatan *= 1.1;
      npcHadir.push("👦 Anak sekolah nongkrong di PC murah");
    }
    if (pc.type === "gaming") {
      pendapatan *= 1.5; reputasi += 2;
      npcHadir.push("🎮 Gamer hardcore puas main di PC gaming");
    }
    if (pc.type === "ultra") {
      if (Math.random() < 0.3) {
        pendapatan += 5000; reputasi += 5;
        npcHadir.push("📹 Streamer live di PC ultra, bikin warnet terkenal!");
      }
    }

    if (upgrades.includes("kursi")) pendapatan *= 1.2;
    if (upgrades.includes("ac")) pendapatan *= 1.3;

    totalPendapatan += pendapatan;
    totalListrik += pcVariants[pc.type].listrik;
  });

  if (reputasi > 70) totalPendapatan *= 1.2;
  if (reputasi < 30) totalPendapatan *= 0.8;

  totalPendapatan += passiveIncome;
  uang += Math.floor(totalPendapatan);
  listrik -= totalListrik;
  if (listrik < 0) listrik = 0;

  let eventChance = Math.random();
  if (eventChance < 0.2) {
    kompetitorEvent();
  } else if (eventChance < 0.4) {
    storyEvent();
  } else if (eventChance < 0.6) {
    randomEvent();
  } else {
    showMessage(`Pendapatan hari ini Rp${totalPendapatan}\n${npcHadir.join("\n")}`);
  }
  updateStatus();
  if (uang <= 0) gameOver();
}

function pilihPC() {
  let pilihan = prompt(
    "Pilih varian PC:\n1. Murah (Rp15000)\n2. Standar (Rp20000)\n3. Gaming (Rp40000)\n4. Ultra (Rp70000)"
  );
  if (pilihan === "1") beliPC("murah");
  else if (pilihan === "2") beliPC("standar");
  else if (pilihan === "3") beliPC("gaming");
  else if (pilihan === "4") beliPC("ultra");
  else showMessage("Pilihan tidak valid!");
}

function beliPC(type) {
  let pcData = pcVariants[type];
  if (uang >= pcData.harga) {
    uang -= pcData.harga;
    pcs.push({ type: type });
    showMessage(`💻 Berhasil beli PC ${type}! Pelanggan suka: ${pcData.npc}`);
  } else {
    showMessage("Uang tidak cukup!");
  }
  updateStatus();
}

function bayarListrik() {
  if (uang >= 10000) {
    uang -= 10000; listrik = 100;
    showMessage("⚡ Listrik sudah dibayar, kembali penuh!");
  } else showMessage("Uang tidak cukup untuk bayar listrik!");
  updateStatus();
}

function upgradeItem(item, cost) {
  if (uang >= cost && !upgrades.includes(item)) {
    uang -= cost; upgrades.push(item);
    if (item === "snack") passiveIncome += 5000;
    if (item === "promosi") pelangganBoost = 1.5;
    showMessage(`Upgrade ${item} berhasil dibeli!`);
  } else if (upgrades.includes(item)) {
    showMessage("Upgrade ini sudah dibeli!");
  } else {
    showMessage("Uang tidak cukup!");
  }
  updateStatus();
}

function randomEvent() {
  let events = [
    "🎲 Mouse hilang, harus beli baru (Rp5000)",
    "⚡ Listrik byarpet, pelanggan kabur!",
    "👮 Satpol PP datang, harus kasih uang rokok (Rp10000)",
    "🔥 Kompetitor kasih diskon besar, pelangganmu berkurang!"
  ];
  let pick = events[Math.floor(Math.random()*events.length)];
  showMessage(pick);
  if (pick.includes("Mouse")) uang -= 5000;
  if (pick.includes("Satpol")) uang -= 10000;
  if (pick.includes("Kompetitor")) uang -= 3000;
  if (uang <= 0) gameOver();
}

function kompetitorEvent() {
  let events = [
    {text:"⚔️ Kompetitor sabotase listrik! Bayar Rp10000 untuk cepat perbaiki atau biarkan (listrik -30)", cost:10000, effect:()=>{ listrik = 100; }},
    {text:"🔥 Kompetitor pasang promo besar! Bayar Rp15000 untuk iklan balasan atau biarkan reputasi turun", cost:15000, effect:()=>{ reputasi += 5; }},
    {text:"😈 Kompetitor sebar rumor jelek! Bayar Rp5000 ke influencer untuk klarifikasi", cost:5000, effect:()=>{ reputasi += 10; }}
  ];
  let s = events[Math.floor(Math.random()*events.length)];
  let choice = confirm(s.text);
  if (choice) {
    if (uang >= s.cost) {
      uang -= s.cost; s.effect();
      showMessage("Kamu melawan kompetitor dengan sukses!");
    } else {
      showMessage("Uang tidak cukup, kompetitor menang kali ini...");
      reputasi -= 5;
    }
  } else {
    showMessage("Kamu diam saja... reputasi turun!");
    reputasi -= 10;
  }
}

function storyEvent() {
  let stories = [
    {text:"💴 Seorang investor ingin membeli saham warnetmu. Terima Rp50000 tapi reputasi turun?", cost:0, reward:"Uang cepat didapat", effect:()=>{ uang += 50000; reputasi -= 10; }},
    {text:"👊 Preman datang nagih uang keamanan Rp20000. Bayar atau lawan?", cost:20000, reward:"Aman sementara", effect:()=>{ reputasi += 2; }},
    {text:"📹 Streamer terkenal mau jadi mitra, tapi kamu harus upgrade PC ultra dulu!", cost:0, reward:"Kalau punya PC ultra → reputasi naik besar", effect:()=>{ if (pcs.some(p=>p.type==="ultra")) reputasi += 20; }}
  ];
  let s = stories[Math.floor(Math.random()*stories.length)];
  let choice = confirm(s.text);
  if (choice) {
    if (uang >= s.cost) {
      uang -= s.cost; s.effect();
      showMessage(s.reward);
    } else {
      showMessage("Uang tidak cukup untuk pilihan ini!");
    }
  } else {
    showMessage("Kamu menolak kesempatan itu...");
    reputasi -= 5;
  }
}

function masukkanCheat() {
  let kode = prompt("Masukkan kode cheat:");
  if (kode === "DRAKS@1122") {
    cheatMode = true;
    uang += 999999;
    showMessage("💸 Cheat aktif! Uang bertambah banyak!");
  } else {
    showMessage("❌ Kode cheat salah!");
  }
  updateStatus();
}

function gameOver() {
  showMessage("💀 Kamu bangkrut! Game Over!");
  uang = 0; pcs = []; listrik = 0;
}

function restartGame() {
  uang = 50000; listrik = 100; reputasi = 50; kompetitorStrength = 30;
  pcs = [{ type: "standar" }];
  upgrades = []; passiveIncome = 0; cheatMode = false; pelangganBoost = 1;
  showMessage("Game dimulai ulang!");
  updateStatus();
}

updateStatus();
