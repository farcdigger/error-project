// Her gün 1950-2000 arası rastgele tarih göster
function showRandomDate() {
    const today = new Date();
    // Bugünün tarihini seed olarak kullan (aynı gün aynı tarihi göstermek için)
    const seed = today.getFullYear() * 10000 + today.getMonth() * 100 + today.getDate();
    
    // Basit bir rastgele sayı üretici (seed bazlı)
    function seededRandom(seed) {
        const x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
    }
    
    // 1950-2000 arası yıl seç
    const year = 1950 + Math.floor(seededRandom(seed) * 51);
    
    // 1-12 arası ay seç
    const month = 1 + Math.floor(seededRandom(seed * 2) * 12);
    
    // Ayın gün sayısına göre gün seç
    const daysInMonth = new Date(year, month, 0).getDate();
    const day = 1 + Math.floor(seededRandom(seed * 3) * daysInMonth);
    
    // Tarihi formatla: DD.MM.YYYY
    const formattedDate = 
        String(day).padStart(2, '0') + '.' + 
        String(month).padStart(2, '0') + '.' + 
        String(year);
    
    // DOM'u güncelle
    document.getElementById('dateDisplay').textContent = formattedDate;
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

// Prompt ekranını binary kodlarla doldur - çok rastgele, uzun örüntüler, "russi" çok seyrek
function fillPromptWithBinary() {
    const promptContent = document.getElementById('promptContent');
    
    let binaryText = '';
    const totalLines = 1200; // Daha fazla satır
    
    // "russi" binary'sini çok seyrek yerleştir (her 300-600 byte'da bir)
    let russiCounter = 0;
    let nextRussiAt = 300 + Math.floor(Math.random() * 300); // 300-600 byte arası
    
    for (let line = 0; line < totalLines; line++) {
        let lineText = '';
        
        // Her satırın uzunluğunu çok rastgele yap (15-50 byte arası)
        const bytesPerLine = 15 + Math.floor(Math.random() * 36);
        
        for (let i = 0; i < bytesPerLine; i++) {
            // Çok seyrek olarak "russi" bytes'larını yerleştir
            if (russiCounter >= nextRussiAt) {
                // "russi" bytes'larından birini ekle
                const byteIndex = Math.floor(Math.random() * russiBytes.length);
                lineText += russiBytes[byteIndex];
                russiCounter = 0;
                // Yeni interval belirle (300-600 byte arası)
                nextRussiAt = 300 + Math.floor(Math.random() * 300);
            } else {
                // Çoğunlukla tamamen rastgele binary
                let randomByte = '';
                for (let j = 0; j < 8; j++) {
                    randomByte += Math.random() > 0.5 ? '0' : '1';
                }
                lineText += randomByte;
                russiCounter++;
            }
            
            // Boşlukları çok rastgele ekle
            if (i < bytesPerLine - 1) {
                const spaceChance = Math.random();
                if (spaceChance > 0.3) {
                    const spaceCount = spaceChance > 0.95 ? 5 : (spaceChance > 0.85 ? 4 : (spaceChance > 0.75 ? 3 : (spaceChance > 0.6 ? 2 : 1)));
                    lineText += ' '.repeat(spaceCount);
                }
            }
        }
        
        // Bazen satır başına rastgele karakterler ekle
        if (Math.random() > 0.7) {
            const randomPrefix = Math.random() > 0.5 ? '0' : '1';
            const prefixLength = Math.floor(Math.random() * 20) + 1;
            lineText = randomPrefix.repeat(prefixLength) + lineText;
        }
        
        // Bazen satır sonuna rastgele karakterler ekle
        if (Math.random() > 0.75) {
            const randomSuffix = Math.random() > 0.5 ? '0' : '1';
            const suffixLength = Math.floor(Math.random() * 18) + 1;
            lineText += randomSuffix.repeat(suffixLength);
        }
        
        binaryText += lineText + '\n';
        
        // Bazen boş satır ekle (rastgele)
        if (Math.random() > 0.65) {
            const emptyLines = Math.random() > 0.92 ? 4 : (Math.random() > 0.85 ? 3 : (Math.random() > 0.75 ? 2 : 1));
            binaryText += '\n'.repeat(emptyLines);
        }
    }
    
    promptContent.textContent = binaryText;
}

// Sayfa yüklendiğinde fonksiyonları başlat
document.addEventListener('DOMContentLoaded', () => {
    // Binary rain her sayfada çalışsın
    createBinaryRain();
    
    // Ana sayfada çalışacak fonksiyonlar
    if (document.getElementById('dateDisplay')) {
        showRandomDate();
    }
    
    if (document.getElementById('copyButton')) {
        setupCopyButton();
    }
    
    if (document.getElementById('promptContent')) {
        fillPromptWithBinary();
    }
});

