import React, { useState } from 'react';
import { COPY, META, ENGAGEMENT_TIERS, FAQ_ITEMS } from '../data';
import { CapacityCalendar } from '../components/CapacityCalendar';
import { svgPixelIcon, svgStrike } from '../utils/helpers';

export const Contact: React.FC = () => {
  const [quantities, setQuantities] = useState<Record<string, number>>({
    sprint: 0,
    advisory: 0,
    audit: 0,
  });
  const [quarter, setQuarter] = useState<string>('Q1 2027 (Jan–Mar)');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [brief, setBrief] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogText, setDialogText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const stepQty = (tierId: string, delta: number) => {
    setQuantities((prev) => {
      const tier = ENGAGEMENT_TIERS.find((t) => t.id === tierId);
      if (!tier) return prev;
      const current = prev[tierId] || 0;
      const next = Math.max(0, Math.min(tier.open, current + delta));
      return { ...prev, [tierId]: next };
    });
    setErrorMsg('');
  };

  const totalCost = ENGAGEMENT_TIERS.reduce((sum, t) => {
    return sum + (quantities[t.id] || 0) * t.price;
  }, 0);

  const totalWeeks = (quantities['sprint'] || 0) + (quantities['audit'] || 0);

  const handleReserve = () => {
    if (totalCost === 0) {
      setErrorMsg('Please select at least 1 sprint week or advisory day.');
      return;
    }
    if (!name.trim() || !email.trim()) {
      setErrorMsg('Please provide your name and work email address.');
      return;
    }

    setDialogText(
      `Inquiry for ${name} (${email}) logged for ${quarter}. Scope: €${totalCost.toLocaleString('en-US')}. Brief: "${brief || 'Standard engagement request'}". Direct response expected within 24 hours.`
    );
    setDialogOpen(true);
    setErrorMsg('');
  };

  return (
    <section className="sub-sec" data-surface="sodium">
      <div className="grid">
        <p className="col-1-3 t-micro">Availability</p>
        <div className="col-5-12">
          <h1 className="t-h1" tabIndex={-1}>
            Scope a project
          </h1>
          <p className="t-body" style={{ marginTop: '16px' }}>
            Select sprint weeks or advisory days to preview 2027 capacity, estimate budget, and send a project brief directly to {META.email}.
          </p>
        </div>

        <div className="col-full" id="tickets-capacity-wrap">
          <CapacityCalendar />
        </div>

        <div className="col-full tier-list" id="tier-list">
          {ENGAGEMENT_TIERS.map((t) => {
            const qty = quantities[t.id] || 0;
            return (
              <div key={t.id} className="grid tier-row" style={{ paddingInline: 0 }} data-tier={t.id}>
                <div className="tier-name-col">
                  <div className="t-lead">{t.name}</div>
                  <div className="t-micro tnum" style={{ marginTop: '4px' }}>
                    {t.open} of {t.allocation} {t.id === 'advisory' ? 'days' : 'weeks'} open in 2027
                  </div>
                </div>
                <div className="tier-inc-col t-small">{t.includes}</div>
                <div className="tier-price-col t-lead tnum">
                  €{t.price.toLocaleString('en-US')} <span className="t-micro">{t.unit}</span>
                </div>
                <div className="tier-step-col">
                  <div className="stepper">
                    <button
                      type="button"
                      className="btn-stepper"
                      aria-label={`Decrease ${t.name} quantity`}
                      aria-disabled={qty <= 0}
                      onClick={() => stepQty(t.id, -1)}
                      dangerouslySetInnerHTML={{
                        __html: `${svgPixelIcon('minus', 14)}${qty <= 0 ? svgStrike() : ''}`,
                      }}
                    />
                    <span className="stepper-val t-small tnum">{qty}</span>
                    <button
                      type="button"
                      className="btn-stepper"
                      aria-label={`Increase ${t.name} quantity`}
                      aria-disabled={qty >= t.open}
                      onClick={() => stepQty(t.id, 1)}
                      dangerouslySetInnerHTML={{
                        __html: `${svgPixelIcon('plus', 14)}${qty >= t.open ? svgStrike() : ''}`,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="col-full day-select-wrap">
          <label className="t-micro" htmlFor="quarter-select">
            Preferred window
          </label>
          <select
            className="select-input t-small"
            id="quarter-select"
            value={quarter}
            onChange={(e) => setQuarter(e.target.value)}
          >
            <option value="">Select quarter</option>
            <option value="Q1 2027 (Jan–Mar)">Q1 2027 (Jan–Mar)</option>
            <option value="Q2 2027 (Apr–Jun)">Q2 2027 (Apr–Jun)</option>
            <option value="Q3 2027 (Jul–Sep)">Q3 2027 (Jul–Sep)</option>
          </select>
        </div>

        <form className="col-full contact-form-grid" id="contact-form" noValidate onSubmit={(e) => e.preventDefault()}>
          <div className="field-group">
            <label className="t-micro" htmlFor="contact-name">
              Your name
            </label>
            <input
              className="text-input"
              type="text"
              id="contact-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alex van Dijk"
              required
            />
          </div>
          <div className="field-group">
            <label className="t-micro" htmlFor="contact-email">
              Work email
            </label>
            <input
              className="text-input"
              type="email"
              id="contact-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@company.com"
              required
            />
          </div>
          <div className="field-group contact-form-full">
            <label className="t-micro" htmlFor="contact-brief">
              Project brief &amp; goals
            </label>
            <textarea
              className="textarea-input"
              id="contact-brief"
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
              placeholder="Tell me about your product, design system, or performance goals..."
            />
          </div>
        </form>

        <div className="col-full passes-total-row">
          <div>
            <p className="t-micro">Estimated scope</p>
            <p className="t-h2 tnum" id="tickets-total">
              €{totalCost.toLocaleString('en-US')} · {totalWeeks} weeks
            </p>
            {errorMsg && (
              <div id="tickets-error-wrap" className="t-micro" style={{ color: '#FF5A5A', marginTop: '6px' }} role="alert">
                {errorMsg}
              </div>
            )}
          </div>
          <button type="button" className="btn-primary t-small" id="reserve-btn" onClick={handleReserve}>
            <span>Send inquiry</span>
          </button>
        </div>

        <div className="col-full faq-sec" id="faq">
          <h2 className="t-h2">Frequently asked</h2>
          <div className="faq-list">
            {FAQ_ITEMS.map((f, i) => (
              <details key={i} className="faq-item">
                <summary className="faq-summary t-lead">
                  <span>{f.q}</span>
                  <span
                    className="faq-icon-plus"
                    dangerouslySetInnerHTML={{ __html: svgPixelIcon('plus', 15) }}
                  />
                  <span
                    className="faq-icon-minus"
                    dangerouslySetInnerHTML={{ __html: svgPixelIcon('minus', 15) }}
                  />
                </summary>
                <p className="faq-answer t-body">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>

      {dialogOpen && (
        <dialog
          className="raster-dialog"
          open
          style={{
            display: 'block',
            position: 'fixed',
            inset: '50% auto auto 50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1000,
          }}
          aria-labelledby="dlg-title"
        >
          <h2 className="t-h2" id="dlg-title">
            Inquiry logged
          </h2>
          <p className="t-body" id="dlg-body" style={{ marginTop: '16px' }}>
            {dialogText}
          </p>
          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="button"
              className="btn-primary t-small"
              onClick={() => {
                setDialogOpen(false);
                setName('');
                setEmail('');
                setBrief('');
                setQuantities({ sprint: 0, advisory: 0, audit: 0 });
              }}
            >
              <span>Done</span>
            </button>
          </div>
        </dialog>
      )}
    </section>
  );
};
