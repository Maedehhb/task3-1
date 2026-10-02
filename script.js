// Questions
const questions = [
    {
        question: "HTML مخفف چیست؟",
        options: [
            "Hyper Text Markup Language",
            "High Text Machine Language",
            "Hyper Tool Multi Language",
            "Home Tool Markup Language"
        ],
        answer: "Hyper Text Markup Language"
    },

    {
        question: "کدام زبان برای استایل‌دهی صفحات وب استفاده می‌شود؟",
        options: [
            "HTML",
            "CSS",
            "JavaScript",
            "Python"
        ],
        answer: "CSS"
    },

    {
        question: "کدام زبان برای ایجاد تعامل در صفحات وب استفاده می‌شود؟",
        options: [
            "HTML",
            "CSS",
            "JavaScript",
            "SQL"
        ],
        answer: "JavaScript"
    },

    {
        question: "کدام کلمه برای تعریف متغیری که مقدار آن تغییر نمی‌کند استفاده می‌شود؟",
        options: [
            "let",
            "var",
            "const",
            "change"
        ],
        answer: "const"
    },

    {
        question: "کدام متد برای اضافه کردن یک مقدار به انتهای آرایه استفاده می‌شود؟",
        options: [
            "pop()",
            "push()",
            "shift()",
            "remove()"
        ],
        answer: "push()"
    }
];


// Variables
let currentQuestion = 0;
let score = 0;


// Show current question
function showQuestion() {
    const question = questions[currentQuestion];

    console.log("--------------------");
    console.log("سؤال " + (currentQuestion + 1));
    console.log(question.question);

    for (let i = 0; i < question.options.length; i++) {
        console.log((i + 1) + ". " + question.options[i]);
    }
}


// Check answer
function checkAnswer(selectedAnswer) {
    const question = questions[currentQuestion];

    if (selectedAnswer === question.answer) {
        console.log("✅ جواب درست است!");
        score++;
    } else {
        console.log("❌ جواب اشتباه است.");
        console.log("جواب درست: " + question.answer);
    }
}


// Go to next question
function nextQuestion() {
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        showQuestion();
    } else {
        showResult();
    }
}


// Show final result
function showResult() {
    console.log("--------------------");
    console.log("آزمون تمام شد!");
    console.log("امتیاز شما: " + score + " از " + questions.length);

    if (score === questions.length) {
        console.log("🎉 همه پاسخ‌ها درست بودند!");
    } else if (score >= 3) {
        console.log("👏 نتیجه خوبی بود!");
    } else {
        console.log("📚 بهتر است دوباره تمرین کنید.");
    }
}


// Restart quiz
function restartQuiz() {
    currentQuestion = 0;
    score = 0;

    console.log("آزمون دوباره شروع شد.");
    showQuestion();
}


// Start quiz
showQuestion();