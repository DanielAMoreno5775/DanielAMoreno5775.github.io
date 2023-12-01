# DanielAMoreno5775.github.io
This is the GitHub repository for my personal portfolio website.
If the top bar is not a different color from the rest of the page, please use the color mode dropdown in the top-right corner to switch between the modes. This issue is due to the fact that you have not yet created a cookie with this website or your previous cookie expired.
## Home Page (/index.html)
This page acts as an organizer for my various GitHub repositories along with a few basic website elements such as table sorting and form validation.
## API Page (/api.html)
This page has an example of some API calls.
## Quiz Page (/questions.html)
This page is an example quiz.
The quiz header will always display 100 points but the number of questions and the time limit will dynamically vary based on the number of questions. Two minutes will be given for each question. The 100 points will be evenly divided between the questions with the remainder being assigned to the final question. The possible question types are true-false, multiple-choice, and multiple-image-choice. 
The javascript code will automatically handle the number of questions. To remove a question, simply delete a div with the class of "questionContainer". However, this div must be the final one. If there are 4 questions, you can only delete the fourth question, not the other three. To add a question, copy a div with the class of "questionContainer", and then you will need change all of the names, labels, fors, ids, classes, and the question name to alter the question's number. Make sure that all of these have the correct question number. 
Press the "Take the Quiz" button to start the quiz. 
During the quiz, please select the radio button that best answers the question. Use the "Previous" and "Next" buttons to navigate through the questions. You can also use the links in the aside to the right of the screen to go directly to a question. Toggle the yellow button on each question to flag it in the right aside. During the quiz, the timer will issue a warning at 30 minutes, 5 minutes, and 1 minute remaining. 
Once you have answered all of the questions, you will be able to press the "Submit" button. The quiz will also automatically be submitted once the timer runs out. After the quiz has been submitted, all answers will be evaluated with points being assigned if the choice was correct. Correct selections will be marked by a green flag. If the selection was wrong, the wrong selection will be marked with a red flag and the correct option will be marked with a gray flag.