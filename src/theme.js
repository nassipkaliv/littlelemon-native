export const colors = {
  primary: '#495E57',
  primaryLight: '#5f7a71',
  yellow: '#F4CE14',
  salmon: '#EE9972',
  peach: '#FBDABB',
  highlight: '#EDEFEE',
  dark: '#333333',
  white: '#FFFFFF',
  border: '#C9CFCD',
  error: '#C0392B',
};

export const STORAGE_KEY = 'little-lemon/profile';

export const emptyProfile = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  image: null,
  notifications: {
    orderStatuses: true,
    passwordChanges: true,
    specialOffers: true,
    newsletter: true,
  },
};
