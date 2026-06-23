import { useState, useEffect } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

export default () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { doRequest, errors } = useRequest({
    url: '/api/users/signin',
    method: 'post',
    body: {
      email,
      password
    },
    onSuccess: () => Router.push('/')
  });

  const onSubmit = async event => {
    event.preventDefault();

    await doRequest();
  };

  return (
    <div className="gt-panel">
      <h1 className="gt-panel__title">Welcome back</h1>
      <p className="gt-panel__subtitle">Sign in to continue to GitTix.</p>
      <form onSubmit={onSubmit}>
        <div className="gt-field">
          <label className="gt-label">Email address</label>
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="gt-input"
            placeholder="you@example.com"
          />
        </div>
        <div className="gt-field">
          <label className="gt-label">Password</label>
          <input
            value={password}
            onChange={e => setPassword(e.target.value)}
            type="password"
            className="gt-input"
            placeholder="••••••••"
          />
        </div>
        {errors}
        <button className="gt-btn gt-btn--primary gt-btn--block gt-btn--lg gt-mt">
          Sign In
        </button>
      </form>
    </div>
  );
};
