
    function updateClock() {
        const now = new Date();
        const s = now.getSeconds() * 6, m = now.getMinutes() * 6, h = (now.getHours() % 12) * 30 + (now.getMinutes()/2);
        document.getElementById('sec').style.transform = `rotate(${s}deg)`;
        document.getElementById('min').style.transform = `rotate(${m}deg)`;
        document.getElementById('hour').style.transform = `rotate(${h}deg)`;
    }
    setInterval(updateClock, 1000); updateClock();

    function toggleGlass(el) { el.parentElement.classList.toggle('open'); }
    function showDoc(title, user, iconClass, el) {
        if(!el.closest('.info-card').classList.contains('open')) return;

        document.getElementById('docTitle').innerText = title;
        document.getElementById('docUser').innerText = user;
        document.getElementById('docIcon').className = 'fab ' + iconClass;

        // 🔥 INI YANG KURANG
        document.getElementById('docLink').href = el.dataset.link;

        document.getElementById('docPopup').classList.add('active');
    }

    function closeDoc() { document.getElementById('docPopup').classList.remove('active'); }
    function toggleVault() { document.getElementById('vaultModal').classList.toggle('active'); }
    function pullLever() {
        const v = document.getElementById('valveWheel');
        v.style.transform = v.style.transform === 'rotate(180deg)' ? 'rotate(0deg)' : 'rotate(180deg)';
        document.getElementById('vaultContainer').classList.toggle('pulled-cards');
    }
    function toggleCard(el) {
        const isActive = el.classList.contains('card-active');
        document.querySelectorAll('.card-item').forEach(c => {
            c.classList.remove('card-active');
            if(c.querySelector('.content')) c.querySelector('.content').style.opacity = "0";
        });
        if (!isActive) {
            el.classList.add('card-active');
            setTimeout(() => { if(el.querySelector('.content')) el.querySelector('.content').style.opacity = "1" }, 200);
        }
    }

    const clockBtn = document.getElementById('mainClock');
    const panicBtn = document.getElementById('panicButton');

    clockBtn.addEventListener('click', () => {
        clockBtn.classList.toggle('clock-shifted');
    });

    // REVISED PANIC LOGIC WITH BOUNCE
    panicBtn.addEventListener('click', () => {
        const siren = document.getElementById('siren');
        siren.classList.add('active'); 
        siren.classList.add('siren-on');

        const bomb = document.getElementById('bomb');

        
        
        // Animasi Jatuh & Memantul (Bounce)
        // Menggunakan array keyframes untuk kontrol penuh posisi
        const dropKeyframes = [
            { top: '-300px', offset: 0, easing: 'cubic-bezier(0.8, 0, 1, 1)' }, // Jatuh cepat
            { top: '420px', transform: 'translateX(-50%) rotate(10deg) scaleY(0.9)', offset: 0.4, easing: 'cubic-bezier(0, 0, 0.2, 1)' }, // Hantam tanah & penyet dikit
            { top: '320px', transform: 'translateX(-50%) rotate(15deg) scaleY(1.05)', offset: 0.65, easing: 'cubic-bezier(0.8, 0, 1, 1)' }, // Mantul ke atas
            { top: '420px', transform: 'translateX(-50%) rotate(20deg) scaleY(0.95)', offset: 0.85, easing: 'cubic-bezier(0, 0, 0.2, 1)' }, // Hantam tanah lagi
            { top: '420px', transform: 'translateX(-50%) rotate(20deg)', offset: 1 } // Diam
        ];

        const dropAnimation = bomb.animate(dropKeyframes, { duration: 1200, fill: 'forwards' });

        dropAnimation.onfinish = () => {
            setTimeout(() => {
                bomb.classList.add('burning');
                setTimeout(triggerExplosion, 2000); 
            }, 100);
        };
    });

    function triggerExplosion() {
        const whiteOut = document.getElementById('whiteOut');
        const mainVault = document.getElementById('mainVault');
        const blocker = document.getElementById('inputBlocker');

        whiteOut.animate([{ opacity: 0 }, { opacity: 1 }, { opacity: 0 }], { duration: 600 });
        document.body.classList.add('screen-shake');
        document.getElementById('bomb').style.display = 'none';

        setTimeout(() => {
            document.body.classList.remove('screen-shake');
            document.getElementById('cabinetGrid').classList.add('damaged');
            document.querySelectorAll('.police-tape').forEach(tape => tape.style.display = 'block');
            blocker.style.display = 'block'; 

            // efek ke vault
            mainVault.style.filter = 'grayscale(0.6) sepia(0.4) contrast(1.1)';

            // ✅ efek ke semua laci
            document.querySelectorAll('.drawer-body').forEach(d => {
                d.style.filter = 'grayscale(0.6) sepia(0.5) contrast(1.15) brightness(1.05)';
            });

        }, 300);
    }

// Status awal: Lampu HIDUP
// Status awal: Lampu HIDUP
let lampIsOn = true;

function toggleLight() {
const lampControl = document.getElementById('lampControl');
const cord = document.getElementById('cordWire');

// Animasi tarik tali (visual feedback)
cord.style.height = '170px';
setTimeout(() => cord.style.height = '150px', 100);

// Toggle status
lampIsOn = !lampIsOn;
updateLampUI();
}

// Fungsi helper untuk sinkronisasi UI Lampu & Kegelapan
function updateLampUI() {
const lampControl = document.getElementById('lampControl');
if (!lampIsOn) {
    lampControl.classList.add('is-off');
} else {
    lampControl.classList.remove('is-off');
}
}

// LOGIKA DARURAT (PANIC)
panicBtn.addEventListener('click', () => {
// FORCE ON: Jika lampu sedang mati, nyalakan paksa sebelum naik
if (!lampIsOn) {
    lampIsOn = true;
    updateLampUI();
}

// Beri jeda sangat singkat agar mata melihat lampu "nyala" dulu baru naik
setTimeout(() => {
    // 1. Lampu & Tali naik ke atas
    document.getElementById('lampControl').classList.add('gear-up');
    
    // 2. Sirine muncul bergantian
    const siren = document.getElementById('siren');
    siren.classList.add('active', 'siren-on');
    siren.style.opacity = '1';
    siren.style.top = '20px'; 
}, 150);
});

// Reset otomatis 10 detik setelah ledakan (lanjutan fungsi triggerExplosion)
// Pastikan saat reset, lampu turun dalam keadaan menyala (default)

// Modifikasi fungsi triggerExplosion yang kamu kirim sebelumnya
const originalExplosion = triggerExplosion;
triggerExplosion = function() {
originalExplosion(); // Jalankan fungsi asli

// RESET OTOMATIS 10 DETIK SETELAH MELEDAK
setTimeout(() => {
    // Balikkan Gear Lampu
    document.getElementById('lampControl').classList.remove('gear-up');
    
    // Sembunyikan Sirine
    const siren = document.getElementById('siren');
    siren.classList.remove('active', 'siren-on');
    siren.style.top = '-200px';

    // Reset Kerusakan (Opsional, sesuai perintah kembali ke semula)
    document.getElementById('cabinetGrid').classList.remove('damaged');
    document.getElementById('inputBlocker').style.display = 'none';
    document.querySelectorAll('.police-tape').forEach(t => t.style.display = 'none');
    document.querySelectorAll('.drawer-body').forEach(d => d.style.filter = 'none');
    document.getElementById('mainVault').style.filter = 'none';
    document.getElementById('bomb').style.display = 'none'; 
    
    console.log("System Restored.");
}, 10000);
};
