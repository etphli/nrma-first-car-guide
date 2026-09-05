import React, { useState } from 'react';
import { InsuranceInfo } from './QuotePreparation.jsx';

const money = (value) => new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 2 }).format(value);
const readAmount = (value, minimum) => {
  if ((typeof value !== 'string' && typeof value !== 'number') || String(value).trim() === '') return null;
  const amount = Number(value);
  return Number.isFinite(amount) && amount >= minimum ? amount : null;
};
const examplePrices = {
  nrma: { annual: '1200', excess: '1000' },
  youi: { annual: '1500', excess: '600' },
  budget: { annual: '1800', excess: '400' },
};

export default function QuoteComparison({ providers, quotes, setQuotes }) {
  const [example, setExample] = useState(false);
  const [samples, setSamples] = useState(examplePrices);
  const values = example ? samples : quotes;
  const update = (id, field, value) => (example ? setSamples : setQuotes)((current) => ({
    ...current, [id]: { ...current[id], [field]: value },
  }));
  const entries = providers.map((provider, index) => {
    const entry = values[provider.id];
    const annual = entry?.annual ?? '';
    const excess = entry?.excess ?? '';
    return { ...provider, name: example ? `Example ${String.fromCharCode(65 + index)}` : provider.name, annual, excess, premium: readAmount(annual, 0.01), basicExcess: readAmount(excess, 0) };
  });
  const entered = entries.filter((entry) => entry.premium !== null);
  const minimum = entered.length ? Math.min(...entered.map((entry) => entry.premium)) : null;
  const maximum = entered.length ? Math.max(...entered.map((entry) => entry.premium)) : null;
  const lowest = entered.filter((entry) => entry.premium === minimum);
  const withExcess = entered.filter((entry) => entry.basicExcess !== null);
  const minimumExcess = withExcess.length ? Math.min(...withExcess.map((entry) => entry.basicExcess)) : null;
  const hasComparison = entered.length >= 2;

  return <div className="lb-quote-workspace" id="quote-prices">
    <div className="lb-quote-toolbar"><div><span>{example ? 'PRACTICE MODE' : 'YOUR PRICE COMPARISON'}</span><h3>{example ? 'Try a comparison with example prices.' : 'Put your quotes side by side.'}</h3><p>{example ? 'Made-up prices for a classroom demonstration. These are not offers from NRMA Insurance, Youi or Budget Direct. Your saved real quotes stay separate.' : 'Prices appear as you enter them. This site does not fetch live prices from insurers. Your entries are kept in this browser when storage is available.'}</p></div><button type="button" aria-pressed={example} onClick={() => setExample((current) => !current)}>{example ? 'Back to my quotes' : 'Try example prices'}</button></div>
    <div className={`lb-comparison-result${hasComparison ? ' is-ready' : ''}`} aria-live="polite" aria-atomic="true">
      <div><span>{example ? 'ILLUSTRATIVE COMPARISON' : `${entered.length} ${entered.length === 1 ? 'QUOTE ENTERED' : 'QUOTES ENTERED'}`}</span>
        {hasComparison ? <><h3>{lowest.length > 1 ? `${lowest.map((entry) => entry.name).join(' and ')} tie for the lowest premium.` : `${lowest[0].name} has the lowest entered premium.`}</h3><p>{money(minimum)} a year. {maximum === minimum ? 'The premiums match. Compare the excess, inclusions and exclusions next.' : `${money(maximum - minimum)} less per year than the highest entered price. Compare cover as well as cost.`}</p></>
          : entered.length === 1 ? <><h3>1 quote entered. Add another to compare.</h3><p>{entered[0].name}: {money(entered[0].premium)} a year, equivalent to {money(entered[0].premium / 12)} a month for budgeting.</p></>
            : <><h3>No quotes entered yet.</h3><p>Enter an annual premium in a card below, or choose “Try example prices” to see how the comparison works.</p></>}
      </div><div className="lb-result-stat"><span>Lowest entered basic excess</span><strong>{minimumExcess === null ? 'Add a premium and excess' : money(minimumExcess)}</strong><small>{minimumExcess === null ? 'A missing excess is not treated as $0.' : withExcess.filter((entry) => entry.basicExcess === minimumExcess).map((entry) => entry.name).join(' · ')}</small></div>
    </div>
    <div className="lb-provider-grid">{entries.map((entry) => <article className={`lb-provider-card provider-${entry.colour}${hasComparison && entry.premium === minimum ? ' is-cheapest' : ''}`} key={entry.id}>
      <header><div><span>{example ? 'ILLUSTRATIVE EXAMPLE' : hasComparison && entry.premium === minimum ? 'LOWEST ENTERED PREMIUM' : 'COMPREHENSIVE'}</span><h3>{entry.name}</h3></div>{!example && <a href={entry.url} target="_blank" rel="noreferrer">Get official quote ↗</a>}</header>
      <div className="lb-quote-price"><strong>{entry.premium === null ? 'No price yet' : money(entry.premium)}</strong><span>{entry.premium === null ? 'Enter an annual premium below' : example ? 'per year · example only' : 'per year · entered by you'}</span></div>
      <p>{example ? 'Edit these sample amounts to see how the premium and excess change the comparison.' : entry.detail}</p>
      <div className="lb-quote-term-row"><span>Premium <InsuranceInfo term="Premium" /></span><span>Excess <InsuranceInfo term="Excess" /></span></div>
      <div className="lb-provider-inputs"><label>Annual premium ($)<input type="number" inputMode="decimal" min="0.01" step="0.01" placeholder="e.g. 1200" value={entry.annual} aria-invalid={entry.annual !== '' && entry.premium === null} onChange={(event) => update(entry.id, 'annual', event.target.value)} />{entry.annual !== '' && entry.premium === null && <small className="lb-quote-error">Enter a price greater than $0.</small>}</label><label>Basic excess ($)<input type="number" inputMode="decimal" min="0" step="0.01" placeholder="e.g. 600" value={entry.excess} aria-invalid={entry.excess !== '' && entry.basicExcess === null} onChange={(event) => update(entry.id, 'excess', event.target.value)} />{entry.excess !== '' && entry.basicExcess === null && <small className="lb-quote-error">Enter $0 or a positive amount.</small>}</label></div>
      <dl><div><dt>Annual premium ÷ 12</dt><dd>{entry.premium === null ? 'Add premium' : money(entry.premium / 12)}</dd></div><div><dt>Annual premium + basic excess</dt><dd>{entry.premium === null ? 'Add premium' : entry.basicExcess === null ? 'Add excess' : money(entry.premium + entry.basicExcess)}</dd></div></dl>
    </article>)}</div>
    <p className="lb-quote-disclaimer">Annual ÷ 12 is a budgeting equivalent, not a monthly payment quote. Premium + basic excess is a one-claim example. Extra driver or age excesses and uninsured losses may apply. Check the PDS and the insurer’s quote before deciding.</p>
  </div>;
}
