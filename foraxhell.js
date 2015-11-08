/* global cb */

var current_mode = 1;
var current_speed = 1;
var numberOfChangeMode = 0;
var handleSpeed = true;
var masterUser = null;
var modAreMaster = false;
var last_tip_username = null;
var last_tip_amount = 0;


cb.settings_choices = [
    { name: 'tokens_to_change', type: 'int', minValue: 1, default: 1, label: 'Nombre de token pour changer de mode.' },
    { name: 'handleSpeed', type: 'choice', choice1: 'OUI', choice2: 'NON', default: 'OUI', label: 'Gestion de la vitesse actif.' },
    { name: 'tokens_for_speed', type: 'int', minValue: 2, default: 100, label: 'Nombre de token pour changer de vitesse.' },
    { name: 'modAreMaster', type: 'choice', choice1: 'OUI', choice2: 'NON', default: 'NON', label: 'Les mod ont droit au commande avancé.' },

    { name: 'mode1', type: 'str', default: "---------", label: ' mode 1.' },
    { name: 'mode2', type: 'str', default: "-- -- -- ", label: ' mode 2.' },
    { name: 'mode3', type: 'str', default: "- - - - - ", label: ' mode 3.' },
    { name: 'mode4', type: 'str', default: "..........", label: ' mode 4.' },
    { name: 'mode5', type: 'str', default: "-..-..-..-", label: ' mode 5.' },
    { name: 'mode6', type: 'str', default: "-..-..-..-", label: ' mode 6.' },
    { name: 'mode7', type: 'str', default: "-...-...-...", label: ' mode 7.' },
    { name: 'mode8', type: 'str', default: "--.--.--.--.", label: ' mode 8.' },

];


// handlers
cb.onTip(function (tip) {
    if (handleSpeed) {
        if (tip['amount'] >= cb.settings.tokens_to_change && tip['amount'] < cb.settings.tokens_for_speed) {
            last_tip_amount = tip['amount']
            last_tip_username = tip['from_user']
            changeMode();
        } else if (tip['amount'] >= cb.settings.tokens_for_speed) {
            last_tip_amount = tip['amount']
            last_tip_username = tip['from_user']
            changeSpeed();
        }

    } else {
        if (tip['amount'] >= cb.settings.tokens_to_change) {
            last_tip_amount = tip['amount']
            last_tip_username = tip['from_user']
            changeMode();
        }
    };


});

cb.onDrawPanel(function (user) {
    return {
        'template': '3_rows_11_21_31',
        'row1_value': 'Mode ' + current_mode + (handleSpeed ? ' Vitesse  ' + current_speed : ""),
        'row2_value': 'Number of mode change ' + numberOfChangeMode,
        'row3_value': 'Latest Tip Received: ' + format_username(last_tip_username) + ' (' + last_tip_amount + ')'
    };
});

function changeMode() {
    numberOfChangeMode++;
    current_mode++;
    if (current_mode > 8) {
        current_mode = 1;
    }

    cb.sendNotice("Nouveau mode : " + current_mode + " " + cb.settings["mode" + current_mode]);
    cb.drawPanel();
}

function changeSpeed() {
    current_speed++;
    if (current_speed > 10) {
        current_speed = 1;
    }

    cb.sendNotice("Nouvelle vitesse : " + current_speed);
    cb.drawPanel();
}

/* 
 * Envoie du texte du message d'aide (ou initial).
 */
function appMessage(eventDetail) {
    var userName = "";
    if (eventDetail !== null) {
        userName = eventDetail['user'];
    }

    var noticeText = ":AxhellMC";

    noticeText += "\nPour changer de mode : " + cb.settings.tokens_to_change + " tk.";
    if (handleSpeed) {
        noticeText += "\nPour changer de vitesse : " + cb.settings.tokens_for_speed + " tk.";
    }
    if (isMaster(eventDetail)) {
        noticeText += "\nPour changer de mode tu peux tapper : /mode ";
        if (handleSpeed) {
            noticeText += "\nPour changer de vitesse tu peux tapper : /speed ";
        }
    }
    cb.sendNotice(noticeText, userName);
}

function setMaster(userName) {
    if (masterUser !== null) {
        cb.sendNotice("Tu as perdu la maitrise. :cry", masterUser);
    }

    masterUser = userName;
    var noticeText = ":AxhellMC";
    noticeText += "\nTu as la maitrise.";
    noticeText += "\nPour changer de mode tu peux tapper : /mode ";
    if (handleSpeed) {
        noticeText += "\nPour changer de vitesse tu peux tapper : /speed ";
    }
    cb.sendNotice(noticeText, userName);
}

cb.onEnter(function (user) {
    cb.sendNotice('Bienvenue ' + user['user'], user['user']);
    appMessage(user);
});

cb.onMessage(function (message) {
    // Gestion des commande.
    if (message['m'].charAt(0) == '/')
        if (handleCommand(message)) {
            message['X-Spam'] = true;
        };
});

function handleCommand(message) {
    //turn the message into an array
    var messagePart = message['m'].split(' ');
    // general command
    switch (messagePart[0]) {
        case '/help':
            appMessage(message);
            return true;
    }
    // reserved command
    if (isMaster(message)) {
        switch (messagePart[0]) {
            case '/mode':
                changeMode();
                return true;
            case '/speed':
                if (handleSpeed)
                    changeSpeed();
                return true;
        }
    }
    // brocaster command
    if (message['user'] == cb.room_slug) {
        switch (messagePart[0]) {
            case '/master':
                setMaster(messagePart[1]);
                return true;
        }
    }

    return false;
}

function isMaster(eventDetail) {
    if (eventDetail === null)
        return false;
    if (eventDetail['user'] == cb.room_slug) {
        return true;
    }
    if (eventDetail['user'] == masterUser) {
        return true;
    }
    if (modAreMaster && eventDetail['is_mod']) {
        return true;
    }

    return false;
}

function format_username(val) {
    if (val === null) {
        return "--";
    } else {
        return val.substring(0, 12);
    }
}

function init() {
    handleSpeed = (cb.settings.handleSpeed == 'OUI');
    modAreMaster = (cb.settings.modAreMaster == 'OUI');
    appMessage(null);

}

init();

