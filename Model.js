/*global alert, myapp, window, document, chrome*/
var myapp = {};

myapp.model = function (view, controller) {
    'use strict';
    var theApp = "empty";


    function reorderArray(theArray) {
        var index = theArray.length, temporaryValue, randomIndex;

        while (0 !== index) {
            randomIndex = Math.floor(Math.random() * index);
            index -= 1;

            temporaryValue = theArray[index];
            theArray[index] = theArray[randomIndex];
            theArray[randomIndex] = temporaryValue;
        }
        return theArray;
    }

    this.displayNextQuestion = function () {
        //Checking prev questions
        var theModel = controller.returnModel();
        if (document.querySelector('input[name="choices"]:checked').value === "A") {
            theModel.checkAns(0);
        }
        if (document.querySelector('input[name="choices"]:checked').value === "B") {
            theModel.checkAns(1);
        }
        if (document.querySelector('input[name="choices"]:checked').value === "C") {
            theModel.checkAns(2);
        }
        if (document.querySelector('input[name="choices"]:checked').value === "D") {
            theModel.checkAns(3);
        }

        theApp.incrQuestionNo();

        view.resetRadButt();

        if (theApp.returnQuestionNo() >= theApp.quizLength) {
            theModel.endQuiz();
            return;
        }

        var question = theApp.theQuiz.returnQuestion(theApp.returnQuestionNo());

        view.changeQuestNum(theApp.returnQuestionNo() + 1);

        //Audio
        view.changeQuizSrc(theApp.allAudio[theApp.returnQuestionNo()].source);
        view.loadAudio();

        view.changeChoiA(question.choices[0].text);
        view.changeChoiB(question.choices[1].text);
        view.changeChoiC(question.choices[2].text);
        view.changeChoiD(question.choices[3].text);
    };

    this.checkAns = function (choice) {
        console.log(theApp.theQuiz.questions[theApp.returnQuestionNo()].choices[choice]);
        if (theApp.theQuiz.questions[theApp.returnQuestionNo()].choices[choice].correct === true) {
            theApp.theQuiz.questions[theApp.returnQuestionNo()].setCorrect();
        }
    };

    //Stats Class
    var Stats = function (newNumRight, newNumTotal, newTime) {
        this.numRight = newNumRight;
        this.numTotal = newNumTotal;
        this.time = newTime;
    },

        //Create quiz
        Choice = function (newText, newCorr) {
            this.correct = newCorr;
            this.text = newText;
            console.log(this);
        },

        Question = function () {
            this.choices = [];
            this.correct = false;

            var wordNum1 = Math.round(Math.random() * (theApp.wordsLength())),
                wordNum2 = Math.round(Math.random() * (theApp.wordsLength())),
                wordNum3 = Math.round(Math.random() * (theApp.wordsLength()));

            this.audio = theApp.allAudio[theApp.returnQuestionNo()];
            this.choices.push(new Choice(this.audio.word, true));
            this.choices.push(new Choice(theApp.words[wordNum1], false));
            this.choices.push(new Choice(theApp.words[wordNum2], false));
            this.choices.push(new Choice(theApp.words[wordNum3], false));

            this.choices = reorderArray(this.choices);
            delete this.audio;

            this.setCorrect = function () {
                this.correct = true;
            };
        },

        Quiz = function () {
            var i;
            this.questions = [];
            for (i = 0; i < theApp.quizLength; i += 1) {
                this.questions.push(new Question());
                theApp.incrQuestionNo();
            }
            theApp.resetQuestionNo();
            this.questions = reorderArray(this.questions);
            console.log(this.questions);
        },

        TheApp = function () {
            this.currentQuestion = 0;
            this.quizLength = 5;
            this.allAudio = [];
            this.report = [];
            this.theQuiz = null;
            this.words = null;
        };

    Quiz.prototype.returnQuestion = function (questNo) {
        return this.questions[questNo];
    };

    TheApp.prototype.returnQuestionNo = function () {
        return this.currentQuestion;
    };

    TheApp.prototype.wordsLength = function () {
        return this.words.length - 1;
    };

    TheApp.prototype.resetQuestionNo = function () {
        this.currentQuestion = 0;
    };

    TheApp.prototype.incrQuestionNo = function () {
        this.currentQuestion += 1;
    };

    TheApp.prototype.reorderAudio = function () {
        this.allAudio = reorderArray(this.allAudio);
    };

    TheApp.prototype.returnLastReport = function () {
        if (theApp.report.length > 0) {
            return 'You got ' + theApp.report[theApp.report.length - 1].numRight + ' of ' + theApp.report[theApp.report.length - 1].numTotal + ' correct in ' + theApp.report[theApp.report.length - 1].time + ' seconds!';
        }
        return "no reports";
    };

    TheApp.prototype.returnAllReport = function () {
        var i, string = "Your Previous tests:<br/>";
        if (theApp.report.length > 0) {
             //check this later
            for (i = 0; i < theApp.report.length; i += 1) {
                string = string + theApp.report[i].numRight + ' of ' + theApp.report[i].numTotal + ' correct in ' + theApp.report[i].time + ' seconds! <br/>';
            }
            return string;
        }
        return "no reports";
    };

    TheApp.prototype.createQuiz = function () {
        theApp.theQuiz = new Quiz();
        theApp.resetQuestionNo();
        theApp.reorderAudio();
        
        console.log("create quiz");
        console.log(theApp);

        var question = theApp.theQuiz.returnQuestion(theApp.returnQuestionNo());

        view.changeQuestNum(theApp.returnQuestionNo() + 1);

        //Audio
        view.changeQuizSrc(theApp.allAudio[theApp.returnQuestionNo()].source);
        view.loadAudio();

        view.changeChoiA(question.choices[0].text);
        view.changeChoiB(question.choices[1].text);
        view.changeChoiC(question.choices[2].text);
        view.changeChoiD(question.choices[3].text);
    };

    TheApp.prototype.loadAllAudio = function () {
        theApp.allAudio = [];
        theApp.allAudio.push({word: "Bird", source: "audio/bird.wav"});
        theApp.allAudio.push({word: "Fantail", source: "audio/fantail.wav"});
        theApp.allAudio.push({word: "Fish", source: "audio/fish.wav"});
        theApp.allAudio.push({word: "Forest", source: "audio/forest.wav"});
        theApp.allAudio.push({word: "Hill", source: "audio/hill.wav"});
        theApp.allAudio.push({word: "Kiwi", source: "audio/kiwi.wav"});
        theApp.allAudio.push({word: "Lake", source: "audio/lake.wav"});
        theApp.allAudio.push({word: "Mountain", source: "audio/mountain.wav"});
        theApp.allAudio.push({word: "Rat",  source: "audio/rat.wav"});
        theApp.allAudio.push({word: "River", source: "audio/river.wav"});
        theApp.allAudio.push({word: "Sea",  source: "audio/sea.wav"});
        theApp.allAudio.push({word: "Wood pigeon", source: "audio/wood-pigeon.wav"});

        theApp.words = [];
        theApp.words.push("Cow", "Friend", "Shake", "Dream", "Dog", "Honor", "Ape", "Liquid", "Birthday", "Flavor", "Roast", "Food", "Family", "Confirm", "Rich", "Chemical", "Export", "Arson", "Hate", "City", "Sheep", "Clam", "Harvest", "Dead", "Grasp", "Evolve", "Germ", "Bug", "Rare", "Frog", "Honest", "Fluffy", "Ears", "Computer", "Raw", "Luck", "Kakapo", "Hero", "Demon", "Ivy", "Hunter");
    };

    this.getTheApp = function () {
        return theApp;
    };

    this.setTheApp = function (newApp) {
        theApp = newApp;
    };

    this.endQuiz = function () {
        var newNumRight = 0,
            newNumTotal = theApp.quizLength,
            newTime = 5,
            i;

        for (i = 0; i < theApp.quizLength; i += 1) {
            if (theApp.theQuiz.questions[i].correct) {
                newNumRight += 1;
            }
        }
        view.hideQuiz();

        theApp.report.push(new Stats(newNumRight, newNumTotal, view.returnTime()));

        //Make stats
        chrome.storage.sync.set({'stats': theApp.report}, function () {});
        //Display Stats
        console.log(theApp.report[theApp.report.length - 1]);

        view.changeResultsPara(theApp.returnLastReport());

        view.goToQuizEnd();
    };

    //Create the app object which holds quizes and other info
    theApp = new TheApp();
    theApp.loadAllAudio();
    chrome.storage.sync.get('stats', function (data) {
        if (data.stats === undefined) {
            chrome.storage.sync.set({'stats': []}, function () {});
            theApp.report = [];
            chrome.storage.sync.get('stats', function (data) {
                console.log(data.stats);
                theApp.report = data.stats;
            });
        } else {
            theApp.report = data.stats;
        }
    });
};