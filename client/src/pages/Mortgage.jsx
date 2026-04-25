import { Fragment, useMemo, useState } from "react";
import {
  Landmark,
  Percent,
  CalendarDays,
  PlusCircle,
  MinusCircle,
  ArrowRight,
} from "lucide-react";
import { priceFormatter } from "../lib/price-formatter";

const clampNumber = (value) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric < 0) return 0;
  return numeric;
};

export default function Mortgage() {
  const [loanAmount, setLoanAmount] = useState(100000);
  const [loanRate, setLoanRate] = useState(15);
  const [loanTerm, setLoanTerm] = useState(2);
  const [termType, setTermType] = useState("yearly");
  const [draftLoanAmount, setDraftLoanAmount] = useState(100000);
  const [draftLoanRate, setDraftLoanRate] = useState(15);
  const [draftLoanTerm, setDraftLoanTerm] = useState(2);
  const [draftTermType, setDraftTermType] = useState("yearly");
  const [expandedYear, setExpandedYear] = useState(null);

  const handleCalculate = () => {
    setLoanAmount(clampNumber(draftLoanAmount));
    setLoanRate(clampNumber(draftLoanRate));
    setLoanTerm(clampNumber(draftLoanTerm));
    setTermType(draftTermType);
  };

  const result = useMemo(() => {
    const principal = clampNumber(loanAmount);
    const annualRate = clampNumber(loanRate);
    const termInput = clampNumber(loanTerm);
    const totalMonths =
      termType === "yearly"
        ? Math.round(termInput * 12)
        : Math.round(termInput);

    if (!principal || !totalMonths) {
      return {
        monthlyEmi: 0,
        totalInterest: 0,
        totalPayment: 0,
        monthlyRows: [],
        yearlyRows: [],
      };
    }

    const monthlyRate = annualRate / 12 / 100;
    let monthlyEmi = 0;

    if (monthlyRate === 0) {
      monthlyEmi = principal / totalMonths;
    } else {
      const factor = Math.pow(1 + monthlyRate, totalMonths);
      monthlyEmi = (principal * monthlyRate * factor) / (factor - 1);
    }

    let balance = principal;
    let runningPrincipalPaid = 0;
    const startDate = new Date();
    const monthlyRows = [];
    const yearlyMap = new Map();

    for (let month = 1; month <= totalMonths; month += 1) {
      const scheduleDate = new Date(
        startDate.getFullYear(),
        startDate.getMonth() + month - 1,
        1,
      );
      const year = scheduleDate.getFullYear();
      const monthLabel = scheduleDate.toLocaleString("en-US", {
        month: "short",
      });
      const interest = monthlyRate === 0 ? 0 : balance * monthlyRate;

      let principalPart = monthlyEmi - interest;
      let payment = monthlyEmi;

      if (month === totalMonths || principalPart > balance) {
        principalPart = balance;
        payment = principalPart + interest;
      }

      balance = Math.max(0, balance - principalPart);
      runningPrincipalPaid += principalPart;
      const loanPaidToDatePct = (runningPrincipalPaid / principal) * 100;

      monthlyRows.push({
        key: `${year}-${month}`,
        period: `${monthLabel} ${year}`,
        principal: Number(principalPart.toFixed(2)),
        interest: Number(interest.toFixed(2)),
        totalPayment: Number(payment.toFixed(2)),
        balance: Number(balance.toFixed(2)),
        loanPaidToDatePct: Number(loanPaidToDatePct.toFixed(2)),
      });

      const current = yearlyMap.get(year) || {
        year,
        principal: 0,
        interest: 0,
        totalPayment: 0,
        balance: 0,
        loanPaidToDatePct: 0,
        months: [],
      };

      current.principal += principalPart;
      current.interest += interest;
      current.totalPayment += payment;
      current.balance = balance;
      current.loanPaidToDatePct = loanPaidToDatePct;
      current.months.push({
        key: `${year}-${month}`,
        monthLabel,
        principal: Number(principalPart.toFixed(2)),
        interest: Number(interest.toFixed(2)),
        totalPayment: Number(payment.toFixed(2)),
        balance: Number(balance.toFixed(2)),
        loanPaidToDatePct: Number(loanPaidToDatePct.toFixed(2)),
      });

      yearlyMap.set(year, current);
    }

    const yearlyRows = Array.from(yearlyMap.values()).map((row) => ({
      ...row,
      principal: Number(row.principal.toFixed(2)),
      interest: Number(row.interest.toFixed(2)),
      totalPayment: Number(row.totalPayment.toFixed(2)),
      balance: Number(row.balance.toFixed(2)),
      loanPaidToDatePct: Number(row.loanPaidToDatePct.toFixed(2)),
      months: row.months,
    }));

    // const roundedMonthlyEmi = Math.round(monthlyEmi);
    const totalPayment = monthlyRows.reduce(
      (sum, row) => sum + row.totalPayment,
      0,
    );
    const totalInterest = totalPayment - principal;

    return {
      // monthlyEmi: roundedMonthlyEmi,
      monthlyEmi,
      totalInterest: Number(totalInterest.toFixed(2)),
      totalPayment: Number(totalPayment.toFixed(2)),
      monthlyRows,
      yearlyRows,
    };
  }, [loanAmount, loanRate, loanTerm, termType]);

  return (
    <section className="py-8 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-transparent">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              EMI Calculator
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              Enter loan details and click calculate to view EMI and breakdown.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-8">
            <div className="rounded-lg  border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 p-5 sm:p-6">
              <div className="space-y-4">
                <label className="space-y-1 block">
                  <span className="text-sm text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
                    <Landmark size={16} className="text-primary" />
                    Loan Amount
                  </span>
                  <input
                    type="number"
                    min="0"
                    value={draftLoanAmount}
                    onChange={(e) => setDraftLoanAmount(e.target.value)}
                    className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-2 focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </label>

                <label className="space-y-1 block">
                  <span className="text-sm text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
                    <Percent size={16} className="text-primary" />
                    Loan Rate
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={draftLoanRate}
                    onChange={(e) => setDraftLoanRate(e.target.value)}
                    className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-2 focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </label>

                <label className="space-y-1 block">
                  <span className="text-sm text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
                    <CalendarDays size={16} className="text-primary" />
                    Loan Tenure
                  </span>
                  <input
                    type="number"
                    min="0"
                    value={draftLoanTerm}
                    onChange={(e) => setDraftLoanTerm(e.target.value)}
                    className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-2 focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </label>

                <div>
                  <p className="text-sm font-semibold mb-2">Tenure Type</p>
                  <div className="flex items-center gap-6 text-base">
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="termType"
                        value="yearly"
                        checked={draftTermType === "yearly"}
                        onChange={(e) => setDraftTermType(e.target.value)}
                        className="h-4 w-4"
                      />
                      <span>Years</span>
                    </label>

                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="termType"
                        value="monthly"
                        checked={draftTermType === "monthly"}
                        onChange={(e) => setDraftTermType(e.target.value)}
                        className="h-4 w-4"
                      />
                      <span>Months</span>
                    </label>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCalculate}
                  className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 rounded-md bg-primary text-white font-semibold hover:bg-primary-dark transition"
                >
                  Calculate <ArrowRight size={16} />
                </button>
              </div>
            </div>

            <div className="p-5 sm:p-6 ">
              <div className="pb-5">
                <p className="text-sm font-semibold">Loan EMI: </p>
                <p className="text-3xl font-bold mt-1">
                  {priceFormatter(result.monthlyEmi)}
                </p>
              </div>

              <div className="py-5">
                <p className="text-sm font-semibold">
                  Total Interest Payable:{" "}
                </p>
                <p className="text-3xl font-bold mt-1">
                  {priceFormatter(result.totalInterest)}
                </p>
              </div>

              <div className="pt-5">
                <p className="text-sm font-semibold">Total Payment: </p>
                <p className="text-3xl font-bold mt-1">
                  {priceFormatter(result.totalPayment)}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-3 text-sm text-neutral-600 dark:text-neutral-400">
            Click a year row to expand monthly EMI breakdown.
          </div>

          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-220">
                <thead className="bg-primary-dark text-white text-left">
                  <tr>
                    <th className="px-4 py-3 text-sm font-semibold">Year</th>
                    <th className="px-4 py-3 text-sm font-semibold">
                      Principal (A)
                    </th>
                    <th className="px-4 py-3 text-sm font-semibold">
                      Interest (B)
                    </th>
                    <th className="px-4 py-3 text-sm font-semibold">
                      Total Payment (A+B)
                    </th>
                    <th className="px-4 py-3 text-sm font-semibold">Balance</th>
                    <th className="px-4 py-3 text-sm font-semibold">
                      Loan Paid To Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {result.yearlyRows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-6 text-sm text-neutral-500 dark:text-neutral-400 text-center"
                      >
                        Enter valid values to view EMI breakdown.
                      </td>
                    </tr>
                  ) : (
                    result.yearlyRows.map((row) => (
                      <Fragment key={`group-${row.year}`}>
                        <tr
                          key={`year-${row.year}`}
                          className="border-t border-neutral-200 dark:border-neutral-800 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800/40"
                          onClick={() =>
                            setExpandedYear((prev) =>
                              prev === row.year ? null : row.year,
                            )
                          }
                        >
                          <td className="px-4 py-3 text-sm font-medium">
                            <span className="inline-flex items-center gap-2">
                              {expandedYear === row.year ? (
                                <MinusCircle size={16} />
                              ) : (
                                <PlusCircle size={16} />
                              )}
                              {row.year}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {priceFormatter(row.principal)}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {priceFormatter(row.interest)}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {priceFormatter(row.totalPayment)}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {priceFormatter(row.balance)}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {row.loanPaidToDatePct.toFixed(2)}%
                          </td>
                        </tr>

                        {expandedYear === row.year &&
                          row.months.map((monthRow) => (
                            <tr
                              key={monthRow.key}
                              className="border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60"
                            >
                              <td className="px-4 py-3 text-sm pl-10">
                                {monthRow.monthLabel}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                {priceFormatter(monthRow.principal)}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                {priceFormatter(monthRow.interest)}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                {priceFormatter(monthRow.totalPayment)}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                {priceFormatter(monthRow.balance)}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                {monthRow.loanPaidToDatePct.toFixed(2)}%
                              </td>
                            </tr>
                          ))}
                      </Fragment>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
