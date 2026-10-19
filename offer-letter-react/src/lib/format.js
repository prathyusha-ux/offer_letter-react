/* Formatting helpers */

export function formatRupees(amount) {
  return Math.round(amount).toLocaleString('en-IN');
}

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function getDaySuffix(day) {
  const isTeen = day % 100 >= 11 && day % 100 <= 13;
  if (isTeen) return 'th';
  const lastDigit = day % 10;
  if (lastDigit === 1) return 'st';
  if (lastDigit === 2) return 'nd';
  if (lastDigit === 3) return 'rd';
  return 'th';
}

/** "Aug 3rd, 2026" — used for Date of Joining */
export function formatDateMonthFirst(isoDateString) {
  if (!isoDateString) return '';
  const date = new Date(isoDateString + 'T00:00:00');
  const day = date.getDate();
  return `${MONTH_NAMES[date.getMonth()]} ${day}${getDaySuffix(day)}, ${date.getFullYear()}`;
}

/** "1st Aug, 2026" — used for the "This statement dated ..." line */
export function formatDateDayFirst(isoDateString) {
  if (!isoDateString) return '';
  const date = new Date(isoDateString + 'T00:00:00');
  const day = date.getDate();
  return `${day}${getDaySuffix(day)} ${MONTH_NAMES[date.getMonth()]}, ${date.getFullYear()}`;
}

const ONES = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
  'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

export function numberToWords(n) {
  if (n < 20) return ONES[n];
  if (n < 100) return TENS[Math.floor(n / 10)] + (n % 10 ? ` ${ONES[n % 10]}` : '');
  if (n < 1000) {
    const hundreds = Math.floor(n / 100);
    const remainder = n % 100;
    return `${ONES[hundreds]} Hundred` + (remainder ? ` ${numberToWords(remainder)}` : '');
  }
  return String(n); // fallback for 1000+, not expected for a notice period
}

/** "2 Lakh" for 200000; falls back to a plain rupee figure otherwise */
export function toLakhsPhrase(amount) {
  if (amount % 100000 === 0) return `${amount / 100000} Lakh`;
  return `₹${formatRupees(amount)}`;
}

/** "12 LPA" for 1200000, "12.5 LPA" for 1250000, "3 LPA" for 300000 */
export function toLpaPhrase(amount) {
  const lakhs = amount / 100000;
  return `${Number.isInteger(lakhs) ? lakhs : parseFloat(lakhs.toFixed(2))} LPA`;
}

/* Date helpers (local time, ISO yyyy-mm-dd) */

export function toLocalISO(d) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function addDaysISO(dateStr, days) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + days);
  return toLocalISO(dt);
}
