// slider

let petCard = document.querySelector('.slider-content');
let pets = []; //includes obj
let fullPetsList = []; //arr which is shown
let tempArr = []; //prev arr
let counter;

const checkItemsPerPage = () => {
  if (document.querySelector("body").offsetWidth > 1280) {
    counter = 3;
  } else if (document.querySelector("body").offsetWidth > 768 && document.querySelector("body").offsetWidth < 1280) {
    counter = 2;
  } else if (document.querySelector("body").offsetWidth < 768) {
    counter = 1;
  }
}

const request = new XMLHttpRequest();
request.open('GET', './pets.json');
request.onload = () => {console.log(request.response)};
fetch('./pets.json').then(res => res.json()).then(list => {
  pets = list;
  createList();
});

function createList() {
  checkItemsPerPage();
  fullPetsList = (() => {
    let arr = [];
    for (let i = 0; i < 3; i++) {
      let index = sortList(arr);
      arr.push(index);
    }
    return arr;
  })();
  createPets();
}

function sortList(arr) {
  let randInd = Math.floor(Math.random() * 8);
  if (tempArr.includes(randInd)) {
    randInd = sortList(arr);
  } else if (arr.includes(randInd)) {
    randInd = sortList(arr);
  }
  return randInd;
}

function createPets () {
  tempArr = [];
  petCard.innerHTML = '';
  for (let i=0; i < counter; i++) {
    let num = fullPetsList[i];
    let petItem = pets[num];
    petCard.innerHTML += `<div class="pets-card" data-btn="${i}"></div>`;
    let petCardInfo = document.querySelectorAll('.pets-card');
    petCardInfo[i].innerHTML = `<img data-btn="${i}" src=" ${ petItem.img } ">`;
    petCardInfo[i].innerHTML += `<h4 class="name">${ petItem.name }</h4>`;
    petCardInfo[i].innerHTML += `<button class="btn btn-secondary" data-btn="${i}">Learn more</button>`;
    tempArr.push(num);
  }
  fullPetsList = [];

  let petInfoBtns = document.querySelectorAll('.btn');
  for (let index = 0; index < petInfoBtns.length; index++) {
    let button = petInfoBtns[index];
    button.addEventListener('click', showPopup);
  }

  let petInfoCards = document.querySelectorAll('.pets-card');
  for (let k = 0; k < petInfoCards.length; k++) {
    let card = petInfoCards[k];
    card.addEventListener('click', showPopup);
  }
}

let nextBtn = document.querySelector('.next');
let prevBtn = document.querySelector('.prev');

nextBtn.addEventListener('click', () => {createList()});
prevBtn.addEventListener('click', () => {createList()});

window.addEventListener('resize', createList);

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
		menu.style.right = '-32rem';
		burger.style.transform = 'rotate(0deg)';
		menu.style.opacity = '1';
		document.body.style.height = '100vh';
		document.body.style.overflowY = 'auto';
		scope = true;
	}
}

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
  popupInfoBlock.innerHTML = `<h4 class="popup-block-name">${ petInfo.name }</h4> <h5>${petInfo.type} - ${ petInfo.breed}</h5> <p>${ petInfo.description}</p> <ul><li>Age: ${ petInfo.age}</li><li>Inoculations:  ${ petInfo.inoculations}</li><li>Diseases: ${ petInfo.diseases}</li><li>Parasites: ${ petInfo.parasites}</li></ul>`;
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