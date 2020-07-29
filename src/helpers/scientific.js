/**
 * Takes a number and converts it to significand and order of magnitude, where the order
 * of magnitude corresponds to one of the canonical SI prefixes. For example:
 * 123456 -> [123.456, 3] (123.456 kilo-)
 * 1234567 -> [1.234567, 6] (1.234567 Mega-)
 * 0.000000123456 -> [123.456, -9] (123.456 nano-)
 * The magnitude will not exceed 24 (yotta) or be less than -24 (yocto)
 * @param value - any real number
 * @returns {*[]} [significand, order of magnitude]
 */
function numToScientific(value) {
  let tmp_val = value;
  let magnitude = 0;
  if (Math.abs(tmp_val) > 1) {
    while (Math.abs(tmp_val) / 1000 > 1 && magnitude <= 24) {
      tmp_val /= 1000;
      magnitude += 3;
    }
  } else {
    while (Math.abs(tmp_val) * 1000 < 1000 && magnitude >= -24) {
      tmp_val *= 1000;
      magnitude -= 3;
    }
  }
  return [tmp_val, magnitude];
}

export default {
  numToScientific
};
