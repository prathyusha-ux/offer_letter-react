import { formatRupees, toLpaPhrase } from '../lib/format.js';

export default function SalaryTable({ salary, values }) {
  // Same total as the "annual remuneration" line on page 1
  const totalRemuneration = values.annualCtc + (salary.variableIncluded ? salary.variableAmount : 0);
  const yearly = (monthly) => formatRupees(monthly * 12);

  return (
    <>
      <table className="salary-table">
        <thead>
          <tr>
            <th>Component</th>
            <th className="num">Monthly</th>
            <th className="num">Yearly</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Basic</td><td className="num">{formatRupees(salary.basic)}</td><td className="num">{yearly(salary.basic)}</td></tr>
          <tr><td>House Rent Allowance(HRA)</td><td className="num">{formatRupees(salary.hra)}</td><td className="num">{yearly(salary.hra)}</td></tr>
          <tr><td>Special Allowance</td><td className="num">{formatRupees(salary.specialAllowance)}</td><td className="num">{yearly(salary.specialAllowance)}</td></tr>
          <tr className="subhead"><td>Gross Pay</td><td className="num">{formatRupees(salary.grossPerMonth)}</td><td className="num">{yearly(salary.grossPerMonth)}</td></tr>

          {salary.variableIncluded && (
            <tr><td>Variable Pay</td><td className="num"></td><td className="num">{formatRupees(salary.variableAmount)}</td></tr>
          )}

          <tr className="subhead"><td>Deductions</td><td className="num"></td><td className="num"></td></tr>

          {salary.pfIncluded && (
            <tr><td>Provident Fund</td><td className="num">{formatRupees(salary.pfDeduction)}</td><td className="num">{yearly(salary.pfDeduction)}</td></tr>
          )}

          <tr><td>Professional Tax</td><td className="num">{formatRupees(salary.professionalTax)}</td><td className="num">{yearly(salary.professionalTax)}</td></tr>

          {salary.tdsIncluded && (
            <tr><td>TDS</td><td className="num">{formatRupees(salary.tdsAmount)}</td><td className="num">{yearly(salary.tdsAmount)}</td></tr>
          )}

          <tr className="subhead"><td>Total Deductions</td><td className="num">{formatRupees(salary.totalDeductions)}</td><td className="num">{yearly(salary.totalDeductions)}</td></tr>
          <tr className="total"><td>Take Home</td><td className="num">{formatRupees(salary.takeHomePerMonth)}</td><td className="num">{yearly(salary.takeHomePerMonth)}</td></tr>

          {/* Ending row: round monthly and yearly CTC */}
          <tr>
            <td className="ctc-box">CTC ({toLpaPhrase(totalRemuneration)})</td>
            <td className="ctc-box num">{formatRupees(totalRemuneration / 12)}</td>
            <td className="ctc-box num">{formatRupees(totalRemuneration)}</td>
          </tr>
        </tbody>
      </table>

      <p className="letter-foot-note">#The Indicative Performance Pay amount as per the current performance pay policy may vary depending upon the performance of individual and of the company. The management reserves the rights to amend policy at any point of time.</p>
      <p className="letter-foot-note">* The exact sum of all elements may mismatch up to Rs.10/-. In the event there is any enhancement in the total emoluments to be paid to you on account of change in any statute or notification, then the said enhanced payment will be adjusted from the total CTC payable to you as shown here in above. In such a case the company will have the right to restructure your emoluments within the specific CTC.</p>
    </>
  );
}
