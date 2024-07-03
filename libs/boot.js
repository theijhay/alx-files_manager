import envLoader from '../utils/env_loader';

const startServer = (api) => {
  envLoader();
  const ports = process.env.PORT || 5000;
  const envr = process.env.npm_lifecycle_event || 'dev';
  api.listen(ports, () => {
    console.log(`[${envr}] API has started listening at port:${ports}`);
  });
};

export default startServer;
