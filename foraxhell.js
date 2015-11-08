/* global cb */

var current_mode = 1;
var current_speed = 0;
var last_tip_username = null;
var last_tip_amount = 0;


cb.settings_choices = [
    { name: 'tokens_to_change', type: 'int', minValue: 1, default: 1, label: 'Nombre de token pour changer de mode.' },
    { name: 'tokens_for_speed', type: 'int', minValue: 2, default: 100, label: 'Nombre de token pour changer de vitesse.' },
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
    if (tip['amount'] >= cb.settings.tokens_to_change && tip['amount'] <= cb.settings.tokens_for_speed ) {
        last_tip_amount = tip['amount']
        last_tip_username = tip['from_user']
        changeMode();
    } else if (tip['amount'] <= cb.settings.tokens_for_speed ) {
        last_tip_amount = tip['amount']
        last_tip_username = tip['from_user']
        changeSpeed();
    }


//    update_subject();
    cb.drawPanel();
});

cb.onDrawPanel(function (user) {
    return {
        'template': '3_rows_of_labels',
        'row1_label': 'Mode ' + current_mode,
        'row1_value': 'Vitesse  ' + current_speed,
        'row2_label': 'To change mode :',
        'row2_value': '' + cb.settings.tokens_to_change + ' tk',
        'row3_label': 'Latest Tip Received:',
        'row3_value': format_username(last_tip_username) + ' (' + last_tip_amount + ')'
    };
});

function changeMode() {
    current_mode++;
    if(current_mode > 8 ) {
        current_mode = 1;
    }
    
    cb.sendNotice("Nouveau mode : " + current_mode + " " + cb.settings["mode"+current_mode]);
}

function changeSpeed() {
    current_speed++;
    if(current_speed > 10 ) {
        current_speed = 0;
    }
    
    cb.sendNotice("Nouvelle vitesse : " + current_speed );
}

function appMessage(userName) {
    cb.sendNotice(":AxhellMC");
    cb.sendNotice("Pour changer de mode : " + cb.settings.tokens_to_change + " tk , pour changer de vitesse : " + cb.settings.tokens_for_speed  + " tk." );
}

cb.onEnter(function(user) {
    cb.sendNotice('Bienvenue ' + user['user']);
    appMessage(user['user']);
});

function format_username(val) {
    if (val === null) {
        return "--";
    } else {
        return val.substring(0, 12);
    }
}

function init() {
    appMessage("");
}

init();