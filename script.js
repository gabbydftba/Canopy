// HTTP Quiz JavaScript

// Set the quiz time to 10 minutes.
const totalTime = 600;

let timeLeft = totalTime;
let timerInterval;
let quizSubmitted = false;

const timerDisplay = document.getElementById("timer");
const quizForm = document.getElementById("quizForm");
const resultsSection = document.getElementById("results");

// Start the countdown timer.
function startTimer() {

    timerDisplay.textContent = "10:00";

    timerInterval = setInterval(function () {

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timerDisplay.textContent = "00:00";

            if (!quizSubmitted) {
                alert("Time is up! Your quiz will be submitted.");
                gradeQuiz();
            }

            return;
        }

        timeLeft--;

        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;

        timerDisplay.textContent =
            String(minutes).padStart(2, "0") + ":" +
            String(seconds).padStart(2, "0");

    }, 1000);
}

// Start the timer when the page loads.
startTimer();


// Get the selected radio answer.
function getRadioAnswer(questionName) {

    const selected = document.querySelector(
        'input[name="' + questionName + '"]:checked'
    );

    return selected ? selected.value : "";
}


// Get selected checkbox answers.
function getCheckboxAnswers(questionName) {

    const selected = document.querySelectorAll(
        'input[name="' + questionName + '"]:checked'
    );

    return Array.from(selected).map(function (item) {
        return item.value;
    });
}


// Check whether two answer arrays contain the same answers.
function sameAnswers(userAnswers, correctAnswers) {

    if (userAnswers.length !== correctAnswers.length) {
        return false;
    }

    return correctAnswers.every(function (answer) {
        return userAnswers.includes(answer);
    });
}


// Grade the quiz.
function gradeQuiz() {

    if (quizSubmitted) {
        return;
    }

    quizSubmitted = true;

    clearInterval(timerInterval);

    let score = 0;

    const answers = [

        {
            question: 1,
            correct: "hypertext",
            user: document.getElementById("q1").value.trim().toLowerCase(),
            correctDisplay: "HyperText",
            explanation: "HTTP stands for HyperText Transfer Protocol."
        },

        {
            question: 2,
            correct: "server",
            user: document.getElementById("q2").value.trim().toLowerCase(),
            correctDisplay: "Server",
            explanation: "A server receives requests and sends responses."
        },

        {
            question: 3,
            correct: "A",
            user: getRadioAnswer("q3"),
            correctDisplay: "Allow browsers and servers to communicate",
            explanation: "HTTP provides rules for client-server communication."
        },

        {
            question: 4,
            correct: "C",
            user: getRadioAnswer("q4"),
            correctDisplay: "GET",
            explanation: "GET retrieves information from a server."
        },

        {
            question: 5,
            correct: "A",
            user: getRadioAnswer("q5"),
            correctDisplay: "Multiplexing",
            explanation: "HTTP/2 introduced multiplexing to allow multiple streams over one connection."
        },

        {
            question: 6,
            correct: ["GET", "POST", "DELETE"],
            user: getCheckboxAnswers("q6"),
            correctDisplay: "GET, POST, and DELETE",
            explanation: "GET, POST, and DELETE are HTTP methods. HTML is a markup language."
        },

        {
            question: 7,
            correct: "true",
            user: getRadioAnswer("q7"),
            correctDisplay: "True",
            explanation: "HTTP/3 uses QUIC as its transport protocol."
        },

        {
            question: 8,
            correct: "404",
            user: document.getElementById("q8").value.trim(),
            correctDisplay: "404 Not Found",
            explanation: "404 means the requested resource was not found."
        },

        {
            question: 9,
            correct: "false",
            user: getRadioAnswer("q9"),
            correctDisplay: "False",
            explanation: "HTTP/0.9 did not include headers or status codes."
        },

        {
            question: 10,
            correct: "A",
            user: getRadioAnswer("q10"),
            correctDisplay: "It sends an HTTP response",
            explanation: "The server sends a response after processing a request."
        }

    ];


    const answerResults = document.getElementById("answerResults");

    answerResults.innerHTML = "";


    answers.forEach(function (item) {

        let isCorrect;

        if (Array.isArray(item.correct)) {

            isCorrect = sameAnswers(item.user, item.correct);

        } else {

            isCorrect = item.user === item.correct;

        }

        if (isCorrect) {
            score++;
        }

        const result = document.createElement("div");

        result.className = isCorrect ? "correct-answer" : "incorrect-answer";

        result.innerHTML = `
            <h3>Question ${item.question}</h3>
            <p>${isCorrect ? "Correct!" : "Incorrect."}</p>
            <p><strong>Correct answer:</strong> ${item.correctDisplay}</p>
            <p>${item.explanation}</p>
        `;

        answerResults.appendChild(result);

    });


    // Calculate the time spent.
    const timeSpent = totalTime - timeLeft;

    const minutesSpent = Math.floor(timeSpent / 60);
    const secondsSpent = timeSpent % 60;

    // Display the final score.
    document.getElementById("score").innerHTML =
        "<h3>Your Score: " + score + " / 10</h3>";

    // Display pass or fail.
    const passFail = document.getElementById("passFail");

    if (score >= 7) {

        passFail.innerHTML = "<h3 class='pass'>PASS!</h3>";

    } else {

        passFail.innerHTML = "<h3 class='fail'>NOT PASSED</h3>";

    }

    // Display time spent.
    document.getElementById("timeSpent").innerHTML =
        "<p>Time Spent: " +
        minutesSpent + " minute(s) and " +
        secondsSpent + " second(s)</p>";

    // Display results.
    resultsSection.hidden = false;

    resultsSection.scrollIntoView({
        behavior: "smooth"
    });

    // Prevent additional answers after submission.
    const inputs = quizForm.querySelectorAll("input");

    inputs.forEach(function (input) {
        input.disabled = true;
    });

    document.getElementById("submitButton").disabled = true;

}


// Submit the quiz.
quizForm.addEventListener("submit", function (event) {

    event.preventDefault();

    gradeQuiz();

});


// Reset the quiz and timer.
quizForm.addEventListener("reset", function () {

    clearInterval(timerInterval);

    quizSubmitted = false;

    timeLeft = totalTime;

    resultsSection.hidden = true;

    document.getElementById("score").innerHTML = "";
    document.getElementById("passFail").innerHTML = "";
    document.getElementById("timeSpent").innerHTML = "";
    document.getElementById("answerResults").innerHTML = "";

    document.getElementById("submitButton").disabled = false;

    // Re-enable all questions.
    const inputs = quizForm.querySelectorAll("input");

    inputs.forEach(function (input) {
        input.disabled = false;
    });

    // Restart the timer after the form resets.
    setTimeout(function () {
        startTimer();
    }, 100);

});
