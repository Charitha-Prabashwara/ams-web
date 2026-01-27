import React from 'react';
import { TextField } from '@mui/material';

/**
 * AlphaUpperTextField
 *
 * @param {string} value
 * @param {(val: string) => void} onChange
 * @param {RegExp | null} allowedRegex - optional regex, characters matching it will be removed
 * @param {boolean} forceUppercase - optional, convert to uppercase
 * @param {boolean} disablePaste - optional, disable paste
 */
export default function AlphaUpperTextField({
  value = '',
  onChange,
  allowedRegex = null,
  forceUppercase = false, // default false, so all letters including lowercase allowed
  disablePaste = false,
  ...props
}) {
  const handleChange = (e) => {
    let val = e.target.value;

    // Force uppercase only if enabled
    if (forceUppercase) {
      val = val.toUpperCase();
    }

    // Apply regex ONLY if provided
    if (allowedRegex instanceof RegExp) {
      val = val.replace(allowedRegex, '');
    }

    onChange?.(val);
  };

  return (
    <TextField
      {...props}
      value={value}
      onChange={handleChange}
      slotProps={{
        htmlInput: {
          style: { textTransform: forceUppercase ? 'uppercase' : 'none' },
          onPaste: disablePaste ? (e) => e.preventDefault() : undefined
        }
      }}
    />
  );
}