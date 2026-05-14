import { Eye, EyeOff, Loader2, LogOut, ShieldCheck, UserRound } from "lucide-react";
import type { FormEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import { useAuth } from "@/context/auth-context";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: {
            callback: (response: { credential?: string }) => void;
            client_id: string;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              shape?: string;
              size?: string;
              text?: string;
              theme?: string;
              width?: number;
            },
          ) => void;
        };
      };
    };
  }
}

type AuthMode = "signin" | "register";
type GoogleButtonState = "idle" | "loading" | "ready" | "authenticating" | "error";

export function CustomerAuthModal() {
  const {
    closeAuthModal,
    error,
    googleClientId,
    isAuthenticated,
    isLoading,
    modalIntent,
    modalOpen,
    registerWithPassword,
    signInWithGoogle,
    signInWithPassword,
    signOut,
    updateProfile,
    user,
  } = useAuth();
  const [mode, setMode] = useState<AuthMode>("signin");
  const [googleButtonState, setGoogleButtonState] = useState<GoogleButtonState>("idle");
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const googleButtonRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!modalOpen || isAuthenticated) {
      setGoogleButtonState("idle");
      return;
    }

    if (!googleClientId) {
      setGoogleButtonState("idle");
      return;
    }

    let isMounted = true;
    setGoogleButtonState("loading");

    loadGoogleIdentityScript()
      .then(() => {
        window.requestAnimationFrame(() => {
          if (!isMounted || !window.google || !googleButtonRef.current) {
            if (isMounted) {
              setGoogleButtonState("error");
            }
            return;
          }

          googleButtonRef.current.innerHTML = "";
          window.google.accounts.id.initialize({
            client_id: googleClientId,
            callback: (response) => {
              if (response.credential) {
                setGoogleButtonState("authenticating");
                void signInWithGoogle(response.credential).finally(() => {
                  if (isMounted) {
                    setGoogleButtonState("ready");
                  }
                });
              }
            },
          });
          window.google.accounts.id.renderButton(googleButtonRef.current, {
            shape: "rectangular",
            size: "large",
            text: "continue_with",
            theme: "outline",
            width: googleButtonRef.current.clientWidth || 320,
          });
          setGoogleButtonState("ready");
        });
      })
      .catch(() => {
        if (isMounted) {
          setGoogleButtonState("error");
        }
      });

    return () => {
      isMounted = false;
    };
  }, [googleClientId, isAuthenticated, modalOpen, signInWithGoogle]);

  const handleSignin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    void signInWithPassword({
      username: String(formData.get("username") ?? ""),
      userpassword: String(formData.get("userpassword") ?? ""),
    });
  };

  const handleRegister = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    void registerWithPassword({
      firstname: String(formData.get("firstname") ?? ""),
      lastname: String(formData.get("lastname") ?? ""),
      useremail: String(formData.get("useremail") ?? ""),
      userpassword: String(formData.get("userpassword") ?? ""),
    });
  };

  const handleProfileUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const mobileNumber = String(formData.get("usermobilenumber") ?? "").replace(/\D/g, "");

    setProfileMessage(null);

    try {
      await updateProfile({
        firstname: String(formData.get("firstname") ?? ""),
        gender: String(formData.get("gender") ?? ""),
        gstnumber: String(formData.get("gstnumber") ?? ""),
        isbusinessuser: formData.get("isbusinessuser") === "on",
        lastname: String(formData.get("lastname") ?? ""),
        useremail: String(formData.get("useremail") ?? ""),
        usermobilenumber: mobileNumber ? Number(mobileNumber) : undefined,
      });

      setProfileMessage("Profile updated.");
    } catch {
      setProfileMessage(null);
    }
  };

  const displayName =
    [user?.firstname, user?.lastname].filter(Boolean).join(" ") ||
    user?.useremail ||
    "Space Mint customer";
  const isGoogleAuthenticating = googleButtonState === "authenticating";

  return (
    <Modal
      open={modalOpen}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          closeAuthModal();
        }
      }}
    >
      <ModalContent className="max-h-[calc(100dvh-1rem)] max-w-[min(58rem,calc(100vw-2rem))] gap-0 overflow-hidden p-0">
        {isAuthenticated ? (
          <div className="grid max-h-[calc(100dvh-1rem)] gap-6 overflow-y-auto overscroll-contain p-6 sm:p-8">
            <ModalHeader>
              <ModalTitle className="font-heading text-3xl font-light">Your profile</ModalTitle>
              <ModalDescription className="text-sm leading-6 text-muted-foreground">
                Manage your Space Mint shopping session.
              </ModalDescription>
            </ModalHeader>
            <div className="flex items-center gap-4 rounded-sm border bg-accent p-4">
              <span className="grid size-12 place-items-center rounded-full border bg-background">
                <UserRound className="size-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="truncate font-medium">{displayName}</p>
                {user?.useremail ? (
                  <p className="truncate text-sm text-muted-foreground">{user.useremail}</p>
                ) : null}
              </div>
            </div>
            <form className="grid gap-4" onSubmit={handleProfileUpdate}>
              <div className="grid gap-3 sm:grid-cols-2">
                <AuthInput
                  autoComplete="given-name"
                  defaultValue={user?.firstname}
                  label="First name"
                  name="firstname"
                />
                <AuthInput
                  autoComplete="family-name"
                  defaultValue={user?.lastname}
                  label="Last name"
                  name="lastname"
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <AuthInput
                  autoComplete="email"
                  defaultValue={user?.useremail}
                  label="Email"
                  name="useremail"
                  type="email"
                />
                <AuthInput
                  autoComplete="tel"
                  defaultValue={user?.usermobilenumber ? String(user.usermobilenumber) : ""}
                  label="Mobile number"
                  name="usermobilenumber"
                  type="tel"
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-2 text-sm">
                  <span className="font-medium">Gender</span>
                  <select
                    className="h-11 rounded-sm border bg-background px-3 text-sm outline-none transition-colors focus:border-foreground"
                    defaultValue={user?.gender ?? ""}
                    name="gender"
                  >
                    <option value="">Prefer not to say</option>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="non_binary">Non-binary</option>
                    <option value="other">Other</option>
                  </select>
                </label>
                <AuthInput
                  autoComplete="off"
                  defaultValue={user?.gstnumber}
                  label="GST number"
                  name="gstnumber"
                />
              </div>
              <label className="flex items-center gap-3 rounded-sm border bg-accent px-4 py-3 text-sm">
                <input
                  className="size-4 accent-[var(--color-primary)]"
                  defaultChecked={!!user?.isbusinessuser}
                  name="isbusinessuser"
                  type="checkbox"
                />
                <span>Business customer</span>
              </label>
              {profileMessage ? (
                <p className="text-sm leading-6 text-muted-foreground">{profileMessage}</p>
              ) : null}
              {error ? <p className="text-sm leading-6 text-destructive">{error}</p> : null}
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                <Button onClick={signOut} type="button" variant="secondary">
                  <LogOut className="size-4" aria-hidden="true" />
                  Sign out
                </Button>
                <Button disabled={isLoading} type="submit">
                  Save profile
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <div className="grid max-h-[calc(100dvh-1rem)] overflow-y-auto overscroll-contain md:grid-cols-[0.46fr_0.54fr]">
            <div className="bg-primary p-6 text-primary-foreground sm:p-8">
              <div className="grid size-12 place-items-center rounded-full border border-white/24">
                <ShieldCheck className="size-5" aria-hidden="true" />
              </div>
              <p className="mt-8 text-eyebrow font-semibold uppercase text-primary-foreground/64">
                {modalIntent === "checkout" ? "Checkout sign in" : "Customer account"}
              </p>
              <h2 className="mt-3 font-heading text-4xl font-light">
                Sign in to continue.
              </h2>
              <p className="mt-5 text-sm leading-6 text-primary-foreground/72">
                Keep your cart, order requests, and project details tied to one customer profile.
              </p>
            </div>

            <div className="relative grid gap-5 p-6 sm:p-8 md:px-10">
              {isGoogleAuthenticating ? (
                <div className="absolute inset-0 z-10 grid place-items-center bg-background/90 px-6 backdrop-blur-sm">
                  <div className="grid justify-items-center gap-3 rounded-sm border bg-background px-6 py-5 text-center shadow-sm">
                    <Loader2 className="size-5 animate-spin" aria-hidden="true" />
                    <p className="text-sm font-medium">Signing in with Google...</p>
                  </div>
                </div>
              ) : null}
              <ModalHeader>
                <ModalTitle className="font-heading text-3xl font-light">
                  {mode === "signin" ? "Welcome back" : "Create account"}
                </ModalTitle>
                <ModalDescription className="text-sm leading-6 text-muted-foreground">
                  Use email and password now. Mobile OTP can be added to the same account later.
                </ModalDescription>
              </ModalHeader>

              <div className="grid grid-cols-2 rounded-sm border p-1">
                <button
                  className={`h-10 rounded-sm text-sm transition-colors ${
                    mode === "signin" ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                  }`}
                  onClick={() => setMode("signin")}
                  type="button"
                >
                  Sign in
                </button>
                <button
                  className={`h-10 rounded-sm text-sm transition-colors ${
                    mode === "register" ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                  }`}
                  onClick={() => setMode("register")}
                  type="button"
                >
                  Register
                </button>
              </div>

              <div className="min-h-11">
                {googleClientId ? (
                  <>
                    <div ref={googleButtonRef} className="w-full" />
                    {googleButtonState === "loading" ? (
                      <div className="grid h-11 place-items-center rounded-sm border text-sm text-muted-foreground">
                        Loading Google sign-in...
                      </div>
                    ) : null}
                    {googleButtonState === "error" ? (
                      <div className="rounded-sm border bg-accent px-4 py-3 text-sm leading-6 text-muted-foreground">
                        Google sign-in could not load. Check the browser console, OAuth origin, or
                        network blocker.
                      </div>
                    ) : null}
                  </>
                ) : (
                  <div className="rounded-sm border bg-accent px-4 py-3 text-sm leading-6 text-muted-foreground">
                    Google sign-in is hidden because `VITE_GOOGLE_CLIENT_ID` is not loaded in the
                    frontend dev server.
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                <span className="h-px flex-1 bg-border" />
                Email
                <span className="h-px flex-1 bg-border" />
              </div>

              {mode === "signin" ? (
                <form className="grid gap-4" onSubmit={handleSignin}>
                  <AuthInput
                    autoComplete="username"
                    label="Email or username"
                    name="username"
                    required
                  />
                  <AuthInput
                    autoComplete="current-password"
                    label="Password"
                    name="userpassword"
                    required
                    trailingControl={
                      <PasswordVisibilityButton
                        isVisible={showPassword}
                        onClick={() => setShowPassword((isVisible) => !isVisible)}
                      />
                    }
                    type={showPassword ? "text" : "password"}
                  />
                  {error ? <p className="text-sm leading-6 text-destructive">{error}</p> : null}
                  <Button disabled={isLoading} type="submit">
                    Sign in
                  </Button>
                </form>
              ) : (
                <form className="grid gap-4" onSubmit={handleRegister}>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <AuthInput autoComplete="given-name" label="First name" name="firstname" />
                    <AuthInput autoComplete="family-name" label="Last name" name="lastname" />
                  </div>
                  <AuthInput
                    autoComplete="email"
                    label="Email"
                    name="useremail"
                    required
                    type="email"
                  />
                  <AuthInput
                    autoComplete="new-password"
                    label="Password"
                    name="userpassword"
                    required
                    trailingControl={
                      <PasswordVisibilityButton
                        isVisible={showPassword}
                        onClick={() => setShowPassword((isVisible) => !isVisible)}
                      />
                    }
                    type={showPassword ? "text" : "password"}
                  />
                  {error ? <p className="text-sm leading-6 text-destructive">{error}</p> : null}
                  <Button disabled={isLoading} type="submit">
                    Create account
                  </Button>
                </form>
              )}
            </div>
          </div>
        )}
      </ModalContent>
    </Modal>
  );
}

function AuthInput({
  autoComplete,
  defaultValue,
  label,
  name,
  required = false,
  trailingControl,
  type = "text",
}: {
  autoComplete?: string;
  defaultValue?: string;
  label: string;
  name: string;
  required?: boolean;
  trailingControl?: React.ReactNode;
  type?: string;
}) {
  return (
    <label className="grid gap-2 text-sm">
      <span className="font-medium">
        {label}
        {required ? <span className="text-muted-foreground"> *</span> : null}
      </span>
      <span className="relative block">
        <input
          autoComplete={autoComplete}
          className={`h-11 w-full rounded-sm border bg-background px-3 text-sm outline-none transition-colors focus:border-foreground ${
            trailingControl ? "pr-11" : ""
          }`}
          defaultValue={defaultValue}
          name={name}
          required={required}
          type={type}
        />
        {trailingControl ? (
          <span className="absolute right-1 top-1/2 -translate-y-1/2">{trailingControl}</span>
        ) : null}
      </span>
    </label>
  );
}

function PasswordVisibilityButton({
  isVisible,
  onClick,
}: {
  isVisible: boolean;
  onClick: () => void;
}) {
  return (
    <button
      aria-label={isVisible ? "Hide password" : "Show password"}
      className="grid size-9 place-items-center rounded-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      onClick={onClick}
      type="button"
    >
      {isVisible ? (
        <EyeOff className="size-4" aria-hidden="true" />
      ) : (
        <Eye className="size-4" aria-hidden="true" />
      )}
    </button>
  );
}

function loadGoogleIdentityScript() {
  const existingScript = document.querySelector<HTMLScriptElement>(
    'script[src="https://accounts.google.com/gsi/client"]',
  );

  if (window.google) {
    return Promise.resolve();
  }

  if (existingScript) {
    return new Promise<void>((resolve, reject) => {
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener("error", () => reject(), { once: true });
    });
  }

  return new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.async = true;
    script.defer = true;
    script.src = "https://accounts.google.com/gsi/client";
    script.onload = () => resolve();
    script.onerror = () => reject();
    document.head.appendChild(script);
  });
}
