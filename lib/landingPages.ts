export type LandingPage = {
  slug: string;
  eyebrow: string;
  headline: string;
  subheadline: string;
  primaryCta: string;
  audience: string;
  painPoints: string[];
  opportunities: string[];
  proofPoints: string[];
  faq: {
    question: string;
    answer: string;
  }[];
};

export const landingPages: LandingPage[] = [
  {
    slug: "business-owner-tax-planning",
    eyebrow: "Tax Planning for Business Owners",
    headline: "Business owners may be missing valuable tax planning opportunities.",
    subheadline:
      "If your business is profitable, your tax situation may deserve more than year-end tax preparation. Start with a Unity Tax Opportunity Assessment™ to identify planning areas worth reviewing.",
    primaryCta: "Start My Business Owner Assessment",
    audience: "Business owners, founders, and self-employed professionals",
    painPoints: [
      "You feel like taxes are one of your largest expenses.",
      "You are unsure whether your entity structure is still appropriate.",
      "You may not be maximizing retirement plan opportunities.",
      "Your CPA prepares the return, but you want more proactive planning.",
    ],
    opportunities: [
      "Entity structure review",
      "S corporation planning",
      "Retirement plan design",
      "QBI and deduction coordination",
      "Business sale preparation",
      "Cash-flow tax planning",
    ],
    proofPoints: [
      "Built for proactive tax planning, not just tax filing.",
      "Designed to coordinate with your CPA and advisory team.",
      "Focused on identifying planning opportunities before deadlines pass.",
    ],
    faq: [
      {
        question: "Do I need to change CPAs?",
        answer:
          "No. Unity Tax Planning can help identify planning areas and coordinate questions with your existing CPA or tax professional.",
      },
      {
        question: "Is this only for large businesses?",
        answer:
          "No. The right fit depends on profitability, complexity, goals, and planning opportunities — not just company size.",
      },
    ],
  },
  {
    slug: "high-income-tax-planning",
    eyebrow: "Tax Planning for High-Income Families",
    headline: "High income can create tax complexity that basic preparation may not solve.",
    subheadline:
      "If your household income is growing, a proactive tax planning review may help identify opportunities around investments, charitable giving, retirement accounts, and income timing.",
    primaryCta: "Start My High-Income Assessment",
    audience: "High-income families and professionals",
    painPoints: [
      "You earn a strong income but feel like taxes keep rising.",
      "You have taxable investments and are unsure how tax-efficient they are.",
      "You want better coordination between income, investments, and taxes.",
      "You are charitable but unsure whether your giving strategy is optimized.",
    ],
    opportunities: [
      "Investment tax efficiency",
      "Charitable giving strategy",
      "Income timing review",
      "Roth conversion analysis",
      "Tax-loss harvesting review",
      "Estate coordination",
    ],
    proofPoints: [
      "Designed for families with more moving parts.",
      "Coordinates tax strategy with broader financial planning.",
      "Built to identify opportunities before the year is already over.",
    ],
    faq: [
      {
        question: "Is this tax preparation?",
        answer:
          "No. This is proactive tax planning designed to identify opportunities before decisions are finalized.",
      },
      {
        question: "What if I already have an advisor?",
        answer:
          "You can still complete an assessment. Planning findings can be coordinated with your existing professionals when appropriate.",
      },
    ],
  },
  {
    slug: "capital-gains-tax-planning",
    eyebrow: "Capital Gains Tax Planning",
    headline: "A large capital gain should be planned before the sale closes.",
    subheadline:
      "Whether you are selling a business, real estate, stock, or another appreciated asset, timing and structure may materially affect your tax outcome.",
    primaryCta: "Start My Capital Gains Assessment",
    audience: "Investors, business sellers, real estate owners, and executives",
    painPoints: [
      "You are preparing to sell an appreciated asset.",
      "You are unsure how much tax the sale may create.",
      "You want to explore charitable or timing strategies before closing.",
      "You need coordination between your CPA, attorney, and advisor.",
    ],
    opportunities: [
      "Pre-sale tax planning",
      "Charitable planning before sale",
      "Installment sale considerations",
      "Tax-loss harvesting review",
      "Estimated tax planning",
      "Reinvestment strategy coordination",
    ],
    proofPoints: [
      "Focused on planning before transactions become irreversible.",
      "Designed for coordination with CPAs, attorneys, and advisors.",
      "Built for complex liquidity events and investment decisions.",
    ],
    faq: [
      {
        question: "When should I start planning?",
        answer:
          "Ideally before the sale is finalized. Many planning opportunities are more effective before closing.",
      },
      {
        question: "Can this help with real estate sales?",
        answer:
          "Yes. Real estate sales may involve basis, depreciation, installment sale considerations, charitable strategies, and reinvestment decisions.",
      },
    ],
  },
  {
    slug: "pre-retirement-tax-planning",
    eyebrow: "Tax Planning Before Retirement",
    headline: "The years before retirement may be your most valuable tax planning window.",
    subheadline:
      "Before RMDs, Medicare, Social Security, and portfolio withdrawals begin, there may be planning opportunities worth reviewing.",
    primaryCta: "Start My Pre-Retirement Assessment",
    audience: "Pre-retirees and retirees",
    painPoints: [
      "You are unsure when to start Roth conversions.",
      "You want to reduce future RMD pressure.",
      "You are worried about Medicare IRMAA and Social Security taxation.",
      "You need a tax-aware retirement income strategy.",
    ],
    opportunities: [
      "Roth conversion planning",
      "RMD planning",
      "IRMAA review",
      "Social Security tax coordination",
      "Withdrawal sequencing",
      "Legacy and beneficiary planning",
    ],
    proofPoints: [
      "Focused on the retirement transition window.",
      "Designed to coordinate tax and retirement income decisions.",
      "Helps identify planning items before deadlines and age milestones.",
    ],
    faq: [
      {
        question: "Is this only for people already retired?",
        answer:
          "No. Many of the most valuable planning opportunities occur in the years before retirement or before RMDs begin.",
      },
      {
        question: "Can this help with Roth conversions?",
        answer:
          "Yes. A review can help determine whether Roth conversion planning deserves deeper analysis.",
      },
    ],
  },
  {
    slug: "real-estate-tax-planning",
    eyebrow: "Tax Planning for Real Estate Investors",
    headline: "Real estate can create tax opportunities — and tax surprises.",
    subheadline:
      "If you own rental property, commercial real estate, or are preparing for a sale, proactive planning may help clarify your options.",
    primaryCta: "Start My Real Estate Assessment",
    audience: "Rental property owners and real estate investors",
    painPoints: [
      "You own rental or commercial property and want more proactive planning.",
      "You are preparing to sell property with a large gain.",
      "You are unsure how depreciation, basis, or cash flow affects taxes.",
      "You need coordination between real estate, taxes, and investments.",
    ],
    opportunities: [
      "Capital gains planning",
      "Depreciation and basis review",
      "Entity structure considerations",
      "Cash-flow tax planning",
      "Estate coordination",
      "Reinvestment planning",
    ],
    proofPoints: [
      "Designed for property owners with more complex tax situations.",
      "Focused on planning before major real estate decisions are finalized.",
      "Built to coordinate with your CPA, attorney, and advisory team.",
    ],
    faq: [
      {
        question: "Do you prepare real estate tax returns?",
        answer:
          "No. Unity Tax Planning focuses on planning and coordination, not tax-return preparation unless separately agreed.",
      },
      {
        question: "Can this help before selling a property?",
        answer:
          "Yes. A review may help identify items to discuss before a sale is finalized.",
      },
    ],
  },
];

export function getLandingPage(slug: string) {
  return landingPages.find((page) => page.slug === slug);
}