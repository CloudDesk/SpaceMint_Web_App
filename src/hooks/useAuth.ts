import { useCallback, useEffect, useMemo, useState } from "react";
import { authenticatedApi, getApiErrorMessage, getApiRoot, postApi } from "../lib/api";
import type {
  AuthIntent,
  AuthSession,
  CustomerUser,
  PasswordLoginInput,
  RegisterInput,
  UpdateProfileInput,
} from "../types/auth";

const authStorageKey = "spacemint.customer.auth.v1";

type OpenAuthModalOptions = {
  intent?: AuthIntent;
  onSuccess?: () => void;
};

export function useAuth() {
  const [session, setSession] = useState<AuthSession | null>(readStoredSession);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalIntent, setModalIntent] = useState<AuthIntent>("profile");
  const [afterAuth, setAfterAuth] = useState<(() => void) | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? "";

  useEffect(() => {
    if (session) {
      window.localStorage.setItem(authStorageKey, JSON.stringify(session));
      return;
    }

    window.localStorage.removeItem(authStorageKey);
  }, [session]);

  const completeAuth = useCallback(
    (nextSession: AuthSession) => {
      setSession({
        ...nextSession,
        user: {
          ...nextSession.user,
          userType: "ecommerce",
        },
      });
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
        const nextSession = await postApi<AuthSession>("/ecommerce-auth/signin", input);
        completeAuth(nextSession);
      } catch (caughtError) {
        setError(getApiErrorMessage(caughtError));
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
        const nextSession = await postApi<AuthSession>("/ecommerce-auth/register", input);
        completeAuth(nextSession);
      } catch (caughtError) {
        setError(getApiErrorMessage(caughtError));
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
        const nextSession = await postApi<AuthSession>("/ecommerce-auth/google", { credential });
        completeAuth(nextSession);
      } catch (caughtError) {
        setError(getApiErrorMessage(caughtError));
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

    if (currentToken && getApiRoot()) {
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
        const message = "Please sign in to update your profile.";
        setError(message);
        throw new Error(message);
      }

      setIsLoading(true);
      setError(null);

      try {
        const updatedUser = await authenticatedApi<CustomerUser>(
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
        const message = getApiErrorMessage(caughtError);
        setError(message);
        throw new Error(message);
      } finally {
        setIsLoading(false);
      }
    },
    [session],
  );

  return useMemo(
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
}

function readStoredSession() {
  try {
    const storedValue = window.localStorage.getItem(authStorageKey);

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
