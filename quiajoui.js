cb.settings_choices = [
    { name: 'chat_ad', type: 'int', minValue: 1, default: 1, label: 'Minutes entre les messages.' },
    {name:'keyword', type:'str', label:'Mot clef pour signaler une jouissance', defaultValue: 'biscotte'},
    {name:'msgcolor', type:'str', label:'Notice color (html code default dark red #9F000F)', defaultValue: '#9F000F'},
    {name:'msgback', type:'str', label:'Notice back color (html code default white #9F000F)', defaultValue: '#FFFFFF'},

//    { name: 'handleSpeed', type: 'choice', choice1: 'OUI', choice2: 'NON', default: 'OUI', label: 'Gestion de la vitesse actif.' },
]

var nbBiscotte = 0;
var keyword = 'biscotte';
var keywordFirstLetter = keyword.charAt(0);

function isMaster(eventDetail) {
    if (eventDetail === null)
        return false;
    if (eventDetail['user'] == cb.room_slug) {
        return true;
    }
    if (eventDetail['is_mod']) {
        return true;
    }

    return false;
}

cb.onMessage(function (message) {
    // Gestion des commande.
    if (message['m'].charAt(0) == '/' || message['m'].charAt(0) == keywordFirstLetter)
        if (handleCommand(message)) {
            message['X-Spam'] = true;
        };
});

function handleCommand(message) {
    //turn the message into an array
    var messagePart = message['m'].split(' ');
    // general command
    switch (messagePart[0]) {
        case keyword:
            biscotte(message);
            return true;
    }
    // reserved command
    if (isMaster(message)) {
        switch (messagePart[0]) {
            case '/showbiscotte':
                showbiscotte(null);
                return true;
        }
    }
    // brocaster command
    if (message['user'] == cb.room_slug) {
//        switch (messagePart[0]) {
//            case '/master':
//                setMaster(messagePart[1]);
//                return true;
//        }
    }

    return false;
}

function biscotte(message) {
    var message = message['user'] + " a joui : " + message['m'];
    cb.sendNotice(message, cb.room_slug); 
    nbBiscotte++;
    message = "Une personne de plus a joui. Au total cela fait " + nbBiscotte;
    sendMessage(message, "");
}

function showbiscotte(eventDetail) {
    var userName = "";
    if (eventDetail !== null) {
        userName = eventDetail['user'];
    }

    var message = "Pour signaler quand tu as joui, ecrit "+ keyword + " dans le chat.\n"
    message += "If you cum, write "+ keyword + " in the chat."
    if(nbBiscotte > 1) {
        message += "\n";
        message += "" + nbBiscotte + " personnes ont joui."
    } else if(nbBiscotte == 1) {
        message += "\n";
        message += "" + nbBiscotte + " personne a joui."
    }
    sendMessage(message, userName);
}

function sendMessage(message, user) {
    cb.sendNotice(message, user, cb.settings['msgback'], cb.settings['msgcolor'], 'bold');
}


cb.onEnter(function (user) {
//    cb.sendNotice('Bienvenue ' + user['user'], user['user']);
    showbiscotte(user);
    if (user['user'] == 'grazy') {
        // just for fun 
        sendMessage('Bienvenue Grazy. :robot1 Ton bot te salue.','')
    }
});


function chatAd(params) {
    showbiscotte(null);
    cb.setTimeout(chatAd, (cb.settings.chat_ad * 60000));
}


function init() {
    keyword = cb.settings['keyword'];
    if (keyword)
        keywordFirstLetter = keyword.charAt(0);
    showbiscotte(null);
    cb.setTimeout(chatAd, (cb.settings.chat_ad * 60000));

}

init();

