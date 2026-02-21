(function () {
    const lines = document.querySelectorAll('#bootOverlay .boot-line');
    let currentLine = 0;
    const delayBetweenLines = 400;

    function typeLine() {
        if (currentLine < lines.length) {
            lines[currentLine].classList.add('typing');
            currentLine++;
            setTimeout(typeLine, delayBetweenLines);
        } else {
            setTimeout(() => {
                const overlay = document.getElementById('bootOverlay');
                overlay.classList.add('fade-out');
                setTimeout(() => {
                    overlay.style.display = 'none';
                }, 700);
            }, 800);
        }
    }

    if (document.getElementById('bootOverlay')) {
        setTimeout(typeLine, 300);
    }
})();

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

document.addEventListener('keydown', function (e) {
    const shortcuts = {
        'F1': 'https://github.com/batuhd',
        'F2': '',
        'F3': '',
        'F4': '',
        'F5': ''
    };

    if (shortcuts[e.key]) {
        e.preventDefault();
        if (e.key === 'F4') {
            window.location.href = shortcuts[e.key];
        } else {
            window.open(shortcuts[e.key], '_blank');
        }
    }
});
