//get the lists of elements by class
questionContainers = document.getElementsByClassName("questionContainer")
questionSeparators = document.getElementsByClassName("questionSeparator")
correctAnswers = document.getElementsByClassName("correctAnswer")
pointCounters = document.getElementsByClassName("numOfPoints")
questionCounters = document.getElementsByClassName("numOfQuestions")
totalMinuteCounters = document.getElementsByClassName("numOfMins")
ptsPerQuestionInstances = document.getElementsByClassName("pointsPerQuestion")
//define the initial index and the number of points
index = 0
numOfPointsAvailable = 100 //changing this value will alter the number of points available everywhere
//initialize an iterable array of flags which are all set to false (0) with the length of the array equaling the number of questions
//a 0 in the array is false, a string is true
arrayOfFlags = Array(questionContainers.length).fill(0)
//initialize an array of the correct answers
arrayOfCorrectAnswers = Array(questionContainers.length).fill("")
//initialize an array of the points per question
arrayOfPoints = Array(questionContainers.length).fill(0)
//initialize an array of selected label for attributes
arrayOfSelectedAnswers = Array(questionContainers.length).fill("")
//initialize the time limit variable
timeLimitVar = 0
//initial hiding
initialSetup()

//check whether all questions have been answered. if so, enable the submit button
function checkForSubmission () {
    //stores true in fieldsPass if every element in arrayOfFlags equals true
    fieldsPass = arrayOfFlags.every(function(field) {
        return (field != 0)
    });
    //if fieldsPass is true, then enable the Submit button
    if (fieldsPass) {
        document.getElementById("submitButton").classList.remove("disabled")
        document.getElementById("submitButton").classList.remove("btn-secondary")
        document.getElementById("submitButton").classList.add("btn-success")
    }
}

//toggle entire forms and all of the elements in them between readOnly and editable
//pass true to make all forms on the page readOnly
function toggleFormElements(isDisabled) {
    //get all of the input tags and toggle them
    inputs = document.getElementsByTagName("input"); 
    for (var i = 0; i < inputs.length; i++) { 
        inputs[i].disabled = isDisabled;
    } 
    //get all of the select tags and toggle them
    selects = document.getElementsByTagName("select");
    for (var i = 0; i < selects.length; i++) {
        selects[i].disabled = isDisabled;
    }
    //get all of the textarea tags and toggle them
    textareas = document.getElementsByTagName("textarea"); 
    for (var i = 0; i < textareas.length; i++) { 
        textareas[i].disabled = isDisabled;
    }

    //ensure that the theme selector is always enabled
    document.getElementById("theme").disabled = false
}

//function for initial hiding of stuff
function initialSetup() {
    //hide all of question separators
    for (let i = 0; i < questionSeparators.length; i++) {
        questionSeparators[i].classList.add("hide")
    }
    //hide all of the questions
    for (let i = 0; i < questionContainers.length; i++) {
        questionContainers[i].classList.add("hide")
    }
    //set the number of points at the top
    for (let i = 0; i < pointCounters.length; i++) {
        pointCounters[i].innerHTML = numOfPointsAvailable
    }
    //set the number of questions at the top
    for (let i = 0; i < questionCounters.length; i++) {
        questionCounters[i].innerHTML = questionContainers.length
    }
    //set the time limit of 2 minutes per question
    for (let i = 0; i < totalMinuteCounters.length; i++) {
        timeLimitVar = questionContainers.length * 2
        totalMinuteCounters[i].innerHTML = timeLimitVar
    }
    //determine the number of points per question as total points divided by number of questions
    //number of points is an integer
    let ptPerQuestion = Math.floor(numOfPointsAvailable / questionContainers.length)
    remainder = numOfPointsAvailable % questionContainers.length
    //set the number of points per question
    for (let i = 0; i < ptsPerQuestionInstances.length; i++) {
        ptsPerQuestionInstances[i].innerHTML = ptPerQuestion
        arrayOfPoints[i] = ptPerQuestion
    }
    //add the remainder of points to reach the total points to the final question
    ptsPerQuestionInstances[ptsPerQuestionInstances.length - 1].innerHTML = ptPerQuestion + remainder
    arrayOfPoints[ptsPerQuestionInstances.length - 1] = ptPerQuestion + remainder
    //hide the previous, next, submit buttons, the quick-link box, and the results
    document.getElementById("previousButton").classList.add("hide")
    document.getElementById("nextButton").classList.add("hide")
    document.getElementById("submitButton").classList.add("hide")
    document.getElementById("quickLinkBox").classList.add("hide")
    document.getElementById("questionResults").classList.add("hide")
    //assemble an array of the correct answers from the labels
    for (let i = 0; i < correctAnswers.length; i++) {
        //get the label's contents
        str = (correctAnswers[i].textContent || correctAnswers[i].innerText)
        //use regex to replace all of the whitespace at either end
        reg = /\s{2,}/g
        arrayOfCorrectAnswers[i] = str.replace(reg, "")
    }
    console.log(arrayOfCorrectAnswers)
    console.log(arrayOfPoints)
    //assemble the list of quick links in the aside scrollbox for each question by concatenating them into the quickLinkList div
    for (let i = 0; i < questionContainers.length; i++) {
        let questionNum = i + 1
        document.getElementById('quickLinkList').innerHTML += `
        <div id="question${questionNum}Check" class="checkMark hide">&#10003;</div><a href="javascript:indexSetter(${i})" class="questionLink" id="question${questionNum}Link">    Question ${questionNum}</a>
        <br>`;
    }
}

//function that will be called to hide everything and then show the correct buttons and question
function hideAndShowEverything() {
    //iterate through all of the questionContainers to hide them all
    for (let i = 0; i < questionContainers.length; i++) {
        questionContainers[i].classList.add("hide")
    }
    //if no earlier question, hide the previous button
    if (index <= 0) {
        document.getElementById("previousButton").classList.add("hide")
     }
    //if no later question, hide the next button
    if (index + 1 >= questionContainers.length) {
        document.getElementById("nextButton").classList.add("hide")
    }

    //removes the hide class from the current question
    questionContainers[index].classList.remove("hide")
    //if there is an earlier question, show the previous button
    if (index > 0) {
        document.getElementById("previousButton").classList.remove("hide")
    }
    //if there is a later question, show the next button
    if (index + 1 < questionContainers.length) {
        document.getElementById("nextButton").classList.remove("hide")
    }
}

//start the quiz so start everything
document.getElementById("startButton").addEventListener("click", function() {
    //adds the hide class to the starting button
    document.getElementById("startButton").classList.add("hide")
    //removes the hide class from the current question
    questionContainers[index].classList.remove("hide")
    //removes the hide class from the submit button
    document.getElementById("submitButton").classList.remove("hide")
    document.getElementById("quickLinkBox").classList.remove("hide")
    //if there is an earlier question, show the previous button
    if (index > 0) {
        document.getElementById("previousButton").classList.remove("hide")
    }
    //if there is a later question, show the next button
    if (index + 1 < questionContainers.length) {
        document.getElementById("nextButton").classList.remove("hide")
    }

    //start the timer
    //set the date we're counting down to
    var nowDate = new Date();
    var minutesTimeLimit = timeLimitVar
    var countDownDate = new Date(nowDate.getTime() + ((minutesTimeLimit + 0.03)*60000));
    thirtyMinWarningTriggered = false
    fiveMinWarningTriggered = false
    oneMinWarningTriggered = false
    // Update the countdown every 1 second
    var x = setInterval(function() {
        // Get today's date and time
        var now = new Date().getTime();
            
        // Find the distance between now and the count down date
        var distance = countDownDate - now;
            
        // Time calculations for hours, minutes and seconds
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
        // Output the result in an element with id="demo"
        document.getElementById("timer").innerHTML = hours + "h " + minutes + "m " + seconds + "s ";
           
        //give a 30 minute warning: 1800200
        if (minutesTimeLimit > 30 && distance < 1800200 && !thirtyMinWarningTriggered) {
            alert("30 minutes remaining")
            thirtyMinWarningTriggered = true
        }

        //give a 5 minute warning: 300800
        if (minutesTimeLimit > 5 && distance < 300700 && !fiveMinWarningTriggered) {
            alert("5 minutes remaining")
            fiveMinWarningTriggered = true
        }

        //give a 1 minute warning: 60500
        if (minutesTimeLimit > 1 && distance < 60500 && !oneMinWarningTriggered) {
            alert("1 minute remaining")
            oneMinWarningTriggered = true
        }

        // If the countdown is over,
        if (distance < 0) {
            //clear the interval
            clearInterval(x);
            //print expired text and alert
            document.getElementById("timer").innerHTML = "EXPIRED";
            alert("Quiz submitted")
            //submit the quiz
            onSubmission()
        }
    }, 1000);
});


//increment the index and alter what is displayed
document.getElementById("nextButton").addEventListener("click", function() {
    if (index < 20) {
        index = index + 1
        hideAndShowEverything()
    }
});

//decrement the index and alter what is displayed
document.getElementById("previousButton").addEventListener("click", function() {
    if (index > 0) {
        index = index - 1
        hideAndShowEverything()
    }
});

//check if any of the radio buttons have been selected
$(document).ready(function(){
    //loop through all of the questions, starting at the first one
    for (var i = 1; i <= questionContainers.length; i++) {
        //assemble the names for the current question
        assembledFormName = "question" + i + "Answer"
        //check whether a radio button in the form has changed
        $("input[name="+assembledFormName+"]").click(function () {
            //get all of the numbers in the selected answer's id
            answerID = this.id
            let numMatches = answerID.match(/\d+/g)
            if (numMatches) {
                //build the associated check's ID from the first number in that id
                assembledCheckName = "question" + numMatches[0] + "Check"
                //set the flag to indicate that the question was answered
                //index of flag equals the question's number minus 1
                arrayOfFlags[numMatches[0] - 1] = $(this).attr("value")
                arrayOfSelectedAnswers[numMatches[0] - 1] = answerID
            } else {
                linkID = "question1Check"
            }
            //make the checkmark appear
            document.getElementById(assembledCheckName).classList.remove("hide")
            //check whether the quiz can be submitted
            checkForSubmission()
        });
    }
});

//function for when the flag button is clicked
function flagButtonClicked(buttonID) {
    //find the element by the passed id
    flagButton = document.getElementById(buttonID)
    //get all of the numbers in the passed id
    let numMatches = buttonID.match(/\d+/g)
    if (numMatches) {
        //build the associated link's ID from the first number
        linkID = "question" + numMatches[0] + "Link"
    } else {
        linkID = "question1Link"
    }
    //if the flag hasn't been toggled, toggle it
    if (flagButton.classList.contains("btn-outline-warning")) {
        flagButton.classList.remove("btn-outline-warning")
        flagButton.classList.add("btn-warning")
        if (numMatches) {
            document.getElementById(linkID).classList.add("flagged")
        }
    }
    //if the flag has been toggled, untoggle it
    else {
        flagButton.classList.remove("btn-warning")
        flagButton.classList.add("btn-outline-warning")
        if (numMatches) {
            document.getElementById(linkID).classList.remove("flagged")
        }
    }
}

//add javascript code to the links
function indexSetter(i) {
    //set the index to the parameter
    index = i
    //hide and show stuff based on the index
    hideAndShowEverything()
}

//function that does stuff when submit button is clicked
function onSubmission() {
    //show the quiz's results
    document.getElementById("questionResults").classList.remove("hide")
    //hide the previous, next, submit buttons and the quick-link box which are no longer useful
    document.getElementById("previousButton").classList.add("hide")
    document.getElementById("nextButton").classList.add("hide")
    document.getElementById("submitButton").classList.add("hide")
    document.getElementById("quickLinkBox").classList.add("hide")
    //hide all of the flag buttons
    flagButtons = document.getElementsByClassName("questionFlag")
    for (let i = 0; i < flagButtons.length; i++) {
        flagButtons[i].classList.add("hide")
    }
    //disable all forms on the page
    toggleFormElements(true)
    //reveal all of question separators
    for (let i = 0; i < questionSeparators.length; i++) {
        questionSeparators[i].classList.remove("hide")
    }
    //reveal all of the questions
    for (let i = 0; i < questionContainers.length; i++) {
        questionContainers[i].classList.remove("hide")
    }
    //mark correct questions and the number of earned points using the shared index principle
    totalEarnedPoints = 0
    for (let i = 0; i < questionContainers.length; i++) {
        //if the selected and correct answers match
        if (arrayOfFlags[i] == arrayOfCorrectAnswers[i]) {
            //give full points
            ptsPerQuestionInstances[i].innerHTML = arrayOfPoints[i] + " / " + arrayOfPoints[i]
            totalEarnedPoints = totalEarnedPoints + arrayOfPoints[i]
            correctAnswers[i].classList.add("correctAnswerSelected")
        } 
        //otherwise,
        else {
            //assign 0 points
            ptsPerQuestionInstances[i].innerHTML = "0 / " + arrayOfPoints[i]
            totalEarnedPoints = totalEarnedPoints + 0
            correctAnswers[i].classList.add("correctAnswerNotSelected")
            //mark selected answer that is wrong but only if one was selected
            console.log(arrayOfSelectedAnswers)
            if (arrayOfSelectedAnswers[i] != '') {
                labelElement = $('label[for="' + arrayOfSelectedAnswers[i] + '"]')[0]
                console.log(labelElement)
                labelElement.classList.add("wrongAnswerSelected")
            }
        }
    }
    document.getElementById("ptsResults").innerHTML = totalEarnedPoints + " out of " + numOfPointsAvailable
}