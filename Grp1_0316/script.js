const calendar = document.querySelector(".calendar");
const month = document.querySelector(".month h1");
const weekdays = document.querySelector(".weekdays");
const days = document.querySelector(".days");

const todoInput = document.getElementById("todo-input");
const addTodoBtn = document.getElementById("add-todo-btn");
const todoList = document.getElementById("todo-list");

const countdownInput = document.getElementById("countdown-input");
const countdownResult = document.getElementById("countdown-result");

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();
let currentDay = currentDate.getDay();

// 顯示月曆
function renderCalendar() {
    // 重置
    month.innerHTML = "";
    weekdays.innerHTML = "";
    days.innerHTML = "";

    // 顯示月份和年份
    month.innerHTML = months[currentMonth] + " " + currentYear;

    // 顯示星期
    for (let i = 0; i < daysOfWeek.length; i++) {
        const weekday = document.createElement("div");
        weekday.innerHTML = daysOfWeek[i];
        weekdays.appendChild(weekday);
    }

    // 顯示日期
    let daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    let firstDay = new Date(currentYear, currentMonth).getDay();
    firstDay = 0 - firstDay + 1;
    for (let i = firstDay; i <= daysInMonth; i++) {
        const day = document.createElement("div");
        day.className = "btn";
        if (i > 0) {
            day.innerHTML = i
        }
        if (i == currentDate.getDate() && currentMonth == currentDate.getMonth() && currentYear == currentDate.getFullYear()) {
            day.style.backgroundColor = '#8698a7';
            day.style.color = '#ffffff';
        }
        days.appendChild(day);
    }

    // 確認日期視窗
    const calendarDays = document.querySelectorAll(".days div");
    calendarDays.forEach(function (calendarDay) {
        calendarDay.addEventListener("click", function () {
            alert("您選擇的時間為 " +  currentYear + "年" + currentMonth + "月" + this.innerHTML + "日");
        });
    });
}

renderCalendar();

// 切換到上個月
document.querySelector(".prev").addEventListener("click", function () {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar();
});

// 切換到下個月
document.querySelector(".next").addEventListener("click", function () {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar();
});

var li;

// 添加待辦事項
addTodoBtn.addEventListener("click", function () {
    if (todoInput.value.trim() !== "") {
        const todo = document.createElement("li");
        todo.className = "list-group-item";

        const input = document.createElement("input");
        const label = document.createElement("label");
        const button = document.createElement("button");

        input.className = "form-check-input me-1";
        input.type = "checkbox";
        input.value = "";

        label.className = "form-check-label";
        label.innerHTML = todoInput.value;
        label.style.wordWrap = "break-word";
        label.style.maxWidth = "80%"

        button.innerHTML = "刪除";
        button.className = "btn";
        button.dataset.bsToggle = "modal";
        button.dataset.bsTarget = "#staticBackdrop";

        button.onclick = function () {
            li = this.parentNode;
            var label = this.parentNode.querySelector('.form-check-label').innerHTML;
            document.getElementById("static_backdrop_check_label").innerHTML = "是否要刪除項目：<br>" + label;
        };

        todo.appendChild(input);
        todo.appendChild(label);
        todo.appendChild(button);

        todoList.appendChild(todo);
        todoInput.value = "";
    }
});

// 刪除待辦事項
function del() {
    li.parentNode.removeChild(li);
}

// 倒數計時日期
countdownInput.addEventListener("input", function () {
    const date = new Date(countdownInput.value);
    if (date instanceof Date && !isNaN(date)) {
        const timeDiff = date.getTime() - currentDate.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        countdownResult.innerHTML = daysDiff + "<span> days</span>";
    } else {
        countdownResult.innerHTML = "請輸入一個有效的日期";
    }
});