import { useEffect } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

export default () => {
  const { doRequest } = useRequest({
    url: '/api/users/signout',
    method: 'post',
    body: {},
    onSuccess: () => Router.push('/')
  });

  useEffect(() => {
    doRequest();
  }, []);

  return (
    <div className="gt-status">
      <div className="gt-status__emoji">👋</div>
      <div className="gt-status__title">Signing you out…</div>
      <div className="gt-status__text">Hang tight, redirecting you home.</div>
    </div>
  );
};
