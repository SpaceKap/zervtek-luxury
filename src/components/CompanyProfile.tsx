import { COMPANY_PROFILE } from "@/lib/site";

export function CompanyProfile() {
  const rows = [
    { label: "Company Name", value: COMPANY_PROFILE.companyName },
    { label: "Japanese Name", value: COMPANY_PROFILE.japaneseName },
    { label: "Address", value: COMPANY_PROFILE.address },
    { label: "Registration No.", value: COMPANY_PROFILE.registrationNo },
    { label: "Used vehicle dealer license", value: COMPANY_PROFILE.dealerLicense },
    { label: "Phone", value: COMPANY_PROFILE.phone },
    { label: "Email", value: COMPANY_PROFILE.email },
    { label: "Hours", value: COMPANY_PROFILE.hours },
  ];

  return (
    <div className="glass info-card">
      <h3 className="heading info-card-title">Company Profile</h3>
      <dl className="info-rows">
        {rows.map((row) => (
          <div className="info-row" key={row.label}>
            <dt>{row.label}</dt>
            <dd>{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
