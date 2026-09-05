import React from 'react';

const links = {
  money: ['MoneySmart · Buying and running a car', 'https://moneysmart.gov.au/student-life-and-money/buying-and-running-a-car'],
  rights: ['ACCC · New and second-hand cars', 'https://www.accc.gov.au/consumers/specific-products-and-activities/new-and-second-hand-cars'],
  private: ['ACCC · Consumer rights and guarantees', 'https://www.accc.gov.au/consumers/buying-products-and-services/consumer-rights-and-guarantees'],
  nsw: ['NSW Government · Buying a used vehicle', 'https://www.nsw.gov.au/driving-boating-and-transport/buying-and-selling-vehicles/buying-a-used-vehicle'],
  ppsr: ['PPSR · Official $2 car check', 'https://www.ppsr.gov.au/carcheck'],
  insurance: ['MoneySmart · Choosing car insurance', 'https://moneysmart.gov.au/car-insurance/choosing-car-insurance'],
  risk: ['MoneySmart · How insurance works', 'https://moneysmart.gov.au/supporting-first-nations-people-with-money-matters/how-insurance-works'],
  sira: ['SIRA · NSW CTP scheme', 'https://www.sira.nsw.gov.au/motor'],
  safety: ['ANCAP · Safety rating FAQs', 'https://www.ancap.com.au/frequently-asked-questions'],
  help: ['NSW Fair Trading · Automotive complaints', 'https://www.nsw.gov.au/departments-and-agencies/fair-trading/complaints-and-enquiries/automotive'],
  ncat: ['NCAT · Motor vehicle disputes', 'https://ncat.nsw.gov.au/case-types/consumers-and-businesses/motor-vehicles.html'],
};

export const researchSources = [
  ...Object.values(links).map(([label, url]) => [label.split(' · ')[0], label.split(' · ')[1], url, 'Official guidance. Reviewed 5 September 2026.']),
  ['NRMA Insurance', 'Company and branding information', 'https://www.nrma.com.au/about-the-company', 'Explains the separate NRMA and NRMA Insurance businesses.'],
  ['NRMA Insurance', 'Comprehensive Car Insurance', 'https://www.nrma.com.au/car-insurance/comprehensive-car-insurance', 'Product information and official quote pathway. Check the current PDS.'],
  ['Youi', 'Comprehensive Car Insurance', 'https://www.youi.com.au/car-insurance/comprehensive', 'Product information and official quote pathway.'],
  ['Budget Direct', 'Comprehensive Car Insurance', 'https://www.budgetdirect.com.au/car-insurance/comprehensive-car-insurance.html', 'Product information and official quote pathway.'],
  ['SRT Performance via Sketchfab', 'BMW M4 Competition M Package', 'https://sketchfab.com/3d-models/bmw-m4-competition-m-package-5c0a2dafb1ad408d9fc9eeef9aee531b', 'Original project model credit. Source page unavailable during this review; licence needs confirmation.'],
];

export const mistakes = [
  ['Spending every dollar of your savings', 'The advertised price becomes the target, so a buyer treats all their savings as spending money.', 'Set a purchase limit after allowing for fees, running costs and emergency savings. Keep the emergency money separate.', 'A repair or insurance excess could force you to borrow or leave the car unusable.', ['money']],
  ['Forgetting the ongoing costs', 'Weekly fuel feels small, while annual registration and insurance are easy to put off thinking about.', 'Convert yearly bills into monthly savings amounts and compare running costs before choosing a model.', 'Bills can exceed your income, causing missed payments and leaving less for other needs.', ['money']],
  ['Choosing appearance over reliability', 'A sporty look or a good sound system is easier to judge than engine condition or safety.', 'Check service records and get an independent inspection. Look up the exact variant and rating year, not just the number of safety stars.', 'You may face expensive repairs or buy a car with weaker safety protection than expected.', ['nsw', 'safety']],
  ['Not comparing prices', 'The first attractive listing feels like a bargain when you have no similar cars to compare it with.', 'Compare several cars with similar age, kilometres, condition and service history. Use the evidence to negotiate.', 'Overpaying uses up money you could have kept for maintenance or savings.', ['money']],
  ['Skipping an independent inspection', 'A buyer trusts the seller or avoids paying for a mechanic because the car seemed fine on a short drive.', 'Arrange an independent pre-purchase inspection and read the report before committing. A registration check is not a full mechanical inspection.', 'Hidden engine, brake or transmission faults may leave you with repair bills or an unsafe car.', ['nsw']],
  ['Ignoring the vehicle history', 'A clean-looking car and a convincing seller can make paperwork seem unnecessary.', 'Match the VIN and get the official $2 PPSR search on the day of purchase or the day before. Check service and registration records separately for kilometres.', 'A registered security interest can put the car at risk of repossession. Stolen or written-off records can reveal further risks.', ['ppsr']],
  ['Picking the wrong insurance', 'Similar names make it easy to confuse CTP with property cover, or choose only by price.', 'Compare what is insured, exclusions and the excess. Read the PDS, which explains the policy, and arrange cover before driving away.', 'CTP will not pay for damage to another car. Without suitable property cover, you could owe a large amount after a crash.', ['insurance', 'sira']],
  ['Not understanding your consumer rights', 'A buyer assumes every seller offers the same protection or that a warranty replaces legal rights.', 'Check whether the seller is a licensed dealer or a private owner. Keep the ad and contract, and learn which remedies apply.', 'You may accept a faulty car without seeking a remedy, or expect protections that a private sale does not provide.', ['rights', 'private']],
  ['Rushing because you feel pressure', 'Fear of missing out makes “someone else is coming today” sound like a reason to skip checks.', 'Take a trusted person, compare your options and walk away if you cannot inspect the car or verify the seller.', 'A rushed deposit or contract may commit you to an unsuitable car and be difficult to undo.', ['nsw']],
  ['Failing to budget before buying', 'A small repayment can look affordable when you have not added it to everyday spending.', 'Start with take-home income, subtract essentials and savings, then include every car cost. If borrowing, compare total repayments, fees and any final balloon payment.', 'Repayments can crowd out essentials. Missed loan payments can lead to fees, debt problems and repossession.', ['money']],
];

export function SourceNote({ ids }) {
  return <div className="assignment-sources"><span>Read the evidence</span>{ids.map((id) => <a key={id} href={links[id][1]} target="_blank" rel="noreferrer">{links[id][0]} ↗</a>)}</div>;
}

export function RightsExplained({ sellerType }) {
  return <section className="assignment-section" aria-label="NSW consumer protections">
    <div className="assignment-heading"><span>THE RULES IN NSW</span><h2>{sellerType === 'Dealer' ? 'A warranty is not the limit of your rights.' : 'Private sale? Check more before you pay.'}</h2></div>
    <div className="assignment-grid">
      <article><span className="assignment-index">01 / YOUR RIGHTS</span><h3>{sellerType === 'Dealer' ? 'Buying from a licensed dealer' : 'Buying from a private owner'}</h3><p>{sellerType === 'Dealer' ? 'Consumer guarantees cover matters such as acceptable quality and matching the description. Expectations depend on the car’s age, price, condition and disclosed faults. For a major failure, you can generally choose a refund or replacement; for a minor fault, the dealer usually gets the chance to repair it.' : 'Most consumer guarantees, including acceptable quality, do not apply to a one-off private sale. Guarantees about title, undisturbed possession and undisclosed debts still apply. Verify the seller’s identity and right to sell, and get a receipt with the VIN and sale details.'}</p><SourceNote ids={sellerType === 'Dealer' ? ['rights'] : ['private']} /></article>
      <article><span className="assignment-index">02 / EXTRA PROTECTION</span><h3>NSW dealer guarantee</h3><p>For eligible used cars less than 10 years old AND under 160,000 km, the dealer guarantee covers relevant defects for 3 months or 5,000 km, whichever comes first. Exceptions apply. Australian Consumer Law rights can continue beyond this guarantee.</p><SourceNote ids={['nsw']} /></article>
    </div>
    <div className="assignment-checks"><div><b>$2</b><h3>History check</h3><p>PPSR shows registered security interests and may show stolen or written-off records. It does not identify the owner, show kilometres or prove mechanical condition.</p><SourceNote ids={['ppsr']} /></div><div><b>+ inspection</b><h3>Condition check</h3><p>A mechanic can assess the engine, brakes, tyres and signs of damage. Compare the VIN and service records too. Check ANCAP’s rating year and the exact vehicle variant.</p><SourceNote ids={['nsw', 'safety']} /></div></div>
    <div className="assignment-help"><span>IF SOMETHING GOES WRONG</span><h3>Keep records. Ask for a remedy. Escalate.</h3><p>Contact the dealer in writing with the fault, evidence and remedy you want. If it remains unresolved, ask NSW Fair Trading for help. NCAT can decide eligible dealer and repair disputes. For a private-sale dispute, seek legal advice about your options. The ACCC accepts reports but does not resolve individual disputes.</p><SourceNote ids={['help', 'ncat', 'rights']} /></div>
  </section>;
}

export function PremiumExplained() {
  return <section className="assignment-section assignment-risk"><div className="assignment-heading"><span>WHY INSURERS ASSESS RISK</span><h2>A premium reflects the chance and cost of a claim.</h2><p>Insurers pool premiums to pay covered claims. They estimate how likely you are to claim and how expensive that claim could be, then price cover using that risk alongside their costs and pricing decisions.</p></div><div className="assignment-grid assignment-four">{[
    ['The driver', 'Age, experience and claims history help insurers estimate the likelihood of a claim.'],
    ['The car', 'Value, model, modifications and repair costs affect how expensive a claim could be.'],
    ['Where and how', 'Parking location, use and kilometres can affect exposure to theft and crashes.'],
    ['The policy', 'Cover level, value basis and excess change how much risk the insurer takes on.'],
  ].map(([title, copy], i) => <article key={title}><span className="assignment-index">0{i + 1}</span><h3>{title}</h3><p>{copy}</p></article>)}</div><SourceNote ids={['risk', 'insurance']} /></section>;
}

export function BudgetExample() {
  return <section className="assignment-section"><div className="assignment-heading"><span>ILLUSTRATIVE CASH PURCHASE · NOT A QUOTE</span><h2>A $14,000 car needs more than $14,000.</h2><p>These made-up amounts show how to build a budget. Replace every allowance with a real price. This example assumes registration and CTP are current at purchase.</p></div><div className="assignment-budget"><div><span>Initial spending</span><strong>$14,800</strong><p>$14,000 car + $500 transfer and duty allowance + $250 inspection + $50 fuel.</p></div><div><span>Emergency savings kept aside</span><strong>$2,500</strong><p>Still your money. Reserved for repairs or an insurance excess, not part of the purchase price.</p></div><div><span>Savings needed at handover</span><strong>$17,300</strong><p>Initial spending + emergency savings. Add any insurance premium or registration due immediately.</p></div></div><div className="assignment-help"><h3>Then allow for life after the purchase.</h3><p>The example running costs total $475 a month, or $5,700 a year. Add loan repayments if you borrow, plus parking, tolls and other costs. Depreciation is the loss in the car’s resale value; it matters to the total cost of ownership even though it is not a monthly bill.</p><p><strong>Opportunity cost</strong> is what you give up by using money on the car, such as keeping savings for study or travel. A budget helps you decide whether that trade-off is worth it.</p></div></section>;
}
