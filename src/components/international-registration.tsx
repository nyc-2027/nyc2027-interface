'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Payment from './payment';
import { register, restoreBooking, type Booking } from '@/lib/registration-client';
import { internationalPackages, delegateBenefits, experienceBenefits, indicativeUsdRate, usd, type InternationalPackageId } from '@/lib/international';
import { money, currentTier, type Order } from '@/lib/event';
import { Check, ShieldCheck, Ticket } from './icon';
import { LocalizedLink as Link } from './locale-provider';

export default function InternationalRegistration() {
  const [packageId, setPackageId] = useState<InternationalPackageId>('delegate');
  const [step, setStep] = useState(0);
  const [booking, setBooking] = useState<Booking | null>(null); const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const selectedPackage = internationalPackages.find(item => item.id === packageId)!;

  useEffect(() => { const saved = restoreBooking(true); if (saved) { setBooking(saved); setStep(2); } }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
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
    setBusy(true); try { const saved = await register(registration); setBooking(saved); setStep(2); setError(''); } catch { setError('Không lưu được đăng ký / Registration unavailable. Please try again.'); } finally { setBusy(false); }
  }



  return (
    <section className="registration-card international-registration" aria-labelledby="international-title">
      <div className="modal-header"><div><p className="eyebrow blue">INTERNATIONAL DELEGATES</p><h2 id="international-title">Your NYC 2027 journey</h2></div></div>
      <div className="registration-steps">{['Choose your package', 'Delegate details', 'Registration'].map((label, index) => <span key={label} className={step >= index ? 'active' : ''}><b>{step > index ? <Check size={13} /> : index + 1}</b>{label}</span>)}</div>
      <div className="demo-notice"><ShieldCheck size={19} /><span>Registration is saved securely. Payment is verified by the COC.</span></div>
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
        <label className="consent"><input type="checkbox" required />I consent to storing my registration details for event organisation and payment reconciliation.</label>
        <div className="order-mini-summary"><Ticket size={20} /><span>{selectedPackage.name}</span><strong>{usd(selectedPackage.price)} USD</strong></div>
        <button className="button navy full" type="submit" disabled={busy}>{busy ? 'Generating…' : 'Get QR code'}</button>
        <button className="back-link" type="button" onClick={() => setStep(0)}>Back to packages</button>
      </form>}
      {step === 2 && booking && <Payment booking={booking} english />}
      {error && <p className="form-error" role="alert">{error}</p>}
    </section>
  );
}
