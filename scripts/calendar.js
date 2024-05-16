const calWrapper = document.getElementById("calendar");
const calNav = document.querySelector(".cal-nav span");
let eventsData = [];

function lastday(month, year) {
  if (month < 0) {
    month = 11;
    year--;
  }
  return new Date(year, month + 1, 0).getDate();
}

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let monthName = new Date().toLocaleString("default", { month: "short" });
calNav.innerHTML = monthName + " " + currentYear;

resetCalendar();

function resetCalendar() {
  let monthName = new Date(currentYear, currentMonth, 1).toLocaleString(
    "default",
    { month: "short" }
  );
  calNav.innerHTML = monthName + " " + currentYear;
  let row = document.querySelector(".calendar .cal-row:first-child");
  while (row.nextElementSibling) {
    row.parentNode.removeChild(row.nextElementSibling);
  }
  initializeCalendar();
  getEventData();
}

function initializeCalendar() {
  console.log("init calendar", currentMonth, currentYear);
  let dow = new Date(currentYear, currentMonth, 1).getDay();
  console.log(dow);
  console.log(new Date(currentYear, currentMonth, 1));
  console.log(new Date(currentYear, currentMonth, 0));
  let last = lastday(currentMonth, currentYear);
  let d = 1;
  while (d <= last) {
    let row = createElem("div", ["cal-row"]);

    if (d === 1 && dow != 1) {
      if (dow == 0) dow = 7;
      let n = dow - 1;
      let prevLast = lastday(currentMonth - 1, currentYear);
      let p = prevLast - n + 1;
      while (p <= prevLast) {
        let elem = createDateElem(p, true);
        row.appendChild(elem);
        p++;
      }
      let end = 7 - n;
      while (d <= end) {
        let elem = createDateElem(d);
        row.appendChild(elem);
        d++;
      }
    } else {
      let end = d + 6;
      while (d <= end && d <= last) {
        let elem = createDateElem(d);
        row.appendChild(elem);
        d++;
      }
      if (end > last) {
        let i = 1;
        end = end - last;
        while (i <= end) {
          let elem = createDateElem(i, true);
          row.appendChild(elem);
          i++;
        }
      }
    }

    calWrapper.appendChild(row);
  }
}

function createDateElem(d, grey) {
  let elem;
  if (grey) {
    elem = createElem("div", ["cal-date", "grey-date"]);
  } else {
    elem = createElem("div", ["cal-date"]);
    elem.id = `day-${d}`;
  }
  elem.innerHTML = d;
  let container = createElem("div");
  elem.appendChild(container);

  return elem;
}

function createEventElem(event) {
  let elem = createElem("div", ["cal-event"]);
  let name = createElem("span");
  name.innerHTML = event.name;
  let time = createElem("span");
  time.innerHTML = event.time_start.split(" ")[0];
  elem.append(name, time);
  return elem;
}

function slideCal(next) {
  if (next) {
    if (currentMonth == 11) {
      currentMonth = 0;
      currentYear++;
    } else {
      currentMonth++;
    }
  } else {
    if (currentMonth == 0) {
      currentMonth = 11;
      currentYear--;
    } else {
      currentMonth--;
    }
  }
  resetCalendar();
}

function getEventData() {
  eventsData = [];
  fetch("data/trainings.json")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((d) => {
        let month = Number(d.date.split("-")[1]);
        console.log("data month", month);
        console.log("current", currentMonth);
        if (month == currentMonth + 1) {
          eventsData.push(d);
        }
      });

      console.log("length events", eventsData.length);
      eventsData.forEach((e) => {
        let elem = createEventElem(e);
        let dayNum = new Date(e.date).getDate();
        let id = `day-${dayNum}`;
        let dateElem = document.querySelector(`#${id} div`);
        if (dateElem) {
          dateElem.appendChild(elem);
        }
      });
    });
}
