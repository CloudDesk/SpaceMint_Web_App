/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";

export type CustomerUser = {
  authprovider?: string;
  emailverified?: boolean;
  firstname?: string;
  gender?: string;
  gstnumber?: string;
  id: number;
  isbusinessuser?: boolean;
  lastname?: string;
  useremail?: string;
  usermobilenumber?: number;
  userType?: "ecommerce";
};

type AuthSession = {
  expiresIn: number;
  refreshToken: string;
  token: string;
  user: CustomerUser;
};

type AuthIntent = "checkout" | "profile";

type OpenAuthModalOptions = {
  intent?: AuthIntent;
  onSuccess?: () => void;
};

type AuthContextValue = {
  closeAuthModal: () => void;
  error: string | null;
  googleClientId: string;
  isAuthenticated: boolean;
  isLoading: boolean;
  modalIntent: AuthIntent;
  modalOpen: boolean;
  openAuthModal: (options?: OpenAuthModalOptions) => void;
  registerWithPassword: (input: RegisterInput) => Promise<void>;
  signInWithGoogle: (credential: string) => Promise<void>;
  signInWithPassword: (input: PasswordLoginInput) => Promise<void>;
  signOut: () => void;
  token: string | null;
  updateProfile: (input: UpdateProfileInput) => Promise<void>;
  user: CustomerUser | null;
};

type PasswordLoginInput = {
  username: string;
  userpassword: string;
};

type RegisterInput = {
  firstname?: string;
  lastname?: string;
  useremail: string;
  userpassword: string;
};

export type UpdateProfileInput = {
  firstname?: string;
  gender?: string;
  gstnumber?: string;
  isbusinessuser?: boolean;
  lastname?: string;
  useremail?: string;
  usermobilenumber?: number;
};

type ApiResponse<T> = {
  data?: T;
  details?: string;
  message?: string;
  success: boolean;
};

const AUTH_STORAGE_KEY = "spacemint.customer.auth.v1";
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(() => readStoredSession());
  const [modalOpen, setModalOpen] = useState(false);
  const [modalIntent, setModalIntent] = useState<AuthIntent>("profile");
  const [afterAuth, setAfterAuth] = useState<(() => void) | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? "";

  useEffect(() => {
    if (session) {
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
      return;
    }

    window.localStorage.removeItem(AUTH_STORAGE_KEY);
  }, [session]);

  const completeAuth = useCallback(
    (nextSession: AuthSession) => {
      setSession(nextSession);
      setModalOpen(false);
      setError(null);
      afterAuth?.();
      setAfterAuth(null);
    },
    [afterAuth],
  );

  const openAuthModal = useCallback(
    (options?: OpenAuthModalOptions) => {
      if (session && options?.onSuccess) {
        options.onSuccess();
        return;
      }

      setModalIntent(options?.intent ?? "profile");
      setAfterAuth(() => options?.onSuccess ?? null);
      setError(null);
      setModalOpen(true);
    },
    [session],
  );

  const closeAuthModal = useCallback(() => {
    setModalOpen(false);
    setAfterAuth(null);
    setError(null);
  }, []);

  const signInWithPassword = useCallback(
    async (input: PasswordLoginInput) => {
      setIsLoading(true);
      setError(null);

      try {
        const nextSession = await authRequest<AuthSession>("/ecommerce-auth/signin", input);
        completeAuth(nextSession);
      } catch (caughtError) {
        setError(getErrorMessage(caughtError));
      } finally {
        setIsLoading(false);
      }
    },
    [completeAuth],
  );

  const registerWithPassword = useCallback(
    async (input: RegisterInput) => {
      setIsLoading(true);
      setError(null);

      try {
        const nextSession = await authRequest<AuthSession>("/ecommerce-auth/register", input);
        completeAuth(nextSession);
      } catch (caughtError) {
        setError(getErrorMessage(caughtError));
      } finally {
        setIsLoading(false);
      }
    },
    [completeAuth],
  );

  const signInWithGoogle = useCallback(
    async (credential: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const nextSession = await authRequest<AuthSession>("/ecommerce-auth/google", {
          credential,
        });
        completeAuth(nextSession);
      } catch (caughtError) {
        setError(getErrorMessage(caughtError));
      } finally {
        setIsLoading(false);
      }
    },
    [completeAuth],
  );

  const signOut = useCallback(() => {
    const currentToken = session?.token;

    setSession(null);
    setModalOpen(false);
    setAfterAuth(null);
    setError(null);

    if (currentToken) {
      void fetch(`${getApiRoot()}/ecommerce-auth/logout`, {
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
        method: "POST",
      });
    }
  }, [session?.token]);

  const updateProfile = useCallback(
    async (input: UpdateProfileInput) => {
      if (!session) {
        setError("Please sign in to update your profile.");
        throw new Error("Please sign in to update your profile.");
      }

      setIsLoading(true);
      setError(null);

      try {
        const updatedUser = await authenticatedRequest<CustomerUser>(
          `/users/${session.user.id}`,
          session.token,
          {
            body: sanitizeProfileInput(input),
            method: "PUT",
          },
        );

        setSession({
          ...session,
          user: {
            ...session.user,
            ...updatedUser,
            userType: "ecommerce",
          },
        });
      } catch (caughtError) {
        const message = getErrorMessage(caughtError);
        setError(message);
        throw new Error(message);
      } finally {
        setIsLoading(false);
      }
    },
    [session],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      closeAuthModal,
      error,
      googleClientId,
      isAuthenticated: !!session,
      isLoading,
      modalIntent,
      modalOpen,
      openAuthModal,
      registerWithPassword,
      signInWithGoogle,
      signInWithPassword,
      signOut,
      token: session?.token ?? null,
      updateProfile,
      user: session?.user ?? null,
    }),
    [
      closeAuthModal,
      error,
      googleClientId,
      isLoading,
      modalIntent,
      modalOpen,
      openAuthModal,
      registerWithPassword,
      session,
      signInWithGoogle,
      signInWithPassword,
      signOut,
      updateProfile,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}

async function authRequest<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${getApiRoot()}${path}`, {
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });
  const payload = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !payload.success || !payload.data) {
    throw new Error(payload.details || payload.message || "Authentication failed.");
  }

  return payload.data;
}

async function authenticatedRequest<T>(
  path: string,
  token: string,
  options: {
    body?: unknown;
    method: "DELETE" | "GET" | "POST" | "PUT";
  },
): Promise<T> {
  const response = await fetch(`${getApiRoot()}${path}`, {
    body: options.body ? JSON.stringify(options.body) : undefined,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.body ? { "Content-Type": "application/json" } : {}),
    },
    method: options.method,
  });
  const payload = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !payload.success || !payload.data) {
    throw new Error(payload.details || payload.message || "Request failed.");
  }

  return payload.data;
}

function getApiRoot() {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "");

  if (!apiBaseUrl) {
    return "";
  }

  return apiBaseUrl.endsWith("/v1") ? apiBaseUrl : `${apiBaseUrl}/v1`;
}

function readStoredSession() {
  try {
    const storedValue = window.localStorage.getItem(AUTH_STORAGE_KEY);

    if (!storedValue) {
      return null;
    }

    const parsedValue = JSON.parse(storedValue) as AuthSession;

    if (!parsedValue.token || !parsedValue.refreshToken || !parsedValue.user?.id) {
      return null;
    }

    return parsedValue;
  } catch {
    return null;
  }
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong. Please try again.";
}

function sanitizeProfileInput(input: UpdateProfileInput) {
  return {
    firstname: normalizeOptionalString(input.firstname),
    gender: normalizeOptionalString(input.gender),
    gstnumber: normalizeOptionalString(input.gstnumber),
    isbusinessuser: !!input.isbusinessuser,
    lastname: normalizeOptionalString(input.lastname),
    useremail: normalizeOptionalString(input.useremail),
    usermobilenumber: input.usermobilenumber || undefined,
  };
}

function normalizeOptionalString(value?: string) {
  const normalizedValue = value?.trim();
  return normalizedValue || undefined;
}
