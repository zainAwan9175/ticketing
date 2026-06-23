import { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import useRequest from '../../hooks/use-request';

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id,
    },
    onSuccess: (payment) => console.log(payment),
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [order]);

  if (timeLeft < 0) {
    return (
      <div className="gt-status">
        <div className="gt-status__emoji">⌛</div>
        <div className="gt-status__title">Order expired</div>
        <div className="gt-status__text">
          This reservation timed out. Please start a new order.
        </div>
      </div>
    );
  }

  return (
    <div className="gt-panel">
      <span className="gt-countdown">
        <span className="gt-dot" />
        {timeLeft}s left to pay
      </span>
      <h1 className="gt-panel__title">Complete your purchase</h1>
      <p className="gt-panel__subtitle">
        {order.ticket.title} — <strong>${order.ticket.price}</strong>
      </p>
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey="pk_test_51RAV5oPMh3tFCWXQJef6rfCiwgzIC7UhFoK3f0551KFiptOFTvrVMDFCqNOIz9PPFS2HwgIANQDOGfSTnknSRoyI00niV0MuIk"
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
      <div className="gt-mt">{errors}</div>
    </div>
  );
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
};

export default OrderShow;
