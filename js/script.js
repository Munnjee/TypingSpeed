const typingText = $(".typing-text p"),
  inputField = $(".wrapper .input-field"),
  time = $(".time span b"),
  typo = $(".mistake span"),
  wpm = $(".wpm span"),
  cpm = $(".cpm span"),
  tryAgain = $("button");

let timer,
  maxTime = 60,
  timeLeft = maxTime,
  charIndex = mistakes = isTyping = 0;

// Event listeners for users to switch between dark and light mode
$(document).ready(function() {
  // Event listener for toggle switch
  $("input[type='checkbox']").change(function() {
    if ($(this).is(":checked")) {
      $(".wrapper").css({
        "background-color": "rgb(30, 30, 30)",
        "color": "whitesmoke"     
      });
      $(".difficulty").text("Normal Mode");
    } else {
      $(".wrapper").css({
        "background-color": "white",
        "color": "black"
      });
      $(".difficulty").text("Programmer Mode");
    }
    // Reset the game
    resetGame();
  });
});

function randomParagraph() {
  // Random index number for object selection
  let randIndex;
  if ($('#toggle-switch').is(':checked')) {
    // Select from codelines if the switch is checked
    randIndex = Math.floor(Math.random() * codelines.length);
  } else {
    // Select from paragraphs if the switch is not checked
    randIndex = Math.floor(Math.random() * paragraphs.length);
  }

  typingText.html("");
  // Split selected object into characters and add each character inside a <span> element
  let selectedObject = ($('#toggle-switch').is(':checked')) ? codelines[randIndex] : paragraphs[randIndex];
  selectedObject.split("").forEach(span => {
    let spanTag = `<span>${span}</span>`;
    typingText.append(spanTag);
  });
  typingText.find("span").eq(0).addClass("active");
  
  // Focus on input field on keydown or click event
  $(document).on("keydown", () => inputField.focus());
  typingText.on("click", () => inputField.focus());
}

// Attach an event listener to the checkbox to detect changes in its state
$('#toggle-switch').on('change', randomParagraph);



function initTyping() {
  const characters = typingText.find("span");
  let typedChar = inputField.val().split("")[charIndex];

  if ((charIndex < characters.length - 1) && (timeLeft > 0)) {
    // Prevents timer from decrementing on every keydown
    if (!isTyping) {
      timer = setInterval(initTimer, 1000);
      isTyping = true;
    }
    // If user pressed backspace or hasn't entered any characters removes class assignment
    if (typedChar == null) {
      charIndex--;
      // Decrements mistake count if charIndex span contains incorrect class
      if (characters.eq(charIndex).hasClass("incorrect")) {
        mistakes--;
      }
      characters.eq(charIndex).removeClass("correct incorrect");
    } else {
      // Adds correct or incorrect class to span depending on if the user typed character matches the shown character
      if (characters.eq(charIndex).text() === typedChar) {
        characters.eq(charIndex).addClass("correct");
      } else {
        // Increments the mistake count for every incorrect entry
        mistakes++;
        characters.eq(charIndex).addClass("incorrect");
      }
      // Increments charIndex to next character
      charIndex++;
    }
    characters.removeClass("active");
    characters.eq(charIndex).addClass("active");
    // wpm equation from https://www.typing.com/blog/what-is-words-per-minute/#:~:text=The%20Basics%20of%20WPM,one%20minute%2C%20divided%20by%20five.
    let wpmCalc = Math.round((((charIndex - mistakes) / 5) / (maxTime - timeLeft)) * 60);
    // If wpm is 0, empty, or infinite, set its value to 0
    wpmCalc = wpmCalc < 0 || !wpmCalc || wpmCalc === Infinity ? 0 : wpmCalc;
    typo.text(mistakes);
    wpm.text(wpmCalc);
    cpm.text(charIndex - mistakes);
  } else {
    inputField.val("");
    clearInterval(timer);
  }
}


function initTimer() {
  // If there is time left on the timer, decrement the timeLeft else clear timer
  if (timeLeft > 0) {
    timeLeft--;
    time.text(timeLeft);
  } else {
    clearInterval(timer);
  }
}

function resetGame() {
  // Call random paragraph selection and reset element values to default
  randomParagraph();
  inputField.value = "";
  clearInterval(timer);
  timeLeft = maxTime + 1,
  initTimer();
  charIndex = mistakes = isTyping = 0;
  time.innerText = timeLeft;
  typo.innerText = mistakes;
  wpm.innerText = 0;
  cpm.innerText = 0;
}

randomParagraph();
inputField.on("input", initTyping);
tryAgain.on("click", resetGame);
