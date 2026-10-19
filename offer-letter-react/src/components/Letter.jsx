import { memo } from 'react';
import { COMPANY } from '../lib/company.js';
import {
  formatRupees,
  formatDateMonthFirst,
  formatDateDayFirst,
  numberToWords,
  toLakhsPhrase,
} from '../lib/format.js';
import SalaryTable from './SalaryTable.jsx';

/* One A4 "page": optional letterhead logo, editable body, footer. */
function PageWrapper({ isFirst = false, editing, children }) {
  return (
    <div className="page">
      {isFirst && (
        <div className="letterhead">
          <img className="logo-img" src={COMPANY.logoImage} alt="Logo" />
        </div>
      )}
      <div className="page-body" contentEditable={editing} suppressContentEditableWarning>
        {children}
      </div>
      <div className="letter-footer">
        <div className="letter-footer-row">
          <h4>{COMPANY.name}</h4>
        </div>
      </div>
    </div>
  );
}

function Page1({ values, salary, editing }) {
  const remuneration = salary.variableIncluded ? (
    <>Your annual remuneration will be <strong>INR {formatRupees(values.annualCtc + salary.variableAmount)}/-</strong> per annum, which includes a variable pay component of <strong>INR {formatRupees(salary.variableAmount)}/-</strong> that is completely dependent on your performance.</>
  ) : (
    <>Your annual remuneration will be <strong>INR {formatRupees(values.annualCtc)}/-</strong> per annum.</>
  );

  return (
    <PageWrapper isFirst editing={editing}>
      <div className="letter-title">OFFER LETTER</div>
      <p><strong>Dear {values.name}</strong>,</p>
      <p><strong>Date of Joining:</strong> <strong>{formatDateMonthFirst(values.doj)}</strong></p>
      <p>This statement dated <strong>{formatDateDayFirst(values.letterDate)}</strong> sets out details of the main terms of your employment with <strong>{COMPANY.name}, {COMPANY.hqCity}.</strong></p>
      <p><strong>{COMPANY.name}</strong> is pleased to offer you appointment as <strong>{values.jobTitle}</strong>. We trust that your knowledge, skills and experience will be among our most valuable assets.</p>

      <h3>Job Title:</h3>
      <div className="tight-group">
        <p>The title of the job that you are employed to do is <strong>{values.jobTitle}</strong>. This position will be in the Company's <strong>{values.department}</strong> department.{values.roleDesc ? ` ${values.roleDesc}` : ''}</p>
        <p>The Company may amend your duties from time to time, and in addition to your normal duties you may from time to time be required to undertake additional or other duties as necessary to meet the needs of the business. This may involve a change in department also.</p>
        <p>Please note that during the course of employment with us, you are able to work at any place in the world.</p>
      </div>

      <h3>HOURS AND PLACE OF WORK:</h3>
      <div className="tight-group">
        <p>You shall be based at <strong>{values.workLocation}</strong>, but may be required to serve the Company in any place within or outside India, as required.</p>
        <p>You may be required to travel nationally and internationally on the business of the Company.</p>
        <p>You will be required to work such hours as may reasonably be expected of you and as is consistent with an appointment of this nature.</p>
        <p>You may, at the discretion of the Company, be transferred to any of the divisions, departments, in the Company, its subsidiaries, branches or associate companies and you shall abide by the standing orders and services rules prevailing in such place/entity without entitlement to any extra remuneration.</p>
      </div>

      <h3>SALARY:</h3>
      <p>{remuneration}</p>
      <p>Please note the salary structure of the Company may be altered or modified at any time without prior notice. Your remuneration package is strictly confidential between you and the Company, and should not be discussed with anyone nor divulged to anyone in any manner whatsoever.</p>
    </PageWrapper>
  );
}

function Page2({ values, editing }) {
  const noticeWords = numberToWords(values.noticePeriodDays);

  return (
    <PageWrapper editing={editing}>
      <h3>ANNUAL SALARY REVISION:</h3>
      <p>We follow an <strong>April to March</strong> performance cycle. All salary revisions come up for review in the month of April at the sole discretion of the Company.</p>
      <p>Employees who have joined the organization on or before October 1 in the current calendar year, may be eligible for a proportionate salary review during April of next calendar year. The increment, if any, is dependent on various factors including performance of the employee and would be proportionate to the number of months of service rendered by the employee. Those joining after 1st October will not be eligible for the same.</p>

      <h3>TERMINATION OR RESIGNATION FROM SERVICE:</h3>
      <p>The employment can, subject to the policies of the Company and the terms and conditions of this Employment Letter, be terminated by either party by serving <strong>{values.noticePeriodDays} ({noticeWords}) days</strong> written notice to the other party. The notice period is part of the Employee Separation Policy which is available for your reference on the Company's HRMS.</p>
      <p>The Company reserves the right to accept/reject the notice pay in lieu of the notice period mentioned hereinabove.</p>
      <p>The Company reserves the absolute right to terminate your services at any time, without assigning any reason whatsoever, by giving you notice in writing or pay in lieu of notice period.</p>
      <p>The Company reserves the right, at its discretion and at any time during the notice period, to announce to employees, clients, suppliers and customers of the Company, its subsidiaries or associate companies, your termination/resignation. However, you expressly agree hereby not to make any announcement of your termination/resignation, unless the same has been formally intimated to you or accepted by the Company in writing, as the case may be.</p>

      <h3>LEAVE ENTITLEMENT AND POLICY</h3>
      <p>For the purpose of leave entitlement, the leave year shall be considered as the calendar year commencing from <strong>1 January and ending on 31 December</strong> of each year.</p>
      <p>The Employee shall be entitled to a total of fifteen (15) days of leave per leave year, subject to the Company's prevailing Leave Policy and applicable rules. The annual leave entitlement shall consist of:</p>
      <ul>
        <li><strong>Casual Leave (CL): 10 days per leave year</strong></li>
        <li><strong>Sick Leave (SL): 5 days per leave year</strong></li>
      </ul>
      <p>Leave shall be availed with the prior approval of the reporting manager or the authorized person, except in cases of emergency or sudden illness, where the Employee shall inform the Company at the earliest possible opportunity.</p>
      <p>Employees joining during the course of a leave year shall be eligible for leave on a <strong>pro-rata basis</strong>, as applicable under the Company's Leave Policy.</p>
      <p>The carry-forward, lapse, or encashment of unused leave shall be governed by the Company's prevailing policies and applicable statutory requirements.</p>
      <p>The Company reserves the right to amend or modify the Leave Policy from time to time in accordance with business requirements and applicable laws.</p>
    </PageWrapper>
  );
}

function Page3({ values, editing }) {
  const bondYearWord = values.bondYears === 1 ? 'year' : 'years';

  return (
    <PageWrapper editing={editing}>
      <h3>PERFORMANCE BASED VARIABLE BONUS/ INCENTIVE:</h3>
      <p>You will be eligible to participate in the Company's variable pay programs/incentive schemes. The payment under this program depends on your performance, the Company's performance and other parameters as the Company may decide from time to time. Please note that there is no minimum payment under this program.</p>
      <p>Payment of this amount is subject to your being in the Company's employment and also subject to your not having resigned or being on notice period.</p>
      <p>You will declare your relationship, if any, with any of the directors of the Company as required by the Companies Act, 2013.</p>
      <p>In case you are or become related to any employee of the Company, then, in the former case you will inform the Company immediately, and in the latter case within 7 days of your becoming so.</p>
      <p>You will abide by all the policies and disclosure norms of the Company that are in effect and by any amendments thereto carried out by the Company from time to time.</p>

      <h3>COMPANY POLICIES AND PROCEDURE:</h3>
      <p>You shall be required at all times to comply with the Company's rules, policies and procedures as may be amended by the Company from time to time, and the same are to be considered as part of the terms and conditions of this Employment Letter. You are also required to comply generally with the standards reasonably expected of an appointment of your nature.</p>

      <h3>ADDITIONAL DUTIES:</h3>
      <p>You agree and consent that the Company may require you (without additional remuneration) to carry out different or additional duties (including holding any office in the Company, its subsidiaries and associate companies) consistent with your status and position in the Company.</p>

      {values.includeBond && (
        <>
          <h3>SERVICE BOND CLAUSE:</h3>
          <p>The Employee agrees to remain in the employment of the Company for a minimum period of <strong>{numberToWords(values.bondYears).toLowerCase()} ({values.bondYears}) {bondYearWord}</strong> from the date of joining. This commitment is made considering the Company's investment in recruitment, training, onboarding, and skill development. In the event that the Employee voluntarily resigns or discontinues employment before completing the agreed service period, the Employee shall reimburse the Company an amount of <strong>{toLakhsPhrase(values.bondAmount)}</strong> towards the costs incurred by the Company for recruitment, training, and related administrative expenses. This provision shall be interpreted and enforced in accordance with applicable laws and regulations governing employment contracts.</p>
        </>
      )}
    </PageWrapper>
  );
}

function Page4({ values, salary, editing }) {
  return (
    <PageWrapper editing={editing}>
      <h3>Detailed Salary Structure:</h3>
      <p>Name: <strong>{values.name}</strong></p>
      <SalaryTable salary={salary} values={values} />

      <div className="sign-block">
        <p className="sign-caption">Name and Signature, confirming acceptance of the above terms and conditions</p>
        <div className="sign-line"><span className="lbl"><strong>Signature</strong></span><span className="fill"></span></div>
        <div className="sign-line"><span className="lbl"><strong>Name</strong></span><span className="fill"></span></div>
        <div className="sign-line"><span className="lbl"><strong>Date</strong></span><span className="fill"></span></div>
      </div>

      <p className="regards-line"><span className="regards-label">Regards</span><br /><strong>{COMPANY.name}</strong></p>
      <img className="stamp-img" src={COMPANY.stampImage} alt="Company stamp and signature" />
    </PageWrapper>
  );
}

function Letter({ values, salary, editing }) {
  return (
    <>
      <Page1 values={values} salary={salary} editing={editing} />
      <Page2 values={values} editing={editing} />
      <Page3 values={values} editing={editing} />
      <Page4 values={values} salary={salary} editing={editing} />
    </>
  );
}

// memo: typing in the form or the email box must not re-render (and risk
// disturbing) the letter, especially while the user is editing it in place.
export default memo(Letter);
