const defaultPhoto = "images/placeholders/photo.png";

//menu button
const navBtn = document.querySelector(".nav-button");
const menu = document.querySelector("nav");
navBtn.onclick = () => {
  console.log(menu.style.display);
  if (!menu.style.display || menu.style.display == "none") {
    menu.style.display = "block";
    console.log("show");
  } else {
    menu.style.display = "none";
    console.log("hide");
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
