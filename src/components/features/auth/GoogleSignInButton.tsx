const apiBase = import.meta.env.DEV
  ? "http://localhost:5000"
  : import.meta.env.VITE_API_URL;

export default function GoogleSignInButton() {
  return (
    <div className="w-full mt-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-px flex-1 bg-[#2a2a2a]" />
        <span className="text-[11px] uppercase tracking-wider text-[#555]">or</span>
        <div className="h-px flex-1 bg-[#2a2a2a]" />
      </div>
      <button
        type="button"
        onClick={() => {
          window.location.href = `${apiBase}/auth/google`;
        }}
        className="
          w-full flex items-center justify-center gap-2
          px-4 py-2.5 rounded-lg
          bg-[#1a1a1a] border border-[#2a2a2a] text-white text-[14px] font-medium
          hover:border-gray-500 hover:bg-[#151515]
          transition-all duration-200 cursor-pointer
        "
      >
        <GoogleIcon />
        Continue with Google
      </button>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3.1l5.7-5.7C34.2 6.1 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.5-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 16 19 12 24 12c3.1 0 5.8 1.2 8 3.1l5.7-5.7C34.2 6.1 29.4 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.3C29.2 35.3 26.7 36 24 36c-5.3 0-9.7-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.2-3.5 5.8-6.6 7.5l6.3 5.3C38.2 38.3 44 32 44 24c0-1.3-.1-2.5-.4-3.5z"
      />
    </svg>
  );
}
