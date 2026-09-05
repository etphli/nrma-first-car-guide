import React, { useId, useState } from 'react';

const terms = {
  Premium: 'The price you pay for insurance. An annual premium covers a year; paying in instalments may cost more overall.',
  Excess: 'Your contribution to a covered claim. A basic excess is the standard amount; extra driver or age excesses may also apply.',
  'Agreed value': 'A vehicle amount you and the insurer agree on when setting up the policy, subject to policy terms and deductions.',
  'Market value': 'What the insurer assesses your car was worth just before the loss, using factors such as age and condition.',
  PDS: 'Product Disclosure Statement: the document explaining benefits, limits, exclusions and conditions. Read it alongside your policy schedule.',
  Exclusions: 'Situations or losses the policy does not cover.',
  'At fault': 'Being responsible for an accident. The insurer assesses responsibility and applies the policy terms.',
  'Listed driver': 'A driver named on the policy. Check how cover and excesses work for anyone not listed.',
  Modifications: 'Changes from the original factory specification, such as engine, suspension or wheel changes. Tell the insurer about them.',
};

export function InsuranceInfo({ term }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return <span className="lb-insurance-info" onKeyDown={(event) => { if (event.key === 'Escape') setOpen(false); }}>
    <button type="button" aria-label={`What does ${term.toLowerCase()} mean?`} aria-expanded={open} aria-controls={id} onClick={() => setOpen((value) => !value)}>i</button>
    {open && <span id={id} className="lb-term-explanation"><strong>{term}</strong>{terms[term]}</span>}
  </span>;
}

const extraQuestions = [
  { key: 'variant', label: 'Exact make, model and variant', hint: 'For example, Mazda 3 Maxx hatchback. Check the listing or registration papers.' },
  { key: 'postcode', label: 'Overnight parking postcode', hint: 'Four digits. Give the full address only to the insurer.' },
  { key: 'licence', label: 'Licence type', options: ['Learner', 'Provisional P1', 'Provisional P2', 'Full', 'Overseas'] },
  { key: 'transmission', label: 'Transmission', options: ['Automatic', 'Manual'] },
  { key: 'fuelType', label: 'Fuel type', options: ['Petrol', 'Diesel', 'Hybrid', 'Electric', 'Other'] },
  { key: 'modifications', label: 'Any modifications?', term: 'Modifications', options: ['No', 'Yes'] },
  { key: 'damage', label: 'Any existing damage?', options: ['No', 'Yes'] },
  { key: 'business', label: 'Delivery, rideshare or business use?', options: ['No', 'Yes'] },
  { key: 'startDate', label: 'When should cover start?', type: 'date' },
  { key: 'targetExcess', label: 'Basic excess to compare ($)', term: 'Excess', type: 'number', min: 0, hint: 'Choose a starting amount, then check what each insurer offers.' },
];

const savedQuestions = [
  { key: 'vehicleYear', label: 'Vehicle year', type: 'number', min: 1900, max: new Date().getFullYear() + 1 },
  { key: 'price', label: 'Vehicle purchase price ($)', type: 'number', min: 1 },
  { key: 'driverAge', label: 'Main driver age', type: 'number', min: 16, max: 99 },
  { key: 'licenceYears', label: 'Years licensed', type: 'number', min: 0, max: 80 },
  { key: 'claimsLastFive', label: 'Claims in the last 5 years', type: 'number', min: 0, max: 30 },
  { key: 'additionalDrivers', label: 'Any additional drivers?', options: ['No', 'Yes'], term: 'Listed driver' },
  { key: 'financeOwing', label: 'Is the car financed?', options: ['No', 'Yes', 'Not sure'] },
  { key: 'kilometres', label: 'Kilometres each year', type: 'number', min: 0, max: 200000 },
  { key: 'parking', label: 'Overnight parking', options: ['Garage', 'Driveway', 'Street'] },
  { key: 'coverBasis', label: 'Vehicle value preference', options: ['Agreed value where available', 'Market value', 'Compare both'], term: 'Agreed value' },
];

function PrepField({ question, value, onChange }) {
  const id = useId();
  const { label, options, hint, term, type = 'text', min, max } = question;
  return <div className="lb-prep-field">
    <div><label htmlFor={id}>{label}</label>{term && <InsuranceInfo term={term} />}</div>
    {options ? <select id={id} value={value ?? ''} onChange={(event) => onChange(event.target.value)}><option value="">Choose an answer</option>{options.map((option) => <option key={option}>{option}</option>)}</select>
      : <input id={id} type={type} min={min} max={max} maxLength={type === 'text' ? 120 : undefined} value={value ?? ''} onChange={(event) => onChange(event.target.value)} />}
    {hint && <small>{hint}</small>}
  </div>;
}

export default function QuotePreparation({ decision, setDecision }) {
  const [answers, setAnswers] = useState({});
  const [confirmed, setConfirmed] = useState(false);
  const questions = [...extraQuestions];
  if (decision.additionalDrivers === 'Yes') questions.push({ key: 'youngest', label: 'Youngest additional driver age', type: 'number', min: 16, max: 99 });
  if (Number(decision.claimsLastFive) > 0) questions.push({ key: 'claimNotes', label: 'Do you have dates and types of claims ready?', options: ['Yes', 'Still checking'], hint: 'Give the insurer the detail it asks for, including incidents outside this five-year planning window if requested.' });
  if (answers.modifications === 'Yes') questions.push({ key: 'modificationNotes', label: 'Which modifications?', term: 'Modifications' });
  if (answers.damage === 'Yes') questions.push({ key: 'damageNotes', label: 'What existing damage does the car have?' });
  if (answers.business === 'Yes') questions.push({ key: 'businessType', label: 'What kind of business driving?', options: ['Business errands', 'Delivery', 'Rideshare', 'Other'], hint: 'Check eligibility directly. Personal car cover may not suit this use.' });
  const complete = (question) => {
    const value = answers[question.key];
    if (value === undefined || String(value).trim() === '' || value === 'Still checking') return false;
    if (question.key === 'postcode') return /^\d{4}$/.test(String(value));
    if (question.type === 'number') return Number.isFinite(Number(value)) && Number(value) >= question.min && (question.max === undefined || Number(value) <= question.max);
    return true;
  };
  const answered = questions.filter(complete).length;
  return <section className="lb-quote-prep" aria-labelledby="quote-prep-title">
    <header><div><span>BEFORE YOU GET QUOTES</span><h2 id="quote-prep-title">Fill in the gaps here.</h2><p>Review your saved answers, then prepare the details the car check did not ask for. This is a planning checklist, not an insurer application.</p></div><output aria-live="polite"><strong>{answered}/{questions.length}</strong> extra details ready</output></header>
    <details className="lb-prep-saved" open><summary>Review or change your saved car-check answers</summary><div className="lb-prep-grid">{savedQuestions.map((question) => <PrepField key={question.key} question={question} value={decision[question.key]} onChange={(value) => { setConfirmed(false); setDecision((current) => ({ ...current, [question.key]: value })); }} />)}</div><label className="lb-prep-confirm"><input type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} /> I checked these answers. They describe my situation, not the example car.</label></details>
    <div className="lb-prep-grid">{questions.map((question) => <PrepField key={question.key} question={question} value={answers[question.key]} onChange={(value) => setAnswers((current) => ({ ...current, [question.key]: value }))} />)}</div>
    <div className="lb-prep-status" role="status">{answered === questions.length && confirmed ? 'Your planning checklist is ready. Each insurer still decides what information it needs and whether it can offer cover.' : `${questions.length - answered} extra details still to check.${confirmed ? '' : ' Review and confirm the saved answers too.'}`}</div>
    <aside><strong>Have these ready for the insurer, not Lowbeam</strong><p>Your full overnight address and postcode, date of birth, registration or VIN, licence details, each driver's history, finance details and any requested claims or driving-offence records. Answer the insurer's exact questions and time periods honestly.</p><p>These extra answers stay only on this page and reset when you leave or reload. Edits to the saved car-check answers remain on this browser. Nothing here is sent to an insurer.</p></aside>
    <details className="lb-insurance-glossary"><summary>Insurance words, explained</summary><div>{Object.keys(terms).map((term) => <div key={term}><span>{term}</span><InsuranceInfo term={term} /></div>)}</div><p>General explanations only. The <a href="https://moneysmart.gov.au/car-insurance/choosing-car-insurance" target="_blank" rel="noreferrer">MoneySmart guide</a> and each insurer's PDS explain what to check.</p></details>
  </section>;
}
