/*
This file includes the Musa keyboards: screen and overlay
It requires either textmonitor.js or divmonitor.js

14may23
*/

var topkey = -1; // negative if waiting for top
var isNumeric = false;
var isHigh = false;
var isDigit = false;

function showTops() {
   for (let i = 0; i < 27; i++) if (i!=16) {
      let l = keyShape[i];
      if (isNumeric) {
         if (i==(isHigh?8:26))
            l = (isHigh?'\u2B12':'\u2B13');
      }
      document.getElementById('key' + i.toString()).innerHTML = l;
      document.getElementById('key' + i.toString()).style.fontSize = '36px';
   }
}

function showBottoms() {
   document.getElementById('key0').innerHTML = '\u238B';
   for (let i = 0; i < 27; i++) if (i!=16) {
      if (isShortcut(topkey, i)) {
         let hash = (100 * topkey) + i;
         let keycap = '';
         switch (hash) {
            case 1500: // line feed
               keycap = 'LF';
               break;
            case 1501: // space
               keycap = 'SP';
               break;
            case 1502: // escape
               keycap = 'ESC';
               break;
            case 1503: // tab
               keycap = 'TAB';
               break;
            case 1504: // zwnj
               keycap = 'ZWNJ';
               break;
            case 1505: // zwj
               keycap = 'ZWJ';
               break;
            case 1506:
               keycap = '123';
               break;
            default:
               // do nothing
               break;
         }
         let size = 36 / keycap.length;
         document.getElementById('key' + i.toString()).style.fontSize = size.toString() + 'px';
         document.getElementById('key' + i.toString()).innerHTML = keycap;
      }
      else {
         document.getElementById('key' + i.toString()).innerHTML = codepoint(topkey, i);
      }
   }
}

function escape() {
   topkey = -1;
   showTops();         
}

function keyed(key) {
   if (isDigit) {
      if (isHigh) {
         topkey = key;
         key = 16; // space
         isHigh = false;
      }
      else {
         topkey = 16; // space
      }
      isDigit = false;
   }
   if (topkey < 0) { // this key is a new top
      if (isNumeric) {
         switch (key) {
            case  8: isHigh = true; break;
            case 17: isNumeric = false; break;
            case 26: isHigh = false; break;
            case 25: insertText('\uE100'); break;
            default: insertText(isHigh ? codepoint(key, 16) : codepoint(16, key)); break;
         }
         showTops();         
      }
      else {
         topkey = key;
         showBottoms();
      }
   }
   else { // key is bottom
      if (isShortcut(topkey, key)) {
         let hash = (100 * topkey) + key;
         switch (hash) {
            case 1500: // line feed
               insertText('\u000A');
               break;
            case 1501: // space
               insertText('\u0020');
               break;
            case 1502: // escape
               insertText('\u001B');
               break;
            case 1503: // tab
               insertText('\u0009');
               break;
            case 1504: // zwnj
               insertText('\u200C');
               break;
            case 1505: // zwj
               insertText('\u200D');
               break;
            case 1506:
               isNumeric = true;
               isHigh = false;
               break;
            default:
               if (codepoint(topkey, key)=='') // invalid bottom
                  return;
               // do nothing
               break;
         }
         topkey = -1;
      }
      else { // not shortcut
         let c = codepoint(topkey, key);
         if (c=='') // invalid
            return;
         insertText(c);
         topkey = -1;
      }
      showTops();
   }
}

function overlay(c) {
   switch (c) {
      case 'Space':   
      case ' ':       keyed(7); break;
      case 'Comma':   
      case ',':       keyed(25); break;
      case 'Period':
      case '.':       keyed(26); break;
      case 'KeyA':    keyed(9); break;
      case 'KeyB':    keyed(22); break;
      case 'KeyC':    keyed(20); break;
      case 'KeyD':    keyed(11); break;
      case 'KeyE':    keyed(2); break;
      case 'KeyF':    keyed(12); break;
      case 'KeyG':    keyed(13); break;
      case 'KeyH':    keyed(14); break;
      case 'KeyI':    keyed(7); break;
      case 'KeyJ':    keyed(15); break;
      case 'KeyK':    keyed(16); break;
      case 'KeyL':    keyed(17); break;
      case 'KeyM':    keyed(24); break;
      case 'KeyN':    keyed(23); break;
      case 'KeyO':    keyed(8); break;
      case 'KeyQ':    keyed(0); break;
      case 'KeyR':    keyed(3); break;
      case 'KeyS':    keyed(10); break;
      case 'KeyT':    keyed(4); break;
      case 'KeyU':    keyed(6); break;
      case 'KeyV':    keyed(21); break;
      case 'KeyW':    keyed(1); break;
      case 'KeyX':    keyed(19); break;
      case 'KeyY':    keyed(5); break;
      case 'KeyZ':    keyed(18); break;
      case 'Digit0':  isDigit = true; keyed(18); break;
      case 'Digit1':  isDigit = true; keyed(0); break;
      case 'Digit2':  isDigit = true; keyed(1); break;
      case 'Digit3':  isDigit = true; keyed(2); break;
      case 'Digit4':  isDigit = true; keyed(3); break;
      case 'Digit5':  isDigit = true; keyed(4); break;
      case 'Digit6':  isDigit = true; keyed(5); break;
      case 'Digit7':  isDigit = true; keyed(19); break;
      case 'Digit8':  isDigit = true; keyed(21); break;
      case 'Digit9':  isDigit = true; keyed(20); break;
      case 'Numpad0': isDigit = true; isHigh = true; keyed(18); break;
      case 'Numpad1': isDigit = true; isHigh = true; keyed(0); break;
      case 'Numpad2': isDigit = true; isHigh = true; keyed(1); break;
      case 'Numpad3': isDigit = true; isHigh = true; keyed(2); break;
      case 'Numpad4': isDigit = true; isHigh = true; keyed(3); break;
      case 'Numpad5': isDigit = true; isHigh = true; keyed(4); break;
      case 'Numpad6': isDigit = true; isHigh = true; keyed(5); break;
      case 'Numpad7': isDigit = true; isHigh = true; keyed(19); break;
      case 'Numpad8': isDigit = true; isHigh = true; keyed(21); break;
      case 'Numpad9': isDigit = true; isHigh = true; keyed(20); break;
      case 'KeyP':
      case ';':
      case 'Semicolon':
      case '/':
      case 'Slash':
      default:
         break;
   }
}
