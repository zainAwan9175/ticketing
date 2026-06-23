import Router from 'next/router';
import useRequest from '../../hooks/use-request';

const TicketShow = ({ ticket }) => {
  const { doRequest, errors } = useRequest({
    url: '/api/orders',
    method: 'post',
    body: {
      ticketId: ticket.id,
    },
    onSuccess: (order) =>
      Router.push('/orders/[orderId]', `/orders/${order.id}`),
  });

  return (
    <div className="gt-panel">
      <div className="gt-hero__eyebrow" style={{ color: 'var(--muted)' }}>
        Ticket details
      </div>
      <h1 className="gt-panel__title">{ticket.title}</h1>
      <div className="gt-price gt-mt">
        <small>$</small>
        {ticket.price}
      </div>
      <div className="gt-mt">{errors}</div>
      <button
        onClick={() => doRequest()}
        className="gt-btn gt-btn--primary gt-btn--block gt-btn--lg gt-mt"
      >
        Purchase ticket
      </button>
    </div>
  );
};

TicketShow.getInitialProps = async (context, client) => {
  const { ticketId } = context.query;
  const { data } = await client.get(`/api/tickets/${ticketId}`);

  return { ticket: data };
};

export default TicketShow;
