/**
 * This is a graditude journal application. It allows user to add morning and/or evening entry for the day.
 * Features includes are:
 * 1. Separate instruction for the morning and evening entry to guide user. It will be displayed accordingly in the placeholder
 *    when user toggle the radio button "Gratitude entry for: morning / evening".
 * 2. Possible default values to speed up entry:
 *    - Date is default to today.
 *    - Depending of the time of the date to select the morning / evening radio button. 4pm and later = evening.
 * 3. Validation:
 *    - date picker is set to disabled future dates to prevent wrong entry
 *    - if notes is empty to abort saving, prompt user and set focus to notes input box.
 * 4. Saving to localstorage
 * 5. Different image background to differenciate the morning and evening entries with date / type displayed below
 *    to help user identify whether they are on track.
 */
let cards = [];

const addCard = (ev) => {
  ev.preventDefault();

  // get the radio button's selection
  const radioButtons = document.querySelectorAll('input[name="entrytype"]');
  let selectedType;
  for (const radioButton of radioButtons) {
    if (radioButton.checked) {
      selectedType = radioButton.value;
      break;
    }
  }
  // ensure the gratitude is not empty
  let contentInput = document.getElementById("graditude").value;
  if (contentInput === "") {
    window.alert(
      `Please enter the graditute for the ${selectedType} before saving.`
    );
  }
  // save the entries to the object array.
  let card = {
    id: document.getElementById("entryDate").value,
    content: document.getElementById("graditude").value,
    type: selectedType,
  };

  cards.push(card);
  document.querySelector("form").reset();
  setDefault();

  // saving to localstorage
  localStorage.setItem(`MyGradituteList`, JSON.stringify(cards));
  display();
};
/*
   static getAllNotes() {
        const notes = JSON.parse(localStorage.getItem("notesapp-notes") || "[]");

        return notes.sort((a, b) => {
            return new Date(a.updated) > new Date(b.updated) ? -1 : 1;
        });
    }*/

/**
 *
 * @returns // all the notes from the localstorage
 */
function getAllNotes() {
  const notes = JSON.parse(localStorage.getItem("MyGradituteList") || "[]");

  console.log(notes);

  return notes.sort((a, b) => {
    return new Date(a.id) > new Date(b.id) ? -1 : 1;
  });
}

/**
 * remove all the html child element
 * @param {*} parent
 */
function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

/**
 * Description: This function dynamically create the journal card based on the array "cards"
 * @param {*} element
 */

function display() {
  const node = document.getElementById("journal-container");
  if (node.hasChildNodes()) {
    removeAllChildNodes(node);
  }
  cards = getAllNotes();

  console.table(cards);

  if (cards.length === 0) {
    return;
  }

  const journalParent = document.getElementById("journal-container");
  const section = document.createElement("div");
  section.classList.add("grid-col-span-4", "title");
  section.innerText = "My graditude journal";
  journalParent.append(section);

  for (let i = 0; i < cards.length; i++) {
    const el = cards[i];
    console.table(el);

    const parentDiv = document.createElement("div");

    journalParent.append(parentDiv);

    const content = document.createElement("p");
    content.innerText = el.content;
    if (el.type === "morning") {
      parentDiv.classList.add(
        "journal-card",
        "journal-card-morning",
        "div.transbox"
      );
      content.classList.add("body-morning-text");
    } else {
      parentDiv.classList.add(
        "journal-card",
        "journal-card-evening",
        "div.transbox"
      );
      content.classList.add("body-evening-text");
    }

    const cardInfo = document.createElement("div");
    cardInfo.classList.add("journal-card-updated");
    parentDiv.append(content, cardInfo);

    const btnDel = document.createElement("button");
    const dateSpan = document.createElement("span");
    dateSpan.innerText = el.id + "/" + el.type;
    const iconSpan = document.createElement("span");

    console.log(parentDiv);
    console.log(content);

    //btnDel.append(dateSpan, iconSpan);

    btnDel.classList.add("button");

    cardInfo.append(btnDel);
    btnDel.id = el.id;
    console.log("btnDel ID", btnDel.id);
    btnDel.onclick = function (ev) {
      console.log("ev.id", ev.id);
      console.log("this.id", this.id);
      deleteNote(this.id);
    };

    dateSpan.classList.add("journal-card-updated");
    iconSpan.classList.add("button-icon");
    btnDel.append(dateSpan, iconSpan);
  }
}

/*
    static deleteNote(id) {
        const notes = NotesAPI.getAllNotes();
        const newNotes = notes.filter(note => note.id != id);

        localStorage.setItem("notesapp-notes", JSON.stringify(newNotes));
    }*/

function deleteNote(id) {
  const newNotes = cards.filter((card) => card.id != id);

  // saving to localstorage
  localStorage.setItem(`MyGradituteList`, JSON.stringify(newNotes));
  display();
}
/**
 * Description: This function set the current date to the html element
 * @param {*} element // DOM element and set it to current date
 */

function setDate(element) {
  let todayDate = new Date().toISOString().slice(0, 10);

  element.value = todayDate;
  element.max = todayDate;
}

/**
 * Description: This function returns true when the current time is before 2pm.
 * @returns // true when current time is before 4pm
 */

function isAM() {
  const date = new Date();

  const [hour, minutes, seconds] = [
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
  ];

  if (hour <= 15) {
    return true;
  } else return false;
}

function toggleInstructions(element) {
  const instruction = {
    morning_msg: "What are the three things/people I am grateful for and why?",
    evening_msg: "What are three moments today that I would like to remember?",
  };

  if (element.id === "morning") {
    document.getElementById("graditude").placeholder = instruction.morning_msg;
    console.log(`instruction is ${instruction.morning_msg}`);
  } else {
    document.getElementById("graditude").placeholder = instruction.evening_msg;
    console.log(`instruction is ${instruction.evening_msg}`);
  }
  document.getElementById("graditude").focus();
}

/**
 * setting all the default values
 */
function setDefault() {
  let curDate = setDate(document.getElementById("entryDate"));

  let element = null;
  if (isAM()) {
    element = document.getElementById("morning");
    element.checked = true;
    toggleInstructions(element);
  } else {
    element = document.getElementById("eveninng");
    element.checked = true;
    //console.log("evening element", element);
    toggleInstructions(element);
  }
}

/** ========================================================================================
 *                            Start of the execution body
 * 1. Check that page is loaded and bind the function to event of interest.
 * 2. Set default values for input fields.
 * 3. Read entries from localstorage 
 * 4. Display entries under "My Gratitude Journal" section
 *
  ======================================================================================== */

/**  ---------------------------------------------------------------------------------------
 *  Ensure the page is loaded to add and del to the event "click" to the button
 * "Add" and "bin" respectively
 -----------------------------------------------------------------------------------------*/
document.addEventListener(`DOMContentLoaded`, () => {
  document.getElementById("add").addEventListener("click", addCard);
  // document.getElementById("del").addEventListener("click", deleteNote(this.id));
});

setDefault();

display();
