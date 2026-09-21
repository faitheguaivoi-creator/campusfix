import { Link } from 'react-router-dom';
import { FileText, Search, ShieldCheck, Wrench } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded bg-lincoln-500 text-white flex items-center justify-center font-bold">
              CF
            </div>
            <div>
              <p className="font-bold text-lg leading-tight">CampusFix</p>
              <p className="text-xs text-gray-500">Lincoln College</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/track-complaint" className="text-sm text-gray-600 hover:text-lincoln-600 hidden sm:inline">
              Track Complaint
            </Link>
            <Link
              to="/login"
              className="text-sm px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-sm px-4 py-2 rounded-lg bg-lincoln-500 text-white hover:bg-lincoln-600 transition"
            >
              Register
            </Link>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block text-xs font-semibold tracking-wider text-lincoln-600 bg-lincoln-50 px-3 py-1 rounded-full">
              LINCOLN COLLEGE OF SCIENCE, MANAGEMENT & TECHNOLOGY
            </span>
            <h1 className="mt-4 text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              Report campus issues.<br />
              Find what was lost.<br />
              <span className="text-lincoln-500">Do it anonymously.</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600">
              CampusFix is the official platform for reporting maintenance problems,
              tracking complaints, and reuniting students with their lost belongings
              — with optional anonymous reporting built in.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/register"
                className="px-6 py-3 rounded-lg bg-lincoln-500 text-white font-medium hover:bg-lincoln-600 transition shadow-sm"
              >
                Get Started
              </Link>
              <Link
                to="/track-complaint"
                className="px-6 py-3 rounded-lg border border-gray-300 font-medium hover:bg-gray-50"
              >
                Track a Complaint
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: FileText,    title: 'Report Problems', text: 'Broken facilities, electrical, plumbing, and more.' },
              { icon: ShieldCheck, title: 'Anonymous Mode',  text: 'Your name stays hidden when you choose.' },
              { icon: Search,      title: 'Lost & Found',    text: 'Post lost items, found items, and reconnect.' },
              { icon: Wrench,      title: 'Track Progress',  text: 'Follow every step from submission to resolution.' },
            ].map((f) => (
              <div
                key={f.title}
                className="p-5 rounded-xl border border-gray-100 bg-white hover:border-lincoln-200 hover:shadow-sm transition"
              >
                <div className="w-10 h-10 rounded-lg bg-lincoln-50 text-lincoln-600 flex items-center justify-center mb-3">
                  <f.icon size={20} />
                </div>
                <p className="font-semibold text-gray-900">{f.title}</p>
                <p className="text-sm text-gray-500 mt-1">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} Lincoln College of Science, Management & Technology
          </p>
          <p className="text-xs text-gray-400">CampusFix v1.0</p>
        </div>
      </footer>
    </div>
  );
}