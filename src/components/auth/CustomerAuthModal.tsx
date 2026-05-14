import { Eye, EyeOff, Loader2, LogOut, ShieldCheck, UserRound, X } from "lucide-react";
import { type FormEvent, useEffect, useRef, useState } from "react";
import type {
  AuthIntent,
  CustomerUser,
  PasswordLoginInput,
  RegisterInput,
  UpdateProfileInput,
} from "../../types/auth";

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

type CustomerAuthModalProps = {
  error: string | null;
  googleClientId: string;
  intent: AuthIntent;
  isAuthenticated: boolean;
  isLoading: boolean;
  onClose: () => void;
  onRegister: (input: RegisterInput) => Promise<void>;
  onSignIn: (input: PasswordLoginInput) => Promise<void>;
  onSignInWithGoogle: (credential: string) => Promise<void>;
  onSignOut: () => void;
  onUpdateProfile: (input: UpdateProfileInput) => Promise<void>;
  open: boolean;
  user: CustomerUser | null;
};

type AuthMode = "signin" | "register";
type GoogleButtonState = "idle" | "loading" | "ready" | "authenticating" | "error";

export function CustomerAuthModal({
  error,
  googleClientId,
  intent,
  isAuthenticated,
  isLoading,
  onClose,
  onRegister,
  onSignIn,
  onSignInWithGoogle,
  onSignOut,
  onUpdateProfile,
  open,
  user,
}: CustomerAuthModalProps) {
  const [mode, setMode] = useState<AuthMode>("signin");
  const [googleButtonState, setGoogleButtonState] = useState<GoogleButtonState>("idle");
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const googleButtonRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open || isAuthenticated) {
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
            if (isMounted) setGoogleButtonState("error");
            return;
          }

          googleButtonRef.current.innerHTML = "";
          window.google.accounts.id.initialize({
            client_id: googleClientId,
            callback: (response) => {
              if (response.credential) {
                setGoogleButtonState("authenticating");
                void onSignInWithGoogle(response.credential).finally(() => {
                  if (isMounted) setGoogleButtonState("ready");
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
        if (isMounted) setGoogleButtonState("error");
      });

    return () => {
      isMounted = false;
    };
  }, [googleClientId, isAuthenticated, onSignInWithGoogle, open]);

  if (!open) return null;

  const handleSignin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    void onSignIn({
      username: String(formData.get("username") ?? ""),
      userpassword: String(formData.get("userpassword") ?? ""),
    });
  };

  const handleRegister = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    void onRegister({
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
      await onUpdateProfile({
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

  const displayName = getCustomerDisplayName(user);
  const isGoogleAuthenticating = googleButtonState === "authenticating";

  return (
    <div className="auth-modal" role="dialog" aria-modal="true" aria-label="Customer account">
      <div className="auth-backdrop" onClick={onClose} />
      <div className="auth-panel">
        <button className="auth-close" type="button" aria-label="Close account modal" onClick={onClose}>
          <X size={20} />
        </button>

        {isAuthenticated ? (
          <div className="auth-profile-shell">
            <div className="auth-rail">
              <UserRound size={24} />
              <span>Customer profile</span>
              <h3>{displayName}</h3>
              <p>Manage your Space Mint shopping session, profile details, and checkout identity.</p>
            </div>
            <form className="auth-body auth-form" onSubmit={handleProfileUpdate}>
              <div className="auth-profile-card">
                <strong>{getCustomerInitials(user)}</strong>
                <span>
                  {displayName}
                  {user?.useremail ? <small>{user.useremail}</small> : null}
                </span>
              </div>
              <div className="auth-grid">
                <AuthField autoComplete="given-name" defaultValue={user?.firstname} label="First name" name="firstname" />
                <AuthField autoComplete="family-name" defaultValue={user?.lastname} label="Last name" name="lastname" />
                <AuthField autoComplete="email" defaultValue={user?.useremail} label="Email" name="useremail" type="email" />
                <AuthField
                  autoComplete="tel"
                  defaultValue={user?.usermobilenumber ? String(user.usermobilenumber) : ""}
                  label="Mobile number"
                  name="usermobilenumber"
                  type="tel"
                />
                <label className="auth-field">
                  Gender
                  <select defaultValue={user?.gender ?? ""} name="gender">
                    <option value="">Prefer not to say</option>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="non_binary">Non-binary</option>
                    <option value="other">Other</option>
                  </select>
                </label>
                <AuthField autoComplete="off" defaultValue={user?.gstnumber} label="GST number" name="gstnumber" />
              </div>
              <label className="auth-check">
                <input defaultChecked={!!user?.isbusinessuser} name="isbusinessuser" type="checkbox" />
                Business customer
              </label>
              {profileMessage ? <p className="auth-success">{profileMessage}</p> : null}
              {error ? <p className="auth-error">{error}</p> : null}
              <div className="auth-actions">
                <button type="button" onClick={onSignOut}>
                  <LogOut size={16} />
                  Sign out
                </button>
                <button type="submit" disabled={isLoading}>
                  {isLoading ? <Loader2 size={16} className="spin-icon" /> : null}
                  Save profile
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="auth-entry-shell">
            <div className="auth-rail">
              <ShieldCheck size={24} />
              <span>{intent === "checkout" ? "Checkout sign in" : "Customer account"}</span>
              <h3>{mode === "signin" ? "Sign in to continue." : "Create your account."}</h3>
              <p>Keep selected modules, project details, and checkout requests tied to one customer profile.</p>
            </div>
            <div className="auth-body">
              {isGoogleAuthenticating ? (
                <div className="auth-loading">
                  <Loader2 size={20} className="spin-icon" />
                  Signing in with Google...
                </div>
              ) : null}
              <div className="auth-tabs">
                <button className={mode === "signin" ? "active" : ""} type="button" onClick={() => setMode("signin")}>
                  Sign in
                </button>
                <button className={mode === "register" ? "active" : ""} type="button" onClick={() => setMode("register")}>
                  Register
                </button>
              </div>
              <div className="google-button-slot">
                {googleClientId ? (
                  <>
                    <div ref={googleButtonRef} />
                    {googleButtonState === "loading" ? <span>Loading Google sign-in...</span> : null}
                    {googleButtonState === "error" ? <span>Google sign-in could not load.</span> : null}
                  </>
                ) : (
                  <span>Google sign-in is unavailable in this environment.</span>
                )}
              </div>
              <div className="auth-divider">
                <span />
                Email
                <span />
              </div>
              {mode === "signin" ? (
                <form className="auth-form" onSubmit={handleSignin}>
                  <AuthField autoComplete="username" label="Email or username" name="username" required />
                  <PasswordField
                    autoComplete="current-password"
                    isVisible={showPassword}
                    label="Password"
                    name="userpassword"
                    onToggle={() => setShowPassword((isVisible) => !isVisible)}
                  />
                  {error ? <p className="auth-error">{error}</p> : null}
                  <button className="auth-submit" type="submit" disabled={isLoading}>
                    {isLoading ? <Loader2 size={16} className="spin-icon" /> : null}
                    Sign in
                  </button>
                </form>
              ) : (
                <form className="auth-form" onSubmit={handleRegister}>
                  <div className="auth-grid">
                    <AuthField autoComplete="given-name" label="First name" name="firstname" />
                    <AuthField autoComplete="family-name" label="Last name" name="lastname" />
                  </div>
                  <AuthField autoComplete="email" label="Email" name="useremail" required type="email" />
                  <PasswordField
                    autoComplete="new-password"
                    isVisible={showPassword}
                    label="Password"
                    name="userpassword"
                    onToggle={() => setShowPassword((isVisible) => !isVisible)}
                  />
                  {error ? <p className="auth-error">{error}</p> : null}
                  <button className="auth-submit" type="submit" disabled={isLoading}>
                    {isLoading ? <Loader2 size={16} className="spin-icon" /> : null}
                    Create account
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function getCustomerDisplayName(user: CustomerUser | null) {
  if (!user) return "Customer";

  return (
    [user.firstname, user.lastname]
      .map((value) => value?.trim())
      .filter(Boolean)
      .join(" ") ||
    user.useremail ||
    "Space Mint customer"
  );
}

export function getCustomerInitials(user: CustomerUser | null) {
  const initials = [user?.firstname, user?.lastname]
    .map((value) => value?.trim()[0])
    .filter(Boolean)
    .join("");

  if (initials) return initials.slice(0, 2).toUpperCase();

  return (user?.useremail?.trim()[0] ?? "U").toUpperCase();
}

function AuthField({
  autoComplete,
  defaultValue,
  label,
  name,
  required = false,
  type = "text",
}: {
  autoComplete?: string;
  defaultValue?: string;
  label: string;
  name: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="auth-field">
      {label}
      <input
        autoComplete={autoComplete}
        defaultValue={defaultValue ?? ""}
        name={name}
        required={required}
        type={type}
      />
    </label>
  );
}

function PasswordField({
  autoComplete,
  isVisible,
  label,
  name,
  onToggle,
}: {
  autoComplete: string;
  isVisible: boolean;
  label: string;
  name: string;
  onToggle: () => void;
}) {
  return (
    <label className="auth-field">
      {label}
      <span className="auth-password-field">
        <input autoComplete={autoComplete} name={name} required type={isVisible ? "text" : "password"} />
        <button type="button" onClick={onToggle} aria-label={isVisible ? "Hide password" : "Show password"}>
          {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </span>
    </label>
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
