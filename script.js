// 24 saatlik geri sayım fonksiyonu
function startCountdown() {
    // Sonraki gece yarısını hesapla
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    // Eğer şu an gece yarısından sonra ise, bugünün gece yarısını kullan
    const midnight = now.getHours() === 0 && now.getMinutes() === 0 && now.getSeconds() === 0
        ? now
        : new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    
    // Eğer gece yarısı geçtiyse, yarının gece yarısını hedefle
    const targetTime = now > midnight ? tomorrow : midnight;
    
    function updateCountdown() {
        const currentTime = new Date();
        const timeDifference = targetTime - currentTime;
        
        // Eğer süre dolduysa, yeni bir 24 saatlik döngü başlat
        if (timeDifference <= 0) {
            const newTarget = new Date(currentTime);
            newTarget.setDate(newTarget.getDate() + 1);
            newTarget.setHours(0, 0, 0, 0);
            targetTime.setTime(newTarget.getTime());
            return updateCountdown();
        }
        
        // Kalan süreyi hesapla
        const hours = Math.floor(timeDifference / (1000 * 60 * 60));
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

// Prompt ekranını binary kodlarla doldur
function fillPromptWithBinary() {
    const promptContent = document.getElementById('promptContent');
    
    // "russi" binary'sini sayfalarca tekrarla
    let binaryText = '';
    const linesPerPage = 60;
    const pages = 15; // 15 sayfa binary kodu (çok uzun olacak)
    
    for (let page = 0; page < pages; page++) {
        for (let line = 0; line < linesPerPage; line++) {
            // Her satırda "russi" binary'sini tekrarla
            let lineText = '';
            const bytesPerLine = 15; // Her satırda 15 byte
            
            for (let i = 0; i < bytesPerLine; i++) {
                // "russi" bytes'larını sırayla kullan
                const byteIndex = (line + i + page) % russiBytes.length;
                lineText += russiBytes[byteIndex];
                
                // Byte'lar arası boşluk ekle (her 4 byte'da bir)
                if ((i + 1) % 4 === 0 && i < bytesPerLine - 1) {
                    lineText += ' ';
                }
            }
            
            binaryText += lineText + '\n';
        }
        
        // Sayfalar arası boşluk
        if (page < pages - 1) {
            binaryText += '\n';
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

