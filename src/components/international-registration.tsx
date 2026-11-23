'use client';

import { useState, type FormEvent } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { internationalPackages, delegateBenefits, experienceBenefits, indicativeUsdRate, usd, type InternationalPackageId } from '@/lib/international';
import { money, saveOrder, currentTier, type Order } from '@/lib/event';
import { Check, ShieldCheck, Ticket } from './icon';
import { LocalizedLink as Link } from './locale-provider';

export default function InternationalRegistration() {
  const [packageId, setPackageId] = useState<InternationalPackageId>('delegate');
  const [step, setStep] = useState(0);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState('');
  const selectedPackage = internationalPackages.find(item => item.id === packageId)!;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const registration: Order = {
      id: `NYC27-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      name: String(form.get('name') ?? '').trim(), email: String(form.get('email') ?? '').trim(),
      phone: String(form.get('phone') ?? '').trim(), chapter: String(form.get('chapter') ?? '').trim(),
      note: String(form.get('note') ?? '').trim(), country: String(form.get('country') ?? '').trim(),
      tier: currentTier(), member: 'non-member', travelMode: 'group', addons: [], currency: 'USD',
      internationalPackageId: packageId, total: selectedPackage.price, status: 'pending', createdAt: new Date().toISOString(),
    };
    if (!registration.name || !registration.email || !registration.country || !registration.phone) {
      setError('Please complete all required fields.');
      return;
    }
    try { saveOrder(registration); setOrder(registration); setStep(2); setError(''); }
    catch { setError('Your browser could not save this demo registration. Please enable local storage and try again.'); }
  }

  function reportPayment() {
    if (!order) return;
    const updated: Order = { ...order, status: 'reported' };
    try { saveOrder(updated); setOrder(updated); setError(''); }
    catch { setError('The demo payment status could not be saved. Please try again.'); }
  }

  return (
    <section className="registration-card international-registration" aria-labelledby="international-title">
      <div className="modal-header"><div><p className="eyebrow blue">INTERNATIONAL DELEGATES</p><h2 id="international-title">Your NYC 2027 journey</h2></div></div>
      <div className="registration-steps">{['Choose your package', 'Delegate details', 'Registration'].map((label, index) => <span key={label} className={step >= index ? 'active' : ''}><b>{step > index ? <Check size={13} /> : index + 1}</b>{label}</span>)}</div>
      <div className="demo-notice"><ShieldCheck size={19} /><span>Interface demo. Registrations are saved in this browser. Payments and confirmation emails are simulated.</span></div>
      {step === 0 && <div className="registration-content">
        <fieldset className="international-package-options"><legend>Select your package</legend>
          {internationalPackages.map(item => <label key={item.id} className={`international-package ${item.id === packageId ? 'selected' : ''}`}>
            <input type="radio" name="international-package" value={item.id} checked={packageId === item.id} onChange={() => setPackageId(item.id)} />
            <span className="eyebrow">{item.id === 'delegate' ? 'THE ESSENTIAL JOURNEY' : 'EXPLORE A LITTLE FURTHER'}</span>
            <h3>{item.name}</h3><strong>{usd(item.price)} <small>USD / person</small></strong><p>Twin sharing</p>
            {item.id === 'experience' && <p className="package-inherits">All Delegate Package benefits, plus</p>}
            <ul>{(item.id === 'delegate' ? delegateBenefits : experienceBenefits).map(benefit => <li key={benefit}><Check size={15} />{benefit}</li>)}</ul>
            <span className="package-indicative">Approx. {money(item.price * indicativeUsdRate)}</span>
          </label>)}
        </fieldset>
        <div className="international-terms"><h3>Before you book</h3><ul><li>Airport transfers operate on the COC group schedule.</li><li>Flights, extra nights, single-room upgrades and private transfers outside the group schedule are not included.</li><li>No lunch on 17 January.</li></ul><p>Indicative conversion only: 1 USD = 26,000 VND, as stated in the event package poster.</p></div>
        <div className="cart-total"><span>{selectedPackage.name}<small>01 delegate · Twin sharing</small></span><strong>{usd(selectedPackage.price)} USD</strong></div>
        <button className="button navy full" onClick={() => setStep(1)}>Continue to delegate details</button>
      </div>}
      {step === 1 && <form className="registration-content" onSubmit={submit}>
        <div className="form-grid">
          <label className="field">Full name *<input name="name" autoComplete="name" required maxLength={120} /></label>
          <label className="field">Country / Territory *<input name="country" autoComplete="country-name" required maxLength={100} /></label>
          <label className="field">Email *<input name="email" type="email" autoComplete="email" required maxLength={180} /></label>
          <label className="field">Phone / WhatsApp *<input name="phone" type="tel" autoComplete="tel" required minLength={6} maxLength={30} placeholder="Include country code" /></label>
          <label className="field full-field">JCI organisation / Chapter<input name="chapter" maxLength={120} /></label>
          <label className="field full-field">Travel and dietary notes<textarea name="note" rows={3} maxLength={1000} placeholder="Flight details, dietary requirements, room sharing or other support…" /></label>
        </div>
        <label className="consent"><input type="checkbox" required />I understand this is a demo and agree to save this sample registration in my browser.</label>
        <div className="order-mini-summary"><Ticket size={20} /><span>{selectedPackage.name}</span><strong>{usd(selectedPackage.price)} USD</strong></div>
        <button className="button navy full" type="submit">Create demo registration</button>
        <button className="back-link" type="button" onClick={() => setStep(0)}>Back to packages</button>
      </form>}
      {step === 2 && order && <div className="registration-content payment-content">
        <div className="order-success"><span><Check size={25} /></span><h3>Demo registration created</h3><p>Thank you, {order.name}. Your package is reserved in this browser for preview.</p></div>
        <div className="qr-layout"><div className="qr-demo"><QRCodeSVG value={`NYC2027-DEMO|${order.id}|USD|${order.total}|NOT-A-PAYMENT`} size={164} /><strong>DEMO QR</strong><small>Not valid for payment</small></div>
          <div className="payment-info"><span className="status-pill">{order.status === 'reported' ? 'Awaiting demo reconciliation' : 'Demo payment pending'}</span><label>REGISTRATION ID</label><p>{order.id}</p><label>PACKAGE TOTAL</label><strong className="payment-total">{usd(order.total)} USD</strong><p>{selectedPackage.name} · Twin sharing</p><p>The COC will provide official payment instructions before live registration opens.</p></div></div>
        <div className="email-note"><p>In the live system, confirmation will be sent to <strong>{order.email}</strong> after payment is verified by the COC.</p></div>
        <button className="button navy full" disabled={order.status === 'reported'} onClick={reportPayment}>{order.status === 'reported' ? 'Demo payment reported' : 'Simulate: I have paid'}</button>
        <Link className="back-link" href="/">Back to the event</Link>
      </div>}
      {error && <p className="form-error" role="alert">{error}</p>}
    </section>
  );
}
