import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950 px-4">
      <div className="max-w-lg text-center">
        <h1 className="text-8xl font-bold text-zinc-900 dark:text-white">
          404
        </h1>

        <h2 className="mt-4 text-3xl font-bold text-zinc-800 dark:text-zinc-100">
          Page Not Found
        </h2>

        <p className="mt-4 text-zinc-500 dark:text-zinc-400">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <Link
          href="/"
          className="mt-8 inline-block rounded-xl bg-black px-6 py-3 font-semibold text-white transition hover:scale-[1.02] dark:bg-white dark:text-black"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
