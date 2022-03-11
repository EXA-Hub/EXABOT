const TIME_FORMAT_ERRING = "Time format error";
const HOUR = 3600000;
const MINUTE = 60000;
const SECOND = 1000;

/*! zero-fill. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
/**
 * Given a number, return a zero-filled string.
 * From http://stackoverflow.com/questions/1267283/
 * @param  {number} width
 * @param  {number} number
 * @return {string}
 */
function zeroFill(width, number, pad) {
  if (number === undefined) {
    return function (number, pad) {
      return zeroFill(width, number, pad);
    };
  }
  if (pad === undefined) pad = "0";
  width -= number.toString().length;
  if (width > 0)
    return new Array(width + (/\./.test(number) ? 2 : 1)).join(pad) + number;
  return number + "";
}

function formatTime(time, format) {
  let showMs;
  let showSc;
  let showHr;

  switch (format.toLowerCase()) {
    case "hh:mm:ss.sss":
      showMs = true;
      showSc = true;
      showHr = true;
      break;
    case "hh:mm:ss":
      showMs = !!time.milliseconds;
      showSc = true;
      showHr = true;
      break;
    case "hh:mm":
      showMs = !!time.milliseconds;
      showSc = showMs || !!time.seconds;
      showHr = true;
      break;
    case "mm:ss":
      showMs = !!time.milliseconds;
      showSc = true;
      showHr = !!time.hours;
      break;
    case "mm:ss.sss":
      showMs = true;
      showSc = true;
      showHr = !!time.hours;
      break;
    default:
      throw new Error(TIME_FORMAT_ERRING);
  }

  let hh = zeroFill(2, time.hours);
  let mm = zeroFill(2, time.minutes);
  let ss = zeroFill(2, time.seconds);
  let sss = zeroFill(3, time.milliseconds);

  return (
    (time.negative ? "-" : "") +
    (showHr
      ? showMs
        ? `${hh}:${mm}:${ss}.${sss}`
        : showSc
        ? `${hh}:${mm}:${ss}`
        : `${hh}:${mm}`
      : showMs
      ? `${mm}:${ss}.${sss}`
      : `${mm}:${ss}`)
  );
}

function fromMs(ms, format = "mm:ss") {
  if (typeof ms !== "number" || Number.isNaN(ms)) {
    throw new Error("NaN error");
  }

  let absMs = Math.abs(ms);

  let negative = ms < 0;
  let hours = Math.floor(absMs / HOUR);
  let minutes = Math.floor((absMs % HOUR) / MINUTE);
  let seconds = Math.floor((absMs % MINUTE) / SECOND);
  let milliseconds = Math.floor(absMs % SECOND);

  return formatTime(
    {
      negative,
      hours,
      minutes,
      seconds,
      milliseconds,
    },
    format
  );
}
function fromS(s, format = "mm:ss") {
  if (typeof s !== "number" || Number.isNaN(s)) {
    throw new Error("NaN error");
  }

  let ms = s * SECOND;

  return fromMs(ms, format);
}

module.exports = { fromMs, fromS, formatTime, zeroFill };
