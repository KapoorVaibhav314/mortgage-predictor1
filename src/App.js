import { useState } from "react";

export default function MortgageApprovalPredictor() {
  const [inputs, setInputs] = useState({
    loanType: "personal",
    creditScore: "",
    yearsSelfEmployed: "",
    bankStatements: "12",
    monthlyRevenue: Array(12).fill(""),
    debtMode: "simple",
    totalMonthlyDebt: "",
    maxMonthlyPaymentAfterExpenses: "",
    carLoans: "",
    creditCardDebt: "",
    studentLoans: "",
    childSupport: "",
    otherMortgages: "",
    otherLoans: "",
    propertyTax: "",
    homeOwnersInsurance: "",
    hoaFees: "",
    maxMonthlyPayment: "",
    downPayment: "",
    interestRate: "",
    loanTerm: "",
  });

  const [approvalChance, setApprovalChance] = useState(null);
  const [averageRevenue, setAverageRevenue] = useState(0);
  const [maxHomePrice, setMaxHomePrice] = useState(0);

  const creditScoreOptions = [
    { value: "850", label: "800-850" },
    { value: "770", label: "740-799" },
    { value: "705", label: "670-739" },
    { value: "625", label: "580-669" },
    { value: "550", label: "300-579" },
  ];

  const yearsOptions = [
    { value: "0.5", label: "6 months" },
    { value: "1", label: "1 year" },
    { value: "1.5", label: "1.5 years" },
    { value: "2", label: "2 years" },
    { value: "3", label: "3 years" },
    { value: "4", label: "4 years" },
    { value: "5", label: "5+ years" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("monthlyRevenue")) {
      const index = parseInt(name.split("-")[1]);
      const updatedRevenue = [...inputs.monthlyRevenue];
      updatedRevenue[index] = value;
      setInputs({ ...inputs, monthlyRevenue: updatedRevenue });
    } else {
      setInputs({ ...inputs, [name]: value });
    }
  };

  const calculateApproval = () => {
    const creditScore = parseInt(inputs.creditScore);
    const yearsSelfEmployed = parseFloat(inputs.yearsSelfEmployed);

    const monthsToCalculate = inputs.bankStatements === "24" ? 24 : 12;
    const totalRevenue = inputs.monthlyRevenue
      .slice(0, monthsToCalculate)
      .reduce((acc, val) => acc + (parseFloat(val) || 0), 0);
    const avgRevenue = totalRevenue / monthsToCalculate || 0;
    setAverageRevenue(avgRevenue);

    let monthlyDebt = 0;
    if (inputs.debtMode === "simple") {
      monthlyDebt = parseFloat(inputs.totalMonthlyDebt) || 0;
    } else {
      monthlyDebt =
        (parseFloat(inputs.carLoans) || 0) +
        (parseFloat(inputs.creditCardDebt) || 0) +
        (parseFloat(inputs.studentLoans) || 0) +
        (parseFloat(inputs.childSupport) || 0) +
        (parseFloat(inputs.otherMortgages) || 0) +
        (parseFloat(inputs.otherLoans) || 0);
    }

    if (!creditScore || !yearsSelfEmployed || avgRevenue === 0) {
      alert("Please fill out all required fields.");
      return;
    }

    let chance = 0;

    if (creditScore >= 800) chance += 35;
    else if (creditScore >= 740) chance += 30;
    else if (creditScore >= 670) chance += 25;
    else if (creditScore >= 580) chance += 15;
    else chance += 5;

    if (avgRevenue >= 15000) chance += 30;
    else if (avgRevenue >= 10000) chance += 25;
    else if (avgRevenue >= 5000) chance += 20;
    else if (avgRevenue >= 3000) chance += 15;
    else chance += 5;

    if (yearsSelfEmployed >= 3) chance += 20;
    else if (yearsSelfEmployed >= 2) chance += 15;
    else if (yearsSelfEmployed >= 1) chance += 10;
    else chance += 5;

    const debtRatio = monthlyDebt / avgRevenue;
    if (debtRatio < 0.2) chance += 15;
    else if (debtRatio < 0.3) chance += 12;
    else if (debtRatio < 0.4) chance += 8;
    else if (debtRatio < 0.5) chance += 5;

    const result = Math.min(chance, 100);
    setApprovalChance(result);

    const maxPayment =
      parseFloat(
        inputs.maxMonthlyPaymentAfterExpenses || inputs.maxMonthlyPayment
      ) || avgRevenue * 0.28;
    const interestRate = parseFloat(inputs.interestRate) || 6.5;
    const loanTermYears = parseFloat(inputs.loanTerm) || 30;

    const monthlyRate = interestRate / 100 / 12;
    const numPayments = loanTermYears * 12;
    const loanAmount =
      maxPayment *
      ((1 - Math.pow(1 + monthlyRate, -numPayments)) / monthlyRate);
    const downPaymentAmount = parseFloat(inputs.downPayment) || 0;
    const estimatedHomePrice = loanAmount + downPaymentAmount;

    setMaxHomePrice(estimatedHomePrice);
  };

  const InfoIcon = ({ tooltip }) => (
    <div className="group relative inline-block">
      <div className="w-4 h-4 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold cursor-help ml-2">
        i
      </div>
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded-lg py-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 pointer-events-none">
        {tooltip}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
      </div>
    </div>
  );

  const renderMonthlyRevenueFields = () => {
    const monthsToShow = inputs.bankStatements === "24" ? 24 : 12;
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {Array(monthsToShow)
          .fill(0)
          .map((_, index) => (
            <div key={index}>
              <input
                name={`monthlyRevenue-${index}`}
                value={inputs.monthlyRevenue[index] || ""}
                onChange={handleChange}
                type="number"
                placeholder={`${months[index]} ${index >= 12 ? "Y2" : "Y1"}`}
                className="w-full border-2 border-gray-200 rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all duration-200 hover:border-gray-300"
              />
            </div>
          ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-blue-100 to-indigo-200 bg-clip-text text-transparent mb-4">
              Self Employed Mortgage Approval Predictor
            </h1>
          </div>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-3xl shadow-2xl backdrop-blur-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 border-b border-gray-100">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-8">
                {/* Loan Type */}
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                  <div className="flex items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800">
                      Loan Type
                    </h3>
                    <InfoIcon tooltip="Choose between personal mortgage or business property loan" />
                  </div>
                  <div className="flex space-x-4">
                    <button
                      onClick={() =>
                        setInputs({ ...inputs, loanType: "personal" })
                      }
                      className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-200 ${
                        inputs.loanType === "personal"
                          ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg transform scale-105"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      🏠 Personal
                    </button>
                    <button
                      onClick={() =>
                        setInputs({ ...inputs, loanType: "business" })
                      }
                      className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-200 ${
                        inputs.loanType === "business"
                          ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg transform scale-105"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      🏢 Business
                    </button>
                  </div>
                </div>

                {/* Credit Score */}
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                  <div className="flex items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800">
                      Credit Score Range
                    </h3>
                    <InfoIcon tooltip="Your FICO credit score range affects approval chances significantly" />
                  </div>
                  <select
                    name="creditScore"
                    value={inputs.creditScore}
                    onChange={handleChange}
                    className="w-full border-2 border-gray-200 rounded-xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg transition-all duration-200 bg-gradient-to-r from-gray-50 to-blue-50"
                  >
                    <option value="">Select your credit score range</option>
                    {creditScoreOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Years Self Employed */}
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                  <div className="flex items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800">
                      Years Self Employed
                    </h3>
                    <InfoIcon tooltip="Lenders prefer 2+ years of self-employment history for stability" />
                  </div>
                  <select
                    name="yearsSelfEmployed"
                    value={inputs.yearsSelfEmployed}
                    onChange={handleChange}
                    className="w-full border-2 border-gray-200 rounded-xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg transition-all duration-200 bg-gradient-to-r from-gray-50 to-blue-50"
                  >
                    <option value="">Select years of self-employment</option>
                    {yearsOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Bank Statements */}
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                  <div className="flex items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800">
                      Bank Statement Period
                    </h3>
                    <InfoIcon tooltip="More months of statements provide better income averaging" />
                  </div>
                  <div className="flex space-x-4">
                    <button
                      onClick={() =>
                        setInputs({ ...inputs, bankStatements: "12" })
                      }
                      className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-200 ${
                        inputs.bankStatements === "12"
                          ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg transform scale-105"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      📅 12 Months
                    </button>
                    <button
                      onClick={() =>
                        setInputs({ ...inputs, bankStatements: "24" })
                      }
                      className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-200 ${
                        inputs.bankStatements === "24"
                          ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg transform scale-105"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      📅 24 Months
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-8">
                {/* Monthly Revenue */}
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                  <div className="flex items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800">
                      Monthly Revenue ({inputs.bankStatements} months)
                    </h3>
                    <InfoIcon tooltip="Enter your gross monthly income before expenses for each month" />
                  </div>
                  {renderMonthlyRevenueFields()}
                </div>

                {/* Debt Mode Toggle */}
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                  <div className="flex items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800">
                      Debt Calculation Mode
                    </h3>
                    <InfoIcon tooltip="Choose simple for quick calculation or advanced for detailed debt breakdown" />
                  </div>
                  <div className="flex space-x-4">
                    <button
                      onClick={() =>
                        setInputs({ ...inputs, debtMode: "simple" })
                      }
                      className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-200 ${
                        inputs.debtMode === "simple"
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg transform scale-105"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      ⚡ Simple
                    </button>
                    <button
                      onClick={() =>
                        setInputs({ ...inputs, debtMode: "advanced" })
                      }
                      className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-200 ${
                        inputs.debtMode === "advanced"
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg transform scale-105"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      🔧 Advanced
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Debt Section */}
          <div className="p-8 bg-gradient-to-r from-purple-50 to-pink-50">
            {inputs.debtMode === "simple" ? (
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 space-y-6">
                <h3 className="text-2xl font-bold text-gray-800 text-center mb-6">
                  💰 Monthly Debt (Simple Mode)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center mb-3">
                      <label className="text-lg font-semibold text-gray-700">
                        Total Monthly Debt
                      </label>
                      <InfoIcon tooltip="Sum of all your monthly debt payments (credit cards, loans, etc.)" />
                    </div>
                    <input
                      name="totalMonthlyDebt"
                      value={inputs.totalMonthlyDebt}
                      onChange={handleChange}
                      type="number"
                      className="w-full border-2 border-gray-200 rounded-xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-lg transition-all duration-200"
                      placeholder="Enter total monthly debt"
                    />
                  </div>
                  <div>
                    <div className="flex items-center mb-3">
                      <label className="text-lg font-semibold text-gray-700">
                        Max Payment After Expenses
                      </label>
                      <InfoIcon tooltip="Maximum monthly amount you can afford for mortgage after all expenses" />
                    </div>
                    <input
                      name="maxMonthlyPaymentAfterExpenses"
                      value={inputs.maxMonthlyPaymentAfterExpenses}
                      onChange={handleChange}
                      type="number"
                      className="w-full border-2 border-gray-200 rounded-xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-lg transition-all duration-200"
                      placeholder="Enter max payment capacity"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 space-y-6">
                <h3 className="text-2xl font-bold text-gray-800 text-center mb-6">
                  🔧 Monthly Debt (Advanced Mode)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <div className="flex items-center mb-3">
                      <label className="text-lg font-semibold text-gray-700">
                        Car Loans
                      </label>
                      <InfoIcon tooltip="Monthly payments for auto loans" />
                    </div>
                    <input
                      name="carLoans"
                      value={inputs.carLoans}
                      onChange={handleChange}
                      type="number"
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                      placeholder="$0"
                    />
                  </div>
                  <div>
                    <div className="flex items-center mb-3">
                      <label className="text-lg font-semibold text-gray-700">
                        Credit Card Debt
                      </label>
                      <InfoIcon tooltip="Minimum monthly credit card payments" />
                    </div>
                    <input
                      name="creditCardDebt"
                      value={inputs.creditCardDebt}
                      onChange={handleChange}
                      type="number"
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                      placeholder="$0"
                    />
                  </div>
                  <div>
                    <div className="flex items-center mb-3">
                      <label className="text-lg font-semibold text-gray-700">
                        Student Loans
                      </label>
                      <InfoIcon tooltip="Monthly student loan payments" />
                    </div>
                    <input
                      name="studentLoans"
                      value={inputs.studentLoans}
                      onChange={handleChange}
                      type="number"
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                      placeholder="$0"
                    />
                  </div>
                  <div>
                    <div className="flex items-center mb-3">
                      <label className="text-lg font-semibold text-gray-700">
                        Child Support
                      </label>
                      <InfoIcon tooltip="Monthly child support or alimony payments" />
                    </div>
                    <input
                      name="childSupport"
                      value={inputs.childSupport}
                      onChange={handleChange}
                      type="number"
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                      placeholder="$0"
                    />
                  </div>
                  <div>
                    <div className="flex items-center mb-3">
                      <label className="text-lg font-semibold text-gray-700">
                        Other Mortgages
                      </label>
                      <InfoIcon tooltip="Payments on existing mortgage or investment properties" />
                    </div>
                    <input
                      name="otherMortgages"
                      value={inputs.otherMortgages}
                      onChange={handleChange}
                      type="number"
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                      placeholder="$0"
                    />
                  </div>
                  <div>
                    <div className="flex items-center mb-3">
                      <label className="text-lg font-semibold text-gray-700">
                        Other Loans
                      </label>
                      <InfoIcon tooltip="Any other monthly loan payments not listed above" />
                    </div>
                    <input
                      name="otherLoans"
                      value={inputs.otherLoans}
                      onChange={handleChange}
                      type="number"
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                      placeholder="$0"
                    />
                  </div>
                </div>
                <div className="mt-6">
                  <div className="flex items-center mb-3">
                    <label className="text-lg font-semibold text-gray-700">
                      Max Payment After Expenses
                    </label>
                    <InfoIcon tooltip="Maximum monthly amount you can afford for mortgage after all expenses" />
                  </div>
                  <input
                    name="maxMonthlyPaymentAfterExpenses"
                    value={inputs.maxMonthlyPaymentAfterExpenses}
                    onChange={handleChange}
                    type="number"
                    className="w-full border-2 border-gray-200 rounded-xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-lg transition-all duration-200"
                    placeholder="Enter max payment capacity"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Housing Expenses & Financing */}
          <div className="p-8 bg-gradient-to-r from-green-50 to-blue-50">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Housing Expenses */}
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <div className="flex items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">
                    🏠 Monthly Housing Expenses
                  </h3>
                  <InfoIcon tooltip="Additional monthly costs associated with homeownership" />
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center mb-2">
                      <label className="text-gray-700 font-semibold">
                        Property Tax (Monthly)
                      </label>
                      <InfoIcon tooltip="Monthly portion of annual property taxes" />
                    </div>
                    <input
                      name="propertyTax"
                      value={inputs.propertyTax}
                      onChange={handleChange}
                      type="number"
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                      placeholder="$0"
                    />
                  </div>
                  <div>
                    <div className="flex items-center mb-2">
                      <label className="text-gray-700 font-semibold">
                        Home Owners Insurance
                      </label>
                      <InfoIcon tooltip="Monthly homeowners insurance premium" />
                    </div>
                    <input
                      name="homeOwnersInsurance"
                      value={inputs.homeOwnersInsurance}
                      onChange={handleChange}
                      type="number"
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                      placeholder="$0"
                    />
                  </div>
                  <div>
                    <div className="flex items-center mb-2">
                      <label className="text-gray-700 font-semibold">
                        HOA Fees
                      </label>
                      <InfoIcon tooltip="Homeowners Association monthly fees" />
                    </div>
                    <input
                      name="hoaFees"
                      value={inputs.hoaFees}
                      onChange={handleChange}
                      type="number"
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                      placeholder="$0"
                    />
                  </div>
                  <div>
                    <div className="flex items-center mb-2">
                      <label className="text-gray-700 font-semibold">
                        Max Monthly Payment
                      </label>
                      <InfoIcon tooltip="Total maximum monthly payment including all housing costs" />
                    </div>
                    <input
                      name="maxMonthlyPayment"
                      value={inputs.maxMonthlyPayment}
                      onChange={handleChange}
                      type="number"
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                      placeholder="$0"
                    />
                  </div>
                </div>
              </div>

              {/* Financing */}
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <div className="flex items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">
                    💰 Financing Details
                  </h3>
                  <InfoIcon tooltip="Loan terms and down payment information" />
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center mb-2">
                      <label className="text-gray-700 font-semibold">
                        Down Payment ($)
                      </label>
                      <InfoIcon tooltip="Amount you plan to put down upfront" />
                    </div>
                    <input
                      name="downPayment"
                      value={inputs.downPayment}
                      onChange={handleChange}
                      type="number"
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder="50000"
                    />
                  </div>
                  <div>
                    <div className="flex items-center mb-2">
                      <label className="text-gray-700 font-semibold">
                        Interest Rate (%)
                      </label>
                      <InfoIcon tooltip="Expected annual interest rate for your mortgage" />
                    </div>
                    <input
                      name="interestRate"
                      value={inputs.interestRate}
                      onChange={handleChange}
                      type="number"
                      step="0.01"
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder="6.5"
                    />
                  </div>
                  <div>
                    <div className="flex items-center mb-2">
                      <label className="text-gray-700 font-semibold">
                        Loan Term (Years)
                      </label>
                      <InfoIcon tooltip="Length of the mortgage loan (typically 15 or 30 years)" />
                    </div>
                    <input
                      name="loanTerm"
                      value={inputs.loanTerm}
                      onChange={handleChange}
                      type="number"
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder="30"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Predict Button */}
          <div className="p-8 text-center bg-gradient-to-r from-gray-50 to-blue-50">
            <button
              onClick={calculateApproval}
              className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold py-6 px-16 rounded-2xl text-2xl shadow-2xl transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300 animate-pulse"
            >
              🎯 Predict My Approval Chances
            </button>
          </div>

          {/* Results */}
          {approvalChance !== null && (
            <div className="p-8 bg-gradient-to-r from-emerald-50 to-teal-50">
              <div className="bg-white p-8 rounded-2xl shadow-2xl border border-gray-100">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
                  📊 Your Mortgage Assessment
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center p-6 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl">
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">
                      💰 Average Monthly Revenue
                    </h3>
                    <p className="text-4xl font-bold text-green-600">
                      ${averageRevenue.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl">
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">
                      📈 Approval Probability
                    </h3>
                    <p
                      className={`text-5xl font-bold ${
                        approvalChance >= 70
                          ? "text-green-600"
                          : approvalChance >= 50
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {approvalChance}%
                    </p>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl">
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">
                      🏠 Estimated Max Home Price
                    </h3>
                    <p className="text-4xl font-bold text-purple-600">
                      ${maxHomePrice.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Links */}
          <div className="p-8 text-center bg-gradient-to-r from-slate-800 to-gray-800 text-white">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">Take the Next Step</h3>
              <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-6">
                <a
                  href="https://trussfinancialgroup.com/contact"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold px-8 py-4 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105"
                >
                  💬 Talk to Our Expert Advisor
                </a>
                <a
                  href="https://docs.google.com/spreadsheets/d/1Mc-yiit_4VP5oU3VMfTKqAtbEynGgL1H/edit?pli=1&gid=1104949358#gid=1104949358"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-300 hover:text-blue-100 font-semibold underline decoration-2 underline-offset-4 transition-colors duration-200"
                >
                  📊 Download Calculation Excel Sheet
                </a>
                <a
                  href="https://trussfinancialgroup.com/self-help-kit"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-300 hover:text-blue-100 font-semibold underline decoration-2 underline-offset-4 transition-colors duration-200"
                >
                  🎯 Download Self-Help Kit
                </a>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="p-6 text-center text-xs text-gray-500 bg-gray-50 border-t border-gray-200">
            <p className="max-w-4xl mx-auto italic">
              The information provided by this predictor is for illustrative
              purposes only, and accuracy is not guaranteed. • All income
              information are projections only and provided for comparison
              purposes only. • This predictor does not have the ability to
              pre-qualify submissions for any loan program. • No results
              provided constitute a credit decision or an offer for the
              extension of credit. • Actual determination of income requires
              independent verification • Qualification for loan programs
              requires specific borrower and property information, and other
              information which is not gathered by this predictor. • Results
              should only be evaluated by a mortgage professional.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
