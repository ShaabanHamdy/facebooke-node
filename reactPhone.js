import React, { useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const UserForm = () => {
  const [country, setCountry] = useState('');
  const [mobile, setMobile] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const user = { country, mobile };

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        console.log('User created successfully');
      } else {
        console.error('Error creating user');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Country</label>
        <PhoneInput
          country={'us'} // Default country
          value={mobile}
          onChange={(phone, data) => {
            setMobile(phone);
            setCountry(data.countryCode.toUpperCase());
          }}
          countryCodeEditable={false} // Disable country code editing
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default UserForm;
