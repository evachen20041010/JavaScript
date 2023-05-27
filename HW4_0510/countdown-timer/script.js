const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minsEl = document.getElementById("mins");
const secondsEl = document.getElementById("seconds");
const currentDateEl = document.getElementById("current-date");

let countdownInterval;

function startCountdown() {
    clearInterval(countdownInterval);

    const countdownDate = new Date(document.getElementById("countdown-date").value);

    countdownInterval = setInterval(updateCountdown, 1000);

    updateCountdown();

    function updateCountdown() {
        const currentDate = new Date();
        const totalSeconds = Math.floor((countdownDate - currentDate) / 1000);
        document.getElementById("current-date").innerHTML = `目前日期：${currentDate.toLocaleDateString()}`;

        if (totalSeconds <= 0) {
            clearInterval(countdownInterval);
            alert("倒數器無法倒數以前的日期，請重新選擇");
            return;
        }

        const days = Math.floor(totalSeconds / 3600 / 24);
        const hours = Math.floor(totalSeconds / 3600) % 24;
        const mins = Math.floor(totalSeconds / 60) % 60;
        const seconds = Math.floor(totalSeconds) % 60;

        daysEl.innerHTML = days;
        hoursEl.innerHTML = formatTime(hours);
        minsEl.innerHTML = formatTime(mins);
        secondsEl.innerHTML = formatTime(seconds);
    }
}

function formatTime(time) {
    return time < 10 ? `0${time}` : time;
}