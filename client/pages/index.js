import Link from 'next/link';

const LandingPage = ({ tickets }) => {
  const hasTickets = tickets && tickets.length > 0;

  const ticketCards = (tickets || []).map((ticket) => {
    return (
      <div key={ticket.id} className="gt-card">
        <div className="gt-card__title">{ticket.title}</div>
        <div className="gt-price">
          <small>$</small>
          {ticket.price}
        </div>
        <Link
          href="/tickets/[ticketId]"
          as={`/tickets/${ticket.id}`}
          className="gt-btn gt-btn--ghost gt-btn--block"
        >
          View ticket →
        </Link>
      </div>
    );
  });

  return (
    <div>
      <section className="gt-hero">
        <div className="gt-hero__eyebrow">Marketplace</div>
        <h1 className="gt-hero__title">Find your next event ticket.</h1>
        <p className="gt-hero__subtitle">
          Buy and sell tickets in seconds. Secure Stripe payments, real-time
          availability, and a checkout that just works.
        </p>
      </section>

      <div className="gt-section-head">
        <h2>Available tickets</h2>
        <span>{hasTickets ? `${tickets.length} listed` : 'None yet'}</span>
      </div>

      {hasTickets ? (
        <div className="gt-grid">{ticketCards}</div>
      ) : (
        <div className="gt-empty">
          <div className="gt-empty__emoji">🎟️</div>
          <div className="gt-empty__title">No tickets yet</div>
          <div className="gt-empty__text gt-muted">
            Be the first to list one on the marketplace.
          </div>
          <Link href="/tickets/new" className="gt-btn gt-btn--primary">
            Sell a ticket
          </Link>
        </div>
      )}
    </div>
  );
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get('/api/tickets');

  return { tickets: data };
};

export default LandingPage;
