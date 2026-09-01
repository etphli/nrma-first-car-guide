import React, { useEffect, useMemo, useRef, useState } from 'react';
import CarStudio from './CarStudio.jsx';

const DEFAULT_DECISION = {
  model: 'Used hatchback',
  price: 14000,
  monthlyBudget: 500,
  kilometres: 12000,
  insurance: 140,
  fuel: 180,
  registration: 75,
  servicing: 80,
  history: true,
  inspected: false,
  safety: '5-star',
  seller: 'Dealer',
  usage: 'Mixed',
};

const learningCards = [
  { href: '/mistakes', eyebrow: 'Learn the traps', title: 'The mistake map', copy: 'Ten common first-car mistakes, decoded into clear actions.', icon: 'warning', colour: 'coral' },
  { href: '/costs', eyebrow: 'Plan your money', title: 'True cost lab', copy: 'See the purchase, running and hidden costs together.', icon: 'wallet', colour: 'lime' },
  { href: '/protect', eyebrow: 'Know your rights', title: 'Protection checklist', copy: 'Dealer or private seller? Know what to check first.', icon: 'shield', colour: 'blue' },
  { href: '/insurance', eyebrow: 'Understand cover', title: 'Cover, decoded', copy: 'A plain-language guide to the main insurance types.', icon: 'file', colour: 'violet' },
];

const signalData = [
  { key: 'budget', label: 'Budget fit', icon: 'wallet', colour: 'lime', copy: 'The monthly number you can actually live with.' },
  { key: 'ownership', label: 'Ownership', icon: 'wrench', colour: 'blue', copy: 'Fuel, servicing and the cost after the handover.' },
  { key: 'history', label: 'History', icon: 'history', colour: 'violet', copy: 'Past facts that shape future repair risk.' },
  { key: 'safety', label: 'Safety', icon: 'shield', colour: 'coral', copy: 'Protection for you, your passengers and your wallet.' },
  { key: 'seller', label: 'Seller', icon: 'person', colour: 'blue', copy: 'Who you are buying from and how it feels.' },
  { key: 'confidence', label: 'Confidence', icon: 'check', colour: 'lime', copy: 'The signal that brings the pieces together.' },
];

const missionSteps = [
  ['Set your brief', 'Write down what matters before you browse.'],
  ['Scan a shortlist', 'Use the signals to compare real options.'],
  ['Dive deeper', 'Check the history, costs and safety.'],
  ['Compare calmly', 'Put the trade-offs side by side.'],
  ['Pressure test', 'Try the budget on a bad month.'],
  ['Decide with confidence', 'Choose the option that fits your life.'],
  ['Take the next step', 'Negotiate, inspect and finalise.'],
];

const mistakes = [
  ['Spending every dollar of your savings', 'A car costs more than its purchase price. Registration, insurance, fuel and repairs start immediately.', 'Set a maximum price that leaves room for the first year of running costs.'],
  ['Forgetting the ongoing costs', 'Fuel, tyres, servicing and registration vary widely between vehicles.', 'Write down weekly, monthly and yearly estimates before comparing cars.'],
  ['Choosing appearance over reliability', 'A shiny body or great sound system cannot show how the engine, brakes or transmission are performing.', 'Prioritise safety, history, condition and a trusted inspection.'],
  ['Not comparing prices', 'One listing does not show the market value of similar vehicles.', 'Compare age, kilometres, condition and features across several listings.'],
  ['Skipping an independent inspection', 'A test drive cannot identify every mechanical issue.', 'Pay for an independent pre-purchase inspection before you commit.'],
  ['Ignoring the vehicle history', 'A check can reveal finance owing, stolen status, written-off records and odometer concerns.', 'Run a PPSR check, match the VIN and check the paperwork.'],
  ['Picking the wrong insurance', 'Different policies protect different things, and the cheapest premium may leave big gaps.', 'Compare cover, excess, exclusions and market or agreed value.'],
  ['Not understanding your consumer rights', 'Dealer and private sales do not have the same protections.', 'Read the contract and learn the rules in your state or territory.'],
  ['Rushing because you feel pressure', 'Urgency makes warning signs and missing comparisons easier to ignore.', 'Take a support person, sleep on it and walk away if checks are blocked.'],
  ['Failing to make a real budget', 'A budget shows whether the car fits with rent, school, savings and other priorities.', 'Test a realistic weekly or monthly budget before committing.'],
];

const covers = [
  { id: 'ctp', name: 'CTP / Green Slip', summary: 'Required cover', colour: 'lime', description: 'Compulsory Third Party insurance helps cover injuries to people caused by a vehicle crash. It is required for registration, but it does not cover damage to cars or property.', yes: ['Injuries to other people', 'Registration requirement', 'State scheme rules'], no: ['Damage to your car', 'Theft or weather damage', 'Damage to another car'] },
  { id: 'third-party', name: 'Third Party Property Damage', summary: 'Cover what you damage', colour: 'coral', description: 'This cover helps pay for damage you cause to someone else’s vehicle or property. Your own vehicle is not covered.', yes: ['Damage to another person’s property', 'Legal liability within the policy', 'A lower-cost option for some older cars'], no: ['Repairs to your own car', 'Theft of your car', 'Storm or hail damage'] },
  { id: 'fire-theft', name: 'Third Party Fire & Theft', summary: 'Add theft protection', colour: 'violet', description: 'This cover includes Third Party Property Damage and adds protection if your car is stolen or damaged by fire, subject to policy terms and excess.', yes: ['Damage to another person’s property', 'Theft of your vehicle', 'Some fire-related damage'], no: ['Every crash to your own car', 'Wear and tear', 'Anything excluded by the policy'] },
  { id: 'comprehensive', name: 'Comprehensive', summary: 'Widest protection', colour: 'blue', description: 'Comprehensive cover generally protects your car for covered crash damage, theft, fire, hail and storm, and includes liability for damage you cause to others.', yes: ['Damage to your car in a covered event', 'Damage to another person’s property', 'Theft, fire and weather events'], no: ['Regular maintenance or wear', 'Unlicensed or excluded driving', 'Anything outside the policy wording'] },
];

const bibliography = [
  ['Australian Competition and Consumer Commission', 'Motor vehicles and consumer guarantees', 'https://www.accc.gov.au/business/selling-products-and-services/consumer-guarantees/motor-vehicles', 'Dealer protections, consumer guarantees and possible remedies.'],
  ['Australian Government MoneySmart', 'Buying and managing a car', 'https://moneysmart.gov.au/buying-and-managing-a-car', 'Budgeting, finance and the real cost of running a car.'],
  ['Personal Property Securities Register', 'Search the PPSR', 'https://www.ppsr.gov.au/', 'Vehicle history, finance owing and written-off vehicle checks.'],
  ['ANCAP Safety', 'Vehicle safety ratings', 'https://www.ancap.com.au/', 'Independent safety rating information.'],
  ['NSW Government', 'Buying and selling vehicles', 'https://www.nsw.gov.au/driving-boating-and-transport/vehicle-registration/buying-and-selling-vehicles', 'Registration and transfer information for the NSW context.'],
  ['NRMA Insurance', 'Car insurance', 'https://www.nrma.com.au/car-insurance', 'Insurance terminology used as an industry reference only.'],
  ['SRT Performance via Sketchfab', 'BMW M4 Competition M Package', 'https://sketchfab.com/3d-models/bmw-m4-competition-m-package-5c0a2dafb1ad408d9fc9eeef9aee531b', 'Interactive road-car model released under CC BY 4.0. Lowbeam removes the supplied livery and adds original materials, lighting and controls.'],
];

function formatCurrency(value) {
  return '$' + Math.round(Number(value)).toLocaleString('en-AU');
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function useStoredState(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key);
      if (!stored) return initialValue;
      const parsed = JSON.parse(stored);
      return Array.isArray(initialValue) ? parsed : { ...initialValue, ...parsed };
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // The tool still works when storage is unavailable.
    }
  }, [key, value]);

  return [value, setValue];
}

function Icon({ name, size = 22, strokeWidth = 1.8 }) {
  const props = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': 'true',
  };
  if (name === 'arrow') return <svg {...props}><path d="M5 12h13M13 6l6 6-6 6" /></svg>;
  if (name === 'chevron') return <svg {...props}><path d="m9 5 7 7-7 7" /></svg>;
  if (name === 'up') return <svg {...props}><path d="M6 18 18 6M8 6h10v10" /></svg>;
  if (name === 'close') return <svg {...props}><path d="m6 6 12 12M18 6 6 18" /></svg>;
  if (name === 'menu') return <svg {...props}><path d="M4 7h16M4 12h16M4 17h16" /></svg>;
  if (name === 'target') return <svg {...props}><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" /></svg>;
  if (name === 'wallet') return <svg {...props}><path d="M4 6.5A2.5 2.5 0 0 1 6.5 4H19v16H6.5A2.5 2.5 0 0 1 4 17.5v-11Z" /><path d="M4 7h15M15 12h4M16.5 12v.01" /></svg>;
  if (name === 'wrench') return <svg {...props}><path d="M14.8 6.2a4.1 4.1 0 0 0-5.1 5.1L4 17a2.1 2.1 0 1 0 3 3l5.7-5.7a4.1 4.1 0 0 0 5.1-5.1l-2.4 2.4-2.8-.7-.7-2.8 2.9-1.9Z" /></svg>;
  if (name === 'history') return <svg {...props}><path d="M4 12a8 8 0 1 0 2.3-5.6M4 5v5h5M12 7v5l3 2" /></svg>;
  if (name === 'shield') return <svg {...props}><path d="M12 3 20 6v5.8c0 4.8-3.3 7.8-8 9.2-4.7-1.4-8-4.4-8-9.2V6l8-3Z" /><path d="m8.5 12 2.3 2.3 4.8-5" /></svg>;
  if (name === 'person') return <svg {...props}><circle cx="12" cy="8" r="3" /><path d="M5 20c.7-3.3 3-5 7-5s6.3 1.7 7 5" /></svg>;
  if (name === 'check') return <svg {...props}><path d="m5 12 4 4L19 6" /></svg>;
  if (name === 'warning') return <svg {...props}><path d="m12 3 9 17H3L12 3Z" /><path d="M12 9v5M12 17h.01" /></svg>;
  if (name === 'file') return <svg {...props}><path d="M6 3.5h8l4 4V20.5H6z" /><path d="M14 3.5v4h4M9 12h6M9 16h6" /></svg>;
  if (name === 'bookmark') return <svg {...props}><path d="M6 4.5A1.5 1.5 0 0 1 7.5 3h9A1.5 1.5 0 0 1 18 4.5V21l-6-3.5L6 21V4.5Z" /></svg>;
  if (name === 'print') return <svg {...props}><path d="M7 9V4h10v5M7 17H5a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-2M7 14h10v7H7z" /><path d="M18 12h.01" /></svg>;
  return <svg {...props}><circle cx="12" cy="12" r="8" /></svg>;
}

function SignalRing({ score, large = false }) {
  const angle = clamp(score, 0, 100) * 3.6;
  return <div className={'lb-ring' + (large ? ' lb-ring-large' : '')} style={{ '--score-angle': angle + 'deg' }} aria-label={'Signal score ' + score + ' out of 100'}><div><strong>{score}</strong><span>{score >= 80 ? 'GOOD FIT' : score >= 64 ? 'LOOK CLOSER' : 'PAUSE HERE'}</span></div></div>;
}

function LowbeamHeader({ isHome = true }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);
  const anchor = (id) => isHome ? `#${id}` : `/#${id}`;
  const openLab = () => { closeMenu(); if (isHome) document.getElementById('lab')?.scrollIntoView({ behavior: 'smooth' }); else window.location.href = '/#lab'; };
  return <header className="lb-header"><div className="lb-wrap lb-header-inner"><a className="lb-logo" href="/" onClick={closeMenu}>LOWBEAM</a><nav className={'lb-nav' + (menuOpen ? ' is-open' : '')}><a href={anchor('lab')} onClick={closeMenu}>Check a car</a><a href="/costs" onClick={closeMenu}>Costs</a><a href="/protect" onClick={closeMenu}>Your rights</a><a href="/insurance" onClick={closeMenu}>Insurance</a><a href="/bibliography" onClick={closeMenu}>Sources</a></nav><div className="lb-header-actions"><button className="lb-command-button" type="button" onClick={() => window.dispatchEvent(new CustomEvent('lowbeam:command'))} aria-label="Open quick find">⌘K</button><button className="lb-header-cta" type="button" onClick={openLab}>Start a check <Icon name="arrow" size={17} /></button><button className="lb-menu-button" type="button" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen((value) => !value)}><Icon name={menuOpen ? 'close' : 'menu'} size={22} /></button></div></div></header>;
}

function LowbeamFooter() {
  return <footer className="lb-footer"><div className="lb-wrap lb-footer-main"><div><a className="lb-footer-logo" href="/">LOWBEAM</a><p>A practical first-car guide<br />for Australian students.</p></div><div className="lb-footer-column"><strong>Start here</strong><a href="/#lab">Check a car</a><a href="/costs">Work out costs</a><a href="/mistakes">Common mistakes</a></div><div className="lb-footer-column"><strong>Know before you buy</strong><a href="/protect">Your rights</a><a href="/insurance">Insurance</a><a href="/bibliography">Sources</a></div></div><div className="lb-wrap lb-footer-bottom"><span>© 2026 Lowbeam. Classroom prototype.</span><span>Original student project · educational use</span></div></footer>;
}

function SignalPreview({ score, monthlyCost, onOpenLab }) {
  return <div className="lb-signal-preview"><div className="lb-panel-top"><span>SIGNAL SCORE</span><span className="lb-panel-status"><i /> LIVE PREVIEW</span></div><div className="lb-preview-grid"><div className="lb-preview-ring"><SignalRing score={score} large /></div><div className="lb-preview-stats"><div><span>monthly reality</span><strong>{formatCurrency(monthlyCost)} <small>/ month</small></strong><em>Estimate with fuel, servicing, rego and insurance.</em></div><div><span>confidence</span><strong>{score >= 80 ? 'High' : score >= 64 ? 'Medium' : 'Low'} <i className="lb-dot" /></strong><em>6 signals in view</em></div><div><span>saved brief</span><strong>First Car Plan <Icon name="bookmark" size={17} /></strong><em>Updated just now</em></div></div></div><div className="lb-preview-car"><img src="/assets/lowbeam-car.png" alt="Black compact hatchback illustration" /></div><button type="button" className="lb-preview-link" onClick={onOpenLab}>Run your own signal <Icon name="arrow" size={18} /></button></div>;
}

function calculateDecision(decision) {
  const monthlyCost = Number(decision.insurance) + Number(decision.fuel) + Number(decision.registration) + Number(decision.servicing);
  const budgetScore = clamp(Math.round(100 - Math.max(0, monthlyCost - Number(decision.monthlyBudget)) / Math.max(1, Number(decision.monthlyBudget)) * 85), 20, 100);
  const ownershipScore = clamp(Math.round(96 - Math.max(0, Number(decision.kilometres) - 8000) / 300), 40, 100);
  const confidenceScore = Math.round((decision.history ? 30 : 10) + (decision.inspected ? 30 : 12) + (decision.safety === '5-star' ? 28 : decision.safety === '4-star' ? 21 : 14) + (decision.seller === 'Dealer' ? 12 : 8));
  const score = Math.round(budgetScore * 0.45 + ownershipScore * 0.22 + confidenceScore * 0.33);
  return { monthlyCost, budgetScore, ownershipScore, confidenceScore, score: clamp(score, 18, 98) };
}

function buildBrief(decision, result) {
  return ['LOWBEAM FIRST-CAR BRIEF', '', 'Vehicle: ' + decision.model, 'Advertised price: ' + formatCurrency(decision.price), 'Signal score: ' + result.score + '/100', 'Monthly reality: ' + formatCurrency(result.monthlyCost), '', 'Before I decide:', '- Run the history check', '- Book an independent inspection', '- Compare the insurance excess and exclusions', '', 'This is an educational estimate, not financial, legal or insurance advice.'].join('\\n');
}

function Hero({ decision, result, onOpenLab }) {
  return <section className="lb-hero"><div className="lb-wrap lb-hero-grid"><div className="lb-hero-copy"><h1>Buy your first car with your eyes open.</h1><p>A practical Australian guide to the costs, risks and rights that matter before you hand over the money.</p><div className="lb-hero-actions"><button className="lb-button lb-button-lime" type="button" onClick={onOpenLab}>Check a car <Icon name="arrow" size={18} /></button><a className="lb-text-link" href="#library">Explore the guide <Icon name="arrow" size={17} /></a></div><div className="lb-current-readout"><span>Your saved estimate</span><strong>{decision.model || 'First car'} · {formatCurrency(result.monthlyCost)}/month</strong></div></div><CarStudio /></div></section>;
}

const taskLinks = [
  ['01', 'Check a car', 'Look before you buy', '#lab'],
  ['02', 'Work out the real cost', 'See the full picture', '/costs'],
  ['03', 'Know my rights', 'Protect the purchase', '/protect'],
  ['04', 'Compare insurance', 'Understand the cover', '/insurance'],
];

function TaskRail() {
  return <nav className="lb-task-rail" aria-label="Choose what you need"><div className="lb-wrap">{taskLinks.map(([number, title, copy, href]) => <a href={href} key={href}><b>{number}</b><span><strong>{title}</strong><small>{copy}</small></span><Icon name="arrow" size={18} /></a>)}</div></nav>;
}

function QuickCheck({ decision, setDecision, result, onToast }) {
  const [step, setStep] = useState(0);
  const types = ['Hatchback', 'SUV / wagon', 'Sedan', 'Ute'];
  const [carType, setCarType] = useStoredState('lowbeam-car-type-v1', 'Hatchback');
  const update = (key, value) => setDecision((current) => ({ ...current, [key]: value }));
  const steps = [
    <div className="lb-wizard-options" key="type">{types.map((type) => <button type="button" className={carType === type ? 'is-selected' : ''} onClick={() => setCarType(type)} key={type}><span className="lb-radio" />{type}</button>)}</div>,
    <div className="lb-wizard-fields" key="price"><Field label="Car or description"><input value={decision.model} onChange={(event) => update('model', event.target.value)} placeholder="e.g. 2018 Mazda 3" /></Field><Field label="Advertised price"><div className="lb-input-prefix"><span>$</span><input type="number" min="1000" step="500" value={decision.price} onChange={(event) => update('price', Number(event.target.value))} /></div></Field></div>,
    <div className="lb-wizard-fields" key="budget"><Field label="Monthly comfort zone" note={formatCurrency(decision.monthlyBudget)}><input className="lb-range" type="range" min="250" max="1200" step="25" value={decision.monthlyBudget} onChange={(event) => update('monthlyBudget', Number(event.target.value))} /></Field><Field label="Kilometres each year" note={Number(decision.kilometres).toLocaleString('en-AU') + ' km'}><input className="lb-range lb-range-blue" type="range" min="5000" max="30000" step="1000" value={decision.kilometres} onChange={(event) => update('kilometres', Number(event.target.value))} /></Field></div>,
    <div className="lb-wizard-checks" key="checks"><button type="button" className={decision.history ? 'is-selected' : ''} onClick={() => update('history', !decision.history)}><Icon name="history" size={20} /><span><strong>Vehicle history checked</strong><small>Finance, stolen and write-off status</small></span></button><button type="button" className={decision.inspected ? 'is-selected' : ''} onClick={() => update('inspected', !decision.inspected)}><Icon name="wrench" size={20} /><span><strong>Independent inspection booked</strong><small>A mechanic checks what the ad cannot show</small></span></button></div>,
  ];
  const headings = ['What type of car are you checking?', 'Which car have you found?', 'Will it fit normal life?', 'Two checks before you commit'];
  const next = () => { if (step < 3) setStep(step + 1); else onToast('Your buyer brief is ready'); };
  return <section className="lb-quick-check" id="lab"><div className="lb-wrap lb-quick-grid"><div className="lb-wizard"><div className="lb-step-line"><span>Step {step + 1} of 4</span><div>{[0, 1, 2, 3].map((item) => <i className={item <= step ? 'is-active' : ''} key={item} />)}</div></div><h2>{headings[step]}</h2><p className="lb-wizard-help">Answer what you know. You can change it later.</p>{steps[step]}<div className="lb-wizard-actions">{step > 0 && <button type="button" className="lb-back-button" onClick={() => setStep(step - 1)}>Back</button>}<button type="button" className="lb-button lb-button-blue" onClick={next}>{step === 3 ? 'Finish my check' : 'Next'} <Icon name="arrow" size={18} /></button></div></div><aside className="lb-check-summary"><span>Your check</span><SignalRing score={result.score} large /><dl><div><dt>Car</dt><dd>{decision.model || carType}</dd></div><div><dt>Advertised</dt><dd>{formatCurrency(decision.price)}</dd></div><div><dt>Monthly reality</dt><dd>{formatCurrency(result.monthlyCost)}</dd></div><div><dt>Checks complete</dt><dd>{Number(decision.history) + Number(decision.inspected)} / 2</dd></div></dl><p>This score is a prompt to investigate, not a verdict.</p></aside></div></section>;
}

function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  useEffect(() => {
    const show = () => setOpen(true);
    const key = (event) => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); setOpen(true); } if (event.key === 'Escape') setOpen(false); };
    window.addEventListener('lowbeam:command', show); window.addEventListener('keydown', key);
    return () => { window.removeEventListener('lowbeam:command', show); window.removeEventListener('keydown', key); };
  }, []);
  const items = [...taskLinks, ['05', 'Common mistakes', 'Avoid the traps', '/mistakes'], ['06', 'Bibliography', 'See every source', '/bibliography']].filter((item) => (item[1] + item[2]).toLowerCase().includes(query.toLowerCase()));
  if (!open) return null;
  return <div className="lb-command-backdrop" onMouseDown={() => setOpen(false)}><div className="lb-command" role="dialog" aria-modal="true" aria-label="Quick find" onMouseDown={(event) => event.stopPropagation()}><div className="lb-command-input"><Icon name="target" size={20} /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="What do you need help with?" /><kbd>Esc</kbd></div><div className="lb-command-results">{items.map((item) => <a href={item[3]} key={item[3]} onClick={() => setOpen(false)}><span>{item[0]}</span><strong>{item[1]}<small>{item[2]}</small></strong><Icon name="arrow" size={17} /></a>)}</div></div></div>;
}

function HowItWorks() {
  return <section className="lb-how" id="how"><div className="lb-wrap lb-how-grid"><div className="lb-section-title"><div className="lb-kicker"><i /> THE IDEA</div><h2>Most first-car surprises are avoidable.</h2><p>Lowbeam turns the noise of ads, opinions and assumptions into a single, clear path to a better decision.</p></div><div className="lb-how-steps"><div><span>01</span><h3>Set your brief.</h3><p>Start with the life you want the car to fit. Budget, use and what matters most.</p></div><div><span>02</span><h3>Scan the signals.</h3><p>See the costs and confidence gaps that a listing page leaves out.</p></div><div><span>03</span><h3>Decide with calm.</h3><p>Take a shareable brief to a parent, mechanic or seller before you commit.</p></div></div></div></section>;
}

function Field({ label, children, note }) {
  return <label className="lb-field"><span>{label}{note && <small>{note}</small>}</span>{children}</label>;
}

function DecisionLab({ decision, setDecision, result, onToast }) {
  const [activeSignal, setActiveSignal] = useState('budget');
  const [saved, setSaved] = useState(false);
  const [scanCount, setScanCount] = useState(0);
  const update = (key, value) => setDecision((current) => ({ ...current, [key]: value }));
  const runScan = () => { setScanCount((count) => count + 1); onToast('Signal recalculated for ' + decision.model); };
  const saveBrief = () => { setSaved((value) => !value); onToast(saved ? 'Brief removed from this browser' : 'Brief saved to this browser'); };
  const copyBrief = async () => {
    try {
      await navigator.clipboard.writeText(buildBrief(decision, result));
      onToast('Buyer brief copied to clipboard');
    } catch {
      onToast('Your brief is ready — use your browser’s copy tools');
    }
  };
  return <section className="lb-lab" id="lab"><div className="lb-wrap"><div className="lb-lab-heading"><div><div className="lb-kicker lb-kicker-lime"><i /> THE LAB</div><h2>Play the variables.<br /><span>See the impact.</span></h2></div><p>Move a few sliders and answer a few real questions. Your Signal Score is a transparent guide—not a verdict.</p></div><div className="lb-lab-panel"><div className="lb-lab-intro"><span className="lb-panel-index">/ 01</span><h3>Build your<br /><span>decision.</span></h3><p>The best first car is not the flashiest one. It is the one that still works for you on a normal Tuesday.</p><a href="/mistakes">See the mistake map <Icon name="arrow" size={17} /></a></div><div className="lb-lab-controls"><div className="lb-control-header"><span>YOUR INPUTS</span><button type="button" onClick={() => { setDecision(DEFAULT_DECISION); onToast('Inputs reset'); }}>Reset</button></div><Field label="Car or description"><input value={decision.model} onChange={(event) => update('model', event.target.value)} /></Field><Field label="Advertised price"><div className="lb-input-prefix"><span>$</span><input type="number" min="1000" step="500" value={decision.price} onChange={(event) => update('price', Number(event.target.value))} /></div></Field><Field label="Monthly comfort zone" note={formatCurrency(decision.monthlyBudget) + ' / month'}><input className="lb-range" type="range" min="250" max="1200" step="25" value={decision.monthlyBudget} onChange={(event) => update('monthlyBudget', Number(event.target.value))} /></Field><Field label="Kilometres per year" note={Number(decision.kilometres).toLocaleString('en-AU') + ' km'}><input className="lb-range lb-range-blue" type="range" min="5000" max="30000" step="1000" value={decision.kilometres} onChange={(event) => update('kilometres', Number(event.target.value))} /></Field><div className="lb-toggle-row"><button type="button" className={decision.history ? 'is-selected' : ''} onClick={() => update('history', !decision.history)}><Icon name="history" size={16} /> History checked</button><button type="button" className={decision.inspected ? 'is-selected' : ''} onClick={() => update('inspected', !decision.inspected)}><Icon name="wrench" size={16} /> Inspected</button></div><button type="button" className="lb-button lb-button-lime lb-scan-button" onClick={runScan}>Run the signal <Icon name="arrow" size={18} /></button></div><div className={'lb-lab-result' + (scanCount ? ' did-scan' : '')}><div className="lb-result-top"><span>SIGNAL SCORE</span><span className="lb-scan-status"><i /> {scanCount ? 'JUST UPDATED' : 'LIVE MODEL'}</span></div><div className="lb-result-score"><SignalRing score={result.score} large /><div><span className="lb-result-label">MONTHLY REALITY</span><strong>{formatCurrency(result.monthlyCost)} <small>/ month</small></strong><p>Based on your four running-cost inputs.</p></div></div><div className="lb-signal-tabs" role="tablist">{[['budget', 'Budget fit'], ['ownership', 'Ownership'], ['confidence', 'Confidence']].map(([key, label]) => <button key={key} type="button" className={activeSignal === key ? 'is-selected' : ''} onClick={() => setActiveSignal(key)} role="tab" aria-selected={activeSignal === key}>{label}</button>)}</div><SignalInsight type={activeSignal} result={result} decision={decision} /><div className="lb-result-actions"><button type="button" className={saved ? 'is-saved' : ''} onClick={saveBrief}><Icon name="bookmark" size={18} /> {saved ? 'Saved' : 'Save this brief'}</button><button type="button" onClick={copyBrief}><Icon name="up" size={17} /> Copy buyer brief</button></div></div></div></div></section>;
}

function SignalInsight({ type, result, decision }) {
  const content = {
    budget: { title: 'Budget fit', score: result.budgetScore, text: result.budgetScore > 80 ? 'Your running costs sit comfortably inside the zone you set.' : 'Your running costs are getting close to the comfort zone you set.' },
    ownership: { title: 'Ownership', score: result.ownershipScore, text: decision.kilometres > 18000 ? 'Higher kilometres make fuel, tyres and servicing worth a closer look.' : 'The usage profile is a reasonable starting point for comparing models.' },
    confidence: { title: 'Confidence', score: result.confidenceScore, text: decision.history && decision.inspected ? 'The important checks are in place. Keep the documents with your brief.' : 'Your confidence score grows when the history and inspection are complete.' },
  }[type];
  return <div className="lb-signal-insight"><div><strong>{content.title}</strong><span>{content.score}/100</span></div><p>{content.text}</p><div className="lb-progress"><span style={{ width: content.score + '%' }} /></div></div>;
}

function Signals() {
  return <section className="lb-signals" id="signals"><div className="lb-wrap"><div className="lb-signals-heading"><div className="lb-kicker"><i /> SIX SIGNALS</div><h2>Make the invisible<br /><span>costs visible.</span></h2><p>Every decision has a story. Lowbeam puts the useful bits next to each other so you can see the whole picture.</p></div><div className="lb-signal-rail">{signalData.map((signal, index) => <article className={'lb-signal-card signal-' + signal.colour} key={signal.key}><span className="lb-signal-number">0{index + 1}</span><div className="lb-signal-icon"><Icon name={signal.icon} size={24} /></div><h3>{signal.label}</h3><p>{signal.copy}</p></article>)}</div></div></section>;
}

function Mission({ completed, setCompleted, onToast }) {
  const progress = Math.round(completed.length / missionSteps.length * 100);
  const toggle = (index) => setCompleted((items) => items.includes(index) ? items.filter((item) => item !== index) : [...items, index].sort((a, b) => a - b));
  return <section className="lb-mission"><div className="lb-wrap"><div className="lb-mission-head"><div><div className="lb-kicker"><i /> THE ROUTE</div><h2>A better decision<br /><span>in seven days.</span></h2></div><div className="lb-progress-summary"><strong>{progress}%</strong><span>of your plan<br />complete</span><div><i style={{ width: progress + '%' }} /></div></div></div><div className="lb-timeline">{missionSteps.map((step, index) => <button type="button" key={step[0]} className={'lb-day' + (completed.includes(index) ? ' is-complete' : '')} onClick={() => { toggle(index); onToast(completed.includes(index) ? 'Day ' + (index + 1) + ' reopened' : 'Day ' + (index + 1) + ' complete'); }}><span className="lb-day-dot">{completed.includes(index) ? <Icon name="check" size={17} /> : index + 1}</span><span className="lb-day-label">DAY {index + 1}</span><strong>{step[0]}</strong><p>{step[1]}</p></button>)}</div><div className="lb-mission-bar"><Icon name="bookmark" size={18} /><span>We guide you each day with clear actions and plain-language insights.</span><button type="button" onClick={() => { document.getElementById('lab')?.scrollIntoView({ behavior: 'smooth' }); }}>Start your seven-day plan <Icon name="arrow" size={16} /></button></div></div></section>;
}

function answerCoach(question) {
  const lower = question.toLowerCase();
  if (lower.includes('seller') || lower.includes('ask')) return 'Ask why they are selling, what work has been done recently, and whether the VIN and service records match. If the answer is vague, slow the deal down.';
  if (lower.includes('insurance') || lower.includes('cover')) return 'Compare what is covered, the excess, exclusions and whether the car is valued at market or agreed value. The lowest premium is not automatically the best fit.';
  if (lower.includes('inspection') || lower.includes('mechanic')) return 'Book an independent pre-purchase inspection before you pay. A seller who will not allow one is giving you useful information.';
  if (lower.includes('budget') || lower.includes('afford')) return 'Start with the monthly number you can live with, then subtract fuel, insurance, registration and servicing. Leave a buffer instead of spending to the limit.';
  return 'Start with three questions: what can I comfortably spend, what checks are still missing, and what would make me walk away? A calm decision is a strong decision.';
}

function Coach({ onToast }) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('Ask a question. Lowbeam will turn it into a next step you can actually take.');
  const presets = ['What should I ask the seller?', 'How do I check insurance?', 'Can I afford this car?'];
  const ask = (value) => { const prompt = value || question; if (!prompt.trim()) return; setAnswer(answerCoach(prompt)); setQuestion(''); onToast('Decision coach updated'); };
  return <section className="lb-coach"><div className="lb-wrap lb-coach-grid"><div className="lb-coach-copy"><div className="lb-kicker lb-kicker-lime"><i /> DECISION COACH</div><h2>When the answer is<br /><span>“it depends”.</span></h2><p>Get a plain-language next step without pretending there is one perfect car for everyone.</p><div className="lb-coach-note"><Icon name="target" size={20} /><span>Lowbeam gives prompts and explanations. You stay in control.</span></div></div><div className="lb-coach-panel"><div className="lb-coach-panel-top"><span>ASK LOWBEAM</span><span><i /> READY</span></div><div className="lb-coach-answer"><div className="lb-coach-avatar">L<span>.</span></div><p>{answer}</p></div><div className="lb-coach-presets">{presets.map((preset) => <button key={preset} type="button" onClick={() => ask(preset)}>{preset}</button>)}</div><form className="lb-coach-form" onSubmit={(event) => { event.preventDefault(); ask(); }}><input aria-label="Ask Lowbeam a question" value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Type a question..." /><button type="submit" aria-label="Ask question"><Icon name="arrow" size={19} /></button></form></div></div></section>;
}

function Library({ onToast }) {
  return <section className="lb-library" id="library"><div className="lb-wrap"><div className="lb-library-heading"><div><div className="lb-kicker"><i /> LEARNING LIBRARY</div><h2>The stuff no listing<br /><span>tells you.</span></h2></div><p>Lowbeam makes the important questions easier to ask, understand and remember.</p></div><div className="lb-library-grid">{learningCards.map((card) => <a className={'lb-learning-card card-' + card.colour} href={card.href} key={card.href}><div className="lb-learning-top"><div className="lb-learning-icon"><Icon name={card.icon} size={24} /></div><Icon name="arrow" size={19} /></div><span>{card.eyebrow}</span><h3>{card.title}</h3><p>{card.copy}</p></a>)}</div><div className="lb-library-bottom"><span>More useful than another “best first car” list.</span><button type="button" onClick={onToast}>Save the library <Icon name="bookmark" size={17} /></button></div></div></section>;
}

function Teams({ onContact }) {
  return <section className="lb-teams" id="teams"><div className="lb-wrap lb-teams-grid"><div><div className="lb-kicker lb-kicker-lime"><i /> FOR TEAMS</div><h2>Bring Lowbeam<br /><span>to your people.</span></h2><p>Schools, youth programs, dealerships and employers can use Lowbeam to help young people make smarter, safer first-car decisions.</p><button type="button" className="lb-button lb-button-coral" onClick={onContact}>Book a walkthrough <Icon name="up" size={17} /></button></div><div className="lb-team-list"><p><Icon name="check" size={18} /> Curriculum-aligned tools</p><p><Icon name="check" size={18} /> Workshops and resources</p><p><Icon name="check" size={18} /> Shareable decision briefs</p><p><Icon name="check" size={18} /> A calmer conversation for families</p></div></div></section>;
}

function ContactModal({ onClose }) {
  const [sent, setSent] = useState(false);
  return <div className="lb-modal-backdrop" onMouseDown={onClose}><div className="lb-modal" role="dialog" aria-modal="true" aria-labelledby="contact-title" onMouseDown={(event) => event.stopPropagation()}><button type="button" className="lb-modal-close" onClick={onClose} aria-label="Close"><Icon name="close" size={20} /></button>{sent ? <div className="lb-modal-success"><div className="lb-success-mark"><Icon name="check" size={28} /></div><div className="lb-kicker"><i /> MESSAGE QUEUED</div><h2>Good call.</h2><p>Thanks for your interest. This prototype keeps the form local; a production version would connect it to your team’s inbox.</p><button type="button" className="lb-button lb-button-lime" onClick={onClose}>Back to Lowbeam <Icon name="arrow" size={18} /></button></div> : <><div className="lb-kicker"><i /> LOWBEAM FOR TEAMS</div><h2 id="contact-title">Let’s make the next decision easier.</h2><p>Tell us a little about your team and we’ll show you the product story.</p><form className="lb-contact-form" onSubmit={(event) => { event.preventDefault(); setSent(true); }}><input required placeholder="Your name" aria-label="Your name" /><input required type="email" placeholder="Work email" aria-label="Work email" /><select defaultValue="" required aria-label="I am interested in"><option value="" disabled>I am interested in...</option><option>School program</option><option>Youth organisation</option><option>Dealership</option><option>Employer program</option></select><button type="submit" className="lb-button lb-button-coral">Send enquiry <Icon name="up" size={17} /></button></form></>}</div></div>;
}

function BibliographyPage() {
  return <main className="lb-bibliography"><div className="lb-wrap"><a className="lb-back-link" href="/"><Icon name="arrow" size={17} /> Back to Lowbeam</a><div className="lb-biblio-hero"><div className="lb-kicker"><i /> RESEARCH TRAIL</div><h1>Bibliography<span>.</span></h1><p>The sources behind the learning library and the checks in the lab. All links open in a new tab.</p></div><div className="lb-biblio-list">{bibliography.map((item, index) => <a href={item[2]} target="_blank" rel="noreferrer" className="lb-biblio-row" key={item[2]}><span className="lb-biblio-number">0{index + 1}</span><span><strong>{item[0]}</strong><b>{item[1]}</b><small>{item[3]}</small></span><Icon name="up" size={19} /></a>)}</div><div className="lb-biblio-notes"><div><span>Visual credit</span><p>The interactive road car is adapted from the BMW M4 Competition M Package model by SRT Performance, licensed under CC BY 4.0. Lowbeam removes the supplied livery and adds original materials, lighting and interaction.</p></div><div><span>AI and authorship note</span><p>This is an original student product concept. AI assisted with prototyping and copy development; facts should be checked against the linked primary sources before publication.</p></div><div><span>Accessed</span><p>1 September 2026</p></div></div></div></main>;
}

const MAP_POINTS = [
  [95, 60, 35], [245, 135, 74], [420, 230, 130], [340, 335, 148], [150, 430, 48],
  [115, 555, 108], [285, 650, 54], [450, 735, 125], [385, 845, 150], [205, 935, 78],
];

function MistakeMap() {
  const [active, setActive] = useState(0);
  const stopRefs = useRef([]);
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActive(Number(visible.target.dataset.mapStop));
    }, { rootMargin: '-28% 0px -42% 0px', threshold: [0.2, 0.45, 0.7] });
    stopRefs.current.forEach((node) => node && observer.observe(node));
    return () => observer.disconnect();
  }, []);
  const [carX, carY, carRotation] = MAP_POINTS[active];
  return <div className="lb-map-layout">
    <section className="lb-map-stage" aria-label={`Mistake ${active + 1} of ${mistakes.length}`} style={{ '--map-progress': active / (mistakes.length - 1) }}>
      <div className="lb-map-heading"><h1>The mistake<br />map<span>.</span></h1><p>Ten wrong turns.<br />One clearer way through.</p><strong aria-live="polite"><b>{active + 1}</b> of {mistakes.length}</strong><div role="progressbar" aria-label="Mistake map progress" aria-valuemin="1" aria-valuemax={mistakes.length} aria-valuenow={active + 1}><i style={{ width: `${((active + 1) / mistakes.length) * 100}%` }} /></div><small>{active === mistakes.length - 1 ? 'You made it through' : 'Keep scrolling'}</small></div>
      <svg className="lb-road-map" viewBox="0 0 560 980" role="img" aria-label="A winding road with ten mistake stops">
        <g className="lb-contours"><path d="M12 160 C120 90 180 180 300 104 S480 30 548 95" /><path d="M10 505 C120 430 180 540 330 465 S500 420 552 480" /><path d="M5 800 C120 720 210 825 345 760 S480 730 555 790" /></g>
        <path className="lb-road-edge" d="M64 -20 C50 110 270 65 355 175 C445 290 180 295 126 410 C75 520 110 585 260 625 C445 675 500 755 394 838 C330 890 205 850 185 1005" />
        <path className="lb-road-centre" pathLength="100" d="M64 -20 C50 110 270 65 355 175 C445 290 180 295 126 410 C75 520 110 585 260 625 C445 675 500 755 394 838 C330 890 205 850 185 1005" />
        <path className="lb-road-progress" pathLength="100" strokeDasharray={`${(active / 9) * 100} 100`} d="M64 -20 C50 110 270 65 355 175 C445 290 180 295 126 410 C75 520 110 585 260 625 C445 675 500 755 394 838 C330 890 205 850 185 1005" />
        {MAP_POINTS.map(([x, y], index) => <g className={'lb-map-node' + (index === active ? ' is-active' : '')} transform={`translate(${x} ${y})`} key={mistakes[index][0]}><circle r="18" /><text y="5">{String(index + 1).padStart(2, '0')}</text></g>)}
        <g className="lb-map-car" style={{ transform: `translate(${carX}px, ${carY}px) rotate(${carRotation}deg)` }}><rect x="-12" y="-23" width="24" height="46" rx="7" /><rect x="-9" y="-12" width="18" height="19" rx="3" /><circle cx="-13" cy="-12" r="4" /><circle cx="13" cy="-12" r="4" /><circle cx="-13" cy="13" r="4" /><circle cx="13" cy="13" r="4" /></g>
      </svg>
      <div className="lb-map-mobile-progress" aria-hidden="true"><b>{String(active + 1).padStart(2, '0')}</b><span>/ {mistakes.length}</span></div>
    </section>
    <div className="lb-map-stories">{mistakes.map((item, index) => <article ref={(node) => { stopRefs.current[index] = node; }} data-map-stop={index} className={index === active ? 'is-active' : ''} aria-current={index === active ? 'step' : undefined} key={item[0]}><header><span>{String(index + 1).padStart(2, '0')}</span><p>Wrong turn {index + 1}</p></header><h2>{item[0]}</h2><div className="lb-map-answer"><span>Why it happens</span><p>{item[1]}</p></div><div className="lb-map-answer"><span>The next move</span><p>{item[2]}</p></div>{index < mistakes.length - 1 && <small>Next: {mistakes[index + 1][0]}</small>}</article>)}</div>
  </div>;
}

function MistakePage() {
  return <main className="lb-mistake-page"><div className="lb-wrap lb-map-top"><a className="lb-back-link" href="/"><Icon name="arrow" size={17} /> Back to Lowbeam</a><p>A confident buyer does not know everything. They know what to check next.</p></div><MistakeMap /></main>;
}

function CostsPage({ decision, setDecision, result }) {
  return <main className="lb-learning-page"><div className="lb-wrap"><a className="lb-back-link" href="/"><Icon name="arrow" size={17} /> Back to Lowbeam</a><div className="lb-learning-hero hero-lime"><div className="lb-kicker"><i /> LEARNING LIBRARY / 02</div><h1>True cost<br /><span>lab.</span></h1><p>The purchase price is only the beginning. Build a monthly reality that leaves room for normal life and bad surprises.</p></div><div className="lb-cost-page-grid"><div><h2>Three layers of cost</h2><div className="lb-cost-lines"><div><span>Initial</span><strong>{formatCurrency(decision.price)}</strong><p>Deposit, transfer, inspection and the first tank of fuel.</p></div><div><span>Ongoing</span><strong>{formatCurrency(result.monthlyCost)} / mo</strong><p>Fuel, insurance, registration and a servicing buffer.</p></div><div><span>Hidden</span><strong>Leave room</strong><p>Parking, tolls, tyres and unexpected repairs belong in the plan.</p></div></div></div><DecisionLabMini decision={decision} setDecision={setDecision} result={result} /></div><div className="lb-table-wrap"><table className="lb-table"><thead><tr><th>Cost</th><th>When it shows up</th><th>Question to ask</th></tr></thead><tbody><tr><td>Purchase</td><td>Up front or over time</td><td>Is this within my total budget?</td></tr><tr><td>Insurance</td><td>Monthly or annually</td><td>What is the excess and what is excluded?</td></tr><tr><td>Registration + CTP</td><td>At renewal</td><td>When is the next renewal due?</td></tr><tr><td>Fuel + maintenance</td><td>Weekly and as needed</td><td>How much does this model cost to run?</td></tr></tbody></table></div></div></main>;
}

function DecisionLabMini({ decision, setDecision, result }) {
  const update = (key, value) => setDecision((current) => ({ ...current, [key]: value }));
  return <div className="lb-mini-lab"><div className="lb-mini-lab-top"><span>MONTHLY REALITY</span><strong>{formatCurrency(result.monthlyCost)}</strong></div><label>Insurance <output>{formatCurrency(decision.insurance)}</output><input type="range" min="50" max="350" step="10" value={decision.insurance} onChange={(event) => update('insurance', Number(event.target.value))} /></label><label>Fuel <output>{formatCurrency(decision.fuel)}</output><input type="range" min="50" max="400" step="10" value={decision.fuel} onChange={(event) => update('fuel', Number(event.target.value))} /></label><label>Servicing buffer <output>{formatCurrency(decision.servicing)}</output><input type="range" min="20" max="200" step="5" value={decision.servicing} onChange={(event) => update('servicing', Number(event.target.value))} /></label><p className="lb-mini-note">Illustrative estimate only—not a quote.</p></div>;
}

function ProtectPage() {
  const [checked, setChecked] = useState([]);
  const checks = ['Match the VIN with the paperwork', 'Run a PPSR vehicle history check', 'Book an independent inspection', 'Read the contract before paying'];
  return <main className="lb-learning-page"><div className="lb-wrap"><a className="lb-back-link" href="/"><Icon name="arrow" size={17} /> Back to Lowbeam</a><div className="lb-learning-hero hero-blue"><div className="lb-kicker"><i /> LEARNING LIBRARY / 03</div><h1>Protect<br /><span>yourself.</span></h1><p>A careful buyer is not being difficult. They are checking the car, the seller and the paperwork before money changes hands.</p></div><div className="lb-seller-grid"><article><div className="lb-round-icon"><Icon name="shield" size={26} /></div><h2>Dealer</h2><p>Consumer guarantees may apply. Ask about the licence, get promises in writing and read the contract.</p></article><article><div className="lb-round-icon"><Icon name="person" size={26} /></div><h2>Private seller</h2><p>Protections can be more limited. Confirm ownership, run a history check and never skip the inspection.</p></article></div><div className="lb-check-card"><div><div className="lb-kicker"><i /> READY-TO-BUY CHECKLIST</div><h2>Make the checks visible.</h2><p>{checked.length}/4 complete</p></div><div>{checks.map((item, index) => <label key={item} className={checked.includes(index) ? 'is-checked' : ''}><input type="checkbox" checked={checked.includes(index)} onChange={() => setChecked((list) => list.includes(index) ? list.filter((value) => value !== index) : [...list, index])} /><span><Icon name="check" size={16} /></span>{item}</label>)}</div></div></div></main>;
}

function InsurancePage() {
  const [selected, setSelected] = useState('comprehensive');
  const cover = covers.find((item) => item.id === selected) || covers[3];
  return <main className="lb-learning-page"><div className="lb-wrap"><a className="lb-back-link" href="/"><Icon name="arrow" size={17} /> Back to Lowbeam</a><div className="lb-learning-hero hero-violet"><div className="lb-kicker"><i /> LEARNING LIBRARY / 04</div><h1>Cover,<br /><span>decoded.</span></h1><p>Insurance can feel full of unfamiliar words. Start with what each type protects, then compare price, excess and exclusions.</p></div><div className="lb-cover-tabs" role="tablist">{covers.map((item) => <button type="button" className={'cover-' + item.colour + (selected === item.id ? ' is-selected' : '')} role="tab" aria-selected={selected === item.id} key={item.id} onClick={() => setSelected(item.id)}><strong>{item.name}</strong><span>{item.summary}</span></button>)}</div><div className={'lb-cover-detail detail-' + cover.colour}><div><div className="lb-kicker"><i /> SELECTED COVER</div><h2>{cover.name}</h2><p>{cover.description}</p></div><div className="lb-cover-columns"><div><strong>Usually includes</strong>{cover.yes.map((item) => <span key={item}><Icon name="check" size={16} /> {item}</span>)}</div><div><strong>Usually does not include</strong>{cover.no.map((item) => <span key={item}><Icon name="close" size={16} /> {item}</span>)}</div></div></div><div className="lb-premium-note"><div><div className="lb-kicker"><i /> WHY PRICES DIFFER</div><h2>What changes a premium?</h2></div><p>The car, the driver, the policy and the location all change the risk being assessed. Compare the cover—not only the starting price.</p></div></div></main>;
}

function LowbeamHome({ onContact }) {
  const [decision, setDecision] = useStoredState('lowbeam-decision-v1', DEFAULT_DECISION);
  const [completed, setCompleted] = useStoredState('lowbeam-mission-v1', []);
  const [toast, setToast] = useState('');
  const result = useMemo(() => calculateDecision(decision), [decision]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(''), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const openLab = () => document.getElementById('lab')?.scrollIntoView({ behavior: 'smooth' });
  const showToast = (message) => setToast(message);
  return <div className="lowbeam-site"><LowbeamHeader onContact={onContact} /><Hero decision={decision} result={result} onOpenLab={openLab} /><TaskRail /><QuickCheck decision={decision} setDecision={setDecision} result={result} onToast={showToast} /><HowItWorks /><Library onToast={() => showToast('Library saved to your browser')} /><Mission completed={completed} setCompleted={setCompleted} onToast={showToast} /><LowbeamFooter /><CommandPalette />{toast && <div className="lb-toast" role="status"><Icon name="check" size={17} />{toast}</div>}</div>;
}

function LowbeamPage({ pathname }) {
  const [decision, setDecision] = useStoredState('lowbeam-decision-v1', DEFAULT_DECISION);
  const result = useMemo(() => calculateDecision(decision), [decision]);
  if (pathname === '/bibliography') return <div className="lowbeam-site"><LowbeamHeader isHome={false} /><BibliographyPage /><LowbeamFooter isHome={false} /></div>;
  if (pathname === '/mistakes') return <div className="lowbeam-site"><LowbeamHeader isHome={false} /><MistakePage /><LowbeamFooter isHome={false} /></div>;
  if (pathname === '/costs') return <div className="lowbeam-site"><LowbeamHeader isHome={false} /><CostsPage decision={decision} setDecision={setDecision} result={result} /><LowbeamFooter isHome={false} /></div>;
  if (pathname === '/protect') return <div className="lowbeam-site"><LowbeamHeader isHome={false} /><ProtectPage /><LowbeamFooter isHome={false} /></div>;
  if (pathname === '/insurance') return <div className="lowbeam-site"><LowbeamHeader isHome={false} /><InsurancePage /><LowbeamFooter isHome={false} /></div>;
  return <LowbeamHome onContact={() => { window.dispatchEvent(new CustomEvent('lowbeam:contact')); }} />;
}

export default function Lowbeam() {
  const [contactOpen, setContactOpen] = useState(false);
  const [pathname, setPathname] = useState(() => window.location.pathname);
  useEffect(() => {
    document.title = pathname === '/bibliography' ? 'Bibliography · Lowbeam' : 'Lowbeam · A calmer first-car decision';
    const openContact = () => setContactOpen(true);
    window.addEventListener('lowbeam:contact', openContact);
    return () => window.removeEventListener('lowbeam:contact', openContact);
  }, [pathname]);
  useEffect(() => {
    const handlePop = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, []);
  return <><LowbeamPage pathname={pathname} />{contactOpen && <ContactModal onClose={() => setContactOpen(false)} />}</>;
}
