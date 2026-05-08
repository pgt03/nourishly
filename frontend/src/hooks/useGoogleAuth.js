import { useEffect, useRef } from 'react';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export function useGoogleAuth(onSuccess, buttonRef) {
  const initialised = useRef(false);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || initialised.current) return;

    const loadScript = () => {
      if (document.getElementById('google-gsi')) {
        initGoogle();
        return;
      }
      const script = document.createElement('script');
      script.id = 'google-gsi';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initGoogle;
      document.head.appendChild(script);
    };

    const initGoogle = () => {
      if (!window.google || initialised.current) return;
      initialised.current = true;
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: ({ credential }) => onSuccess(credential),
        auto_select: false,
      });
      if (buttonRef?.current) {
        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: 'outline',
          size: 'large',
          width: buttonRef.current.offsetWidth || 400,
          text: 'continue_with',
          shape: 'rectangular',
        });
      }
    };

    loadScript();
  }, [onSuccess, buttonRef]);

  return { available: !!GOOGLE_CLIENT_ID };
}
