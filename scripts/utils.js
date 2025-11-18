function getCharFromCode(keyCode) {
	var key;
	switch(keyCode) {
		case 8:
			key = 'Backspace'
			break;
		case 12:
			key = '5 (NumPad)';
			break;
		case 13:
			key = 'Enter';
			break;
		case 16:
			key = 'Shift';
			break;
		case 19:
			key = 'Pause';
			break;
		case 32:
			key = 'Space';
			break;
		case 37:
			key = 'Left';
			break;
		case 38: 
			key = 'Up';
			break;
		case 39: 
			key = 'Right';
			break;
		case 40:
			key = 'Down';
			break;
		case 33:
			key = 'Page Up';
			break;
		case 34:
			key = 'Page Down';
			break;
		case 35:
			key = 'End';
			break;
		case 36:
			key = 'Home';
			break;
		case 44:
			key = 'Print Screen';
			break;
		case 45:
			key = 'Insert';
			break;
		case 46:
			key = 'Delete';
			break;
		case 106:
			key = '* (NumPad)';
			break;
		case 107:
			key = '+ (NumPad)';
			break;
		case 109:
			key = '- (NumPad)';
			break;
		case 111:
			key = '/ (NumPad)';
			break;
		case 112:
			key = 'F1';
			break;
		case 113:
			key = 'F2';
			break;
		case 114:
			key = 'F3';
			break;
		case 115:
			key = 'F4';
			break;
		case 116:
			key = 'F5';
			break;
		case 117:
			key = 'F6';
			break;
		case 118:
			key = 'F7';
			break;
		case 119:
			key = 'F8';
			break;
		case 120:
			key = 'F9';
			break;
		case 121:
			key = 'F10';
			break;
		case 122:
			key = 'F11';
			break;
		case 123:
			key = 'F12';
			break;
		case 175:
			key = 'Volume';
			break;
		case 186:
			key = ';';
			break;
		case 187:
			key = '=';
			break;
		case 188:
			key = ',';
			break;
		case 189:
			key = '-';
			break;
		case 190:
			key = '.';
			break;
		case 191:
			key = '/';
			break;
		case 192:
			key = '\`';
			break;
		case 219:
			key = '[';
			break;
		case 220:
			key = '\\';
			break;
		case 221:
			key = ']';
			break;
		case 222:
			key = '\'';
			break;
		default:
			key = String.fromCharCode(keyCode);
			break;
	}
	return key;
}