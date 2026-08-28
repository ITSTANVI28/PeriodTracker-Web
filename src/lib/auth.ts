import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signOut,
  User 
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/gmail.send');

let isSigningIn = false;
let cachedAccessToken: string | null = null;

export const initAuthListener = (
  onSuccess?: (user: User, token: string) => void,
  onFail?: () => void
) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      if (cachedAccessToken && onSuccess) {
        onSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        cachedAccessToken = null;
        if (onFail) onFail();
      }
    } else {
      cachedAccessToken = null;
      if (onFail) onFail();
    }
  });
};

export const signInWithGoogle = async (forceConsent: boolean = false): Promise<{ user: User; accessToken: string }> => {
  try {
    isSigningIn = true;
    const provider = new GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/gmail.send');
    
    if (forceConsent) {
      provider.setCustomParameters({
        prompt: 'select_account'
      });
    }

    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    
    if (!credential?.accessToken) {
      throw new Error('Could not obtain Gmail access token from Google Sign-In.');
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    if (error?.code === 'auth/popup-closed-by-user' || error?.message?.includes('popup-closed-by-user')) {
      throw new Error('Sign-in cancelled: The login popup was closed before completing authentication. Please click to try again.');
    }
    if (error?.code === 'auth/popup-blocked' || error?.message?.includes('popup-blocked')) {
      throw new Error('Sign-in popup blocked by browser. Please enable popups for this site and try again.');
    }
    if (error?.code === 'auth/cancelled-popup-request') {
      throw new Error('Sign-in request was cancelled.');
    }
    console.warn('Google Sign-In Error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getCachedToken = (): string | null => cachedAccessToken;

export const logoutGoogle = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};

export async function sendGmailEmail({
  to,
  subject,
  htmlBody,
  accessToken
}: {
  to: string;
  subject: string;
  htmlBody: string;
  accessToken: string;
}) {
  const emailLines = [
    `To: ${to}`,
    `Subject: =?utf-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`,
    `Content-Type: text/html; charset=utf-8`,
    `MIME-Version: 1.0`,
    ``,
    htmlBody
  ];

  const emailText = emailLines.join('\r\n');
  const base64 = btoa(unescape(encodeURIComponent(emailText)));
  const raw = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ raw })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errMsg = errorData.error?.message || `Gmail API Error (${response.status})`;
    
    if (errMsg.toLowerCase().includes('insufficient authentication scopes') || response.status === 403) {
      cachedAccessToken = null;
      throw new Error('Gmail API requires sending permissions. Please click "Grant Gmail Permissions" to allow sending emails.');
    }
    
    throw new Error(errMsg);
  }

  return await response.json();
}
