/**
 Name: Do you read my bio ?
 Author: grazy

 Ask user to answer some question before allowing him to talk.

*/

cb.settings_choices =
[
    {name: 'introduction', label: 'Introduction before the questions', type: 'str', minLength: 1, maxLength: 1000, defaultValue: 'You must answer some question before be able to talk.'},
    {name: 'question1', label: 'Question 1:', type: 'str', minLength: 1, maxLength: 1000, defaultValue: 'How can you call me ? a: bb, b: with my name.'},
    {name: 'answer1', label: 'Answer of question 1:', type: 'str', minLength: 1, maxLength: 20, defaultValue: 'b'},
    {name: 'question2', label: 'Question 2:', type: 'str', minLength: 1, maxLength: 1000, defaultValue: 'How can you meet me ? a: ask to my father, b: ask the president, c: there is no way.'},
    {name: 'answer2', label: 'Answer of question 2:', type: 'str', minLength: 1, maxLength: 20, defaultValue: 'c'}
];

var allowedUser = [];
var notifBack = '#FFFFFF';
var notifcolor = '#C287C2';
var notifError = '#FF0000';
var notifw = 'bold';
var questionIndexList = {};


function sendQuestion(user) {
    cb.sendNotice(cb.settings.introduction,user,notifBack,notifcolor, notifw);
    var questionIndex = questionIndexList[user] || 0;

    if(questionIndex == 0) {
        cb.sendNotice(cb.settings.question1,user,notifBack,notifcolor, notifw);
    } else {
        cb.sendNotice(cb.settings.question2,user,notifBack,notifcolor, notifw);
    }
}

function checkAnswer(user, answer) {
    var questionIndex = questionIndexList[user] || 0;
    var isOk = false;
    if(questionIndex == 0) {
        isOk = answer == cb.settings.answer1;

    } else {
        isOk = answer == cb.settings.answer2;
    }

    if(!isOk) { 
        cb.sendNotice("Wrong answer!",user,notifBack,notifError, notifw);
    } else {
        questionIndex++;
        questionIndexList[user] = questionIndex;
        if(questionIndex == 2) {
            // all qestion OK
            delete questionIndexList[user];
            allowedUser.push(user);
            return true
        }
    }
    return false;
}

cb.onMessage(function (msg)
{
    if(!allowedUser.includes(msg['user'])) {
        //don't print this message to chat
        msg['X-Spam'] = true;

        if(!checkAnswer(msg['user'], msg['m'])) 
        {
            sendQuestion(msg['user']);
        }
    }
});

cb.onEnter(function(user)
{
    if(!allowedUser.includes(user['user'])) {
        sendQuestion(user['user']);
    }
});