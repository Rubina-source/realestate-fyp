import { ArrowLeft } from "lucide-react";

export default function AdminBackButton({ className = "" }) {
  return (
    <button
      type="button"
      onClick={() => window.history.back()}
      className={`group inline-flex items-center justify-center w-9 h-9 rounded-full border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition ${className}`}
      aria-label="Go back"
    >
      <ArrowLeft className="group-hover:-translate-x-0.5 transition-transform"/>
    </button>
  );
}
