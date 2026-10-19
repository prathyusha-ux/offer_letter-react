import { useEffect, useMemo, useRef, useState } from 'react';
import SearchHeader from './components/SearchHeader.jsx';
import OfferForm from './components/OfferForm.jsx';
import Letter from './components/Letter.jsx';
import { calculateSalaryBreakdown } from './lib/salary.js';
import { addDaysISO, formatDateMonthFirst, toLocalISO } from './lib/format.js';
import { findFirstError, isValidEmail } from './lib/validate.js';
import { appendOfferSendFields, saveOffer, sendOffer } from './lib/api.js';
import { buildLetterPdfBlob, downloadLetterPdf } from './lib/pdf.js';

const todayISO = toLocalISO(new Date());

const initialForm = () => ({
  empName: '',
  doj: addDaysISO(todayISO, 1),
  letterDate: todayISO,
  jobTitle: '',
  department: '',
  roleDesc: '',
  workLocation: 'Hyderabad Corporate Office - WFH',
  customLocation: '',
  annualCtc: '',
  noticePeriod: '90',
  variablePay: 'no',
  variablePayAmount: '',
  pf: 'yes',
  tds: 'no',
  tdsAmount: '',
  includeBond: false,
  bondYears: '1',
  bondAmount: '',
});

/* Input restrictions, applied as the user types */
const digitsOnly = (v) => v.replace(/[^0-9]/g, '');
const lettersOnly = (v) => v.replace(/[^A-Za-z\s]/g, '');
const SANITIZERS = {
  // "john doe" -> "John Doe"
  empName: (v) => lettersOnly(v).replace(/(^|\s)([a-z])/g, (m, boundary, letter) => boundary + letter.toUpperCase()),
  customLocation: lettersOnly,
  annualCtc: digitsOnly,
  noticePeriod: digitsOnly,
  variablePayAmount: digitsOnly,
  tdsAmount: digitsOnly,
  bondYears: digitsOnly,
  bondAmount: digitsOnly,
};

function toSalaryInput(form) {
  return {
    annualCtc: Number(form.annualCtc) || 0,
    doj: form.doj,
    pfIncluded: form.pf === 'yes',
    variableIncluded: form.variablePay === 'yes',
    variableAmount: Number(form.variablePayAmount) || 0,
    tdsIncluded: form.tds === 'yes',
    tdsAmount: Number(form.tdsAmount) || 0,
  };
}

function toLetterValues(form) {
  const parsedNotice = parseInt(form.noticePeriod, 10);
  return {
    name: form.empName.trim(),
    doj: form.doj,
    letterDate: form.letterDate,
    jobTitle: form.jobTitle.trim(),
    department: form.department.trim(),
    workLocation: form.workLocation === '__custom' ? form.customLocation.trim() : form.workLocation,
    roleDesc: form.roleDesc.trim(),
    annualCtc: Number(form.annualCtc) || 0,
    noticePeriodDays: Number.isNaN(parsedNotice) ? 90 : parsedNotice,
    includeBond: form.includeBond,
    bondYears: parseInt(form.bondYears, 10) || 1,
    bondAmount: parseFloat(form.bondAmount) || 0,
  };
}

export default function App() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [letter, setLetter] = useState(null); // { values, salary } snapshot taken on Generate
  const [generation, setGeneration] = useState(0);
  const [status, setStatus] = useState('');
  const [editing, setEditing] = useState(false);
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState({ pdf: false, email: false });

  const letterRef = useRef(null);
  const savedGeneration = useRef(0);

  // Live figures for the read-only PF fields
  const previewSalary = useMemo(() => calculateSalaryBreakdown(toSalaryInput(form)), [form]);

  const getPageEls = () => Array.from(letterRef.current?.querySelectorAll('.page') ?? []);

  function setField(name, raw) {
    const value = SANITIZERS[name] ? SANITIZERS[name](raw) : raw;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => (current[name] ? { ...current, [name]: '' } : current));
  }

  function handleGenerate() {
    const problem = findFirstError(form);
    if (problem) {
      const [fieldId, message] = problem;
      setErrors({ [fieldId]: message });
      document.getElementById(fieldId)?.focus();
      return;
    }
    setErrors({});
    setLetter({ values: toLetterValues(form), salary: calculateSalaryBreakdown(toSalaryInput(form)) });
    setEditing(false);
    setStatus('Generated ✓ — saving...');
    setGeneration((g) => g + 1);
  }

  // Auto-save right after each Generate, once the letter pages are in the DOM.
  useEffect(() => {
    if (generation === 0 || savedGeneration.current === generation || !letter) return;
    savedGeneration.current = generation;

    (async () => {
      try {
        const { values, salary } = letter;
        const pdfBlob = await buildLetterPdfBlob(getPageEls());
        const formData = new FormData();
        formData.append('candidateName', values.name || 'Candidate');
        formData.append('jobTitle', values.jobTitle || 'the offered role');
        if (email.trim()) formData.append('recipientEmail', email.trim());
        if (values.doj) formData.append('doj', values.doj);
        appendOfferSendFields(formData, values, salary);
        formData.append('pdf', pdfBlob, `${values.name.replace(/\s+/g, '_')}_Offer_Letter.pdf`);
        const result = await saveOffer(formData);
        // The server answers 200 with a `warning` when the PDF uploaded but the
        // offer_sends row could not be written (e.g. a missing column).
        setStatus(result.warning ? `Generated ✓ — ${result.warning}` : 'Generated ✓ — saved');
      } catch (err) {
        console.error('Auto-save failed:', err);
        setStatus('Generated ✓ — save failed (see console)');
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generation]);

  async function handlePrint() {
    if (!letter) return alert('Generate the offer letter first.');
    setBusy((b) => ({ ...b, pdf: true }));
    try {
      const fileName = `${(letter.values.name || 'Offer_Letter').replace(/\s+/g, '_')}_Offer_Letter.pdf`;
      await downloadLetterPdf(getPageEls(), fileName);
    } catch (err) {
      console.error('PDF generation failed:', err);
      alert(`Something went wrong generating the PDF.\n\nDetails: ${err?.message ?? err}`);
    } finally {
      setBusy((b) => ({ ...b, pdf: false }));
    }
  }

  async function handleEmail() {
    if (!letter) return alert('Generate the offer letter first.');
    const recipient = email.trim();
    if (!isValidEmail(recipient)) {
      alert('Enter a valid recipient email address.');
      document.getElementById('emailInput')?.focus();
      return;
    }
    const { values } = letter;
    setBusy((b) => ({ ...b, email: true }));
    try {
      const pdfBlob = await buildLetterPdfBlob(getPageEls());
      const formData = new FormData();
      formData.append('recipient', recipient);
      formData.append('candidateName', values.name || 'Candidate');
      formData.append('jobTitle', values.jobTitle || 'the offered role');
      formData.append('dojDisplay', formatDateMonthFirst(values.doj));
      formData.append('workLocation', values.workLocation);
      formData.append('pdf', pdfBlob, `${values.name.replace(/\s+/g, '_')}_Offer_Letter.pdf`);
      await sendOffer(formData);
      alert(`Offer letter sent to ${recipient}.`);
    } catch (err) {
      console.error('Email send failed:', err);
      alert(`Could not send the email.\n\nDetails: ${err?.message ?? err}`);
    } finally {
      setBusy((b) => ({ ...b, email: false }));
    }
  }

  return (
    <>
      <SearchHeader />

      <OfferForm form={form} errors={errors} onChange={setField} pf={previewSalary}>
        <div className="button-row">
          <button type="button" className="btn-primary btn-wide" onClick={handleGenerate}>
            Generate Offer Letter
          </button>
        </div>

        <div className="secondary-buttons">
          <button type="button" onClick={handlePrint} disabled={busy.pdf}>
            {busy.pdf ? 'Preparing PDF...' : 'Download as PDF'}
          </button>
          <button
            id="editBtn"
            type="button"
            className={`icon-btn${editing ? ' active' : ''}`}
            onClick={() => setEditing((e) => !e)}
            disabled={!letter}
          >
            {editing ? '✓ Done Editing' : '✎ Edit Letter'}
          </button>
        </div>

        <div className="email-row">
          <input
            id="emailInput"
            type="email"
            placeholder="Recipient's email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button id="emailBtn" type="button" className="icon-btn" onClick={handleEmail} disabled={!letter || busy.email}>
            {busy.email ? 'Sending...' : '✉ Email Offer Letter'}
          </button>
        </div>
      </OfferForm>

      <p id="previewStatus">{status}</p>
      {!letter && (
        <p id="letterEmpty">No letter generated yet. Fill in the form and click "Generate Offer Letter".</p>
      )}
      <p id="editHint" className={editing ? 'show' : ''}>
        Editing on — click directly into the letter text to make changes, then click "Done Editing" to lock them in.
      </p>

      <div id="letterOutput" ref={letterRef} className={`${letter ? 'show' : ''}${editing ? ' editing' : ''}`}>
        {letter && <Letter values={letter.values} salary={letter.salary} editing={editing} />}
      </div>
    </>
  );
}
