/* Title: "Rotating Notifier" bot
    Author: badbadbubba + me
    Version: 1.0.3 (04/11/2015)

    A simple rotating notifier bot.  Only options are to set color and display interval.  Messages are rotated in
    sequence.  Message 1 will also be displayed on room entry privately.
    V1.0.1 - Removed unnecessary check for valid first messages
    V1.0.2 - Increase messages to 5
    V1.0.3 - Added option to display msg1 on room entry      
*/

var i=1;

cb.settings_choices = [
    {name: 'msgonentry', type: 'choice', choice1: 'yes', choice2: 'no', defaultValue: 'yes', label: "Display Message 1 privately on entry - set to no for busy rooms"},
    {name:'msg1', type:'str', required: false, label:'Message 1',},
    {name:'msg2', type:'str', required: false, label:'Message 2',},
    {name:'msg3', type:'str', required: false, label:'Message 3',},
    {name:'msg4', type:'str', required: false, label:'Message 4',},
    {name:'msg5', type:'str', required: false, label:'Message 5',},
    {name:'msgcolor', type:'str', label:'Notice color (html code default dark red #9F000F)', defaultValue: '#9F000F'},
    {name:'msgback', type:'str', label:'Notice back color (html code default white #9F000F)', defaultValue: '#FFFFFF'},
    {name: 'chat_ad', type:'int', minValue: 1, maxValue: 999, defaultValue: 2,
        label: 'Delay in minutes between notices being displayed (minimum 1)'},
{
    name: 'tipamount',
    type: 'int',
    minValue: 1,
    defaultValue: 1,
    label: 'Minimum tokens required for a thank you message'
}
,
{
    name: 'tipmsg',
    type: 'str',
    minLength: 8,
    maxLength: 128,
    defaultValue: '****  Thank you [tipper] for your tip!!! (: **** ',
    label: "Tip thank you message, [tipper] = tipper's name"
},

{
    name: 'tipamount1',
    type: 'int',
    minValue: 10,
    defaultValue: 10,
    label: 'Minimum tokens required for a thank you message 2'
}
,
{
    name: 'tipmsg1',
    type: 'str',
    minLength: 8,
    maxLength: 128,
    defaultValue: '****  Thank you [tipper] for your tip!!!   !!!! **** ',
    label: "Tip thank you message 2 , [tipper] = tipper's name"
}
];

cb.onEnter(function(user) {
    if (cb.settings['msgonentry'] == 'yes') {
        cb.sendNotice('Bienvenue ' + user['user'] + '! ' + cb.settings['msg1'],user['user'],cb.settings['msgback'],cb.settings['msgcolor'],'bold');
    }
});

function chatAd() {
    var msg;
    
        while (cb.settings['msg' + i] == 0) {      //skip empty messages
        i++;
            if (i > 5) {                           //loop back to first message   
                i=1;
            }
        }
        
        msg = cb.settings['msg' + i];
        i++;
        
        if (i > 5) {                           //loop back to first message   
           i=1;
        }
           
        cb.sendNotice(msg,'',cb.settings['msgback'],cb.settings['msgcolor'],'bold');
        cb.setTimeout(chatAd, (cb.settings.chat_ad * 60000));
}
cb.setTimeout(chatAd, (cb.settings.chat_ad * 60000));

cb.onTip(function (tip)
{
    if (parseInt(tip['amount']) >= cb.settings.tipamount1)
    {
        tipper = tip['from_user'];
        tipmsg=cb.settings.tipmsg1;
        tipmsg = tipmsg.replace("[tipper]", tipper);
    cb.sendNotice(tipmsg,'',cb.settings['msgback'],cb.settings['msgcolor'],'bold');

    } else
    if (parseInt(tip['amount']) >= cb.settings.tipamount)
    {
        tipper = tip['from_user'];
        tipmsg=cb.settings.tipmsg;
        tipmsg = tipmsg.replace("[tipper]", tipper);
    cb.sendNotice(tipmsg,'',cb.settings['msgback'],cb.settings['msgcolor'],'bold');

    }
});


function init()
{

}

init();