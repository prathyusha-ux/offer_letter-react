function Field({ id, label, error, span2 = false, children }) {
  return (
    <div className={`field-group${span2 ? ' span-2' : ''}`}>
      <label htmlFor={id}>{label}</label>
      {children}
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}

function YesNo({ name, value, onChange }) {
  return (
    <div className="radio-row">
      {['yes', 'no'].map((option) => (
        <label key={option} className="radio-option">
          <input
            type="radio"
            name={name}
            value={option}
            checked={value === option}
            onChange={() => onChange(option)}
          />
          {option === 'yes' ? 'Yes' : 'No'}
        </label>
      ))}
    </div>
  );
}

/**
 * The form card. `pf` carries the live-calculated PF figures (read-only fields),
 * and `children` holds the buttons rendered under the grid.
 */
export default function OfferForm({ form, errors, onChange, pf, children }) {
  const text = (id) => ({
    id,
    value: form[id],
    onChange: (e) => onChange(id, e.target.value),
  });

  return (
    <form id="offerForm" onSubmit={(e) => e.preventDefault()} noValidate>
      <div className="form-grid">
        <Field id="empName" label="Full Name" error={errors.empName}>
          <input type="text" placeholder="e.g. Ogirala Lakshmi Prathyusha" {...text('empName')} />
        </Field>

        <Field id="doj" label="Date of Joining" error={errors.doj}>
          <input type="date" {...text('doj')} />
        </Field>

        <Field id="letterDate" label="Letter Date (statement date)" error={errors.letterDate}>
          <input type="date" {...text('letterDate')} />
        </Field>

        <Field id="jobTitle" label="Job Title" error={errors.jobTitle}>
          <input type="text" placeholder="e.g. SOFTWARE ENGINEER L1" {...text('jobTitle')} />
        </Field>

        <Field id="department" label="Department" error={errors.department}>
          <input type="text" placeholder="e.g. Services" {...text('department')} />
        </Field>

        <Field id="workLocation" label="Work Location">
          <select {...text('workLocation')}>
            <option value="Hyderabad Corporate Office - WFH">Hyderabad Corporate Office - WFH</option>
            <option value="Hyderabad Corporate Office">Hyderabad Corporate Office</option>
            <option value="__custom">Other (type below)</option>
          </select>
        </Field>

        {form.workLocation === '__custom' && (
          <Field id="customLocation" label="Custom Work Location">
            <input type="text" placeholder="Custom work location" {...text('customLocation')} />
          </Field>
        )}

        <Field id="annualCtc" label="Annual CTC (₹)" error={errors.annualCtc}>
          <input type="text" inputMode="numeric" placeholder="e.g. 300000" {...text('annualCtc')} />
        </Field>

        <Field id="noticePeriod" label="Notice Period (days)" error={errors.noticePeriod}>
          <input type="text" inputMode="numeric" {...text('noticePeriod')} />
        </Field>

        <Field id="roleDesc" label="Role Description" span2>
          <textarea
            rows={3}
            placeholder="e.g. As a Frontend Developer, you will develop responsive web applications..."
            {...text('roleDesc')}
          />
        </Field>

        {/* Variable pay */}
        <Field label="Variable Pay">
          <YesNo name="variablePay" value={form.variablePay} onChange={(v) => onChange('variablePay', v)} />
        </Field>
        {form.variablePay === 'yes' && (
          <Field id="variablePayAmount" label="Annual Variable Pay (₹)">
            <input type="text" inputMode="numeric" placeholder="e.g. 30000" {...text('variablePayAmount')} />
          </Field>
        )}

        {/* Provident fund */}
        <Field label="Provident Fund">
          <YesNo name="pf" value={form.pf} onChange={(v) => onChange('pf', v)} />
        </Field>
        {form.pf === 'yes' && (
          <>
            <Field id="pfEmployee" label="PF Employee (₹ / month)">
              <input id="pfEmployee" type="text" value={pf.employeePf} readOnly />
            </Field>
            <Field id="pfEmployer" label="PF Employer (₹ / month)">
              <input id="pfEmployer" type="text" value={pf.employerPf} readOnly />
            </Field>
          </>
        )}

        {/* TDS */}
        <Field label="TDS">
          <YesNo name="tds" value={form.tds} onChange={(v) => onChange('tds', v)} />
        </Field>
        {form.tds === 'yes' && (
          <Field id="tdsAmount" label="TDS Amount (₹ / month)">
            <input type="text" inputMode="numeric" placeholder="e.g. 1000" {...text('tdsAmount')} />
          </Field>
        )}

        {/* Service bond */}
        <div className="field-group">
          <label htmlFor="bondToggle">Service Bond Clause</label>
          <div className="toggle-row">
            <input
              id="bondToggle"
              type="checkbox"
              checked={form.includeBond}
              onChange={(e) => onChange('includeBond', e.target.checked)}
            />
            <label htmlFor="bondToggle">Include Service Bond Clause</label>
          </div>
        </div>
        {form.includeBond && (
          <>
            <Field id="bondYears" label="Bond Duration (years)">
              <input type="text" inputMode="numeric" {...text('bondYears')} />
            </Field>
            <Field id="bondAmount" label="Bond Amount (₹, whole lakhs)">
              <input type="text" inputMode="numeric" placeholder="e.g. 200000" {...text('bondAmount')} />
            </Field>
          </>
        )}
      </div>

      {children}
    </form>
  );
}
