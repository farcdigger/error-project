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

// Frequency Modal ve Audio
let audioContext = null;
let oscillator = null;
let gainNode = null;
let noiseNode = null;
let noiseGain = null;
let filterNode = null;
let isPlaying = false;

// Tarihe göre rastgele frekans üret (deterministik)
function generateFrequencyFromDate(dateString) {
    // Tarihi seed olarak kullan
    const seed = dateString.split('.').join('');
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        const char = seed.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    
    // Hash'i pozitif yap
    hash = Math.abs(hash);
    
    // Rastgele frekans üret (200-2000 Hz arası)
    const baseFreq = 200 + (hash % 1800);
    
    // Rastgele modülasyon türleri
    const modulations = ['AM', 'FM', 'PULSE', 'SINE', 'SQUARE', 'TRIANGLE', 'NOISE'];
    const modulation = modulations[hash % modulations.length];
    
    // Rastgele kaynaklar
    const sources = [
        'UNKNOWN', 'ATMOSPHERIC', 'ORBITAL', 'TERRESTRIAL', 
        'ANOMALOUS', 'REMNANT', 'ARTIFACT', 'RESONANCE'
    ];
    const source = sources[hash % sources.length];
    
    // Rastgele koordinatlar
    const lat = ((hash * 7) % 180) - 90;
    const lon = ((hash * 11) % 360) - 180;
    
    // Rastgele güç seviyesi
    const power = 20 + (hash % 80);
    
    // Dalga boyu hesapla (frekans cinsinden)
    const wavelength = (299792458 / baseFreq).toFixed(2);
    
    // Amplitude (rastgele)
    const amplitude = 0.3 + ((hash % 70) / 100);
    
    // Sinyal durumu (tarihe göre deterministik)
    const statusHash = (hash * 13) % 100;
    let status, statusColor;
    if (statusHash < 40) {
        // %40 ihtimalle ACTIVE
        status = 'ACTIVE';
        statusColor = '#00ff00';
    } else if (statusHash < 65) {
        // %25 ihtimalle WEAK
        status = 'WEAK';
        statusColor = '#ffff00';
    } else if (statusHash < 80) {
        // %15 ihtimalle INTERMITTENT
        status = 'INTERMITTENT';
        statusColor = '#ff8800';
    } else if (statusHash < 90) {
        // %10 ihtimalle INACTIVE
        status = 'INACTIVE';
        statusColor = '#666666';
    } else {
        // %10 ihtimalle NO SIGNAL
        status = 'NO SIGNAL';
        statusColor = '#ff0000';
    }
    
    return {
        frequency: baseFreq,
        wavelength: wavelength,
        amplitude: (amplitude * 100).toFixed(1) + '%',
        source: source,
        coordinates: `${lat.toFixed(2)}°N, ${lon.toFixed(2)}°E`,
        modulation: modulation,
        power: power + ' dB',
        status: status,
        statusColor: statusColor
    };
}

// White noise üret (cızırtı için)
function createNoise() {
    const bufferSize = audioContext.sampleRate * 2;
    const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1; // -1 ile 1 arası rastgele
    }
    
    const noise = audioContext.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;
    
    return noise;
}

// Frekans sesini çal (status'a göre)
function playFrequency(frequency, status) {
    // INACTIVE veya NO SIGNAL ise ses çalma
    if (status === 'INACTIVE' || status === 'NO SIGNAL') {
        return;
    }
    
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    if (isPlaying) {
        stopFrequency();
    }
    
    // Ana sinyal (oscilatör)
    oscillator = audioContext.createOscillator();
    gainNode = audioContext.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    
    // Cızırtı için white noise ekle
    noiseNode = createNoise();
    noiseGain = audioContext.createGain();
    
    // Low-pass filter ekle (eski radyo hissi için)
    filterNode = audioContext.createBiquadFilter();
    filterNode.type = 'lowpass';
    filterNode.frequency.value = 3000; // Yüksek frekansları kes
    filterNode.Q.value = 1;
    
    // Volume kontrolü - status'a göre ayarla
    let volume = 0.15;
    let noiseVolume = 0.08; // Cızırtı seviyesi
    
    if (status === 'WEAK') {
        volume = 0.08;
        noiseVolume = 0.12; // Zayıf sinyallerde cızırtı daha belirgin
    } else if (status === 'INTERMITTENT') {
        volume = 0.12;
        noiseVolume = 0.10;
        // Intermittent için sesi kes-kes yap
        const interval = setInterval(() => {
            if (gainNode) {
                gainNode.gain.value = gainNode.gain.value > 0 ? 0 : volume;
            }
            if (noiseGain) {
                noiseGain.gain.value = noiseGain.gain.value > 0 ? 0 : noiseVolume;
            }
        }, 500);
        // Cleanup için interval'i sakla
        if (!oscillator._interval) {
            oscillator._interval = interval;
        }
    }
    
    gainNode.gain.value = volume;
    noiseGain.gain.value = noiseVolume;
    
    // Sinyal ve cızırtıyı filtreye bağla, sonra çıkışa
    oscillator.connect(gainNode);
    gainNode.connect(filterNode);
    
    noiseNode.connect(noiseGain);
    noiseGain.connect(filterNode);
    
    filterNode.connect(audioContext.destination);
    
    // Başlat
    oscillator.start();
    noiseNode.start();
    isPlaying = true;
}

// Frekans sesini durdur
function stopFrequency() {
    if (oscillator) {
        // Intermittent için interval'i temizle
        if (oscillator._interval) {
            clearInterval(oscillator._interval);
            oscillator._interval = null;
        }
        oscillator.stop();
        oscillator.disconnect();
        oscillator = null;
    }
    if (noiseNode) {
        noiseNode.stop();
        noiseNode.disconnect();
        noiseNode = null;
    }
    if (gainNode) {
        gainNode.disconnect();
        gainNode = null;
    }
    if (noiseGain) {
        noiseGain.disconnect();
        noiseGain = null;
    }
    if (filterNode) {
        filterNode.disconnect();
        filterNode = null;
    }
    isPlaying = false;
}

// Modal'ı aç ve frekans bilgilerini göster
function openFrequencyModal() {
    const modal = document.getElementById('frequencyModal');
    const dateDisplay = document.getElementById('dateDisplay');
    const currentDate = dateDisplay.textContent;
    
    // Frekans bilgilerini üret
    const freqData = generateFrequencyFromDate(currentDate);
    
    // Modal içindeki değerleri güncelle
    document.getElementById('frequencyDate').textContent = currentDate;
    document.getElementById('wavelengthValue').textContent = freqData.wavelength + ' m';
    document.getElementById('amplitudeValue').textContent = freqData.amplitude;
    document.getElementById('sourceValue').textContent = freqData.source;
    document.getElementById('coordinatesValue').textContent = freqData.coordinates;
    document.getElementById('modulationValue').textContent = freqData.modulation;
    document.getElementById('powerValue').textContent = freqData.power;
    
    // Modal'ı göster
    modal.classList.add('active');
    
    // Status'u güncelle
    const statusText = document.getElementById('statusText');
    const statusIndicator = document.getElementById('statusIndicator');
    statusText.textContent = freqData.status;
    statusIndicator.style.background = freqData.statusColor;
    statusIndicator.style.boxShadow = `0 0 10px ${freqData.statusColor}`;
    
    // Frekans sesini çal (status'a göre)
    playFrequency(freqData.frequency, freqData.status);
}

// Modal'ı kapat
function closeFrequencyModal() {
    const modal = document.getElementById('frequencyModal');
    modal.classList.remove('active');
    stopFrequency();
    document.getElementById('statusText').textContent = 'SCANNING...';
}

// Frequency buton event listener'ları
function setupFrequencyButton() {
    const frequencyButton = document.getElementById('frequencyButton');
    const frequencyClose = document.getElementById('frequencyClose');
    const frequencyModal = document.getElementById('frequencyModal');
    
    if (frequencyButton) {
        frequencyButton.addEventListener('click', () => {
            openFrequencyModal();
        });
    }
    
    if (frequencyClose) {
        frequencyClose.addEventListener('click', () => {
            closeFrequencyModal();
        });
    }
    
    // Modal dışına tıklandığında kapat
    if (frequencyModal) {
        frequencyModal.addEventListener('click', (e) => {
            if (e.target === frequencyModal) {
                closeFrequencyModal();
            }
        });
    }
    
    // ESC tuşu ile kapat
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && frequencyModal.classList.contains('active')) {
            closeFrequencyModal();
        }
    });
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
    
    if (document.getElementById('frequencyButton')) {
        setupFrequencyButton();
    }
    
    if (document.getElementById('correlationButton')) {
        setupCorrelationButton();
    }
});

// Date Correlation Engine
function parseDate(dateString) {
    const parts = dateString.split('.');
    if (parts.length !== 3) return null;
    
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);
    
    if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
    if (year < 1950 || year > 2000) return null;
    if (month < 1 || month > 12) return null;
    if (day < 1 || day > 31) return null;
    
    const date = new Date(year, month - 1, day);
    if (date.getDate() !== day || date.getMonth() !== month - 1) return null;
    
    return date;
}

function calculateTemporalGap(date1, date2) {
    const diff = Math.abs(date2 - date1);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const years = Math.floor(days / 365);
    const months = Math.floor((days % 365) / 30);
    const remainingDays = days % 30;
    
    if (years > 0) {
        return `${years}Y ${months}M ${remainingDays}D`;
    } else if (months > 0) {
        return `${months}M ${remainingDays}D`;
    } else {
        return `${days}D`;
    }
}

function calculateResonance(date1, date2) {
    // Tarihlerin sayısal özelliklerini kullanarak "rezonans" hesapla
    const d1 = date1.getDate();
    const m1 = date1.getMonth() + 1;
    const y1 = date1.getFullYear();
    
    const d2 = date2.getDate();
    const m2 = date2.getMonth() + 1;
    const y2 = date2.getFullYear();
    
    // Farklı pattern'ler kontrol et
    let resonance = 0;
    
    // Aynı gün
    if (d1 === d2) resonance += 30;
    // Aynı ay
    if (m1 === m2) resonance += 25;
    // Aynı yıl
    if (y1 === y2) resonance += 20;
    
    // Sayısal pattern'ler
    const sum1 = d1 + m1 + y1;
    const sum2 = d2 + m2 + y2;
    const sumDiff = Math.abs(sum1 - sum2);
    
    if (sumDiff === 0) resonance += 40;
    else if (sumDiff < 10) resonance += 20;
    else if (sumDiff < 50) resonance += 10;
    
    // Çift/tek pattern
    if ((d1 % 2 === 0 && d2 % 2 === 0) || (d1 % 2 === 1 && d2 % 2 === 1)) {
        resonance += 5;
    }
    
    // Yıl farkı pattern'leri
    const yearDiff = Math.abs(y1 - y2);
    if (yearDiff === 0) resonance += 15;
    else if (yearDiff === 1 || yearDiff === 10 || yearDiff === 25 || yearDiff === 50) {
        resonance += 10;
    }
    
    // Ay farkı pattern'leri
    const monthDiff = Math.abs(m1 - m2);
    if (monthDiff === 0 || monthDiff === 6) resonance += 8;
    
    return Math.min(100, resonance);
}

function getPatternType(date1, date2, resonance) {
    const d1 = date1.getDate();
    const m1 = date1.getMonth() + 1;
    const y1 = date1.getFullYear();
    const d2 = date2.getDate();
    const m2 = date2.getMonth() + 1;
    const y2 = date2.getFullYear();
    
    if (resonance >= 80) return 'STRONG RESONANCE';
    if (resonance >= 60) return 'MODERATE LINK';
    if (resonance >= 40) return 'WEAK CORRELATION';
    if (resonance >= 20) return 'MINOR PATTERN';
    
    // Özel pattern'ler
    if (d1 === d2 && m1 === m2) return 'TEMPORAL ECHO';
    if (y1 === y2) return 'SAME PERIOD';
    if (Math.abs(y1 - y2) === 1) return 'SEQUENTIAL';
    if (Math.abs(y1 - y2) === 10 || Math.abs(y1 - y2) === 25) return 'HARMONIC GAP';
    
    return 'NO PATTERN';
}

function generateAnalysis(date1, date2, resonance, patternType, gap) {
    const patterns = [
        `Temporal gap of ${gap} detected. Signal interference patterns suggest ${resonance >= 60 ? 'strong' : resonance >= 40 ? 'moderate' : 'weak'} temporal resonance between these coordinates.`,
        `Analysis indicates ${resonance >= 60 ? 'significant' : 'minor'} correlation. Pattern type: ${patternType}. Temporal waveform shows ${resonance >= 70 ? 'synchronized' : 'asynchronous'} behavior.`,
        `These temporal coordinates exhibit ${resonance >= 50 ? 'unusual' : 'standard'} alignment. Resonance level suggests ${resonance >= 60 ? 'potential causal link' : 'coincidental overlap'}.`,
        `Temporal analysis reveals ${patternType.toLowerCase()} pattern. Gap measurement: ${gap}. ${resonance >= 70 ? 'High probability of temporal interference.' : 'Low interference probability.'}`,
        `Signal correlation detected. Pattern classification: ${patternType}. ${resonance >= 60 ? 'Recommend further investigation.' : 'No further action required.'}`
    ];
    
    const specialCases = [
        { condition: () => date1.getDate() === date2.getDate() && date1.getMonth() === date2.getMonth(),
          text: `CRITICAL: Same calendar date detected across different years. This suggests temporal echo or recurring event pattern. Resonance is unusually high.` },
        { condition: () => Math.abs(date1.getFullYear() - date2.getFullYear()) === 0,
          text: `Same year correlation. Events may share temporal context. Pattern suggests localized temporal anomaly.` },
        { condition: () => Math.abs(date1.getFullYear() - date2.getFullYear()) === 25,
          text: `Quarter-century gap detected. This interval often shows harmonic resonance in temporal analysis.` }
    ];
    
    for (const special of specialCases) {
        if (special.condition()) {
            return special.text;
        }
    }
    
    return patterns[Math.floor(Math.random() * patterns.length)];
}

function analyzeCorrelation(date1Str, date2Str) {
    const date1 = parseDate(date1Str);
    const date2 = parseDate(date2Str);
    
    if (!date1 || !date2) {
        return {
            error: 'Invalid date format. Please use DD.MM.YYYY format (1950-2000)'
        };
    }
    
    const gap = calculateTemporalGap(date1, date2);
    const resonance = calculateResonance(date1, date2);
    const patternType = getPatternType(date1, date2, resonance);
    const analysis = generateAnalysis(date1, date2, resonance, patternType, gap);
    
    return {
        gap: gap,
        resonance: resonance + '%',
        patternType: patternType,
        analysis: analysis,
        status: resonance >= 70 ? 'STRONG' : resonance >= 50 ? 'MODERATE' : resonance >= 30 ? 'WEAK' : 'NONE',
        statusColor: resonance >= 70 ? '#00ff00' : resonance >= 50 ? '#ffff00' : resonance >= 30 ? '#ff8800' : '#666666'
    };
}

// Correlation Modal Functions
function setupCorrelationButton() {
    const correlationButton = document.getElementById('correlationButton');
    const correlationClose = document.getElementById('correlationClose');
    const correlationModal = document.getElementById('correlationModal');
    const analyzeBtn = document.getElementById('correlationAnalyzeBtn');
    
    if (correlationButton) {
        correlationButton.addEventListener('click', () => {
            correlationModal.classList.add('active');
            // Mevcut tarihi ilk input'a otomatik doldur
            const currentDate = document.getElementById('dateDisplay').textContent;
            document.getElementById('dateInput1').value = currentDate;
        });
    }
    
    if (correlationClose) {
        correlationClose.addEventListener('click', () => {
            closeCorrelationModal();
        });
    }
    
    if (correlationModal) {
        correlationModal.addEventListener('click', (e) => {
            if (e.target === correlationModal) {
                closeCorrelationModal();
            }
        });
    }
    
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', () => {
            const date1 = document.getElementById('dateInput1').value.trim();
            const date2 = document.getElementById('dateInput2').value.trim();
            
            if (!date1 || !date2) {
                alert('Please enter both dates');
                return;
            }
            
            const results = analyzeCorrelation(date1, date2);
            
            if (results.error) {
                alert(results.error);
                return;
            }
            
            // Sonuçları göster
            document.getElementById('temporalGap').textContent = results.gap;
            document.getElementById('resonanceLevel').textContent = results.resonance;
            document.getElementById('patternType').textContent = results.patternType;
            document.getElementById('analysisText').textContent = results.analysis;
            document.getElementById('correlationStatusText').textContent = results.status;
            document.getElementById('correlationStatusIndicator').style.background = results.statusColor;
            document.getElementById('correlationStatusIndicator').style.boxShadow = `0 0 10px ${results.statusColor}`;
            
            document.getElementById('correlationResults').style.display = 'block';
            
            // Animasyon için scroll
            document.getElementById('correlationResults').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
    }
    
    // ESC tuşu ile kapat
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && correlationModal.classList.contains('active')) {
            closeCorrelationModal();
        }
    });
    
    // Tarih input'larına otomatik format ekle
    const dateInputs = document.querySelectorAll('.date-input');
    dateInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '.' + value.substring(2);
            }
            if (value.length >= 5) {
                value = value.substring(0, 5) + '.' + value.substring(5, 9);
            }
            e.target.value = value;
        });
    });
}

function closeCorrelationModal() {
    const correlationModal = document.getElementById('correlationModal');
    correlationModal.classList.remove('active');
    document.getElementById('correlationResults').style.display = 'none';
    document.getElementById('dateInput1').value = '';
    document.getElementById('dateInput2').value = '';
}

