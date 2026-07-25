import { BANK_ACCOUNTS, PAYPAL } from "@/lib/site";

export function BankDetails() {
  return (
    <section className="section container" id="bank-details">
      <div className="section-head section-head-center">
        <div>
          <span className="eyebrow">Payments</span>
          <h2>Bank &amp; Payment Details</h2>
          <p className="muted section-lead">Secure payment options for your transactions</p>
        </div>
      </div>

      <div className="bank-grid">
        {BANK_ACCOUNTS.map((account) => (
          <div className="glass info-card" key={account.title}>
            <h3 className="heading info-card-title">{account.title}</h3>
            <dl className="info-rows">
              {account.rows.map((row) => (
                <div className="info-row" key={row.label}>
                  <dt>{row.label}</dt>
                  <dd className="mono">{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}

        <div className="glass info-card">
          <h3 className="heading info-card-title">PayPal</h3>
          <dl className="info-rows">
            <div className="info-row">
              <dt>PayPal Email</dt>
              <dd className="mono">{PAYPAL.email}</dd>
            </div>
            <div className="info-row">
              <dt>Transfer Fees</dt>
              <dd>{PAYPAL.transferFees}</dd>
            </div>
          </dl>
        </div>

        <div className="security-notice">
          <strong>Security Notice</strong>
          <p>
            Only send payments to the accounts listed on this page. Always confirm payment details
            with your ZervTek representative before transferring funds.
          </p>
        </div>
      </div>
    </section>
  );
}
