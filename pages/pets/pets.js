// slides generation

let petCard = document.querySelector('.pets-cards-block');
let pets = [];
let fullPetsList = [];
let counter;
let startIndex = 0;
let page = 1;
let maxPages;

let counterIncrease;
let startIndexDecrease;

let petInfoBtns;

const checkItemsPerPage = () => {
  if (document.querySelector("body").offsetWidth > 1280) {
    counter = 8;
    maxPages = 5;
    counterIncrease = 8;
    startIndexDecrease = 16;
  } else if (document.querySelector("body").offsetWidth > 768 && document.querySelector("body").offsetWidth < 1280) {
    counter = 6;
    maxPages = 7;
    counterIncrease = 6;
    startIndexDecrease = 12;
  } else if (document.querySelector("body").offsetWidth < 768) {
    counter = 3;
    maxPages = 15;
    counterIncrease = 3;
    startIndexDecrease = 6;
  }
}

checkItemsPerPage();

const request = new XMLHttpRequest();
request.open('GET', './pets.json');
request.onload = () => {console.log(request.response)};
fetch('./pets.json').then(res => res.json()).then(list => {
  pets = list;

  fullPetsList = (() => {
  let tempArr = [];

    for (let i = 0; i < 6; i++) {
      const newPets = pets;

      for (let j = pets.length; j > 0; j--) {
        let randInd = Math.floor(Math.random() * j);
        const randElem = newPets.splice(randInd, 1)[0];
        newPets.push(randElem);
      }

      tempArr = [...tempArr, ...newPets];
    }
    return tempArr;
  })();

  fullPetsList = sort6recursively(fullPetsList);

  createPets(fullPetsList);
});

const createPets = (petsList) => {
  for (let i = 0; counter > startIndex; i++) {
    petCard.innerHTML += `<div class="pets-card" data-btn="${i}"></div>`;
    let petCardInfo = document.querySelectorAll('.pets-card');
    petCardInfo[i].innerHTML = `<img data-btn="${i}" src=" ${ petsList[startIndex].img } ">`;
    petCardInfo[i].innerHTML += `<h4 class="name">${ petsList[startIndex].name }</h4>`;
    petCardInfo[i].innerHTML += `<button class="btn" data-btn="${i}">Learn more</button>`;
    
    startIndex++;
  }
  petInfoBtns = document.querySelectorAll('.btn');
  for (let index = 0; index < petInfoBtns.length; index++) {
    button = petInfoBtns[index];
    button.addEventListener('click', showPopup);
  }

  let petInfoCards = document.querySelectorAll('.pets-card');
  for (let k = 0; k < petInfoCards.length; k++) {
    let card = petInfoCards[k];
    card.addEventListener('click', showPopup);
  }

}

const sort6recursively = (list) => {
  const length = list.length;

  for (let i = 0; i < (length / 6); i++) {
    const stepList = list.slice(i * 6, (i * 6) + 6);

    for (let j = 0; j < 6; j++) {
      const duplicatedItem = stepList.find((item, ind) => {
        return item.name === stepList[j].name && (ind !== j);
      });

      if (duplicatedItem !== undefined) {
        const ind = (i * 6) + j;
        const which8OfList = Math.trunc(ind / 8);

        list.splice(which8OfList * 8, 0, list.splice(ind, 1)[0]);

        sort6recursively(list);
      }
    }
  }

  return list;
}

function clickNext() {
  prevButton.disabled = false;
  startButton.disabled = false;
  if (page === maxPages) {
    nextButton.disabled = true;
    endButton.disabled = true;
  }  
  petCard.innerHTML = '';
  counter += counterIncrease;
  createPets(fullPetsList);
  pageNumber.innerHTML = `${++page}`;
}

function clickPrev() {
  nextButton.disabled = false;
  endButton.disabled = false;
  if (page === 2) {
    prevButton.disabled = true;
    startButton.disabled = true;
  } 
  petCard.innerHTML = '';
  counter -= counterIncrease;
  startIndex -= startIndexDecrease;
  createPets(fullPetsList);
  pageNumber.innerHTML = `${--page}`;
}

function clickStart() {
  nextButton.disabled = false;
  endButton.disabled = false;
  prevButton.disabled = true;
  startButton.disabled = true;

  checkItemsPerPage();

  startIndex = 0;
  page = 1;
  petCard.innerHTML = '';

  createPets(fullPetsList);

  pageNumber.innerHTML = `${page}`;
}

function clickEnd() {
  nextButton.disabled = true;
  endButton.disabled = true;
  prevButton.disabled = false;
  startButton.disabled = false;

  if (document.querySelector("body").offsetWidth > 1280) {
    startIndex = 40;
    page = 6;
  } else if (document.querySelector("body").offsetWidth > 768 && document.querySelector("body").offsetWidth < 1280) {
    startIndex = 42;
    page = 8;
  } else if (document.querySelector("body").offsetWidth < 768) {
    startIndex = 45;
    page = 16;
  }

  counter = 48;
  petCard.innerHTML = '';
  createPets(fullPetsList);
  pageNumber.innerHTML = `${page}`;
}

let prevButton = document.querySelector('.prev');
let nextButton = document.querySelector('.next');
let startButton = document.querySelector('.start');
let endButton = document.querySelector('.end');
let pageNumber = document.querySelector('.page');

prevButton.addEventListener('click', clickPrev);
nextButton.addEventListener('click', clickNext);
startButton.addEventListener('click', clickStart);
endButton.addEventListener('click', clickEnd);

window.addEventListener('resize', () => {
  if (document.querySelector("body").offsetWidth > 1280) {
    checkItemsPerPage();
    clickStart();
  } else if (document.querySelector("body").offsetWidth > 768 && document.querySelector("body").offsetWidth < 1280) {
    checkItemsPerPage();
    clickStart();
  } else if (document.querySelector("body").offsetWidth < 768) {
    checkItemsPerPage();
    clickStart();
  }
});

// popup

function showPopup(event) {
  let popup = document.querySelector('.popup');
  let popupInfoBlock = document.querySelector('.popup-info');
  let num = event.target.getAttribute('data-btn');
  let allPets = document.querySelectorAll('.pets-card');
  let popupWraper = document.querySelector('.popup-wraper');

  let name = (allPets[num]).querySelector('.name').innerHTML;
  let petInfo;
    for (let i = 0; i < pets.length; i++) {
      let objValues = Object.values(pets[i]);
      if (objValues.includes(name)) {
        petInfo = pets[i];
      }
    }
  
  if (document.querySelector("body").offsetWidth < 768) {
    popupInfoBlock.innerHTML = `<h4>${ petInfo.name }</h4> <h5>${petInfo.type} - ${ petInfo.breed}</h5> <p>${ petInfo.description}</p> <ul><li>Age: ${ petInfo.age}</li><li>Inoculations:  ${ petInfo.inoculations}</li><li>Diseases: ${ petInfo.diseases}</li><li>Parasites: ${ petInfo.parasites}</li></ul>`;
  } else {
  popupInfoBlock.innerHTML = `<img src=" ${ petInfo.img } "> <h4>${ petInfo.name }</h4> <h5>${petInfo.type} - ${ petInfo.breed}</h5> <p>${ petInfo.description}</p> <ul><li>Age: ${ petInfo.age}</li><li>Inoculations:  ${ petInfo.inoculations}</li><li>Diseases: ${ petInfo.diseases}</li><li>Parasites: ${ petInfo.parasites}</li></ul>`;
  }


  popup.style.visibility = 'visible';
  document.body.style.height = '100vh';
  document.body.style.overflowY = 'hidden';
  popupWraper.style.visibility = 'visible';

  let closePopupBtn = document.querySelector('.popup-close-btn');
  closePopupBtn.addEventListener('click', hidePopup);
  closePopupBtn.addEventListener('mouseenter', addHover);
  popupWraper.addEventListener('click', hidePopup);
  popupWraper.addEventListener('mouseenter', addHover);
  popupWraper.addEventListener('mouseout', hideHover);
}

function addHover() {
  let closePopupBtn = document.querySelector('.popup-close-btn');
  closePopupBtn.style.backgroundColor = '#f1cdb3';
}
function hideHover() {
  let closePopupBtn = document.querySelector('.popup-close-btn');
  closePopupBtn.style.backgroundColor = 'transparent';
}

function hidePopup(event) {
  let popup = document.querySelector('.popup');
  let popupInfoBlock = document.querySelector('.popup-info');
  let popupWraper = document.querySelector('.popup-wraper');
  
  popup.style.visibility = 'hidden';
  popupWraper.style.visibility = 'hidden';
  document.body.style.height = '100vh';
  document.body.style.overflowY = 'auto';
  popupInfoBlock.innerHTML = '';
}

// burger

let burger = document.querySelector('.burger');
let menu = document.querySelector('.menu');
let black = document.querySelectorAll('.wraper');

let scope = true;

burger.addEventListener('click', showBurger);
for (let n = 0; n < black.length; n++) {
  let blackWr = black[n];
  blackWr.addEventListener('click', showBurger);
}

function showBurger() {
	if (scope) {
		for (let i = 0; i < black.length; i++) {
			black[i].style.width = '100%';
			black[i].style.opacity = '0.6';
		}
		menu.style.right = '0px';
		menu.style.opacity = '1';
		burger.style.transform = 'rotate(-90deg)';
		document.body.style.height = '100vh';
		document.body.style.overflowY = 'hidden';
		function widthMenu() {
			setTimeout(widthMenu, 10)
			if (scope == true) {
				clearTimeout();
			}
		}
		widthMenu()
		scope = false;
	} else {
		for (let i = 0; i < black.length; i++) {
			black[i].style.width = '0';
			black[i].style.opacity = '0';
		}
		menu.style.right = '-33rem';
		burger.style.transform = 'rotate(0deg)';
		menu.style.opacity = '1';
		document.body.style.height = '100vh';
		document.body.style.overflowY = 'auto';
		scope = true;
	}
}
