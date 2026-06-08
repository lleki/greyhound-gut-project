function guessYear(digit) {
  const d = parseInt(digit, 10);
  const currentYear = new Date().getFullYear();
  const candidate1 = 2010 + d;
  const candidate2 = 2020 + d;
  if (candidate2 <= currentYear) return candidate2;
  if (candidate1 <= currentYear) return candidate1;
  return candidate1;
}

export function parseEarmark(raw) {
  const cleaned = raw.trim().toUpperCase().replace(/[^A-Z0-9-]/g, "");
  const parts = cleaned.split("-");
  if (parts.length !== 2) return null;

  // Accept either orientation — NGA standard has right ear (MYO) on the left
  let litter, rightEar;
  if (/^\d{5}$/.test(parts[0])) {
    litter = parts[0];
    rightEar = parts[1];
  } else if (/^\d{5}$/.test(parts[1])) {
    litter = parts[1];
    rightEar = parts[0];
  } else {
    return null;
  }

  // Right ear: ends in a letter, preceded by 2-3 digits (month + year digit)
  const reMatch = rightEar.match(/^(\d{1,2})(\d)([A-Z])$/);
  if (!reMatch) return null;

  const month = parseInt(reMatch[1], 10);
  const yearDigit = reMatch[2];
  const orderLetter = reMatch[3];

  if (month < 1 || month > 12) return null;

  const year = guessYear(yearDigit);
  const monthName = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ][month - 1];

  return { litter, month, monthName, year, yearDigit, orderLetter, raw: cleaned };
}
