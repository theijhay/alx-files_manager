import { existsSync, readFileSync } from 'fs';

// Load environment variables from .env file
const envLoader = () => {
  const envr = process.env.npm_lifecycle_event || 'dev';
  const paths = envr.includes('test') || envr.includes('cover') ? '.env.test' : '.env';

  if (existsSync(paths)) {
    const data = readFileSync(paths, 'utf-8').trim().split('\n');

    for (const line of data) {
      const delimPosition = line.indexOf('=');
      const variable = line.substring(0, delimPosition);
      const value = line.substring(delimPosition + 1);
      process.envr[variable] = value;
    }
  }
};

export default envLoader;
