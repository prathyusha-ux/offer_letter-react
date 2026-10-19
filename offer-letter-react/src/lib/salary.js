/* ----------------------------------------------------------------------- *
 * SALARY CALCULATION (pure function — no DOM access)
 * ----------------------------------------------------------------------- *
 * PF rule depends on the Date of Joining:
 *   - Joining BEFORE 4 Sep 2026   -> old rule:
 *         Basic > 15000  : employee PF = employer PF = 1800
 *         otherwise      : Basic * 12%
 *   - Joining ON/AFTER 4 Sep 2026 -> new rule:
 *         Basic >= 25000 : employee PF = employer PF = 3000
 *         otherwise      : Basic * 12%
 * If no joining date is available, the new rule is used.
 * ----------------------------------------------------------------------- */

export const PROFESSIONAL_TAX_MONTHLY = 200;
export const PF_NEW_RULE_START = '2026-09-04'; // ISO date — plain string comparison works

export function getPfShare(basic, doj) {
  const useOldRule = doj && doj < PF_NEW_RULE_START;

  if (useOldRule) {
    return basic > 15000 ? 1800 : Math.round(basic * 0.12); // old rule
  }
  return basic >= 25000 ? 3000 : Math.round(basic * 0.12); // new rule
}

export function calculateSalaryBreakdown({
  annualCtc,
  doj,
  pfIncluded = true,
  variableIncluded = false,
  variableAmount = 0,
  tdsIncluded = false,
  tdsAmount = 0,
}) {
  // Monthly CTC = Annual CTC / 12
  const ctcPerMonth = annualCtc / 12;

  // Basic = 50% of Monthly CTC
  const basic = Math.round(ctcPerMonth * 0.5);

  // HRA = 40% of Basic
  const hra = Math.round(basic * 0.4);

  // PF share — same amount for BOTH employee and employer
  const pfShare = getPfShare(basic, doj);
  const employeePf = pfShare;
  const employerPf = pfShare;

  // Special Allowance = Monthly CTC - Basic - HRA - (employer PF, only if PF is on)
  const specialAllowance = Math.round(ctcPerMonth - basic - hra - (pfIncluded ? employerPf : 0));

  const professionalTax = PROFESSIONAL_TAX_MONTHLY;
  const pfDeduction = pfIncluded ? employeePf : 0;
  const tds = tdsIncluded ? tdsAmount : 0;
  const variable = variableIncluded ? variableAmount : 0;

  // Gross = Basic + HRA + Special Allowance
  const grossPerMonth = basic + hra + specialAllowance;

  // Deductions = Professional Tax + employee PF (if on) + TDS (if on)
  const totalDeductions = professionalTax + pfDeduction + tds;

  // Net pay = earnings - deductions
  const takeHomePerMonth = grossPerMonth - totalDeductions;

  return {
    ctcPerMonth,
    basic,
    hra,
    specialAllowance,
    employeePf,
    employerPf,
    professionalTax,
    totalDeductions,
    takeHomePerMonth,
    variableIncluded,
    variableAmount: variable,
    pfIncluded,
    pfDeduction,
    tdsIncluded,
    tdsAmount: tds,
    grossPerMonth,
  };
}
