import LoginForm from "./LoginForm";

export const metadata = {
  title: "Sign in — Trade with LK55 Admin",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050505] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <img
            src="/Logo.png"
            alt=""
            className="h-14 w-14 rounded-full ring-1 ring-[rgba(212,175,55,0.4)]"
          />
          <h1 className="mt-4 font-display text-2xl font-bold text-[#f2f0eb]">
            Trade with <span className="text-gold-gradient">LK55</span>
          </h1>
          <p className="mt-1 text-sm text-[#a19c8f]">Sign in to manage your website</p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
