// Main entry point for gomtmui package
// This file serves as the primary export for the gomtmui application

// Export main types
export * from './types';

// Export main components (commented out to avoid UI dependencies during build)
// export * from './components';

// Export utilities
export * from './lib/utils';

// Export stores (commented out to avoid React dependencies during build)
// export * from './stores';

// Default export - minimal for now to ensure build success
export default {
  name: 'gomtmui',
  version: '0.0.1',
  description: 'GOMTM UI Application'
};
