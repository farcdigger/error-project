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

// Sayfa yüklendiğinde geri sayımı başlat
document.addEventListener('DOMContentLoaded', startCountdown);

