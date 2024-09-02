document.addEventListener('DOMContentLoaded', () => {
    const revealButton = document.getElementById('revealButton');
    const logoContainer = document.getElementById('logoContainer');
    const logo = document.getElementById('logo');
    const timerElement = document.getElementById('timer');
    const modal = document.getElementById('confirmationModal');
    const closeModal = document.querySelector('.modal .close');

    const API_URL = 'https://logoreveal.onrender.com'; // Replace with your deployed server URL

    const updateProgress = async () => {
        try {
            const response = await fetch(`${API_URL}/count`);
            const data = await response.json();
            const percentage = data.percentage;
            const timeLeft = data.timeLeft;

            const hours = Math.floor(timeLeft / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

            if (timerElement) {
                timerElement.textContent = `Time left: ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            }

            if (data.revealLogo && logoContainer && logo) {
                logoContainer.style.display = 'block';
                logo.style.opacity = 0;
                logo.style.transform = 'scale(0.5)';
                setTimeout(() => {
                    logo.style.transition = 'opacity 1s, transform 1s';
                    logo.style.opacity = 1;
                    logo.style.transform = 'scale(1)';
                }, 10);
                if (revealButton) {
                    revealButton.disabled = true;
                }
            }
        } catch (error) {
            console.error('Error fetching count data:', error);
        }
    };

    if (revealButton) {
        revealButton.addEventListener('click', async () => {
            try {
                const response = await fetch(`${API_URL}/increment`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                await response.json();
                updateProgress();
                if (modal) {
                    modal.style.display = 'block';
                }
            } catch (error) {
                console.error('Error incrementing count:', error);
            }
        });
    }

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            if (modal) {
                modal.style.display = 'none';
            }
        });
    }

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    updateProgress();
    setInterval(updateProgress, 1000);
});
