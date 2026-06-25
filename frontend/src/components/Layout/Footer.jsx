import { APP_NAME } from '../../services/constants';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-200 py-4 px-6 text-center text-sm text-slate-500">
      <p>
        &copy; {year} {APP_NAME}. AI-ready vulnerability scanning for financial institutions.
      </p>
    </footer>
  );
}
