/* Backend calls (Render). Configure via VITE_API_BASE / VITE_API_KEY. */

const API_BASE = import.meta.env.VITE_API_BASE || 'https://offer-letter-ux.onrender.com';
const API_KEY = import.meta.env.VITE_API_KEY || '';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { 'x-api-key': API_KEY, ...(options.headers || {}) },
  });
  let result = {};
  try {
    result = await response.json();
  } catch {
    // non-JSON response — fall through to the status check below
  }
  if (!response.ok) {
    throw new Error(result.error || `Request failed (${response.status})`);
  }
  return result;
}

export const sendOffer = (formData) => request('/api/send-offer', { method: 'POST', body: formData });
export const saveOffer = (formData) => request('/api/save-offer', { method: 'POST', body: formData });
export const searchOffers = (name) => request(`/api/search-offers?name=${encodeURIComponent(name)}`);

/** Fields logged to the offer_sends table, taken from the letter that was actually generated. */
export function appendOfferSendFields(formData, values, salary) {
  formData.append('letterDate', values.letterDate);
  formData.append('department', values.department);
  formData.append('workLocation', values.workLocation);
  formData.append('roleDescription', values.roleDesc);
  formData.append('annualCtc', String(values.annualCtc));
  formData.append('noticePeriodDays', String(values.noticePeriodDays));
  formData.append('includeBond', String(values.includeBond));
  formData.append('bondYears', String(values.bondYears));
  formData.append('bondAmount', String(values.bondAmount));
  formData.append('pfIncluded', String(salary.pfIncluded));
  formData.append('employeePf', String(salary.employeePf));
  formData.append('employerPf', String(salary.employerPf));
  formData.append('variablePayIncluded', String(salary.variableIncluded));
  formData.append('variablePayAmount', String(salary.variableAmount));
  formData.append('tdsIncluded', String(salary.tdsIncluded));
  formData.append('tdsAmount', String(salary.tdsAmount));
}
