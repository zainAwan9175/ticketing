import 'bootstrap/dist/css/bootstrap.css';
import '../styles/globals.css';
import buildClient from '../api/build-client';
import Header from '../components/header';

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div className="gt-shell">
      <Header currentUser={currentUser} />
      <main className="gt-main">
        <Component currentUser={currentUser} {...pageProps} />
      </main>
      <footer className="gt-footer">
        GitTix · microservices ticketing · deployed on GKE 🚀
      </footer>
    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
  const { data } = await client.get('/api/users/currentuser');

  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx,
      client,
      data.currentUser
    );
  }

  return {
    pageProps,
    ...data,
  };
};

export default AppComponent;
