import { useState } from "react";

export default function Waitlist() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    await fetch("https://formspree.io/f/xwvnblla", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email }),
    });

    setSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6 text-white">
      <div className="text-center max-w-md w-full">

        <h1 className="text-4xl font-bold mb-4">YC's Bidding Room</h1>

        <p className="text-gray-400 mb-8">
          Access Pending.  
          <br />
          Dont Lack.
        </p>

        {submitted ? (
          <p className="text-green-400 font-medium">
            You’re on the list. you'll let you know when its time.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="email"
              required
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-3 rounded bg-gray-900 border border-gray-700 text-white focus:outline-none"
            />

            <button
              type="submit"
              className="bg-white text-black py-3 rounded font-semibold hover:bg-gray-200 transition"
            >
              Request Early Access
            </button>
          </form>
        )}

        <p className="text-xs text-gray-600 mt-6">
          Those who know, Wait.
        </p>

      </div>
    </div>
  );
}