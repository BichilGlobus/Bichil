"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface LoanCalculatorProps {
  defaultAmount?: string;
  defaultRate?: string;
  defaultTerm?: string;
  maxAmount?: number;
  maxTerm?: number;
  minRate?: number;
  maxRate?: number;
  productType?: string;
  compact?: boolean;
}

export default function LoanCalculator({
  defaultAmount = "10000000",
  defaultRate = "2.5",
  defaultTerm = "12",
  maxAmount = 100000000,
  maxTerm = 60,
  minRate = 0.5,
  maxRate = 5.0,
  productType = "general",
  compact = false,
}: LoanCalculatorProps) {
  const [loanAmount, setLoanAmount] = useState<string>(defaultAmount);
  const [interestRate, setInterestRate] = useState<string>(defaultRate);
  const [loanTerm, setLoanTerm] = useState<string>(defaultTerm);
  const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null);
  const [totalPayment, setTotalPayment] = useState<number | null>(null);
  const [totalInterest, setTotalInterest] = useState<number | null>(null);

  const calculateLoan = () => {
    const principal = parseFloat(loanAmount);
    const monthlyRate = parseFloat(interestRate) / 100;
    const months = parseInt(loanTerm);

    if (
      isNaN(principal) ||
      isNaN(monthlyRate) ||
      isNaN(months) ||
      principal <= 0 ||
      months <= 0
    ) {
      return;
    }

    const interest = principal * monthlyRate * months;
    const total = principal + interest;
    const monthly = total / months;

    setMonthlyPayment(monthly);
    setTotalPayment(total);
    setTotalInterest(interest);
  };

  // Auto-calculate on mount and when values change
  useEffect(() => {
    calculateLoan();
  }, [loanAmount, interestRate, loanTerm]);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("mn-MN").format(Math.round(num));
  };

  const formatAmount = (amount: number) => {
    if (amount >= 1000000) {
      return `₮${amount / 1000000}M`;
    }
    return `₮${formatNumber(amount)}`;
  };

  return (
    <div className={`bg-white border border-teal-100 rounded-2xl shadow-sm ${compact ? 'p-4' : 'p-6'}`}>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none">
            <path
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 className={`font-bold text-slate-900 ${compact ? 'text-sm' : 'text-base'}`}>
          Зээлийн тооцоолуур
        </h3>
      </div>

      <div className="space-y-4">
        {/* Loan Amount */}
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1.5">
            Зээлийн дүн
          </label>
          <div className="relative">
            <input
              type="text"
              value={formatNumber(parseFloat(loanAmount) || 0)}
              onChange={(e) =>
                setLoanAmount(e.target.value.replace(/[^0-9]/g, ""))
              }
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-slate-400">
              ₮
            </span>
          </div>
          <input
            type="range"
            min="1000000"
            max={maxAmount}
            step="1000000"
            value={loanAmount}
            onChange={(e) => setLoanAmount(e.target.value)}
            className="mt-2 w-full accent-teal-600 h-1.5"
          />
          <div className="mt-0.5 flex justify-between text-[10px] text-slate-400">
            <span>₮1M</span>
            <span>{formatAmount(maxAmount)}</span>
          </div>
        </div>

        {/* Interest Rate */}
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1.5">
            Сарын хүү (%)
          </label>
          <div className="relative">
            <input
              type="text"
              value={interestRate}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9.]/g, "");
                if (value.split(".").length <= 2) setInterestRate(value);
              }}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-slate-400">
              %
            </span>
          </div>
          <input
            type="range"
            min={minRate}
            max={maxRate}
            step="0.1"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            className="mt-2 w-full accent-teal-600 h-1.5"
          />
          <div className="mt-0.5 flex justify-between text-[10px] text-slate-400">
            <span>{minRate}%</span>
            <span>{maxRate}%</span>
          </div>
        </div>

        {/* Loan Term */}
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1.5">
            Хугацаа (сар)
          </label>
          <div className="relative">
            <input
              type="text"
              value={loanTerm}
              onChange={(e) =>
                setLoanTerm(e.target.value.replace(/[^0-9]/g, ""))
              }
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-slate-400">
              сар
            </span>
          </div>
          <input
            type="range"
            min="3"
            max={maxTerm}
            step="3"
            value={loanTerm}
            onChange={(e) => setLoanTerm(e.target.value)}
            className="mt-2 w-full accent-teal-600 h-1.5"
          />
          <div className="mt-0.5 flex justify-between text-[10px] text-slate-400">
            <span>3 сар</span>
            <span>{maxTerm} сар</span>
          </div>
        </div>

        {/* Results */}
        {monthlyPayment !== null && (
          <div className="bg-teal-50 rounded-xl p-4 border border-teal-200">
            <div className="text-center mb-3">
              <p className="text-xs text-teal-700 font-medium mb-1">
                Сарын төлбөр
              </p>
              <p className="text-2xl font-bold text-teal-800">
                ₮{formatNumber(monthlyPayment)}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-white rounded-lg p-2 border border-slate-100">
                <p className="text-[10px] text-slate-600 mb-0.5">Нийт төлбөр</p>
                <p className="text-xs font-semibold text-slate-900">
                  ₮{formatNumber(totalPayment!)}
                </p>
              </div>
              <div className="bg-white rounded-lg p-2 border border-slate-100">
                <p className="text-[10px] text-slate-600 mb-0.5">Нийт хүү</p>
                <p className="text-xs font-semibold text-slate-900">
                  ₮{formatNumber(totalInterest!)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Link to full calculator */}
        <Link
          href="/calculator"
          className="block text-center text-xs text-teal-600 hover:text-teal-700 font-medium mt-2"
        >
          Дэлгэрэнгүй тооцоолуур →
        </Link>
      </div>
    </div>
  );
}
