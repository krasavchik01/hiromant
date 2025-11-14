// Глобальные переменные
let videoStream = null;
let capturedImageData = null;

// Переключение экранов
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

// Начало чтения
async function startReading() {
    showScreen('cameraScreen');
    await initCamera();
}

// Инициализация камеры
async function initCamera() {
    try {
        const video = document.getElementById('video');

        // Запрос доступа к камере
        videoStream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: 'user',
                width: { ideal: 1280 },
                height: { ideal: 720 }
            }
        });

        video.srcObject = videoStream;
        video.play();
    } catch (error) {
        console.error('Ошибка доступа к камере:', error);
        showError('Не удалось получить доступ к камере. Пожалуйста, разрешите доступ к камере.');
    }
}

// Остановка камеры
function stopCamera() {
    if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
        videoStream = null;
    }
}

// Захват фото
function capturePhoto() {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');

    // Установка размеров canvas
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Отрисовка кадра из видео
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Получение данных изображения
    capturedImageData = canvas.toDataURL('image/jpeg', 0.9);

    // Остановка камеры
    stopCamera();

    // Переход к экрану обработки
    showScreen('processingScreen');

    // Анализ изображения
    setTimeout(() => {
        analyzeHand(capturedImageData);
    }, 2000);
}

// Анализ руки и генерация предсказания
async function analyzeHand(imageData) {
    try {
        // Для демонстрации используем локальную генерацию предсказаний
        // В реальном приложении здесь может быть вызов API для анализа изображения
        const prediction = await generatePrediction(imageData);

        // Показ результата
        displayResult(prediction);
    } catch (error) {
        console.error('Ошибка анализа:', error);
        showError('Не удалось проанализировать изображение. Попробуйте еще раз.');
    }
}

// Генерация предсказания
async function generatePrediction(imageData) {
    // Симуляция задержки обработки
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Массивы для генерации случайных предсказаний
    const predictions = [
        {
            text: "Ваши линии судьбы показывают сильную интуицию и творческий потенциал. В ближайшее время вас ждут интересные встречи, которые могут изменить ваш взгляд на жизнь. Линия сердца говорит о глубокой эмоциональной природе и способности к искренним чувствам.",
            love: "Высокий потенциал 💕",
            career: "Благоприятный период 📈",
            luck: "Удача на вашей стороне ✨"
        },
        {
            text: "Линия жизни на вашей ладони длинная и четкая - это признак крепкого здоровья и долголетия. Линия ума показывает практичность и аналитический склад мышления. Вы находитесь на пороге важных решений, которые приведут к позитивным переменам.",
            love: "Стабильность и гармония 💑",
            career: "Время для новых начинаний 🚀",
            luck: "Звезды благоволят вам ⭐"
        },
        {
            text: "Редкий знак на вашей ладони указывает на исключительные способности в области коммуникации. Линия судьбы пересекается с линией сердца, что говорит о том, что ваша страсть станет источником успеха. Впереди период роста и самореализации.",
            love: "Романтические встречи близко 💖",
            career: "Карьерный взлет ожидается 🌟",
            luck: "Фортуна улыбается вам 🍀"
        },
        {
            text: "Ваша ладонь имеет признаки творческой личности с сильной интуицией. Линия судьбы указывает на предстоящие возможности для самовыражения. Кольцо Венеры подчеркивает вашу чувствительность и эмоциональную глубину. Доверяйте своим инстинктам.",
            love: "Глубокие связи на горизонте ❤️",
            career: "Творческий прорыв ожидается 🎨",
            luck: "Благоприятные обстоятельства 🌈"
        },
        {
            text: "Линии на вашей руке говорят о сильной воле и целеустремленности. Холм Юпитера развит, что указывает на лидерские качества и амбиции. В ближайшее время откроются новые горизонты для реализации ваших планов. Верьте в себя.",
            love: "Страсть и преданность 🔥",
            career: "Лидерские позиции впереди 👑",
            luck: "Успех неизбежен 💫"
        },
        {
            text: "Уникальный рисунок линий на вашей ладони свидетельствует о многогранной личности. Линия интуиции хорошо выражена - прислушивайтесь к внутреннему голосу. Впереди период, когда старые мечты начнут воплощаться в реальность.",
            love: "Судьбоносная встреча близко 💝",
            career: "Мечты становятся реальностью ✨",
            luck: "Вселенная поддерживает вас 🌟"
        }
    ];

    // Выбор случайного предсказания
    const randomIndex = Math.floor(Math.random() * predictions.length);
    const selectedPrediction = predictions[randomIndex];

    // Добавление анализа изображения (в реальном приложении здесь был бы AI-анализ)
    // Для демонстрации просто используем случайное предсказание

    return {
        image: imageData,
        prediction: selectedPrediction
    };
}

// Отображение результата
function displayResult(data) {
    // Установка изображения
    document.getElementById('capturedPhoto').src = data.image;

    // Установка текста предсказания
    document.getElementById('predictionText').textContent = data.prediction.text;

    // Установка значений аспектов
    document.getElementById('loveScore').textContent = data.prediction.love;
    document.getElementById('careerScore').textContent = data.prediction.career;
    document.getElementById('luckScore').textContent = data.prediction.luck;

    // Показ экрана результата
    showScreen('resultScreen');
}

// Новое чтение
function newReading() {
    capturedImageData = null;
    showScreen('welcomeScreen');
}

// Поделиться результатом
function shareResult() {
    const predictionText = document.getElementById('predictionText').textContent;

    if (navigator.share) {
        navigator.share({
            title: 'Мое предсказание по линиям руки',
            text: predictionText,
            url: window.location.href
        }).catch(err => console.log('Ошибка при попытке поделиться:', err));
    } else {
        // Fallback для браузеров без поддержки Web Share API
        const textArea = document.createElement('textarea');
        textArea.value = predictionText;
        document.body.appendChild(textArea);
        textArea.select();

        try {
            document.execCommand('copy');
            alert('Текст предсказания скопирован в буфер обмена!');
        } catch (err) {
            console.error('Не удалось скопировать текст:', err);
        }

        document.body.removeChild(textArea);
    }
}

// Отмена чтения
function cancelReading() {
    stopCamera();
    showScreen('welcomeScreen');
}

// Показ ошибки
function showError(message) {
    document.getElementById('errorMessage').textContent = message;
    showScreen('errorScreen');
}

// Повтор после ошибки
function retry() {
    showScreen('welcomeScreen');
}

// Очистка при закрытии страницы
window.addEventListener('beforeunload', () => {
    stopCamera();
});

// Обработка ошибок камеры
window.addEventListener('error', (event) => {
    if (event.message.includes('camera') || event.message.includes('mediaDevices')) {
        showError('Произошла ошибка при работе с камерой');
    }
});
