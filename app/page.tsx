'use client'

import { useMemo, useState } from 'react'
import { ArrowUpRight, Check, Clock3, MapPin, Menu, MessageCircle, Phone, Sparkles, X } from 'lucide-react'

const phone = '0648004091'
const whatsapp = '381648004091'
const services = [
  ['Masaža leđa', '12 / 25 din/min', 'Oslobađa napetost u leđima i ramenima, ublažava bolove od sedenja.'],
  ['Masaža nogu i stopala', '12 / 25 din/min', 'Smanjuje osećaj težine, podstiče cirkulaciju i donosi pravo olakšanje.'],
  ['Masaža ruku', '10 / 20 din/min', 'Opušta umorne mišiće šaka i podlaktica — idealno za rad za računarom.'],
  ['Masaža lica', '8 / 15 din/min', 'Podstiče cirkulaciju, opušta mimične mišiće i vraća prirodan sjaj.'],
  ['Hodanje po leđima', '5 / 10 din/min', 'Tradicionalna tehnika za duboko opuštanje i oslobađanje napetosti.'],
  ['Kombo paket', '25 / 55 din/min', 'Ruke, noge i leđa u jednom tretmanu. Minimum 30 minuta.'],
]
const cards = [['Dnevna karta', '250 din', '500 din'], ['Nedeljna karta', '1.320 din', '2.640 din'], ['Mesečna karta', '4.800 din', '9.600 din'], ['Godišnja karta', '50.400 din', '100.800 din']]

export default function Page() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [age, setAge] = useState<'under' | 'adult'>('adult')
  const [minutes, setMinutes] = useState(45)
  const [selectedService, setSelectedService] = useState(0)
  const rate = selectedService === 0 ? (age === 'under' ? 12 : 25) : selectedService === 1 ? (age === 'under' ? 12 : 25) : selectedService === 2 ? (age === 'under' ? 10 : 20) : selectedService === 3 ? (age === 'under' ? 8 : 15) : selectedService === 4 ? (age === 'under' ? 5 : 10) : (age === 'under' ? 25 : 55)
  const total = useMemo(() => minutes * rate, [minutes, rate])

  return <main className="site-shell">
    <div className="topline"><span>SUBOTA · 10:00—14:00</span><span className="topline-dot" /><span>BANOVO BRDO, BEOGRAD</span></div>
    <header className="nav-wrap">
      <a href="#top" className="brand"><span className="brand-mark">M</span><span>MAKSAŽA</span></a>
      <nav className={menuOpen ? 'nav-links mobile-open' : 'nav-links'}>
        <a href="#usluge" onClick={() => setMenuOpen(false)}>Usluge</a><a href="#cenovnik" onClick={() => setMenuOpen(false)}>Cenovnik</a><a href="#galerija" onClick={() => setMenuOpen(false)}>Galerija</a><a href="#kontakt" onClick={() => setMenuOpen(false)}>Kontakt</a>
        <a className="nav-login" href="/prijava">Prijava <ArrowUpRight size={15} /></a>
      </nav>
      <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)} aria-label="Otvori meni">{menuOpen ? <X /> : <Menu />}</button>
    </header>

    <section className="hero" id="top">
      <div className="hero-copy"><p className="eyebrow"><Sparkles size={15} /> PREMIUM WELLNESS ISKUSTVO</p><h1>Prostor za<br /><em>vaš mir.</em></h1><p className="hero-text">Prepustite se veštim rukama. Profesionalna masaža po vašoj meri, u mirnom ambijentu Banovog brda.</p><div className="hero-actions"><a className="button button-dark" href="#kalkulator">Izračunaj cenu <ArrowUpRight size={17} /></a><a className="text-link" href={`tel:${phone}`}><Phone size={16} /> Pozovi nas</a></div><div className="hero-note"><span className="live-dot" /> Dostupan je i dolazak na adresu</div></div>
      <div className="hero-visual"><img src="https://maksaza-sajt.vercel.app/maksaza-hero.png" alt="Premium wellness ambijent MAKSAŽA" /><div className="hero-badge"><strong>10%</strong><span>popusta nakon<br />pete posete</span></div></div>
    </section>

    <section className="intro-section" id="usluge"><div className="section-heading"><p className="eyebrow">NAŠE USLUGE</p><h2>Dodir koji vraća<br /><em>ravnotežu.</em></h2></div><p className="section-lead">Svaki tretman je prilagođen vašim potrebama — za opuštanje, oporavak i zdravlje tela.</p><div className="service-grid">{services.map(([name, price, desc], i) => <article className="service-card" key={name}><span className="service-number">0{i + 1}</span><h3>{name}</h3><p>{desc}</p><span className="service-price">{price} <small>mlađi / 18+</small></span></article>)}</div></section>

    <section className="calculator-section" id="kalkulator"><div className="calculator-intro"><p className="eyebrow">KALKULATOR CENE</p><h2>Vi birate<br /><em>trajanje.</em></h2><p>Cena se obračunava po minutu. Unesite željeno trajanje i odmah saznajte cenu tretmana.</p><div className="calc-rule" /></div><div className="calculator-card"><div className="calc-row"><label>Usluga<select value={selectedService} onChange={e => setSelectedService(Number(e.target.value))}>{services.map(([name], i) => <option value={i} key={name}>{name}</option>)}</select></label><label>Uzrast<div className="segmented"><button className={age === 'under' ? 'selected' : ''} onClick={() => setAge('under')}>Do 18 god.</button><button className={age === 'adult' ? 'selected' : ''} onClick={() => setAge('adult')}>18+</button></div></label></div><label className="minutes-label">Broj minuta <output>{minutes} min</output><input type="range" min="1" max="180" value={minutes} onChange={e => setMinutes(Number(e.target.value))} /></label><div className="quick-times">{[30, 45, 60].map(n => <button key={n} className={minutes === n ? 'active' : ''} onClick={() => setMinutes(n)}>{n} min</button>)}</div><div className="total-line"><span>Ukupno</span><strong>{total.toLocaleString('sr-RS')} <small>din</small></strong></div><p className="calc-footnote">{minutes} min × {rate} din/min · cena se automatski ažurira</p></div></section>

    <section className="pricing-section" id="cenovnik"><div className="section-heading"><p className="eyebrow">PAKETI I KARTE</p><h2>Više opuštanja,<br /><em>više vrednosti.</em></h2></div><p className="section-lead">Za one koji žele da masaža postane deo njihove rutine.</p><div className="package-grid">{cards.map(([name, under, adult], i) => <article className={i === 2 ? 'package-card featured' : 'package-card'} key={name}>{i === 2 && <span className="popular">NAJPOPULARNIJE</span>}<span className="package-index">0{i + 1}</span><h3>{name}</h3><div className="package-prices"><span><small>DO 18 GOD.</small><b>{under}</b></span><span><small>18+</small><b>{adult}</b></span></div><p>fleksibilno korišćenje</p></article>)}</div><p className="discount-note"><Check size={17} /> Redovni klijenti dobijaju 10% popusta nakon pete posete.</p></section>

    <section className="gallery-section" id="galerija"><div className="gallery-title"><p className="eyebrow">AMBIJENT</p><h2>Mir počinje<br /><em>ovde.</em></h2><p>Prijatan ambijent i posvećenost svakom detalju — pogled na MAKSAŽA doživljaj.</p></div><div className="gallery-images"><img src="https://maksaza-sajt.vercel.app/maksaza-gallery-1.png" alt="Opuštajuća masaža u MAKSAŽA salonu" /><img src="https://maksaza-sajt.vercel.app/maksaza-gallery-2.png" alt="Spa ambijent sa peškirima i svećom" /></div></section>

    <section className="contact-section" id="kontakt"><div><p className="eyebrow">REZERVACIJE I INFORMACIJE</p><h2>Spremni za<br /><em>svoj trenutak?</em></h2></div><div className="contact-details"><div><MapPin size={20} /><span>Banovo brdo<br /><small>Beograd</small></span></div><div><Clock3 size={20} /><span>Subota<br /><small>10:00—14:00</small></span></div><a href={`tel:${phone}`}><Phone size={20} /><span>064 800 4091<br /><small>Pozovi za termin</small></span></a><a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer"><MessageCircle size={20} /><span>WhatsApp<br /><small>Pišite nam</small></span></a></div></section>
    <footer><a href="#top" className="brand"><span className="brand-mark">M</span><span>MAKSAŽA</span></a><p>© 2026 MAKSAŽA · Banovo brdo, Beograd</p><div><a href="/registracija">Registracija</a><a href="/admin/login">Admin</a><span aria-label="Instagram" className="social-mark">ig</span></div></footer>
  </main>
}
