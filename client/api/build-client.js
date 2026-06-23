import axios from 'axios';

// Decides the base URL for API requests depending on where the code runs.
const buildClient = ({ req }) => {
  if (typeof window === 'undefined') {
    // Server-side (Next.js getInitialProps runs inside the client pod):
    // talk to the ingress-nginx controller by its in-cluster DNS name and
    // forward the original request headers (Host + cookies) so routing and
    // the logged-in session work.
    return axios.create({
      baseURL:
        'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: req.headers,
    });
  } else {
    // Browser: use a relative URL so requests go to the same host the user
    // is on (the LoadBalancer IP / domain), and the ingress routes them.
    return axios.create({
      baseURL: '/',
    });
  }
};

export default buildClient;
