"use client";

import React, { FormEvent, useState } from "react";
import Link from "next/link";
import Notification from "@/components/Notification";

export default function SubscribeButton() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [formError, setFormError] = React.useState<string | undefined>(
    undefined,
  );

  const [showNotification, setShowNotification] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    // Be sure we have a value
    if (!formData.get("email")) return;

    setIsLoading(true);

    // Send the email
    const response = await fetch("/api/subscribe", {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: formData.get("email"),
      }),
    });

    if (response.ok) {
      setFormError(undefined);
      await response.json();
      console.log("Email stored");
      setShowNotification(true);
    } else {
      console.log(response.body);
      setFormError(response.statusText);
    }

    setIsLoading(false);
  }

  return (
    <>
      <section className="mx-auto container px-8">
        <form
          onSubmit={onSubmit}
          className="flex flex-col gap-4 md:flex-row md:items-center md:justify-center"
        >
          <input
            className="w-80 placeholder-gray-200 text-white bg-transparent border rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
            placeholder="Enter your email..."
            name="email"
            type="email"
          />
          <button
            className="w-60 bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold shadow-lg hover:bg-gray-200 transition-transform transform hover:scale-105 disabled:bg-gray-300 disabled:hover:scale-none"
            disabled={isLoading}
          >
            Join the Waitlist →
          </button>
        </form>

        {formError && (
          <div
            className="w-100 mx-auto mt-5 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{formError}</span>
          </div>
        )}

        {showNotification && (
          <Notification
            message="You've been added to the waitlist successfully!"
            type="success"
            onDismiss={() => setShowNotification(false)}
          />
        )}
      </section>
    </>
  );
}
