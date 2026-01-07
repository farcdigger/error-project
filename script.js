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

// Sayfa yüklendiğinde geri sayımı ve kopyalama butonunu başlat
document.addEventListener('DOMContentLoaded', () => {
    startCountdown();
    setupCopyButton();
});

