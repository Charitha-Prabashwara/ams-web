import Toastify from 'toastify-js';

export const showToast = ({ text, type = 'info', duration = 3000 }) => {
  let background = '#2196f3';

  if (type === 'success') background = '#4caf50';
  if (type === 'error') background = '#f44336';
  if (type === 'warning') background = '#ff9800';

  Toastify({
    text,
    duration,
    gravity: 'top',
    position: 'right',
    close: true,
    stopOnFocus: true,
    backgroundColor: background
  }).showToast();
};
