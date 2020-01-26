import React, { useState } from 'react';
import fetch from 'unfetch';

const FormItem = props => (
  <div className={`form-item ${props.className}`}>{props.children}</div>
);

const Input = props =>
  React.createElement(props.multiline ? 'textarea' : 'input', {
    className: 'p-3 w-full block appearance-none text-xl border bg-gray-200',
    ...props
  });

const FormField = ({ label, id, ...rest }) => {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block font-bold text-xl tracking-tighter">
        {label}
      </label>
      <Input id={id} {...rest} />
    </div>
  );
};

const encode = data => {
  return Object.keys(data)
    .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
    .join('&');
};

const ContactForm = () => {
  const [isFormSent, setIsFormSent] = useState(false);
  const [showFormError, setFormError] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMsg] = useState('');

  const handleFieldChange = e => {
    const val = e.target.value;

    switch (e.target.name) {
      case 'name':
        return setName(val);
      case 'email':
        return setEmail(val);
      case 'message':
        return setMsg(val);
    }
  };

  const handleSubmit = e => {
    e.preventDefault();

    setIsFormSent(false);

    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: encode({ 'form-name': 'contact', name, email, message })
    })
      .then(() => {
        setIsFormSent(true);
        setFormError(false);
      })
      .catch(error => {
        isFormSent(false);
        setFormError(true);
        console.log(error);
      });
  };

  if (isFormSent) {
    return <p className="alert alert--success">Message sent</p>;
  }

  return (
    <form
      name="contact"
      method="post"
      data-netlify="true"
      data-netlify-honeypot="bot-field"
      onSubmit={handleSubmit}
      className="mb-32 xl:w-2/3"
    >
      {showFormError && (
        <p className="alert alert--error">
          Oh no! Something went wrong. Refresh and try again?
        </p>
      )}

      <input type="hidden" name="bot-field" />
      <div className="md:flex -mx-3">
        <div className="md:w-1/2 px-3">
          <FormField
            id="name"
            label="Your name (so I know who's calling)"
            type="text"
            name="name"
            value={name}
            onChange={handleFieldChange}
            spellCheck={false}
            required
          />
        </div>
        <div className="md:w-1/2 px-3">
          <FormField
            label="Your email (so I can get back to you)"
            id="email"
            type="email"
            name="email"
            onChange={handleFieldChange}
            value={email}
            required
          />
        </div>
      </div>
      <FormField
        label="Message (so I know what's up)"
        id="message"
        name="message"
        onChange={handleFieldChange}
        value={message}
        required
        multiline
      />
      <FormItem className="form-item--btn">
        <button type="submit" className="btn">
          <span>Send message</span>
        </button>
      </FormItem>
    </form>
  );
};

export default ContactForm;
