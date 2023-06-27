/* 

Javascript support for Janus numbers
------------------------------------
10 June 2022
© 2002-2022 The Musa Academy

Janus is a balanced dozenal number system written in Musa (www.musa.bet).  It uses 13 digits from -6
to +6, including 0, and a vertical line called the Break as punctuation.  It doesn't use the Musa -0.
The digits may be low (normal), high, or shapes (double size).
Digits are replaced by a special "repeater" digit when they follow the same digit.

Here are the Unicodes (low, high. shape):
+0 uE0AC uE0A8	uE030
+1 uE0B4 uE0B0	uE031	         -1 uE09C uE098 uE02E
+2 uE0BC uE0B8	uE032          -2 uE094 uE090 uE02D
+3 uE0C4 uE0C0	uE033          -3 uE08C uE088 uE02C
+4 uE0CC uE0C8	uE034          -4 uE084 uE080 uE02B
+5 uE0D4 uE0D0	uE035          -5 uE07C uE078 uE02A
+6 uE0DC uE0D8	uE036          -6 uE074 uE070 uE029
Rp	uE0FC uE0F8 uE03A          Bk uE100 uE100 uE025

*/

const digits = "\uE074\uE07C\uE084\uE08C\uE094\uE09C\uE0AC\uE0B4\uE0BC\uE0C4\uE0CC\uE0D4\uE0DC";
const highdigits = "\uE070\uE078\uE080\uE088\uE090\uE098\uE0A8\uE0B0\uE0B8\uE0C0\uE0C8\uE0D0\uE0D8";
const complements = "\uE0DC\uE0D4\uE0CC\uE0C4\uE0BC\uE0B4\uE0AC\uE09C\uE094\uE08C\uE084\uE07C\uE074";
const repeater = "\uE0FC";
const bk = "\uE100";

function complement(janum) { // returns complement of low Janus number
	var result = "";
	for (var i = 0; i < janum.length; i++) {
		result += complements.charAt(digits.indexOf(janum.charAt(i)));
	}
	return result;
}

function raise(janum) { // returns Janus number with high digits
	var result = "";
	for (var i = 0; i < janum.length; i++) {
		result += highdigits.charAt(digits.indexOf(janum.charAt(i)));
	}
	return result;
}

function lower(janum) { // returns Janus number with low digits
	var result = "";
	for (var i = 0; i < janum.length; i++) {
		result += digits.charAt(highdigits.indexOf(janum.charAt(i)));
	}
	return result;
}

function repeatered(janum) { // adds low repeaters
	var result = janum.charAt(0);
	for (var i = 1; i < janum.length; i++) { // skip first digit
		if (janum.charAt(i)==janum.charAt(i-1))
			result += repeater;
		else
			result += janum.charAt(i);
	}
	return result;
}

function unrepeat(janum) { // removes low repeaters
	var result = janum.charAt(0);
	for (var i = 1; i < janum.length; i++) { // skip first digit
		if (janum.charAt(i)==repeater) {
			result += janum.charAt(i-1);
		}
		else
			result += janum.charAt(i);
	}
	return result;
}

function javal(janum) { // returns value of Janus number
	var result = 0;
	var jadit = "";
	var uncials = janum.indexOf(bk);
	if (uncials > -1) {
		janum = janum.substring(0, uncials) + janum.substring(uncials+1);
		uncials = janum.length - uncials;
	}
	for (var i = 0; i < janum.length; i++) {
		result *= 12;
		jadit = janum.charAt(i);
		if (jadit==repeater)
			result += digits.indexOf(janum.charAt(i-1)) - 6;
		else if (digits.indexOf(jadit)!=-1)
			result += digits.indexOf(jadit) - 6;		
		else // bad digit, second Break
			result += 0;
	}
	for (i = 0; i < uncials; i++)
		result /= 12;
	return result;
}

function janusInt(number) { // returns Janus integer
	if (number==0)
		return digits.charAt(6); // zero
	number = Math.round(number);
	var isneg = (number < 0);
	if (isneg)
		number = number * -1; // easier to work with positive numbers, then complement
	var result = "";
	var remainder = 0;
	while (number!=0) {
		remainder = number % 12;
		number = (number - remainder) / 12;
		if (remainder > 6) { // digit is -6 through -1
			result = digits.charAt(remainder - 6) + result;
			number += 1;
		}
		else { // digit is 0-6
			result = digits.charAt(remainder + 6) + result;
			if (number%12==6) { // preceding digit is 6
				result = digits.charAt(0) + result;
				number = 1 + (number - 6) / 12;
			}
		}
	}
	if (isneg)
		result = complement(result);
	return repeatered(result);
}

function janusReal(number, places) { // returns Janus spelling of real number to specified places
	// places 0 means max 6, but with no trailing zeroes
	if (typeof places === "undefined")
		places = 0;
	var isneg = (number < 0);
	if (isneg)
		number = number * -1; // easier to work with positive numbers, then complement
	var magnitude = 0;
	var exponent = "";
	var mantissa = "";
	while (number > 6) {
		number /= 12;
		magnitude++;
	}
	while (number < 0.5) {
		number *= 12;
		magnitude--;
	}
	if (places<=0) {
		mantissa = janusInt(Math.round((number * Math.pow(12, 5))));  // no more than 6 places
		var zeroes = /[\uE0AC\uE0A8\uE030]/;
		while (zeroes.test(mantissa.slice(-1)))
			mantissa = mantissa.slice(0, -1);
	}
	else
		mantissa = janusInt(Math.round((number * Math.pow(12, places-1))));
	exponent = janusInt(magnitude);
	if (isneg)
		mantissa = complement(mantissa);
	return (raise(exponent) + bk + mantissa);
}

