/* Form validation helpers */

const REQUIRED_IN_ORDER = [
  'empName', 'doj', 'letterDate', 'jobTitle', 'department', 'annualCtc', 'noticePeriod',
];

const ONLY_NUMBERS_OR_SYMBOLS_MESSAGE =
  'This field cannot contain only numbers or only special characters — please enter a valid value.';

// Job Title and Department may mix letters, numbers and spaces ("Level 2 Support", "R&D"),
// but cannot be made up ENTIRELY of digits or ENTIRELY of special characters.
function isOnlyNumbersOrOnlySpecialChars(value) {
  const trimmed = value.trim();
  if (!trimmed) return false;
  return /^[0-9]+$/.test(trimmed) || /^[^A-Za-z0-9]+$/.test(trimmed);
}

/** Returns [fieldId, message] for the first problem, or null if the form is valid. */
export function findFirstError(form) {
  for (const id of REQUIRED_IN_ORDER) {
    const value = String(form[id] ?? '').trim();
    if (!value) return [id, 'Please fill this field'];
    if ((id === 'jobTitle' || id === 'department') && isOnlyNumbersOrOnlySpecialChars(value)) {
      return [id, ONLY_NUMBERS_OR_SYMBOLS_MESSAGE];
    }
  }
  if (!(Number(form.annualCtc) > 0)) return ['annualCtc', 'Enter an Annual CTC greater than 0'];
  return null;
}

export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
