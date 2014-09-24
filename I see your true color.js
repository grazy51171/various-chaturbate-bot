var colors = [];
var fonts = [];
var broadcaster = cb.room_slug;

var min_level = 0.5;
var gamma = 0.1;

var available_fonts = [
   "default", "Arial, Helvetica", "Bookman Old Style",
   '"Comic Sans MS", cursive', '"Courrier New"',
   "Lucida", "Palantino", "Tahoma, Geneva",
   '"Times New Roman"'
]

var preset_colors = {
	'/red': '#FF0000',
	'/green': '#00aa00',
	'/blue': '#0000FF',
	'/pink': '#FF00FF',
	'/yellow': '#AAAA00',
	'/cyan': '#008888',
	'/purple': '#990099'
}

function to_hex(value){
   var str = value.toString(16);
   if (str.length == 1){
      str = '0' + str;
   }
   return str;
}

function html_color(r, g, b){
    return '#' + to_hex(r) + to_hex(g) + to_hex(b);
}

function hue_strength(hue){
	return Math.pow(0.5 * (1 + Math.cos(2 * Math.PI * hue / 120.)), gamma);
}

function pick_color(){
    var t = Math.random() * 360;
    var ti = Math.floor(t/60);
    var v = 255 * (min_level + (1.0-min_level) * Math.random() * hue_strength(t));
    
	var f = t/60 - ti;
	var m = Math.floor(v * (1 - f));
	var n = Math.floor(v * f);
	
    v = Math.floor(v);

	var r = 0;
	var g = 0;
	var b = 0;

	if (ti == 0){
		r = v;
		g = n;
		b = 0;
	}
	else if (ti == 1){
		r = m;
		g = v;
		b = 0;
	}
	else if (ti == 2){
		r = 0;
		g = v;
		b = n;
	}
	else if (ti == 3){
		r = 0;
		g = m;
		b = v;	
	}
	else if (ti == 4){
		r = n;
		g = 0;
		b = v;	
	}
	else if (ti == 5){
		r = v;
		g = 0;
		b = m;	
	}
	return html_color(r, g, b);
}

function get_user_color(user){
    if (typeof(colors[user]) == 'undefined'){
          set_user_color(user);
   }
    return colors[user];
}

function set_user_color(user){
    colors[user] = pick_color();
}

function get_user_font(user){
   if (typeof(fonts[user]) == 'undefined'){
          set_user_font(user);
   }
   return fonts[user];
}

function pick_font(){
	var i = Math.floor(
			Math.random()*available_fonts.length
	);
	return available_fonts[i];
}

function set_user_font(user){
    fonts[user] = pick_font();
}

cb.onMessage(function (msg){
     var user = msg["user"];
	 if (
			( (user in colors) || (msg["c"] == "#494949") ) &&
			( (user in fonts)  || (msg["f"] == "default") )
	  ){
		msg["c"] = get_user_color(user);
		msg["f"] = get_user_font(user);
	 }
     if (msg["m"] == "/color"){
		 set_user_color(user);
         msg["c"] = get_user_color(user);
         msg["X-Spam"] = true; 
     }
     else if (msg["m"] == "/font"){
		 set_user_font(user);
         msg["f"] = get_user_font(user);
         msg["X-Spam"] = true; 
     } else if (msg["m"][0] = "/"){
		for (var color in preset_colors){
			if (msg.m == color) {
                                colors[msg.user] = preset_colors[color];
				msg.c = get_user_color(user);
				msg["X-Spam"] = true;
			}
		}
    }
    return msg;
});

