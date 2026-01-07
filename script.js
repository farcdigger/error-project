// 96 saatlik (4 gün) geri sayım fonksiyonu
function startCountdown() {
    // 4 gün sonrasını hesapla
    const now = new Date();
    const targetTime = new Date(now);
    targetTime.setDate(targetTime.getDate() + 4); // 4 gün ekle
    targetTime.setHours(0, 0, 0, 0); // Gece yarısına ayarla
    
    function updateCountdown() {
        const currentTime = new Date();
        const timeDifference = targetTime - currentTime;
        
        // Eğer süre dolduysa, yeni bir 4 günlük döngü başlat
        if (timeDifference <= 0) {
            const newTarget = new Date(currentTime);
            newTarget.setDate(newTarget.getDate() + 4);
            newTarget.setHours(0, 0, 0, 0);
            targetTime.setTime(newTarget.getTime());
            return updateCountdown();
        }
        
        // Kalan süreyi hesapla
        const totalHours = Math.floor(timeDifference / (1000 * 60 * 60));
        const hours = totalHours; // Toplam saat (96 saate kadar)
        const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
        
        // DOM'u güncelle
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    }
    
    // İlk güncelleme
    updateCountdown();
    
    // Her saniye güncelle
    setInterval(updateCountdown, 1000);
}

// Kopyalama fonksiyonu
function setupCopyButton() {
    const copyButton = document.getElementById('copyButton');
    const promptContent = document.getElementById('promptContent');
    
    copyButton.addEventListener('click', async () => {
        try {
            const text = promptContent.textContent || promptContent.innerText;
            await navigator.clipboard.writeText(text);
            
            // Buton durumunu güncelle
            const originalHTML = copyButton.innerHTML;
            copyButton.classList.add('copied');
            copyButton.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>';
            
            // 2 saniye sonra eski haline dön
            setTimeout(() => {
                copyButton.classList.remove('copied');
                copyButton.innerHTML = originalHTML;
            }, 2000);
        } catch (err) {
            console.error('Kopyalama hatası:', err);
            // Fallback: eski yöntem
            const textArea = document.createElement('textarea');
            textArea.value = promptContent.textContent || promptContent.innerText;
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            // Buton durumunu güncelle
            const originalHTML = copyButton.innerHTML;
            copyButton.classList.add('copied');
            copyButton.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>';
            
            setTimeout(() => {
                copyButton.classList.remove('copied');
                copyButton.innerHTML = originalHTML;
            }, 2000);
        }
    });
}

// "russi" kelimesini binary'ye çevir
// r=01110010, u=01110101, s=01110011, s=01110011, i=01101001
const russiBinary = '0111001001110101011100110111001101101001';
const russiBytes = ['01110010', '01110101', '01110011', '01110011', '01101001'];

function createBinaryRain() {
    const binaryRain = document.getElementById('binaryRain');
    const columns = 30; // Kolon sayısı
    
    // "rrussia" binary'sini 8'li gruplar halinde böl
    // 01110010 01110010 01110101 01110011 01110011 01101001 01100001
    const rrussiaBytes = [
        '01110010', // r
        '01110010', // r
        '01110101', // u
        '01110011', // s
        '01110011', // s
        '01101001', // i
        '01100001'  // a
    ];
    
    for (let i = 0; i < columns; i++) {
        const column = document.createElement('div');
        column.className = 'binary-column';
        column.style.left = `${(100 / columns) * i}%`;
        column.style.animationDuration = `${10 + Math.random() * 15}s`;
        column.style.animationDelay = `${Math.random() * 5}s`;
        
        // Her kolonda binary kodları oluştur
        let binaryText = '';
        const lines = 80;
        
        for (let j = 0; j < lines; j++) {
            // Her satırda "rrussia" binary'sinden bir byte kullan
            // Ama görsel olarak çeşitlilik için bazı satırlarda rastgele ekle
            if (Math.random() > 0.2) {
                // "rrussia" bytes'ından birini al
                const byteIndex = (j + i) % rrussiaBytes.length;
                binaryText += rrussiaBytes[byteIndex] + ' ';
            } else {
                // Bazen rastgele binary ama yine de "rrussia" pattern'ini koru
                const randomByte = rrussiaBytes[Math.floor(Math.random() * rrussiaBytes.length)];
                binaryText += randomByte + ' ';
            }
            
            // Her 8 satırda bir yeni satır ekle (görsel düzen için)
            if ((j + 1) % 8 === 0) {
                binaryText += '\n';
            }
        }
        
        column.textContent = binaryText;
        binaryRain.appendChild(column);
    }
}

// Prompt ekranını binary kodlarla doldur - rastgele ve karışık ama "russi" pattern'ini koru
function fillPromptWithBinary() {
    const promptContent = document.getElementById('promptContent');
    
    // "russi" binary'sini sayfalarca tekrarla ama rastgele dağıt
    let binaryText = '';
    const totalLines = 900; // Toplam satır sayısı
    
    // "russi" binary'sini tek bir string olarak birleştir
    const fullRussiBinary = russiBinary;
    
    for (let line = 0; line < totalLines; line++) {
        let lineText = '';
        
        // Her satırın uzunluğunu rastgele yap (5-25 byte arası, çok değişken)
        const bytesPerLine = 5 + Math.floor(Math.random() * 21);
        
        for (let i = 0; i < bytesPerLine; i++) {
            // %60 ihtimalle "russi" binary'sinden bir byte kullan
            if (Math.random() > 0.4) {
                // "russi" bytes'larından rastgele birini seç
                const byteIndex = Math.floor(Math.random() * russiBytes.length);
                lineText += russiBytes[byteIndex];
            } else {
                // %40 ihtimalle rastgele binary ama "russi" pattern'ini koru
                if (Math.random() > 0.6) {
                    // "russi" bytes'ından birini al
                    const randomByte = russiBytes[Math.floor(Math.random() * russiBytes.length)];
                    lineText += randomByte;
                } else {
                    // Tamamen rastgele 8 bit ama "russi" bytes'larına benzer pattern
                    let randomBits = '';
                    const baseByte = russiBytes[Math.floor(Math.random() * russiBytes.length)];
                    for (let j = 0; j < 8; j++) {
                        // %40 ihtimalle base byte'dan, %60 rastgele
                        randomBits += Math.random() > 0.6 ? baseByte[j] : (Math.random() > 0.5 ? '0' : '1');
                    }
                    lineText += randomBits;
                }
            }
            
            // Boşlukları çok rastgele ekle
            if (i < bytesPerLine - 1) {
                const spaceChance = Math.random();
                if (spaceChance > 0.5) {
                    const spaceCount = spaceChance > 0.9 ? 3 : (spaceChance > 0.7 ? 2 : 1);
                    lineText += ' '.repeat(spaceCount);
                }
            }
        }
        
        // Bazen satır başına rastgele karakterler ekle
        if (Math.random() > 0.88) {
            const randomPrefix = Math.random() > 0.5 ? '0' : '1';
            lineText = randomPrefix.repeat(Math.floor(Math.random() * 8)) + lineText;
        }
        
        // Bazen satır sonuna rastgele karakterler ekle
        if (Math.random() > 0.92) {
            const randomSuffix = Math.random() > 0.5 ? '0' : '1';
            lineText += randomSuffix.repeat(Math.floor(Math.random() * 6));
        }
        
        binaryText += lineText + '\n';
        
        // Bazen boş satır ekle (rastgele)
        if (Math.random() > 0.82) {
            binaryText += '\n';
        }
        
        // Bazen 2-3 boş satır ekle
        if (Math.random() > 0.95) {
            binaryText += '\n\n';
        }
    }
    
    promptContent.textContent = binaryText;
}

// Sayfa yüklendiğinde geri sayımı, kopyalama butonunu, binary rain'i ve prompt'u doldur
document.addEventListener('DOMContentLoaded', () => {
    startCountdown();
    setupCopyButton();
    createBinaryRain();
    fillPromptWithBinary();
});

