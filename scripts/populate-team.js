const emailImg = "images/symbol/mail.svg";
const teamImg = "images/symbol/people.svg";

//
//populate team section
//
let teamData = [];
const leaderRow = document.querySelector(".leader-row");
const teamWrapper = document.querySelector(".team-container");

function createPersonElem(name, primary, secondary, email, teamLink) {
  let wrapper = createElem("div", ["person-data"]);
  let temp;
  if (name) {
    temp = createElem("h4");
    temp.innerHTML = name;
    wrapper.appendChild(temp);
  }
  if (primary) {
    temp = createElem("h5");
    temp.innerHTML = primary;
    wrapper.appendChild(temp);
  }
  if (secondary) {
    temp = createElem("h6");
    temp.innerHTML = secondary;
    wrapper.appendChild(temp);
  }
  let links = createElem("div", ["links"]);
  let emailInfo = createElem("a");
  let emailSym = createElem("img");
  emailSym.src = emailImg;
  emailInfo.appendChild(emailSym);
  emailInfo.innerHTML += "Email";
  if (email) {
    emailInfo.href = email;
  }
  let teamInfo = createElem("a");
  let teamSym = createElem("img");
  teamSym.src = teamImg;
  teamInfo.appendChild(teamSym);
  teamInfo.innerHTML += "Teams";
  if (teamLink) {
    teamInfo.href = teamLink;
  }
  links.append(emailInfo, teamInfo);
  wrapper.appendChild(links);
  return wrapper;
}

function toggleExpand(elem) {
  if (elem.classList.contains("expand")) {
    elem.classList.remove("expand");
  } else {
    elem.classList.add("expand");
  }
}

function resetExpand(isLeader, elem) {
  if (isLeader) {
    let leaders = document.querySelectorAll(".leader-profile");
    leaders.forEach((elem) => {
      elem.classList.remove("expand");
    });
  } else {
    let profiles = elem.parentNode.querySelectorAll(".profile");
    profiles.forEach((elem) => {
      elem.classList.remove("expand");
    });
  }
}

// get person data object
function getPersonData(ids) {
  console.log(ids);
  let source = teamData;
  let person;
  ids.forEach((id) => {
    let idx = 0;
    while (source[idx].id != id && idx < source.length) {
      idx++;
    }
    if (idx >= source.length) {
      return; //not found
    }
    person = JSON.parse(JSON.stringify(source[idx]));
    if (source[idx].team) {
      source = source[idx].team;
    }
  });
  console.log(person);
  return person;
}

function teamClicked(event) {
  // console.log(event.target.tagName);
  if (event.target.tagName === "A") {
    //link clicked
    return;
  }
  let elem = event.currentTarget;
  toggleExpand(elem);
  let ids = elem.id.split("-").slice(1);
  if (elem.classList.contains("expand")) {
    if (ids.length === 1) {
      //leader clicked
      resetExpand(true);
      elem.classList.add("expand");
    } else {
      resetExpand(false, elem);
      elem.classList.add("expand");
    }
    // remove previously expanded layers
    let parent;
    if (ids.length === 1) {
      parent = elem.parentNode;
    } else {
      parent = elem.parentNode.parentNode;
    }
    while (parent.nextElementSibling) {
      parent.parentNode.removeChild(parent.nextElementSibling);
    }
    // create next layer if team exist
    let person = getPersonData(ids);
    if (person.team.length > 0) {
      let newLayer = createElem("div", ["team-layer"]);
      if (ids.length === 1) {
        newLayer.classList.add("first");
      }
      newLayer.innerHTML = `Person reporting to ${person.name}`;
      teamWrapper.appendChild(newLayer);

      let teams = createElem("div", ["teams"]);
      newLayer.appendChild(teams);
      person.team.forEach((p) => {
        let member = createPersonElem(
          p.name,
          p.role,
          p.dept,
          p.email,
          p.teams_link
        );
        member.classList.add("profile");
        member.id = `${elem.id}-${p.id}`;
        member.onclick = teamClicked;
        teams.appendChild(member);
      });
    }
  } else {
    // remove previously expanded layers
    let parent;
    if (ids.length === 1) {
      parent = elem.parentNode;
    } else {
      parent = elem.parentNode.parentNode;
    }
    while (parent.nextElementSibling) {
      parent.parentNode.removeChild(parent.nextElementSibling);
    }
  }
}

fetch("data/team.json")
  .then((response) => response.json())
  .then((data) => {
    teamData = JSON.parse(JSON.stringify(data));
    console.log(teamData);

    //populate leader row data
    teamData.forEach((person) => {
      let texts = createPersonElem(
        person.name,
        person.role,
        person.location,
        person.email,
        person.teams_link
      );
      let profile = createElem("div", ["leader-profile", "profile"]);
      profile.onclick = teamClicked;
      profile.id = `team-${person.id}`;
      // profile.onclick = (event) => {
      //   console.log("profile clicked");
      //   teamClicked(event);
      // };
      let picWrapper = createElem("div", ["profile-pic"]);
      let pic = createElem("img");
      if (person.photo_url) {
        pic.src = person.photo_url;
      } else {
        pic.src = defaultPhoto;
      }
      picWrapper.appendChild(pic);

      let more = createElem("h6", ["see-more"]);
      more.innerHTML = `See ${person.name.split(" ")[0]}'s Team`;
      let moreImg = createElem("img");
      moreImg.src = "images/symbol/chevron-right.svg";
      more.appendChild(moreImg);

      profile.append(picWrapper, texts, more);
      leaderRow.appendChild(profile);
    });
  });
