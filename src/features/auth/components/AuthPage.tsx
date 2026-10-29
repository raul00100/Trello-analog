"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { GalleryVerticalEnd } from "lucide-react";
import { useSharedProvider } from "../../../shared/context/useSharedProvider";
import { Button } from "../../../shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../shared/components/ui/card";
import { Input } from "../../../shared/components/ui/input";
import { Label } from "../../../shared/components/ui/label";
import {
  validateRegistration,
  validateSignIn,
} from "../model/authValidation";

export default function AuthPage() {
  const { signIn, register } = useSharedProvider();
  const router = useRouter();
  const [mode, setMode] = useState<"signIn" | "signUp">("signIn");
  const [name, setName] = useState("");
  const [signInEmail, setSignInEmail] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const activeEmail = mode === "signIn" ? signInEmail : signUpEmail;
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setInfoMessage(null);

    const validationError =
      mode === "signIn"
        ? validateSignIn(signInEmail, password)
        : validateRegistration(name, signUpEmail, password, confirmPassword);
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === "signIn") {
        await signIn(signInEmail, password);
        const savedBoardId = localStorage.getItem("boardId") ?? "0";
        router.replace(`/board/${savedBoardId}`);
      } else {
        const needsEmailConfirmation = await register(name, signUpEmail, password);
        if (needsEmailConfirmation) {
          setInfoMessage(
            "Check your email and confirm the address to finish creating your account, then sign in."
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
    setConfirmPassword("");
    setErrorMessage(null);
    setInfoMessage(null);
  };

  return (
    <main className="dark flex min-h-svh items-center justify-center bg-background p-6 text-foreground md:p-10">
      <Card className="w-full max-w-sm">
        <CardHeader className="items-center text-center">
          <div className="flex size-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEnd className="size-5" />
          </div>
          <CardTitle className="text-xl">
            {mode === "signIn" ? "Welcome back" : "Create your account"}
          </CardTitle>
          <CardDescription>
            {mode === "signIn"
              ? "Sign in to Management Tool"
              : "Register to save and access your boards"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 grid grid-cols-2 rounded-lg bg-muted p-1 text-sm">
            <Button
              type="button"
              variant={mode === "signIn" ? "default" : "ghost"}
              aria-pressed={mode === "signIn"}
              onClick={() => changeMode("signIn")}
              className={
                mode === "signIn"
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "text-muted-foreground hover:text-foreground"
              }
            >
              Sign in
            </Button>
            <Button
              type="button"
              variant={mode === "signUp" ? "default" : "ghost"}
              aria-pressed={mode === "signUp"}
              onClick={() => changeMode("signUp")}
              className={
                mode === "signUp"
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "text-muted-foreground hover:text-foreground"
              }
            >
              Register
            </Button>
          </div>

          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            {mode === "signUp" && (
              <div className="grid gap-2">
                <Label htmlFor="auth-name">Name</Label>
                <Input
                  id="auth-name"
                  type="text"
                  autoComplete="name"
                  required
                  maxLength={100}
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Your name"
                />
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="auth-email">Email</Label>
              <Input
                id="auth-email"
                type="email"
                autoComplete="email"
                required
                maxLength={254}
                value={activeEmail}
                onChange={(event) => {
                  const email = event.target.value;
                  if (mode === "signIn") {
                    setSignInEmail(email);
                  } else {
                    setSignUpEmail(email);
                  }
                }}
                placeholder="you@example.com"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="auth-password">Password</Label>
              <Input
                id="auth-password"
                type="password"
                autoComplete={
                  mode === "signIn" ? "current-password" : "new-password"
                }
                minLength={6}
                maxLength={128}
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="At least 6 characters"
              />
            </div>

            {mode === "signUp" && (
              <div className="grid gap-2">
                <Label htmlFor="auth-confirm-password">Confirm password</Label>
                <Input
                  id="auth-confirm-password"
                  type="password"
                  autoComplete="new-password"
                  minLength={6}
                  maxLength={128}
                  required
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Enter your password again"
                />
              </div>
            )}

            {errorMessage && (
              <p role="alert" className="text-sm text-destructive">
                {errorMessage}
              </p>
            )}
            {infoMessage && (
              <p role="status" className="text-sm text-emerald-600">
                {infoMessage}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting
                ? "Please wait..."
                : mode === "signIn"
                  ? "Sign in"
                  : "Create account"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
