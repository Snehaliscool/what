const introText = "Just a moment…";
const introEl = document.getElementById("intro-text");
const introScreen = document.getElementById("intro");
const card = document.querySelector(".card");
const blurLayer = document.getElementById("blur-layer");
const vignette = document.getElementById("vignette");

let index = 0;

function typeIntro() {
    introEl.style.opacity = 1;
    if (index < introText.length) {
        introEl.innerHTML += introText[index++];
        setTimeout(typeIntro, 120);
    } else {
        setTimeout(endIntro, 900);
    }
}

function endIntro() {
    introScreen.style.opacity = 0;
    introScreen.style.transition = "opacity 0.8s ease";
    setTimeout(() => {
        introScreen.style.display = "none";
        card.classList.add("show");
    }, 800);
}

window.addEventListener("load", typeIntro);

/* Content */
const alternatives = [
    { text: "", images: "images/cat-01.gif" },
    { text: "I promise it will be unforgettable", images: "images/cat-02.gif" },
    { text: "Think about it again", images: "images/cat-03.gif" },
    { text: "Come on, dare to say yes", images: "images/cat-04.gif" },
    { text: "Don't let fear stop you", images: "images/cat-05.gif" }
];

const ohyes = {
    text: "Love, still unfolding~!",
    images: "images/cat-yes.gif"
};

const text = document.querySelector(".text");
const cat = document.querySelector(".cat");
const buttons = document.querySelectorAll(".button");
const errorButton = document.querySelector(".button__error");

/* Confetti */
const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");
let confetti = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function createConfetti() {
    confetti = [];
    for (let i = 0; i < 150; i++) {
        confetti.push({
            x: Math.random() * canvas.width,
            y: Math.random() * -canvas.height,
            size: Math.random() * 6 + 4,
            speed: Math.random() * 3 + 2,
            drift: Math.random() * 2 - 1,
            color: `hsl(${Math.random() * 360},80%,70%)`,
            rotation: Math.random() * 360
        });
    }
}

function animateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    confetti.forEach(p => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation * Math.PI / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size);
        ctx.restore();

        p.y += p.speed;
        p.x += p.drift;
        p.rotation += 4;
    });

    confetti = confetti.filter(p => p.y < canvas.height + 20);
    if (confetti.length) requestAnimationFrame(animateConfetti);
}

/* UI logic */
let count = 0;

function updateDisplay(item) {
    cat.classList.remove("fade-in");
    text.classList.remove("fade-in");

    setTimeout(() => {
        cat.src = item.images;
        text.innerHTML = item.text;
        cat.classList.add("fade-in");
        text.classList.add("fade-in");
    }, 200);
}

errorButton.addEventListener("click", () => {
    count = 0;
    updateDisplay(alternatives[count]);
    buttons.forEach(b => b.style.display = "inline-block");
    errorButton.style.display = "none";
});

buttons.forEach(button => {
    button.addEventListener("click", () => {

        if (button.textContent === "YES") {
            updateDisplay(ohyes);
            buttons.forEach(b => b.style.display = "none");

            createConfetti();
            animateConfetti();
            enableCursorHearts();

            /* DELAYED, SMOOTH BACKGROUND DEEPENING */
            setTimeout(() => {
                blurLayer.style.backdropFilter = "blur(6px)";
            }, 400);

            setTimeout(() => {
                vignette.style.opacity = "1";
                document.body.classList.add("warm");
            }, 800);
        }

        if (button.textContent === "NO") {
            count++;
            if (count < alternatives.length) {
                updateDisplay(alternatives[count]);
            } else {
                buttons.forEach(b => b.style.display = "none");
                errorButton.style.display = "inline-block";
            }
        }
    });
});

/* Cursor hearts */
function enableCursorHearts(duration = 4000) {
    const handler = e => {
        const heart = document.createElement("div");
        heart.className = "cursor-heart";
        heart.innerHTML = "❤";
        heart.style.left = e.clientX + "px";
        heart.style.top = e.clientY + "px";
        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 1400);
    };

    document.addEventListener("mousemove", handler);
    setTimeout(() => document.removeEventListener("mousemove", handler), duration);
}
