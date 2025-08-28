"use client";

import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";

export default function SignUpPage() {
  const { signIn } = useAuthActions();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await signIn("password", {
        email,
        password,
        flow: "signUp",
      });
      setMessage("User created successfully!");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full rounded-2xl border border-border bg-card/90 backdrop-blur shadow-sm p-6">
        <h1 className="text-2xl font-semibold text-center mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Sign Up</h1>
        
        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-input bg-card rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="mt-1 block w-full px-3 py-2 border border-input bg-card rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 rounded-lg border border-border text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>
        
        {message && (
          <div className={`mt-4 p-3 rounded-md border ${
            message.includes("successfully") 
              ? "bg-success/10 text-success-foreground border-success/30" 
              : "bg-destructive/10 text-destructive border-destructive/30"
          }`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
