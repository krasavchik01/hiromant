// Глобальные переменные
let videoStream = null;
let capturedImageData = null;
let particlesArray = [];
let numerologyData = null;

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

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    capturedImageData = canvas.toDataURL('image/jpeg', 0.9);

    stopCamera();

    showScreen('processingScreen');

    setTimeout(() => {
        analyzeHand(capturedImageData);
    }, 2500);
}

// Анализ руки и генерация предсказания
async function analyzeHand(imageData) {
    try {
        const prediction = await generatePrediction(imageData);
        // Сохраняем предсказание для использования после ввода даты рождения
        window.palmPrediction = prediction;
        // Показываем экран ввода даты рождения
        showScreen('birthdateScreen');
    } catch (error) {
        console.error('Ошибка анализа:', error);
        showError('Не удалось проанализировать изображение. Попробуйте еще раз.');
    }
}

// Генерация расширенного предсказания
async function generatePrediction(imageData) {
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Расширенные предсказания
    const predictions = [
        {
            text: "Ваша ладонь раскрывает редкий дар провидения и глубокой интуиции. Линии четко указывают на то, что вы обладаете способностью предчувствовать важные события. В ближайшие недели перед вами откроются двери, о которых вы даже не подозревали. Следуйте своему внутреннему голосу - он никогда вас не обманет.",
            love: "Страстный роман на горизонте 💕",
            lovePercent: 92,
            career: "Предложение от мечты близко 🚀",
            careerPercent: 88,
            luck: "Фортуна благоволит вам ⭐",
            luckPercent: 95,
            health: "Энергия на максимуме 💪",
            healthPercent: 90,
            lifeLine: "Длинная и глубокая, указывает на долгую жизнь, полную энергии и жизненной силы. Вы обладаете крепким здоровьем и выносливостью.",
            headLine: "Ясная и прямая линия ума говорит о практическом складе мышления и превосходных аналитических способностях. Вы умеете находить нестандартные решения.",
            heartLine: "Глубокая линия сердца свидетельствует о вашей эмоциональной глубине и способности к искренней любви. Вы романтичная натура с большим сердцем.",
            fateLine: "Сильная линия судьбы предсказывает успех в карьере и финансовое благополучие. Ваш упорный труд скоро принесет заслуженные плоды.",
            destinyNumber: 7,
            destinyDesc: "Число мистиков и философов. Вы стремитесь к познанию глубинных истин и обладаете особым магнетизмом.",
            luckyStone: "Аметист",
            stoneDesc: "Камень мудрости и духовного роста, защищает от негативной энергии.",
            luckyColors: ["#9333ea", "#6366f1", "#8b5cf6"],
            luckyDays: "Среда, Пятница",
            monthlyAdvice: "Этот месяц принесет важные встречи и возможности. Не бойтесь рисковать в новых начинаниях. Доверяйте интуиции при принятии важных решений. Время благоприятно для начала творческих проектов."
        },
        {
            text: "Линии на вашей ладони образуют уникальный рисунок успеха и процветания. Холмы Юпитера и Солнца говорят о лидерских качествах и творческом потенциале. Вас ждет период активного роста и самореализации. Не упустите возможности, которые появятся в ближайшее время - они могут изменить вашу жизнь к лучшему.",
            love: "Гармония в отношениях ❤️",
            lovePercent: 85,
            career: "Лидерские позиции впереди 👑",
            careerPercent: 94,
            luck: "Удача сопутствует вам 🍀",
            luckPercent: 88,
            health: "Отличное самочувствие 🌟",
            healthPercent: 87,
            lifeLine: "Ветвящаяся линия жизни показывает вашу многогранность и способность успешно заниматься несколькими делами одновременно.",
            headLine: "Изогнутая линия ума указывает на творческое мышление и богатое воображение. Вы - генератор оригинальных идей.",
            heartLine: "Линия сердца с множеством ответвлений говорит о богатой эмоциональной жизни и способности любить всем сердцем.",
            fateLine: "Четко выраженная линия судьбы предвещает стабильность и уверенный рост в профессиональной сфере.",
            destinyNumber: 3,
            destinyDesc: "Число творчества и самовыражения. Вы обладаете даром вдохновлять других и создавать красоту.",
            luckyStone: "Цитрин",
            stoneDesc: "Камень изобилия и успеха, привлекает богатство и процветание.",
            luckyColors: ["#fbbf24", "#f59e0b", "#eab308"],
            luckyDays: "Вторник, Четверг",
            monthlyAdvice: "Сейчас идеальное время для воплощения творческих идей в жизнь. Не сомневайтесь в своих способностях. Коллаборации и партнерства принесут отличные результаты."
        },
        {
            text: "Редкий знак Соломона на вашей ладони указывает на мудрость и проницательность. Вы обладаете природным даром понимать людей и видеть суть вещей. Линия интуиции особенно выражена - следуйте своим предчувствиям. Ваша жизнь наполнится значимыми событиями и глубокими переживаниями. Вы на пути к важным открытиям.",
            love: "Судьбоносная встреча близко 💝",
            lovePercent: 96,
            career: "Признание и уважение 🏆",
            careerPercent: 90,
            luck: "Невероятное везение 🌠",
            luckPercent: 93,
            health: "Жизненная сила процветает 🌿",
            healthPercent: 91,
            lifeLine: "Глубокая без разрывов линия жизни обещает долголетие и крепкое здоровье на протяжении всей жизни.",
            headLine: "Раздвоенная линия ума - признак способности видеть несколько решений одной проблемы. Вы обладаете универсальным интеллектом.",
            heartLine: "Длинная линия сердца, доходящая до указательного пальца, говорит об идеализме в любви и высоких моральных принципах.",
            fateLine: "Линия судьбы, начинающаяся от линии жизни, указывает на самостоятельность и способность строить свою судьбу.",
            destinyNumber: 9,
            destinyDesc: "Число завершения и мудрости. Вы обладаете глубоким пониманием жизни и способностью помогать другим.",
            luckyStone: "Лунный камень",
            stoneDesc: "Камень интуиции и новых начинаний, усиливает экстрасенсорные способности.",
            luckyColors: ["#c084fc", "#e879f9", "#d8b4fe"],
            luckyDays: "Понедельник, Воскресенье",
            monthlyAdvice: "Прислушивайтесь к своим снам и знакам судьбы. Медитация и духовные практики принесут озарения. Помогайте другим - это принесет вам удачу."
        },
        {
            text: "Ваши линии образуют гармоничный баланс между разумом и чувствами. Треугольник на холме Меркурия свидетельствует о коммерческой жилке и финансовой удаче. В скором времени появится возможность значительно улучшить материальное положение. Звезда на холме Аполлона предвещает успех в публичной деятельности и признание.",
            love: "Взаимная любовь и понимание 💞",
            lovePercent: 89,
            career: "Финансовый прорыв ожидается 💰",
            careerPercent: 96,
            luck: "Счастливый период начинается ✨",
            luckPercent: 91,
            health: "Баланс и гармония 🧘",
            healthPercent: 88,
            lifeLine: "Четкая линия жизни с восходящими ответвлениями указывает на периоды значительных достижений и успеха.",
            headLine: "Прямая линия ума говорит о реалистичном подходе к жизни и способности концентрироваться на целях.",
            heartLine: "Ровная линия сердца свидетельствует о эмоциональной стабильности и способности к долгосрочным отношениям.",
            fateLine: "Сильная линия судьбы, идущая от запястья к среднему пальцу, обещает успешную карьеру и материальное благополучие.",
            destinyNumber: 8,
            destinyDesc: "Число материального успеха и власти. Вы рождены для достижения великих целей и финансового процветания.",
            luckyStone: "Тигровый глаз",
            stoneDesc: "Камень силы и процветания, защищает от негатива и привлекает богатство.",
            luckyColors: ["#f97316", "#ea580c", "#fb923c"],
            luckyDays: "Суббота, Воскресенье",
            monthlyAdvice: "Сосредоточьтесь на финансовых целях и инвестициях. Деловые партнерства будут особенно выгодны. Проявляйте решительность в переговорах."
        },
        {
            text: "Исключительно редкое сочетание линий на вашей ладони! Мистический крест между линиями ума и сердца указывает на особую связь с тонкими мирами. Вы обладаете даром целительства и способностью влиять на энергетические поля. Кольцо Венеры говорит о вашей чувствительности к красоте и искусству. Вас ждет период духовного роста.",
            love: "Космическая связь с партнером 🌟",
            lovePercent: 94,
            career: "Уникальный путь к успеху 🦋",
            careerPercent: 87,
            luck: "Магическое везение 🔮",
            luckPercent: 97,
            health: "Исцеляющая энергия 💫",
            healthPercent: 93,
            lifeLine: "Двойная линия жизни - знак особой защиты высших сил. Вы наделены особой жизненной энергией.",
            headLine: "Линия ума с островками указывает на периоды глубоких размышлений и философских прозрений.",
            heartLine: "Цепочкообразная линия сердца говорит о чувствительности и способности к глубоким эмоциональным переживаниям.",
            fateLine: "Волнообразная линия судьбы предсказывает интересный, полный приключений жизненный путь с неожиданными поворотами.",
            destinyNumber: 11,
            destinyDesc: "Мастер-число духовного озарения. Вы - проводник высших энергий и вдохновения для других.",
            luckyStone: "Лабрадорит",
            stoneDesc: "Камень магии и трансформации, открывает третий глаз и усиливает интуицию.",
            luckyColors: ["#06b6d4", "#0ea5e9", "#22d3ee"],
            luckyDays: "Понедельник, Пятница",
            monthlyAdvice: "Откройтесь новым духовным практикам и эзотерическим знаниям. Ваша интуиция на пике - доверяйте ей. Записывайте свои сны - в них скрыты важные послания."
        },
        {
            text: "Ваши ладони показывают гармонию между материальным и духовным. Квадрат на холме Юпитера - знак защиты в сложных ситуациях. Линия Солнца хорошо развита, что обещает славу, признание и успех в творческих начинаниях. Множественные линии путешествий указывают на любовь к приключениям и важные поездки, которые изменят вашу жизнь.",
            love: "Романтика и приключения 🌹",
            lovePercent: 90,
            career: "Творческий триумф 🎨",
            careerPercent: 92,
            luck: "Счастливые случайности 🎲",
            luckPercent: 89,
            health: "Активность и бодрость ⚡",
            healthPercent: 86,
            lifeLine: "Линия жизни с четкими восходящими линиями обещает успех в начинаниях и преодоление всех препятствий.",
            headLine: "Длинная линия ума свидетельствует о пытливом уме и стремлении к знаниям. Вы постоянно развиваетесь.",
            heartLine: "Высоко расположенная линия сердца указывает на романтическую натуру и высокие идеалы в любви.",
            fateLine: "Линия судьбы с ответвлениями к различным пальцам говорит о разносторонних талантах и множестве возможностей.",
            destinyNumber: 5,
            destinyDesc: "Число свободы и перемен. Вы любите приключения, новый опыт и не боитесь рисковать.",
            luckyStone: "Авантюрин",
            stoneDesc: "Камень удачи и новых возможностей, привлекает благоприятные обстоятельства.",
            luckyColors: ["#10b981", "#059669", "#34d399"],
            luckyDays: "Среда, Пятница",
            monthlyAdvice: "Не бойтесь перемен - они принесут позитивные результаты. Путешествия откроют новые горизонты. Общайтесь с разными людьми - каждая встреча важна."
        }
    ];

    const randomIndex = Math.floor(Math.random() * predictions.length);
    const selectedPrediction = predictions[randomIndex];

    return {
        image: imageData,
        prediction: selectedPrediction
    };
}

// Отображение результата с анимациями
function displayResult(data) {
    document.getElementById('capturedPhoto').src = data.image;

    const pred = data.prediction;

    // Основное предсказание
    document.getElementById('predictionText').textContent = pred.text;

    // Анализ линий
    document.getElementById('lifeLineDesc').textContent = pred.lifeLine;
    document.getElementById('headLineDesc').textContent = pred.headLine;
    document.getElementById('heartLineDesc').textContent = pred.heartLine;
    document.getElementById('fateLineDesc').textContent = pred.fateLine;

    // Аспекты жизни с процентами
    document.getElementById('loveScore').textContent = pred.love;
    document.getElementById('careerScore').textContent = pred.career;
    document.getElementById('luckScore').textContent = pred.luck;
    document.getElementById('healthScore').textContent = pred.health;

    // Анимация прогресс-баров
    setTimeout(() => {
        document.getElementById('loveBar').style.width = pred.lovePercent + '%';
        document.getElementById('careerBar').style.width = pred.careerPercent + '%';
        document.getElementById('luckBar').style.width = pred.luckPercent + '%';
        document.getElementById('healthBar').style.width = pred.healthPercent + '%';
    }, 300);

    // Число судьбы
    document.getElementById('destinyNumber').textContent = pred.destinyNumber;
    document.getElementById('destinyNumberDesc').textContent = pred.destinyDesc;

    // Камень-талисман
    document.getElementById('luckyStone').textContent = pred.luckyStone;
    document.getElementById('luckyStoneDesc').textContent = pred.stoneDesc;

    // Цвета удачи
    const colorsContainer = document.getElementById('luckyColors');
    colorsContainer.innerHTML = '';
    pred.luckyColors.forEach(color => {
        const swatch = document.createElement('div');
        swatch.className = 'color-swatch';
        swatch.style.backgroundColor = color;
        colorsContainer.appendChild(swatch);
    });

    // Благоприятные дни
    document.getElementById('luckyDays').textContent = pred.luckyDays;

    // Совет на месяц
    document.getElementById('monthlyAdvice').textContent = pred.monthlyAdvice;

    // Генерация персонального талисмана
    generateTalisman(pred.destinyNumber, pred.luckyColors);

    // Создание частиц
    createParticles();

    // Отображение нумерологического анализа, если есть данные
    displayNumerologyAnalysis();

    showScreen('resultScreen');
}

// Генерация персонального талисмана (СЮРПРИЗ!)
function generateTalisman(destinyNumber, colors) {
    const canvas = document.getElementById('talismanCanvas');
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Фон
    const gradient = ctx.createRadialGradient(100, 100, 20, 100, 100, 100);
    gradient.addColorStop(0, colors[0]);
    gradient.addColorStop(0.5, colors[1]);
    gradient.addColorStop(1, colors[2]);

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(100, 100, 95, 0, Math.PI * 2);
    ctx.fill();

    // Внешний круг
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(100, 100, 90, 0, Math.PI * 2);
    ctx.stroke();

    // Звезда или мандала в зависимости от числа судьбы
    const points = destinyNumber || 8;
    drawStar(ctx, 100, 100, points, 60, 30, '#ffffff');

    // Число судьбы в центре
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(destinyNumber, 100, 100);

    // Описание талисмана
    const talismanDescriptions = {
        3: "Ваш талисман несет энергию творчества и самовыражения. Сохраните его для привлечения вдохновения.",
        5: "Этот талисман защищает вас в путешествиях и привлекает новые возможности. Носите его с собой.",
        7: "Мистический талисман усиливает интуицию и духовное зрение. Медитируйте с ним.",
        8: "Талисман процветания привлекает богатство и успех. Разместите его в месте работы.",
        9: "Талисман мудрости помогает принимать правильные решения. Храните его близко к сердцу.",
        11: "Священный талисман духовного пробуждения. Он откроет вам новые измерения реальности."
    };

    document.getElementById('talismanDescription').textContent =
        talismanDescriptions[destinyNumber] || "Ваш уникальный талисман создан специально для вас. Он несет вашу личную энергию и будет оберегать вас.";
}

// Рисование звезды
function drawStar(ctx, cx, cy, points, outer, inner, color) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    ctx.beginPath();

    for (let i = 0; i < points * 2; i++) {
        const radius = i % 2 === 0 ? outer : inner;
        const angle = (Math.PI / points) * i - Math.PI / 2;
        const x = cx + radius * Math.cos(angle);
        const y = cy + radius * Math.sin(angle);

        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }

    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
}

// Создание анимированных частиц
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    particlesContainer.innerHTML = '';

    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = Math.random() * 4 + 2 + 'px';
        particle.style.height = particle.style.width;
        particle.style.borderRadius = '50%';
        particle.style.backgroundColor = 'rgba(251, 191, 36, ' + (Math.random() * 0.5 + 0.3) + ')';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animation = `particleFloat ${Math.random() * 3 + 2}s ease-in-out infinite`;
        particle.style.animationDelay = Math.random() * 2 + 's';

        particlesContainer.appendChild(particle);
    }

    // Добавляем CSS анимацию
    if (!document.getElementById('particle-animation-style')) {
        const style = document.createElement('style');
        style.id = 'particle-animation-style';
        style.textContent = `
            @keyframes particleFloat {
                0%, 100% {
                    transform: translate(0, 0) scale(1);
                    opacity: 0;
                }
                50% {
                    transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) scale(1.5);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Скачать талисман
function downloadTalisman() {
    const canvas = document.getElementById('talismanCanvas');
    const link = document.createElement('a');
    link.download = 'мой-талисман-' + Date.now() + '.png';
    link.href = canvas.toDataURL();
    link.click();
}

// Печать результата
function printResult() {
    window.print();
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
            title: 'Мое предсказание по линиям руки 🔮',
            text: predictionText.substring(0, 200) + '...',
            url: window.location.href
        }).catch(err => console.log('Ошибка при попытке поделиться:', err));
    } else {
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

// Обработка ошибок
window.addEventListener('error', (event) => {
    if (event.message && (event.message.includes('camera') || event.message.includes('mediaDevices'))) {
        showError('Произошла ошибка при работе с камерой');
    }
});

// ========== НУМЕРОЛОГИЯ ==========

// Расчет числа (сложение цифр до однозначного)
function reduceToSingleDigit(num) {
    // Сохраняем мастер-числа 11, 22, 33
    if (num === 11 || num === 22 || num === 33) {
        return num;
    }

    while (num > 9) {
        num = num.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
        if (num === 11 || num === 22 || num === 33) {
            return num;
        }
    }
    return num;
}

// Расчет числа жизненного пути
function calculateLifePathNumber(day, month, year) {
    const dayNum = reduceToSingleDigit(day);
    const monthNum = reduceToSingleDigit(month);
    const yearNum = reduceToSingleDigit(year);

    const total = dayNum + monthNum + yearNum;
    return reduceToSingleDigit(total);
}

// Расчет персонального года
function calculatePersonalYear(day, month) {
    const currentYear = new Date().getFullYear();
    const dayNum = reduceToSingleDigit(day);
    const monthNum = reduceToSingleDigit(month);
    const yearNum = reduceToSingleDigit(currentYear);

    const total = dayNum + monthNum + yearNum;
    return reduceToSingleDigit(total);
}

// Описания чисел жизненного пути
const lifePathDescriptions = {
    1: {
        main: "Вы — прирожденный лидер и первопроходец. Независимость, амбиции и инновационное мышление определяют ваш путь. Вы не боитесь идти своим путем и часто становитесь источником вдохновения для других. Ваша сила в уверенности и способности принимать быстрые решения.",
        personality: "Харизматичная личность с сильной волей. Вы естественным образом притягиваете внимание и способны мотивировать окружающих.",
        soul: "Ваша душа жаждет свободы и самовыражения. Вы стремитесь оставить свой уникальный след в мире.",
        destiny: "Судьба ведет вас к лидерским позициям. Вы рождены, чтобы вести других к новым высотам."
    },
    2: {
        main: "Дипломат и миротворец. Вы обладаете уникальной способностью видеть обе стороны любой ситуации. Партнерство и сотрудничество играют ключевую роль в вашей жизни. Ваша чувствительность и интуиция помогают создавать гармонию вокруг себя.",
        personality: "Деликатная и чуткая натура. Вы умеете находить общий язык с людьми и создавать атмосферу доверия.",
        soul: "Душа ищет гармонии и баланса. Любовь и понимание — ваши главные ценности.",
        destiny: "Ваше предназначение — объединять людей и создавать мосты взаимопонимания."
    },
    3: {
        main: "Творец и коммуникатор. Ваша жизнь наполнена радостью, творчеством и самовыражением. Вы обладаете природным даром вдохновлять и развлекать других. Оптимизм и энтузиазм — ваши лучшие спутники на жизненном пути.",
        personality: "Яркая, харизматичная личность. Вы — душа компании и источник позитивной энергии.",
        soul: "Ваша душа стремится к творчеству и самовыражению. Красота и искусство наполняют вас энергией.",
        destiny: "Судьба призывает вас делиться своими талантами с миром и вдохновлять других."
    },
    4: {
        main: "Строитель и организатор. Стабильность, порядок и практичность — основа вашей жизни. Вы создаете прочный фундамент для себя и других. Трудолюбие и надежность делают вас незаменимым во многих сферах жизни.",
        personality: "Надежная и практичная личность. Люди доверяют вам и знают, что на вас можно положиться.",
        soul: "Душа ценит порядок и стабильность. Вы находите удовлетворение в создании чего-то долговечного.",
        destiny: "Ваше предназначение — создавать прочные структуры и системы, которые служат долго."
    },
    5: {
        main: "Искатель приключений и путешественник. Свобода, перемены и новый опыт — вот что движет вами. Вы не боитесь рисковать и постоянно расширяете свои горизонты. Ваша адаптивность помогает процветать в любых условиях.",
        personality: "Динамичная и непредсказуемая личность. Вы приносите свежий ветер перемен везде, где появляетесь.",
        soul: "Душа жаждет свободы и новых впечатлений. Рутина — ваш главный враг.",
        destiny: "Судьба ведет вас через разнообразный опыт, делая вас мудрее и свободнее."
    },
    6: {
        main: "Заботливый и ответственный. Семья, дом и служение другим — ваши приоритеты. Вы обладаете природным даром целительства и умением создавать уют. Любовь и гармония в отношениях имеют первостепенное значение.",
        personality: "Теплая и заботливая личность. Вы создаете атмосферу любви и принятия вокруг себя.",
        soul: "Душа стремится помогать и заботиться. Вы находите счастье в служении другим.",
        destiny: "Ваше предназначение — создавать гармонию и помогать другим находить свой путь."
    },
    7: {
        main: "Мистик и философ. Вы ищете глубинные истины и духовное понимание. Интуиция и аналитический ум помогают вам проникать в суть вещей. Одиночество для вас — время для размышлений и роста.",
        personality: "Загадочная и интроспективная личность. Вы видите то, что скрыто от других.",
        soul: "Душа ищет духовного просветления. Материальное имеет для вас второстепенное значение.",
        destiny: "Судьба ведет вас к глубоким знаниям и духовному пробуждению."
    },
    8: {
        main: "Магнат и материалист. Сила, власть и материальное изобилие — ваши цели. Вы обладаете природным деловым чутьем и способностью управлять крупными проектами. Успех и достижения мотивируют вас двигаться вперед.",
        personality: "Авторитетная и амбициозная личность. Вы излучаете силу и уверенность.",
        soul: "Душа стремится к материальным достижениям и признанию. Вы хотите оставить наследие.",
        destiny: "Ваше предназначение — достичь финансового успеха и использовать его для блага."
    },
    9: {
        main: "Гуманист и идеалист. Вы видите общую картину и заботитесь о благе всего человечества. Сострадание, мудрость и альтруизм определяют ваш путь. Вы завершаете циклы и помогаете другим трансформироваться.",
        personality: "Мудрая и сострадательная личность. Вы понимаете людей на глубоком уровне.",
        soul: "Душа стремится служить высшим целям. Вы хотите сделать мир лучше.",
        destiny: "Ваше предназначение — быть светочем мудрости и помогать человечеству эволюционировать."
    },
    11: {
        main: "Духовный посланник и вдохновитель. Мастер-число 11 наделяет вас особой интуицией и способностью вдохновлять массы. Вы — проводник высших энергий и идей. Ваша чувствительность позволяет воспринимать тонкие планы реальности.",
        personality: "Харизматичная личность с мощной энергетикой. Вы естественный лидер духовного движения.",
        soul: "Душа связана с высшим сознанием. Вы чувствуете призвание служить свету.",
        destiny: "Судьба призывает вас освещать путь другим и трансформировать сознание человечества."
    },
    22: {
        main: "Мастер-строитель. Число 22 дает способность воплощать грандиозные идеи в реальность. Вы сочетаете духовное видение с практическими навыками. Ваш потенциал безграничен — вы можете создавать империи и изменять мир.",
        personality: "Могущественная личность с невероятным потенциалом. Вы мыслите масштабно.",
        soul: "Душа стремится создать что-то значимое и долговечное. Вы хотите оставить след в истории.",
        destiny: "Ваше предназначение — реализовать великие проекты, которые изменят мир к лучшему."
    },
    33: {
        main: "Мастер-учитель и целитель. Самое редкое мастер-число. Вы воплощаете безусловную любовь и служение. Ваша жертвенность и желание помогать вдохновляют окружающих. Вы несете свет и исцеление миру.",
        personality: "Просветленная личность, излучающая любовь. Вы — живой пример служения.",
        soul: "Душа посвящена служению высшему благу. Вы чувствуете боль мира и хотите исцелить его.",
        destiny: "Ваше предназначение — быть духовным учителем и целителем для всего человечества."
    }
};

// Описания персонального года
const personalYearDescriptions = {
    1: "Год новых начинаний! Время сеять семена для будущего. Проявляйте инициативу и смело беритесь за новые проекты.",
    2: "Год партнерства и сотрудничества. Фокусируйтесь на отношениях и дипломатии. Терпение принесет плоды.",
    3: "Год творчества и самовыражения! Время реализовать творческие идеи и наслаждаться жизнью.",
    4: "Год работы и строительства фундамента. Дисциплина и организация приведут к стабильности.",
    5: "Год перемен и свободы! Ожидайте неожиданных возможностей. Время путешествовать и исследовать.",
    6: "Год семьи и ответственности. Домашние дела требуют внимания. Время для любви и заботы.",
    7: "Год духовного роста и самопознания. Время для медитации, обучения и внутренней работы.",
    8: "Год изобилия и достижений! Финансовый успех и признание близки. Действуйте уверенно.",
    9: "Год завершения и освобождения. Отпустите старое, чтобы освободить место для нового.",
    11: "Мастер-год духовного пробуждения. Ваша интуиция на пике. Следуйте внутреннему голосу.",
    22: "Мастер-год реализации. Ваши мечты могут стать реальностью. Думайте масштабно!",
    33: "Мастер-год служения. Время максимально помогать другим и распространять любовь."
};

// Совместимость чисел
const compatibilityData = {
    1: { best: [1, 3, 5], difficult: [6, 8] },
    2: { best: [2, 4, 6, 8], difficult: [1, 5] },
    3: { best: [1, 3, 5, 9], difficult: [4, 7] },
    4: { best: [2, 4, 6, 8], difficult: [3, 5] },
    5: { best: [1, 3, 5, 7], difficult: [2, 4] },
    6: { best: [2, 4, 6, 9], difficult: [5] },
    7: { best: [5, 7], difficult: [3] },
    8: { best: [2, 4, 6, 8], difficult: [1] },
    9: { best: [3, 6, 9], difficult: [] },
    11: { best: [2, 6, 11], difficult: [] },
    22: { best: [4, 22], difficult: [] },
    33: { best: [6, 33], difficult: [] }
};

// Рассчитать нумерологию
function calculateNumerology() {
    const day = parseInt(document.getElementById('birthDay').value);
    const month = parseInt(document.getElementById('birthMonth').value);
    const year = parseInt(document.getElementById('birthYear').value);

    // Валидация
    if (!day || !month || !year || day < 1 || day > 31 || month < 1 || month > 12 || year < 1900 || year > 2024) {
        alert('Пожалуйста, введите корректную дату рождения');
        return;
    }

    // Расчет чисел
    const lifePathNumber = calculateLifePathNumber(day, month, year);
    const personalYear = calculatePersonalYear(day, month);

    // Числа личности, души и судьбы (упрощенная версия)
    const personalityNumber = reduceToSingleDigit(day);
    const soulNumber = reduceToSingleDigit(month);
    const destinyNumber = reduceToSingleDigit(year);

    // Сохраняем данные
    numerologyData = {
        lifePathNumber,
        personalYear,
        personalityNumber,
        soulNumber,
        destinyNumber,
        birthDate: { day, month, year }
    };

    // Показываем результаты
    if (window.palmPrediction) {
        displayResult(window.palmPrediction);
    }
}

// Пропустить нумерологию
function skipNumerology() {
    numerologyData = null;
    if (window.palmPrediction) {
        displayResult(window.palmPrediction);
    }
}

// Отобразить нумерологический анализ
function displayNumerologyAnalysis() {
    if (!numerologyData) return;

    const section = document.getElementById('numerologySection');
    section.style.display = 'block';

    const data = lifePathDescriptions[numerologyData.lifePathNumber];

    // Число жизненного пути
    document.getElementById('lifePathNumber').textContent = numerologyData.lifePathNumber;
    document.getElementById('lifePathDesc').textContent = data.main;

    // Детальный анализ
    document.getElementById('personalityNumber').textContent = numerologyData.personalityNumber;
    document.getElementById('personalityDesc').textContent = lifePathDescriptions[numerologyData.personalityNumber]?.personality || '';

    document.getElementById('soulNumber').textContent = numerologyData.soulNumber;
    document.getElementById('soulDesc').textContent = lifePathDescriptions[numerologyData.soulNumber]?.soul || '';

    document.getElementById('destinyNumberFull').textContent = numerologyData.destinyNumber;
    document.getElementById('destinyDescFull').textContent = lifePathDescriptions[numerologyData.destinyNumber]?.destiny || '';

    // Совместимость
    const compat = compatibilityData[numerologyData.lifePathNumber];
    document.getElementById('compatibilityDesc').textContent =
        `Ваше число жизненного пути ${numerologyData.lifePathNumber} определяет особые энергетические связи с другими числами.`;
    document.getElementById('bestMatches').textContent = compat.best.join(', ');
    document.getElementById('difficultMatches').textContent = compat.difficult.length > 0 ? compat.difficult.join(', ') : 'Нет сложных сочетаний';

    // Персональный год
    document.getElementById('personalYear').textContent = numerologyData.personalYear;
    document.getElementById('personalYearDesc').textContent = personalYearDescriptions[numerologyData.personalYear];
}

// Инициализация
console.log('🔮 Приложение хиромантии и нумерологии загружено!');
