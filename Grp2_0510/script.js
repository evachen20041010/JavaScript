// 學期時間 (2023/2 ~ 2023/6)
const startDate = new Date("2023/2/1");
const endDate = new Date("2023/6/30");

// 課程活動
const courseActivities = [
    { date: "2023/2/15", activity: "week1", link: "https://flipclass.stust.edu.tw/media/doc/164592" },
    { date: "2023/2/22", activity: "week2", link: "https://flipclass.stust.edu.tw/media/doc/167625" },
    { date: "2023/3/1", activity: "week3", link: "https://flipclass.stust.edu.tw/media/doc/168800" },
    { date: "2023/3/8", activity: "week4", link: "https://flipclass.stust.edu.tw/media/doc/170942" },
    { date: "2023/3/15", activity: "week5", link: "https://flipclass.stust.edu.tw/media/doc/172646" },
    { date: "2023/3/22", activity: "week6", link: "https://flipclass.stust.edu.tw/media/doc/174210" },
    { date: "2023/3/29", activity: "week7", link: "https://flipclass.stust.edu.tw/media/doc/176113" },
    { date: "2023/4/5", activity: "week8(放假)", link: "" },
    { date: "2023/4/12", activity: "week9(期中上機考)", link: "https://flipclass.stust.edu.tw/media/doc/176950" },
    { date: "2023/4/19", activity: "week10", link: "https://flipclass.stust.edu.tw/media/doc/178356" },
    { date: "2023/4/26", activity: "week11", link: "https://flipclass.stust.edu.tw/media/doc/179622" },
    { date: "2023/5/3", activity: "week12", link: "https://flipclass.stust.edu.tw/media/doc/180792" },
    { date: "2023/5/10", activity: "week13", link: "https://flipclass.stust.edu.tw/media/doc/180791" },
    { date: "2023/5/17", activity: "week14", link: "https://flipclass.stust.edu.tw/media/doc/180790" },
    { date: "2023/5/24", activity: "week15", link: "https://flipclass.stust.edu.tw/media/doc/180789" },
    { date: "2023/5/31", activity: "week16(分組專題1)", link: "" },
    { date: "2023/6/7", activity: "week17(分組專題2)", link: "" },
    { date: "2023/6/14", activity: "week18(Final)", link: "" },
];

let currentMonth = startDate.getMonth();
let currentYear = startDate.getFullYear();

// 產生課程時間表
function generateTimetable(month, year) {
    const startDateOfMonth = new Date(year, month, 1);
    const endDateOfMonth = new Date(year, month + 1, 0);
    const timetable = [];

    let week = [];
    const firstDayOfWeek = startDateOfMonth.getDay();

    for (let i = 0; i < firstDayOfWeek; i++) {
        week.push({ day: "" });
    }



    for (let date = startDateOfMonth; date <= endDateOfMonth; date.setDate(date.getDate() + 1)) {
        const day = date.getDate();
        const hasClass = courseActivities.some(activity => {
            const activityDate = new Date(activity.date);
            return (
                activityDate.getFullYear() === date.getFullYear() &&
                activityDate.getMonth() === date.getMonth() &&
                activityDate.getDate() === day
            );
        });

        week.push({ day: day, hasClass: hasClass });

        if (week.length === 7) {
            timetable.push(week);
            week = [];
        }
    }

    if (week.length > 0) {
        timetable.push(week);
    }
    return timetable;
}

// 顯示課程活動
function showActivities(day) {
    const dayActivitiesDiv = document.getElementById("day-activities");
    dayActivitiesDiv.innerHTML = "";

    const activities = courseActivities.filter(activity => {
        const activityDate = new Date(activity.date);
        return (
            activityDate.getFullYear() === currentYear &&
            activityDate.getMonth() === currentMonth &&
            activityDate.getDate() === day
        );
    });
    if (activities.length > 0) {
        activities.forEach(activity => {
            const activityDate = document.createElement("a");
            activityDate.textContent = activity.date + " ";      //課程活動日期
            const activityLink = document.createElement("a");
            activityLink.href = activity.link;
            activityLink.textContent = activity.activity;   //課程活動
            activityLink.target = "_blank";
            const activityDiv = document.createElement("div");
            activityDiv.className = "event";

            activityDiv.appendChild(activityDate);
            activityDiv.appendChild(activityLink);
            dayActivitiesDiv.appendChild(activityDiv);
        });
    } else {
        const noActivityText = document.createElement("a");
        noActivityText.textContent = "當天沒有課程活動";    //課程活動
        dayActivitiesDiv.appendChild(noActivityText);
    }
}

// 渲染曆法
function renderCalendar() {
    const calendarDiv = document.getElementById("calendar");
    const monthActivitiesDiv = document.getElementById("month-activities");
    try {
        monthActivitiesDiv.querySelectorAll("div").forEach(div => {
            div.remove();
        });
    } catch (e) {

    }
    calendarDiv.innerHTML = "";

    const monthNames = [
        "一月", "二月", "三月", "四月", "五月", "六月",
        "七月", "八月", "九月", "十月", "十一月", "十二月"
    ];

    const timetable = generateTimetable(currentMonth, currentYear);

    const table = document.createElement("table");
    table.className = "table";

    const thead = document.createElement("thead");
    const tr = document.createElement("tr");

    for (let i = 0; i < 7; i++) {
        const th = document.createElement("th");
        th.textContent = ["日", "一", "二", "三", "四", "五", "六"][i];
        tr.appendChild(th);
    }

    thead.appendChild(tr);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");

    timetable.forEach(week => {
        const tr = document.createElement("tr");

        week.forEach(day => {
            const td = document.createElement("td");
            td.textContent = day.day !== "" ? day.day : "";
            if (day.day !== "") {
                if (day.hasClass) {
                    monthActivitiesDiv.innerHTML = "";
                    td.classList.add("has-class");

                    const activities = courseActivities.filter(activity => {
                        const activityDate = new Date(activity.date);
                        return (
                            activityDate.getFullYear() === currentYear &&
                            activityDate.getMonth() === currentMonth
                        );
                    });

                    if (activities.length > 0) {
                        activities.forEach(activity => {
                            const activityDate = document.createElement("a");
                            activityDate.textContent = activity.date + " ";      //課程活動日期
                            const activityLink = document.createElement("a");
                            activityLink.href = activity.link;
                            activityLink.textContent = activity.activity;   //課程活動
                            activityLink.target = "_blank";
                            const activityDiv = document.createElement("div");
                            activityDiv.className = "event";

                            activityDiv.appendChild(activityDate);
                            activityDiv.appendChild(activityLink);
                            monthActivitiesDiv.appendChild(activityDiv);
                        });
                    } else {
                        const noActivityText = document.createElement("a");
                        noActivityText.textContent = "當天沒有課程活動";    //課程活動
                        monthActivitiesDiv.appendChild(noActivityText);
                    }
                }

                td.addEventListener("click", () => {
                    showActivities(day.day);
                });
            }

            tr.appendChild(td);
        });

        tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    calendarDiv.appendChild(table);

    const currentMonthText = monthNames[currentMonth] + " " + currentYear;
    document.getElementById("currentMonth").textContent = currentMonthText;
}

// 切換到前一個月份
function prevMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar();
}

// 切換到下一個月份
function nextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar();
}

// 初始化月曆
renderCalendar();

// 綁定按鈕點擊事件
document.getElementById("prevBtn").addEventListener("click", prevMonth);
document.getElementById("nextBtn").addEventListener("click", nextMonth);