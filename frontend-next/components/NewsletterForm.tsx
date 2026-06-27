"use client";

import { FormEvent, useState } from "react";

type NewsletterFormProps = {
  idPrefix: string;
  className?: string;
  title?: string;
  showKicker?: boolean;
  headingLevel?: "h1" | "h2";
};

export default function NewsletterForm({
  idPrefix,
  className = "sidebar-newsletter labeled",
  title = "Newsletter",
  showKicker = false,
  headingLevel = "h2",
}: NewsletterFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const Heading = headingLevel;

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <form className={className} onSubmit={onSubmit}>
      {showKicker ? <span className="kicker">Newsletter</span> : <div className="section-rule" />}
      <Heading>{title}</Heading>
      <div className="field-row field-row--first-name">
        <label htmlFor={`${idPrefix}-name`}>Name</label>
        <input id={`${idPrefix}-name`} name="first-name" type="text" placeholder="Name" />
      </div>
      <div className="field-row field-row--last-name">
        <label htmlFor={`${idPrefix}-last-name`}>Last name</label>
        <input id={`${idPrefix}-last-name`} name="last-name" type="text" placeholder="Last name" />
      </div>
      <div className="field-row field-row--email">
        <label htmlFor={`${idPrefix}-email`}>Email address:</label>
        <input id={`${idPrefix}-email`} name="email" type="email" placeholder="Your email address" required />
      </div>
      <button className="signup-button" type="submit">
        Sign up
      </button>
      {submitted ? <p className="form-message">Thank you for signing up.</p> : null}
    </form>
  );
}
