import {
  COMPANY_PROFILE,
  googleMapsEmbedUrl,
  googleMapsPlaceUrl,
  SITE,
} from "@/lib/site";

export function MeetUs() {
  const mapsHref = googleMapsPlaceUrl();
  const embedSrc = googleMapsEmbedUrl();

  return (
    <section className="section container" id="visit" style={{ paddingTop: 0 }}>
      <div className="section-head">
        <div>
          <span className="eyebrow">Visit</span>
          <h2>Come meet us</h2>
          <p className="muted section-lead" style={{ marginInline: 0 }}>
            Our office is in Hanamigawa-ku, Chiba. Visits are by appointment.
            Message us before you come so a specialist can prepare for you.
          </p>
        </div>
      </div>

      <div className="meet-us-grid">
        <div className="meet-us-map">
          <iframe
            title={`${SITE.name} office map`}
            src={embedSrc}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>

        <div className="meet-us-details">
          <p className="meet-us-label">Address</p>
          <p className="meet-us-value">{COMPANY_PROFILE.address}</p>

          <p className="meet-us-label">Hours</p>
          <p className="meet-us-value">{COMPANY_PROFILE.hours}</p>

          <p className="meet-us-label">Phone</p>
          <p className="meet-us-value">
            <a href={`tel:${SITE.phone.replace(/\s/g, "")}`}>{SITE.phone}</a>
          </p>

          <div className="meet-us-actions">
            <a
              className="btn btn-gold"
              href={mapsHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open in Google Maps
            </a>
            <a className="btn btn-outline" href="#contact-form">
              Book a visit
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
