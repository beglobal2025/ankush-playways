import { redirect } from "next/navigation";
import { loginAction } from "@/lib/admin/actions";
import { getCurrentAdmin } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";

interface LoginPageProps {
  searchParams?: Promise<{
    error?: string;
  }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const admin = await getCurrentAdmin();
  const params = await searchParams;

  if (admin) {
    redirect("/admin");
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[var(--sun-sky-soft)] px-5">
      <form action={loginAction} className="w-full max-w-md rounded-lg bg-white p-7 shadow-2xl shadow-[#7ecae1]/20">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-[var(--sun-coral-strong)]">Admin</p>
        <h1 className="mt-2 text-3xl font-black text-[var(--sun-sky-dark)]">Sign in</h1>
        <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">
          Manage Ankush Playways catalogue content from one simple panel.
        </p>

        {params?.error === "invalid" ? (
          <p className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
            Email or password is incorrect.
          </p>
        ) : null}

        <div className="mt-6 grid gap-4">
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Email
            <input
              name="email"
              type="email"
              required
              className="rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-[var(--sun-sky-dark)]"
              placeholder="admin@ankushplayways.com"
            />
          </label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Password
            <input
              name="password"
              type="password"
              required
              className="rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-[var(--sun-sky-dark)]"
              placeholder="Password"
            />
          </label>
        </div>

        <button className="mt-6 w-full rounded-full bg-[var(--sun-sky-dark)] px-5 py-3 text-sm font-black text-white transition hover:bg-[var(--sun-coral-strong)]">
          Login
        </button>
      </form>
    </main>
  );
}
