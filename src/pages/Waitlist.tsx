import { useState } from "react";

export default function Waitlist() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const FORMSPREE_ENDPOINT = "https://formspree.io/f/xwvnblla";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    try {
      setStatus("sending");

      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error("Failed");

      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-semibold tracking-tight">
  YC's Hidden Vault
</h1>
          <p className="mt-3 text-sm text-white/70">
            For those who know. Invite-only drops.
          </p>
          <p className="mt-2 text-xs text-white/50">
            Coming soon,Dont Lack.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <form onSubmit={onSubmit} className="space-y-3">
            <label className="block text-sm text-white/80">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-white placeholder:text-white/40 outline-none focus:border-white/30"
            />

            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full rounded-xl bg-white text-black font-medium py-3 hover:bg-white/90 disabled:opacity-60"
            >
              {status === "sending" ? "Locking you in..." : "Join the waitlist"}
            </button>

            {status === "success" && (
              <p className="text-sm text-green-300">
                Locked in. We’ll let you know when it’s time.
              </p>
            )}

            {status === "error" && (
              <p className="text-sm text-red-300">
                Something went wrong. Try again.
              </p>
            )}
          </form>

          <div className="mt-4 text-xs text-white/50">
            No spam. Invite-only drops.
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-xs text-white/40">
          © {new Date().getFullYear()} YC’s Finest
        </div>
      </div>
    </div>
  );
}