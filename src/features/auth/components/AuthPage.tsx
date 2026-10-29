"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useSharedProvider } from "../../../shared/context/useSharedProvider";

export default function AuthPage() {
  const { signIn, register } = useSharedProvider();
  const router = useRouter();
  const [mode, setMode] = useState<"signIn" | "signUp">("signIn");
  const [signInEmail, setSignInEmail] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [password, setPassword] = useState("");
  const activeEmail = mode === "signIn" ? signInEmail : signUpEmail;
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setInfoMessage(null);
    setIsSubmitting(true);

    try {
      if (mode === "signIn") {
        await signIn(signInEmail, password);
        const savedBoardId = localStorage.getItem("boardId") ?? "0";
        router.replace(`/board/${savedBoardId}`);
      } else {
        const needsEmailConfirmation = await register(
          signUpEmail,
          password
        );
        if (needsEmailConfirmation) {
          setInfoMessage(
            "Check your email and confirm the address to finish creating your account. Your boards will remain attached to this browser session."
          );
        } else {
          router.replace("/board/0");
        }
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Authentication failed."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const changeMode = (nextMode: "signIn" | "signUp") => {
    setMode(nextMode);
    setPassword("");
    setErrorMessage(null);
    setInfoMessage(null);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#080b14] px-4 text-white">
      <section className="w-full max-w-md rounded-2xl border border-white/15 bg-white/[0.06] p-8 shadow-2xl backdrop-blur-xl">
        <p className="mb-2 text-sm font-medium uppercase tracking-[0.25em] text-indigo-300">
          Trello Analog
        </p>
        <h1 className="mb-2 text-3xl font-semibold">
          {mode === "signIn" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="mb-7 text-sm text-white/65">
          {mode === "signIn"
            ? "Sign in to access your boards."
            : "Create an account to keep your boards safe and accessible."}
        </p>

        <div className="mb-6 grid grid-cols-2 rounded-lg bg-black/25 p-1 text-sm">
          <button
            type="button"
            aria-pressed={mode === "signIn"}
            onClick={() => changeMode("signIn")}
            className={`rounded-md px-3 py-2 transition ${
              mode === "signIn" ? "bg-white/15 text-white" : "text-white/60"
            }`}
          >
            Sign in
          </button>
          <button
            type="button"
            aria-pressed={mode === "signUp"}
            onClick={() => changeMode("signUp")}
            className={`rounded-md px-3 py-2 transition ${
              mode === "signUp" ? "bg-white/15 text-white" : "text-white/60"
            }`}
          >
            Register
          </button>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-2 text-sm text-white/80">
            Email
            <input
              type="email"
              autoComplete="email"
              required
              value={activeEmail}
              onChange={(event) => {
                const email = event.target.value;
                if (mode === "signIn") {
                  setSignInEmail(email);
                } else {
                  setSignUpEmail(email);
                }
              }}
              className="rounded-lg border border-white/15 bg-black/30 px-3 py-3 text-white outline-none transition focus:border-indigo-400"
              placeholder="you@example.com"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm text-white/80">
            Password
            <input
              type="password"
              autoComplete={
                mode === "signIn" ? "current-password" : "new-password"
              }
              minLength={6}
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="rounded-lg border border-white/15 bg-black/30 px-3 py-3 text-white outline-none transition focus:border-indigo-400"
              placeholder="At least 6 characters"
            />
          </label>

          {errorMessage && (
            <p role="alert" className="text-sm text-red-300">
              {errorMessage}
            </p>
          )}
          {infoMessage && (
            <p role="status" className="text-sm text-emerald-200">
              {infoMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 rounded-lg bg-indigo-500 px-4 py-3 font-semibold transition hover:bg-indigo-400 disabled:cursor-wait disabled:opacity-60"
          >
            {isSubmitting
              ? "Please wait..."
              : mode === "signIn"
                ? "Sign in"
                : "Create account"}
          </button>
        </form>
      </section>
    </main>
  );
}
