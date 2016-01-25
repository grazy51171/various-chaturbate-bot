/* Title: "Rotating Notifier" bot modified to ass thanks
    Author : grazy
    
    Base on : 
    Author: badbadbubba
    Version: 1.0.3 (04/11/2015)

    A simple rotating notifier bot.  Only options are to set color and display interval.  Messages are rotated in
    sequence.  Message 1 will also be displayed on room entry privately.
    Thanks on tip (two level of message possible).
    
*/

var i=1;

cb.settings_choices = [
    {name: 'msgonentry', type: 'choice', choice1: 'yes', choice2: 'no', defaultValue: 'yes', label: "Display Message entry privately on entry - set to no for busy rooms"},
    {name:'msgentry', type:'str', required: false, label:'Message entry (use \\n for multi line)',},
    {name:'msg1', type:'str', required: false, label:'Message 1',},
    {name:'msg2', type:'str', required: false, label:'Message 2',},
    {name:'msg3', type:'str', required: false, label:'Message 3',},
    {name:'msg4', type:'str', required: false, label:'Message 4',},
    {name:'msg5', type:'str', required: false, label:'Message 5',},
    {name:'msgcolor', type:'str', label:'Notice color (html code default dark red #9F000F)', defaultValue: '#9F000F'},
    {name:'msgback', type:'str', label:'Notice back color (html code default white #9F000F)', defaultValue: '#FFFFFF'},
    {name: 'chat_ad', type:'int', minValue: 1, maxValue: 999, defaultValue: 2,
        label: 'Delay in minutes between notices being displayed (minimum 1)'},
    {name: 'tipamount', type: 'int', minValue: 1, defaultValue: 1, 
        label: 'Minimum tokens required for a thank you message'},
    {name: 'tipmsg', type: 'str', minLength: 8, maxLength: 128,  
        defaultValue: '****  Thank you [tipper] for your tip!!! (: **** ',
        label: "Tip thank you message, [tipper] = tipper's name" },
    {name: 'tipamount1', type: 'int', minValue: 10, defaultValue: 10, 
        label: 'Minimum tokens required for a thank you message 2'},
    {name: 'tipmsg1', type: 'str', minLength: 8, maxLength: 128,
        defaultValue: '****  Thank you [tipper] for your tip!!!   !!!! **** ',
        label: "Tip thank you message 2 , [tipper] = tipper's name"}
        ];

function sendMessage(message, user) {
    cb.sendNotice(message, user, cb.settings['msgback'], cb.settings['msgcolor'], 'bold');
}

cb.onEnter(function (user) {
    if (cb.settings['msgonentry'] == 'yes') {
        sendMessage('Bienvenue ' + user['user'] + '! \n ' + cb.settings['msgentry'], user['user'])
    }

    if (user['user'] == 'grazy') {
        // just for fun 
        sendMessage('Bienvenue Grazy. :robot1 Ton bot te salue, maitre.','')
    }
});

function chatAd() {
    var msg;

    while (cb.settings['msg' + i] == 0) {      //skip empty messages
        i++;
        if (i > 5) {                           //loop back to first message   
            i = 1;
        }
    }

    msg = cb.settings['msg' + i];
    i++;

    if (i > 5) {                           //loop back to first message   
        i = 1;
    }

    sendMessage(msg, '');
    cb.setTimeout(chatAd, (cb.settings.chat_ad * 60000));
}

cb.setTimeout(chatAd, (cb.settings.chat_ad * 60000));

cb.onTip(function (tip) {
    var tipper = tip['from_user'];
    var tipmsg;
    // remove tip for me for small tip
    if(parseInt(tip['amount']) < 5 && tipper == 'grazy' )
         return;
    if (parseInt(tip['amount']) >= cb.settings.tipamount1) {
        tipmsg = cb.settings.tipmsg1;
        tipmsg = tipmsg.replace("[tipper]", tipper);
        sendMessage(tipmsg, '');
    } else if (parseInt(tip['amount']) >= cb.settings.tipamount) {
        tipmsg = cb.settings.tipmsg;
        tipmsg = tipmsg.replace("[tipper]", tipper);
        sendMessage(tipmsg, '');
    }
});


function init()
{

}

init();