export const isValidName = (value) => /^[A-Za-zÀ-ÿА-Яа-яЁё' -]{1,40}$/.test(value.trim());

export const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());

// US phone number, 10 digits, displayed as (217) 555-0113
export const formatPhone = (value) => {
  const d = value.replace(/\D/g, '').slice(0, 10);
  if (d.length === 0) return '';
  if (d.length < 4) return `(${d}`;
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
};

export const isValidPhone = (value) => value === '' || value.replace(/\D/g, '').length === 10;
