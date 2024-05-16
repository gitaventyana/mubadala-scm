const defaultPhoto = "images/placeholders/photo.png";

//header bar hide/show
let lastpos = window.scrollY;
const header = document.querySelector("header");
const body = document.querySelector("body");
window.onscroll = () => {
  let currentPos = window.scrollY;
  if (currentPos > lastpos) {
    header.classList.add("hide-bar");
  } else {
    header.classList.remove("hide-bar");
  }
  lastpos = currentPos;
};

//menu button
const navBtn = document.querySelector(".nav-button");
const menu = document.querySelector("nav");
navBtn.onclick = (event) => {
  console.log("menu", menu.style.display);
  if (!menu.style.display || menu.style.display == "none") {
    menu.style.display = "block";
  } else {
    menu.style.display = "none";
  }
};
function gotoSection(section) {
  let dest = document.querySelector(`.${section}`);
  dest.scrollIntoView({ behavior: "smooth" });
  menu.style.display = "none";
}

body.onclick = (event) => {
  if (event.target !== navBtn) {
    menu.style.display = "none";
  }
};

// //
// //helper functions
// //

function createElem(tag, className) {
  let element = document.createElement(tag);
  if (className) element.classList.add(...className);
  return element;
}

//
//populate resources section
//
fetch("data/resources.json")
  .then((response) => response.json())
  .then((data) => {
    const wrapper = document.querySelector(".resource-logos");
    data.forEach((element) => {
      let link = document.createElement("a");
      link.href = element.link;
      link.classList.add("resource-item");
      let temp_img = document.createElement("img");
      temp_img.src = element.img_url;
      link.appendChild(temp_img);
      wrapper.appendChild(link);
    });
  });

//
//populate gallery section
//
const rowOne = document.getElementById("row-slide-left");
const rowTwo = document.getElementById("row-slide-right");

function populateImageRow(row, images) {
  let idx = 0;
  while (idx < 5) {
    images.push(images[idx]);
    idx++;
  }
  while (images.length < 20) {
    images.push(images[idx]);
    idx++;
  }
  while (images.length % 4 != 0) {
    images.push(images[idx]);
    idx++;
  }
  images.forEach((img) => {
    let wrap = document.createElement("div");
    wrap.classList.add("image-wrapper");
    let item = document.createElement("img");
    item.src = img.img_url;
    wrap.appendChild(item);
    row.appendChild(wrap);
  });
  let timing = images.length * 8;
  row.style.animationDuration = `${timing}s`;
}

fetch("data/gallery.json")
  .then((response) => response.json())
  .then((data) => {
    if (data.length == 1) {
      populateImageRow(rowOne, data);
      populateImageRow(rowTwo, data);
    } else if (data.length > 1) {
      let mid = Math.floor(data.length / 2);
      populateImageRow(rowOne, data.slice(0, mid));
      populateImageRow(rowTwo, data.slice(mid));
    }
  });

//
//populate news section
//

let newsData = [];
let newsIdx = 0;
const newsWrapper = document.querySelector(".news-wrapper");
const newsNext = document.querySelector(".news-next");
const newsPrev = document.querySelector(".news-prev");

function createNewsItemElem(data) {
  let elem = createElem("div", ["news-item"]);

  let imgWrap = createElem("div", ["news-thumbnail"]);
  let img = createElem("img");
  img.src = data.thumbnail_url;
  imgWrap.appendChild(img);

  let imgTexts = createElem("div", ["news-info"]);

  let tags = createElem("div", ["news-tags"]);
  data.tags.forEach((t) => {
    let tag = createElem("span");
    tag.innerHTML = t;
    tags.appendChild(tag);
  });

  let title = createElem("h5");
  title.innerHTML = data.title;

  let desc = createElem("p");
  desc.innerHTML = data.description;

  let link = createElem("a");
  link.href = data.link;
  link.innerHTML = "Read more";
  let chevron = createElem("img");
  chevron.src = "images/symbol/chevron-right.svg";
  link.appendChild(chevron);

  imgTexts.append(tags, title, desc, link);

  let date = createElem("div", ["news-date"]);
  date.innerHTML = `<span>${data.day}</span><span>${data.month}</span>`;

  elem.append(imgWrap, imgTexts, date);
  return elem;
}

fetch("data/news.json")
  .then((response) => response.json())
  .then((data) => {
    newsData = data;
    let idx = newsIdx;
    while (idx < newsData.length && idx < 3) {
      let item = createNewsItemElem(newsData[idx]);
      newsWrapper.appendChild(item);
      idx++;
    }
    if (idx > 1) {
      newsNext.classList.add("enabled");
      enableClick(true);
    }
  });

function enableClick(next) {
  if (next) {
    newsNext.onclick = () => {
      slideNews(true);
      console.log("next");
    };
  } else {
    newsPrev.onclick = () => {
      slideNews(false);
      console.log("prev");
    };
  }
}

function slideNews(next) {
  if (next) {
    //remove first news item
    let item = document.querySelector(".news-item:first-child");
    let parent = item.parentNode;
    parent.removeChild(item);

    //new item
    newsIdx++;
    if (newsIdx + 2 < newsData.length) {
      item = createNewsItemElem(newsData[newsIdx + 2]);
      parent.appendChild(item);
    }
  } else {
    //remove last news item
    let item = document.querySelector(".news-item:last-child");
    let parent = item.parentNode;
    parent.removeChild(item);

    //new item
    newsIdx--;
    if (newsIdx >= 0) {
      item = createNewsItemElem(newsData[newsIdx]);
      parent.prepend(item);
    }
  }

  if (newsIdx + 2 >= newsData.length - 1) {
    newsNext.classList.remove("enabled");
    newsNext.onclick = null;
  } else {
    newsNext.classList.add("enabled");
    enableClick(true);
  }

  if (newsIdx > 0) {
    newsPrev.classList.add("enabled");
    enableClick(false);
  } else {
    newsPrev.classList.remove("enabled");
    newsPrev.onclick = null;
  }
}

const proc1 = document.getElementById("proc-content-1");
const proc2 = document.getElementById("proc-content-2");
const proc3 = document.getElementById("proc-content-3");
const proc4 = document.getElementById("proc-content-4");
const tab1 = document.getElementById("proc-1");
const tab2 = document.getElementById("proc-2");
const tab3 = document.getElementById("proc-3");
const tab4 = document.getElementById("proc-4");
proc2.style.display = "none";
proc3.style.display = "none";
proc4.style.display = "none";

function resetTabs() {
  tab1.classList.remove("active");
  tab2.classList.remove("active");
  tab3.classList.remove("active");
  tab4.classList.remove("active");
  proc1.style.display = "none";
  proc2.style.display = "none";
  proc3.style.display = "none";
  proc4.style.display = "none";
}

function clickTab(elem, content) {
  resetTabs();
  elem.classList.add("active");
  content.style.display = "flex";
}

tab1.onclick = () => {
  clickTab(tab1, proc1);
};
tab2.onclick = () => {
  clickTab(tab2, proc2);
};
tab3.onclick = () => {
  clickTab(tab3, proc3);
};
tab4.onclick = () => {
  clickTab(tab4, proc4);
};

const streamItems = document.querySelectorAll(".stream-item");
const circles = document.querySelectorAll(".stream-circle");
const tables = document.querySelectorAll(".stream-table");
const centerCircle = document.getElementById("center-circle");
streamItems.forEach((item) => {
  item.onmouseenter = () => {
    hoverStreamItem(item);
  };
  item.onmouseleave = () => {
    hoverOutStreamItem(item);
  };
  item.onclick = () => {
    clickStreamItem(item);
  };
});

function hoverStreamItem(item) {
  let id = item.id;
  let circle = document.getElementById(`${id}-circle`);
  circle.classList.add("hovering");
}
function hoverOutStreamItem(item) {
  let id = item.id;
  let circle = document.getElementById(`${id}-circle`);
  circle.classList.remove("hovering");
}
function clickStreamItem(item) {
  let id = item.id;
  let circle = document.getElementById(`${id}-circle`);
  let table = document.getElementById(`${id}-table`);
  if (item.classList.contains("active")) {
    item.classList.remove("active");
    circle.classList.remove("active");
    table.style.display = "none";
    centerCircle.classList.remove("inactive");
  } else {
    streamItems.forEach((e) => {
      e.classList.remove("active");
    });
    circles.forEach((e) => {
      e.classList.remove("active");
    });
    tables.forEach((t) => {
      t.style.display = "none";
    });
    item.classList.add("active");
    circle.classList.add("active");
    table.style.display = "block";
    centerCircle.classList.add("inactive");
  }
}
