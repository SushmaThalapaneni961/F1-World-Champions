export interface Environment {
  production: boolean;
  environmentName: string;
  apiUrl: string;
}

// Environment configurations
const environments = {
  development: {
    production: false,
    environmentName: 'development',
    apiUrl: 'http://localhost:5001',
  },
};

export const environment = environments.development;
