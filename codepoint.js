/* 

Javascript support for Musa Keyboard
------------------------------------
13 May 2023
©2023 The Musa Academy

This file contains the function that converts keypresses into Musa letters,
and other information related to the standard Musa keyboard

*/

// for each Falcon key 0-39, this array returns the standard key
const keyFalcon = [
   24,  8, 17, 26,  7, 10, 19,  3,  0,  6, 12, 21,  4,  1, 18, 23, 20,  5,  2, 25,
   15,  8, 17, 26, 16, 10, 10, 12,  9,  6, 12, 12, 13, 10, 22, 14, 11, 14, 11, 25
];

// for each key 0-26, this array returns the Roman name of the shape, or ''
const keyName = [
   'Wi', 'Si', 'Ti', 'Ki', 'Pi', 'Ni', 'Ri', 'Ya', 'Fi', 
   'Wa', 'Sa', 'Ta', 'Ka', 'Pa', 'Na', 'Ma', 'Ya', 'Fa', 
   'Lu', 'Su', 'Tu', 'Ku', 'Pu', 'Nu', 'Mu', 'Yu', 'Fu'
];

// for each key 0-26, this array returns the keycap shape
const keyShape = [
   '\uE031', '\uE032', '\uE033', '\uE034', '\uE035', '\uE036', '\uE03A', '\uE021', '\uE022',
   '\uE02E', '\uE02D', '\uE02C', '\uE02B', '\uE02A', '\uE029', '\uE02F', '\uE021', '\uE023',
   '\uE030', '\uE037', '\uE039', '\uE038', '\uE028', '\uE026', '\uE027', '\uE025', '\uE024'
];

// for each key 0-26, this array returns the key color
const keyColor = [
   '#FF80AA', '#FFAA80', '#FFFF80', '#AAFF80', '#80FFAA', '#80FFFF', '#C0C0C0', '#808080', '#808080',
   '#800000', '#805500', '#558000', '#008000', '#008055', '#005580', '#000000', '#808080', '#808080',
   '#FFFFFF', '#80AAFF', '#FF80FF', '#AA80FF', '#000080', '#800055', '#550080', '#404040', '#808080'
];

// for each key 0-26, this array returns the accent number (0-3), or -1
const keyAccent = [
   -1, -1, -1, -1, -1, -1, -1,  0,  1,
   -1, -1, -1, -1, -1, -1, -1,  0,  2, 
   -1, -1, -1, -1, -1, -1, -1, -1,  3
];

// for each key 0-26, this array returns the vowel number (E050 = 0), or -1
const keyVowel = [
   12, 13, 14, 15, 16, 17, 21, -1, -1,
    9,  8,  7,  6,  5,  4, 10, -1, -1,
   11, 18, 20, 19,  3,  1,  2,  0, -1
];

// for each key // for each key 
const keyConsonant = [
   0x6, 0x7, 0x8, 0x9, 0xA, 0xB, 0xF,  -1, -1, 
    -1, 0x4,  -1, 0x3,  -1,  -1,  -1,  -1, -1,
   0x5, 0xC, 0xE, 0xD,  -1, 0x1, 0x2, 0x0, -1
];

// for each key 0-26, this array returns the extended number, or -1
const keyExtended = [
   -1, -1, -1, -1, -1, -1, -1, -1, -1,
   -1, -1,  0, -1,  2,  1, -1, -1, -1,
   -1, -1, -1, -1,  3, -1, -1, -1, -1
];

// this array contains all the INVALID letters in the E1xx unicode-range
const invalidLetter = [
   '\uE111', '\uE114', '\uE115', '\uE117', '\uE11B', '\uE11D', '\uE11E', '\uE11F', 
   '\uE121', '\uE122', '\uE123', '\uE126', '\uE129', '\uE12A', '\uE12B', '\uE12C', '\uE12D', '\uE12E', '\uE12F', 
   '\uE131', '\uE13D', '\uE13E', 
   '\uE141', '\uE142', '\uE14D', '\uE14F', 
   '\uE151', '\uE152', '\uE156', '\uE158', '\uE159', '\uE15B', '\uE15D', '\uE15E', '\uE15F', 
   '\uE161', '\uE162', '\uE166', '\uE16D', '\uE16E', 
   '\uE171', '\uE172', '\uE178', '\uE17D', '\uE17F', 
   '\uE181', '\uE186', '\uE18D', '\uE18E', 
   '\uE191', '\uE192', '\uE194', '\uE195', '\uE196', '\uE197', '\uE19A', '\uE19C', '\uE19D', '\uE19E', 
   '\uE1A1', '\uE1A2', '\uE1A8', '\uE1A9', '\uE1AD', 
   '\uE1B1', '\uE1B2', '\uE1B4', '\uE1B5', '\uE1B6', '\uE1B7', '\uE1B9', '\uE1BB', '\uE1BD', '\uE1BE', '\uE1BF', 
   '\uE1C1', '\uE1C2', '\uE1CD', '\uE1CF', 
   '\uE1D1', '\uE1D2', '\uE1D6', '\uE1DD', '\uE1DE', 
   '\uE1E1', '\uE1ED', 
   '\uE1F1', '\uE1F2', '\uE1F3', '\uE1FA', '\uE1FB', '\uE1FD'
];

var isHentrax = false;

function isShortcut(t, b) {
   // Wa=9 and Ma=15 are neither accents, consonants, nor extended
   if (keyAccent[t] < 0 && keyAccent[b] < 0)
      if (keyConsonant[t] < 0 && keyExtended[t] < 0 ||
          keyConsonant[b] < 0 && keyExtended[b] < 0 )
         return true;
   return false;
}

function codepoint(t, b) { // returns codepoint spelled by keypair
   if (isShortcut(t, b))
      return '';
   if (keyAccent[t] < 0) {
      if (keyAccent[b] < 0) {  // consonant
         if (keyExtended[t] > -1 || keyExtended[b] > -1) { // extended
            if (isHentrax) {
               if (keyExtended[t] > -1) {
                  if (keyExtended[b] > -1)
                     return String.fromCodePoint(0xE280 + 
                        (0x04 * keyExtended[t]) + keyExtended[b]);
                  else
                     return String.fromCodePoint(0xE200 + 
                        (0x10 * keyExtended[t]) + keyExtended[b]); 
               }
               else
                  return String.fromCodePoint(0xE240 + 
                     (0x10 * keyExtended[b]) + keyExtended[t]); 
            }
            else
               return '';  // extensions not active
         }
         let c = String.fromCodePoint(0xE100 + (0x10 * keyConsonant[t]) + keyConsonant[b]); 
         if (isHentrax) // if Hentrax, don't check for invalid
            return c;
         if (invalidLetter.includes(c)) // invalid consonant
            return '';
         return c;
      }
      else { // high vowel
         return String.fromCodePoint(0xE050 + (0x8 * keyVowel[t]) + keyAccent[b]);
      }
   }
   else {
      if (keyAccent[b] < 0)  // low vowel
         return String.fromCodePoint(0xE054 + (0x8 * keyVowel[b]) + keyAccent[t]);
      else // punctuation
         return String.fromCodePoint(0xE040 + (0x4 * keyAccent[t]) + keyAccent[b]);
   }
}

