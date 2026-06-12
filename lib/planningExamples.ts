export type PlanningExample = {
  slug: string;
  title: string;
  eyebrow: string;
  shortDescription: string;
  profile: string;
  mainConcern: string;
  blindSpots: string[];
  reportIncludes: string[];
  opportunities: string[];
  samplePdf: string;
  sampleButtonText: string;
};

export const planningExamples: PlanningExample[] = [
  {
    slug: "high-income-family",
    title: "High-Income Family Tax Planning",
    eyebrow: "Sample Plan",
    shortDescription:
      "A dual-income household earning significant W-2 income wants to understand where taxes may be leaking wealth.",
    profile:
      "This hypothetical family earns strong W-2 income, itemizes deductions, contributes to retirement plans, gives to charity, and holds a taxable brokerage account.",
    mainConcern:
      "They feel like they are already doing the obvious things, but they want to know whether additional tax planning strategies are available before year-end.",
    blindSpots: [
      "Backdoor Roth IRA opportunities",
      "Charitable giving with appreciated securities",
      "Tax-loss harvesting in a taxable brokerage account",
      "Asset location across taxable and retirement accounts",
      "Bracket management around bonuses, capital gains, and investment income",
    ],
    reportIncludes: [
      "Current tax position and bracket analysis",
      "SALT deduction and itemized deduction review",
      "Backdoor Roth and possible Mega Backdoor Roth discussion",
      "Appreciated stock gifting and donor-advised fund considerations",
      "Tax-loss harvesting and asset location opportunities",
      "CPA coordination notes and year-end action items",
    ],
    opportunities: [
      "Increase tax-free Roth accumulation",
      "Reduce taxable investment drag",
      "Give more tax-efficiently",
      "Coordinate year-end income, deductions, and capital gains",
    ],
    samplePdf: "/sample-plans/high-income-family-tax-plan-sample.pdf",
    sampleButtonText: "View Sample High-Income Family Plan",
  },
  {
    slug: "business-owner",
    title: "Business Owner Tax Planning",
    eyebrow: "Sample Plan",
    shortDescription:
      "An S-Corporation business owner wants to coordinate business income, retirement plan design, and personal tax strategy.",
    profile:
      "This hypothetical household receives income from W-2 wages, S-Corporation pass-through income, investment income, and business distributions.",
    mainConcern:
      "The owner has strong income but wants to know whether the business structure, retirement plan, estimated taxes, and personal tax plan are working together.",
    blindSpots: [
      "SEP-IRA versus Solo 401(k) and Cash Balance Plan design",
      "S-Corp reasonable compensation review",
      "QBI deduction limitations",
      "Estimated tax coordination",
      "Entity structure questions to review with the CPA",
    ],
    reportIncludes: [
      "Income composition and total tax burden",
      "Federal bracket analysis",
      "S-Corp reasonable compensation discussion",
      "Retirement plan optimization comparison",
      "Estimated tax payment coordination",
      "CPA questions and projected tax impact",
    ],
    opportunities: [
      "Increase deductible retirement contributions",
      "Reduce current-year federal tax liability",
      "Improve quarterly tax reserve planning",
      "Coordinate business and household tax strategy",
    ],
    samplePdf: "/sample-plans/business-owner-tax-plan-sample.pdf",
    sampleButtonText: "View Sample Business Owner Plan",
  },
  {
    slug: "pre-retiree-large-iras",
    title: "Pre-Retiree with Large IRAs",
    eyebrow: "Sample Plan",
    shortDescription:
      "A couple approaching retirement wants to reduce future RMD pressure and avoid unnecessary tax surprises.",
    profile:
      "This hypothetical couple has built large pre-tax IRA balances and wants to evaluate whether Roth conversions before RMD age could improve long-term tax outcomes.",
    mainConcern:
      "They want to know whether waiting until RMDs begin could force them into higher tax brackets later in retirement.",
    blindSpots: [
      "Roth conversion windows before RMD age",
      "Future required minimum distributions",
      "Medicare IRMAA exposure",
      "Social Security taxation",
      "Long-term tax bracket management",
    ],
    reportIncludes: [
      "Current retirement account picture",
      "Projected IRA balances and RMDs",
      "Roth conversion ladder analysis",
      "IRMAA and Medicare premium considerations",
      "Lifetime tax impact comparison",
      "Implementation roadmap",
    ],
    opportunities: [
      "Reduce future taxable RMDs",
      "Create more tax-free Roth assets",
      "Manage Medicare IRMAA exposure",
      "Improve withdrawal flexibility in retirement",
    ],
    samplePdf: "/sample-plans/roth-conversion-ladder-sample.pdf",
    sampleButtonText: "View Sample Roth Conversion Plan",
  },
  {
    slug: "large-capital-gain",
    title: "Large Capital Gain Planning",
    eyebrow: "Sample Plan",
    shortDescription:
      "A family preparing to sell a highly appreciated asset wants to understand tax options before closing.",
    profile:
      "This hypothetical family is considering selling a long-held rental property with a significant embedded gain and depreciation recapture.",
    mainConcern:
      "They want to know what can be done before the sale to reduce, defer, or better manage the tax impact.",
    blindSpots: [
      "Federal long-term capital gains tax",
      "Depreciation recapture",
      "Net Investment Income Tax",
      "State tax exposure",
      "Planning strategies that must happen before closing",
    ],
    reportIncludes: [
      "Estimated gain calculation",
      "Tax impact without planning",
      "Pre-sale optimization scenario comparison",
      "Donor-advised fund contribution strategy",
      "Tax-loss harvesting strategy",
      "Installment sale and partial 1031 exchange discussion",
      "Estimated tax payment schedule",
    ],
    opportunities: [
      "Reduce current-year tax liability",
      "Defer a portion of the gain",
      "Use charitable planning before liquidity",
      "Coordinate closing timeline with tax strategy",
    ],
    samplePdf: "/sample-plans/large-capital-gain-tax-plan-sample.pdf",
    sampleButtonText: "View Sample Capital Gain Plan",
  },
  {
    slug: "taxable-investment-account",
    title: "Taxable Investment Account Review",
    eyebrow: "Sample Plan",
    shortDescription:
      "A household with a large brokerage account wants to know whether the portfolio is being managed tax-efficiently.",
    profile:
      "This hypothetical household owns a taxable brokerage portfolio with embedded gains, harvestable losses, and some tax-inefficient holdings.",
    mainConcern:
      "They want to know whether their portfolio is creating unnecessary tax drag and whether losses or asset location could improve the outcome.",
    blindSpots: [
      "Unrealized capital gains exposure",
      "Unharvested tax losses",
      "Wash sale rule awareness",
      "Tax-inefficient holdings in taxable accounts",
      "Concentrated position planning",
    ],
    reportIncludes: [
      "Portfolio composition review",
      "Unrealized gains exposure",
      "Tax-loss harvesting opportunities",
      "Suggested replacement securities for tax-loss harvesting",
      "Asset location analysis",
      "Estimated tax drag and action plan",
    ],
    opportunities: [
      "Harvest losses to offset gains",
      "Reduce annual portfolio tax drag",
      "Improve asset location",
      "Create a multi-year diversification plan",
    ],
    samplePdf: "/sample-plans/taxable-investment-account-sample.pdf",
    sampleButtonText: "View Sample Investment Tax Review",
  },
  {
    slug: "charitable-giving",
    title: "Charitable Giving Tax Strategy",
    eyebrow: "Sample Plan",
    shortDescription:
      "A charitably inclined family wants to coordinate generosity with smarter tax planning.",
    profile:
      "This hypothetical family gives consistently to church, community organizations, and other charities, but most gifts are made by cash or check.",
    mainConcern:
      "They want to continue giving generously while making sure their charitable strategy is tax-efficient.",
    blindSpots: [
      "Cash gifts versus appreciated stock gifts",
      "Donor-advised fund bunching strategy",
      "Standard deduction versus itemizing",
      "Future qualified charitable distributions",
      "Long-term charitable roadmap",
    ],
    reportIncludes: [
      "Current giving snapshot",
      "Charitable deduction analysis",
      "Appreciated stock gifting comparison",
      "Donor-advised fund bunching strategy",
      "Future QCD planning",
      "Recommended next steps",
    ],
    opportunities: [
      "Avoid capital gains tax on donated appreciated stock",
      "Capture more itemized deductions through bunching",
      "Maintain the same giving schedule through a donor-advised fund",
      "Prepare for future QCD planning in retirement",
    ],
    samplePdf: "/sample-plans/charitable-giving-tax-plan-sample.pdf",
    sampleButtonText: "View Sample Charitable Giving Plan",
  },
];

export function getPlanningExample(slug: string) {
  return planningExamples.find((example) => example.slug === slug);
}