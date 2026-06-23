import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

const NewTicket = () => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const { doRequest, errors } = useRequest({
    url: '/api/tickets',
    method: 'post',
    body: {
      title,
      price,
    },
    onSuccess: () => Router.push('/'),
  });

  const onSubmit = (event) => {
    event.preventDefault();

    doRequest();
  };

  const onBlur = () => {
    const value = parseFloat(price);

    if (isNaN(value)) {
      return;
    }

    setPrice(value.toFixed(2));
  };

  return (
    <div className="gt-panel">
      <h1 className="gt-panel__title">Sell a ticket</h1>
      <p className="gt-panel__subtitle">
        List your ticket on the GitTix marketplace.
      </p>
      <form onSubmit={onSubmit}>
        <div className="gt-field">
          <label className="gt-label">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="gt-input"
            placeholder="e.g. Coldplay — Front Row"
          />
        </div>
        <div className="gt-field">
          <label className="gt-label">Price</label>
          <div className="gt-input-group">
            <span className="gt-input-group__prefix">$</span>
            <input
              value={price}
              onBlur={onBlur}
              onChange={(e) => setPrice(e.target.value)}
              className="gt-input"
              placeholder="0.00"
            />
          </div>
        </div>
        {errors}
        <button className="gt-btn gt-btn--primary gt-btn--block gt-btn--lg gt-mt">
          Publish ticket
        </button>
      </form>
    </div>
  );
};

export default NewTicket;
