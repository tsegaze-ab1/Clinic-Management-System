import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import heroImage from '../../../ingrident/images/hero image.jpg';
import sliderOne from '../../../ingrident/images/1 slider.jpg';
import sliderTwo from '../../../ingrident/images/2 secondary slider.jpg';
import homePageBackground from '../../../ingrident/images/background homepage.jpg';
import logo from '../../../ingrident/logo.jpg';
import doctorOneImage from '../../../ingrident/Template for home page/2098_health/images/team-image1.jpg';
import doctorTwoImage from '../../../ingrident/Template for home page/2098_health/images/team-image2.jpg';
import doctorThreeImage from '../../../ingrident/Template for home page/2098_health/images/team-image3.jpg';

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Services', href: '#services' },
  { label: 'Doctors', href: '#doctors' },
  { label: 'About', href: '#about' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Contact', href: '#contact' }
];

const HERO_SLIDES = [
  {
    image: heroImage,
    eyebrow: 'Digital-first clinic operations',
    title: 'Yanet Clinic Management System',
    description:
      'A unified platform that connects care teams, patients, and reception workflows to deliver faster, safer clinical experiences.'
  },
  {
    image: sliderOne,
    eyebrow: 'Reliable and role-driven',
    title: 'One system for every stakeholder',
    description:
      'Enable administrators, clinicians, reception, and patients through secure dashboards designed for their daily tasks.'
  },
  {
    image: sliderTwo,
    eyebrow: 'Optimized patient journey',
    title: 'From booking to follow-up, simplified',
    description:
      'Reduce delays, centralize records, and improve coordination with dependable appointment and patient management tools.'
  }
];

const SERVICES = [
  {
    title: 'General Consultation',
    description: 'Streamline doctor consultations with quick patient lookup and real-time encounter updates.'
  },
  {
    title: 'Diagnosis',
    description: 'Capture and track diagnosis details in one secure and searchable place.'
  },
  {
    title: 'Patient Management',
    description: 'Manage patient profiles, history, and care coordination across departments.'
  },
  {
    title: 'Appointment Scheduling',
    description: 'Book and manage appointments with clear timelines and reduced no-shows.'
  },
  {
    title: 'Lab Integration',
    description: 'Coordinate laboratory requests and results for faster clinician decision-making.'
  },
  {
    title: 'Pharmacy Workflow',
    description: 'Track medication notes and dispensing tasks to support treatment continuity.'
  },
  {
    title: 'Telemedicine Support',
    description: 'Extend care remotely with secure digital interaction and better accessibility.'
  }
];

const FEATURES = [
  'Role-based dashboards for Admin, Doctor, Receptionist, and Patient',
  'Centralized patient records and encounter history',
  'Fast appointment booking and queue visibility',
  'Secure session architecture with JWT-ready authentication'
];

const CONTACT_ITEMS = [
  { label: 'Phone', value: 'Please update with clinic phone' },
  { label: 'Email', value: 'Please update with clinic email' },
  { label: 'Location', value: 'Arbaminch' }
];

const DOCTORS = [
  {
    name: 'Dr. Emma Carter',
    specialty: 'General Physician',
    image: doctorOneImage,
    description: 'Focuses on preventive care, early diagnosis, and comprehensive patient wellness planning.'
  },
  {
    name: 'Dr. Liam Bennett',
    specialty: 'Internal Medicine',
    image: doctorTwoImage,
    description: 'Leads chronic condition management with data-backed follow-up and patient-first communication.'
  },
  {
    name: 'Dr. Sophia Reed',
    specialty: 'Family Care',
    image: doctorThreeImage,
    description: 'Supports long-term family healthcare journeys with compassionate and coordinated treatment.'
  }
];

const TESTIMONIALS = [
  {
    quote:
      'Booking and follow-up became so much faster. The clinic feels more organized, and communication is excellent.',
    name: 'Ava Thompson',
    role: 'Patient'
  },
  {
    quote:
      'The role-based dashboard helps our team coordinate better every day. It reduced our front-desk bottlenecks.',
    name: 'Noah Williams',
    role: 'Reception Team'
  },
  {
    quote:
      'Access to records and scheduling in one place improved consultation flow and saved valuable clinical time.',
    name: 'Dr. Olivia Brooks',
    role: 'Clinician'
  }
];

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 4a1 1 0 0 1 1 1v10.58l3.3-3.29a1 1 0 1 1 1.4 1.42l-5 4.94a1.03 1.03 0 0 1-1.4 0l-5-4.94a1 1 0 0 1 1.4-1.42L11 15.58V5a1 1 0 0 1 1-1Z" />
    </svg>
  );
}

function AccountIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 2a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 12c5.14 0 9 2.75 9 6.4a1 1 0 1 1-2 0c0-2.22-2.8-4.4-7-4.4s-7 2.18-7 4.4a1 1 0 1 1-2 0C3 16.75 6.86 14 12 14Z" />
    </svg>
  );
}

export default function LandingHome() {
  const [activeSlide, setActiveSlide] = useState(0);

  const currentSlide = useMemo(() => HERO_SLIDES[activeSlide], [activeSlide]);

  const heroCopy = useMemo(
    () => ({
      eyebrow: 'Digital-first clinic operations',
      title: 'Yanet Clinic Management System',
      description:
        'A unified platform that connects care teams, patients, and reception workflows to deliver faster, safer clinical experiences.'
    }),
    []
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((previous) => (previous + 1) % HERO_SLIDES.length);
    }, 5500);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="clinic-home" style={{ '--clinic-page-bg': `url(${homePageBackground})` }}>
      <a href="#home" className="clinic-home__corner-brand" aria-label="Yanet home">
        <img src={logo} alt="Yanet logo" />
        <span className="clinic-home__corner-brand-text" data-text="Yanet">
          Yanet
        </span>
      </a>

      <header className="clinic-home__header" id="home">
        <nav className="clinic-home__navbar" aria-label="Main Navigation">
          <ul>
            {NAV_LINKS.map((item) => (
              <li key={item.label}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
          <div className="clinic-home__cta-wrap">
            <Link to="/login" className="clinic-home__ghost-btn">
              Login
            </Link>
            <Link to="/signup" className="clinic-home__primary-btn">
              Signup
            </Link>
          </div>
        </nav>

        <section className="clinic-home__hero" aria-label="Hero">
          <div className="clinic-home__hero-media">
            <img src={currentSlide.image} alt={currentSlide.title} />
            <div className="clinic-home__hero-overlay" />
          </div>

          <div className="clinic-home__hero-content">
            <p className="clinic-home__eyebrow">{heroCopy.eyebrow}</p>
            <h1 className="clinic-home__glitch-title" data-text={heroCopy.title}>
              {heroCopy.title}
            </h1>
            <p>{heroCopy.description}</p>
            <div className="clinic-home__hero-actions">
              <Link to="/login" className="clinic-home__primary-btn">
                Book Appointment
              </Link>
              <Link to="/login" className="clinic-home__ghost-btn clinic-home__ghost-btn--light">
                Login
              </Link>
            </div>
          </div>

          <div className="clinic-home__hero-indicators" aria-label="Slide indicators">
            {HERO_SLIDES.map((slide, index) => (
              <button
                key={slide.title}
                type="button"
                className={index === activeSlide ? 'is-active' : ''}
                onClick={() => setActiveSlide(index)}
                aria-label={`Show slide ${index + 1}`}
              />
            ))}
          </div>

          <a href="#services" className="clinic-home__scroll-down" aria-label="Scroll to services">
            <ArrowIcon />
          </a>
        </section>
      </header>

      <main>
        <section id="services" className="clinic-home__section clinic-home__section--glow">
          <div className="clinic-home__section-head">
            <p>Services</p>
            <h2 className="clinic-home__glow-title">Comprehensive clinical workflow coverage</h2>
          </div>
          <div className="clinic-home__service-grid">
            {SERVICES.map((service) => (
              <article key={service.title} className="clinic-home__service-card">
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="doctors" className="clinic-home__section clinic-home__section--glow">
          <div className="clinic-home__section-head">
            <p>Doctors</p>
            <h2 className="clinic-home__glow-title">Meet your specialist care team</h2>
          </div>
          <div className="clinic-home__doctor-grid">
            {DOCTORS.map((doctor) => (
              <article key={doctor.name} className="clinic-home__doctor-card">
                <img src={doctor.image} alt={doctor.name} />
                <div>
                  <h3>{doctor.name}</h3>
                  <p className="clinic-home__doctor-role">{doctor.specialty}</p>
                  <p>{doctor.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="about" className="clinic-home__section clinic-home__about clinic-home__section--glow">
          <div>
            <p className="clinic-home__kicker">About Yanet</p>
            <h2 className="clinic-home__glow-title">Care coordination built for operational excellence</h2>
            <p>
              Yanet Clinic Management System helps healthcare teams deliver structured, timely, and patient-centered
              services. The platform combines scheduling, patient data, clinical coordination, and communication tools
              into one dependable experience.
            </p>
          </div>

          <div className="clinic-home__vision-grid">
            <article>
              <h3>Mission</h3>
              <p>
                To empower clinics with intuitive digital tools that improve care quality, reduce administrative burden,
                and strengthen patient trust.
              </p>
            </article>
            <article>
              <h3>Vision</h3>
              <p>
                To become the most trusted clinic operations platform for delivering connected, secure, and efficient
                healthcare services.
              </p>
            </article>
          </div>
        </section>

        <section className="clinic-home__section clinic-home__features clinic-home__section--glow">
          <div className="clinic-home__section-head">
            <p>System Highlights</p>
            <h2 className="clinic-home__glow-title">Designed for fast and secure clinic operations</h2>
          </div>
          <div className="clinic-home__feature-list">
            {FEATURES.map((feature) => (
              <article key={feature}>
                <h3>{feature}</h3>
              </article>
            ))}
          </div>
        </section>

        <section id="testimonials" className="clinic-home__section clinic-home__section--glow">
          <div className="clinic-home__section-head">
            <p>Testimonials</p>
            <h2 className="clinic-home__glow-title">Trusted by patients and care teams</h2>
          </div>
          <div className="clinic-home__testimonial-grid">
            {TESTIMONIALS.map((item) => (
              <article key={item.name} className="clinic-home__testimonial-card">
                <p className="clinic-home__testimonial-quote">"{item.quote}"</p>
                <h3>{item.name}</h3>
                <p className="clinic-home__testimonial-role">{item.role}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="contact" className="clinic-home__section clinic-home__contact clinic-home__section--glow">
          <div className="clinic-home__section-head">
            <p>Contact</p>
            <h2 className="clinic-home__glow-title">Connect with the Yanet team</h2>
          </div>
          <div className="clinic-home__contact-layout">
            <div className="clinic-home__contact-card">
              {CONTACT_ITEMS.map((item) => (
                <div key={item.label} className="clinic-home__contact-item">
                  <p>{item.label}</p>
                  <h3>{item.value}</h3>
                </div>
              ))}
            </div>

            <form className="clinic-home__contact-form" onSubmit={(event) => event.preventDefault()}>
              <label htmlFor="contactName">Full Name</label>
              <input id="contactName" name="contactName" type="text" placeholder="Your full name" />

              <label htmlFor="contactEmail">Email</label>
              <input id="contactEmail" name="contactEmail" type="email" placeholder="you@example.com" />

              <label htmlFor="contactMessage">Message</label>
              <textarea id="contactMessage" name="contactMessage" rows="4" placeholder="Tell us how we can help" />

              <button type="submit" className="clinic-home__primary-btn">
                Send Message
              </button>
            </form>
          </div>
        </section>
      </main>

      <footer className="clinic-home__footer">
        <div>
          <h3>Yanet Clinic Management System</h3>
          <p>Professional healthcare workflow platform for modern clinics.</p>
        </div>

        <div className="clinic-home__footer-links">
          <a href="#home">Home</a>
          <a href="#services">Services</a>
          <a href="#doctors">Doctors</a>
          <a href="#about">About</a>
          <a href="#testimonials">Testimonials</a>
          <a href="#contact">Contact</a>
          <Link to="/login">Login</Link>
          <Link to="/signup">Signup</Link>
        </div>
      </footer>
    </div>
  );
}
