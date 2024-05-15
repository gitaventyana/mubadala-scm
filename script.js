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

// function createElem(tag, className) {
//   let element = document.createElement(tag);
//   if (className) element.classList.add(...className);
//   return element;
// }

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
