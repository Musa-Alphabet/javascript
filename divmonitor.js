/*
This file includes the version of insertText()
for use when <div id="monitor" contentEditable>

06apr23
*/

function cursorEnd() {
   document.getElementById('monitor').focus();
   let n = document.getElementById('monitor').lastChild;
   let r = new Range();
   r.setStartAfter(n);
   let s = document.getSelection();
   s.removeAllRanges();
   s.addRange(r);
}

function insertText(letter) {
   if (letter=='')
      return;
   undoPush();
   let s = document.getSelection();
   let r = s.getRangeAt(0);
   r.deleteContents();
   let n = document.createTextNode(letter);
   r.insertNode(n);
   s.removeAllRanges();
   r = r.cloneRange();
   r.selectNode(n);
   r.collapse(false);
   s.addRange(r);
   for (let position = 0; position < letter.length - 1; position++) {
      s.modify("move", "right", "character");
   }
   document.getElementById('monitor').normalize();
   document.getElementById('monitor').focus();
}

function removePending() { // removes pending letters
   var m = document.getElementById('monitor');
   var s = m.innerHTML;
   s = s.replace(/\u200D.*\u200C/g,'');
   m.innerHTML = s;
   cursorEnd();
}
