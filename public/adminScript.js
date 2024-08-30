document.addEventListener('DOMContentLoaded', () => {
    const progressBar = document.getElementById('progressBar');
    const logoContainer = document.getElementById('logoContainer');
    const timerElement = document.getElementById('timer');
    const statusElement = document.getElementById('status');
  
    const API_URL = 'https://logoreveal.onrender.com'; // Replace with your deployed server URL

    const updateProgress = async () => {
        try {
            const response = await fetch(`${API_URL}/count`);
            const data = await response.json();
            const percentage = data.percentage;
            progressBar.style.width = `${percentage}%`;
  
            const timeLeft = data.timeLeft;
            const hours = Math.floor(timeLeft / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
  
            timerElement.textContent = `Time left: ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  
            if (data.revealLogo) {
                logoContainer.style.display = 'block';
                statusElement.textContent = 'Logo is revealed!';
            } else {
                statusElement.textContent = `Percentage of students clicked: ${percentage.toFixed(2)}%`;
            }
        } catch (error) {
            console.error('Error fetching count data:', error);
        }
    };

    updateProgress();
    setInterval(updateProgress, 1000);
});
