document.addEventListener('DOMContentLoaded', () => {
    const revealButton = document.getElementById('revealButton');
    const logoContainer = document.getElementById('logoContainer');
    const logo = document.getElementById('logo');
    const timerElement = document.getElementById('timer');

    const updateProgress = async () => {
        try {
            const response = await fetch('http://localhost:3000/count');
            const data = await response.json();
            const percentage = data.percentage;
            const timeLeft = data.timeLeft;

            const hours = Math.floor(timeLeft / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

            timerElement.textContent = `Time left: ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

            if (data.revealLogo) {
                logoContainer.style.display = 'block';
                logo.style.opacity = 0;
                logo.style.transform = 'scale(0.5)';
                setTimeout(() => {
                    logo.style.transition = 'opacity 1s, transform 1s';
                    logo.style.opacity = 1;
                    logo.style.transform = 'scale(1)';
                }, 10);
                revealButton.disabled = true;
            }
        } catch (error) {
            console.error('Error fetching count data:', error);
        }
    };

    revealButton.addEventListener('click', async () => {
        try {
            const response = await fetch('http://localhost:3000/increment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            await response.json();
            updateProgress();
        } catch (error) {
            console.error('Error incrementing count:', error);
        }
    });

    updateProgress();
    setInterval(updateProgress, 1000);
});