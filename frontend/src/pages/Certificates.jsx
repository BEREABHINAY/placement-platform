import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Award } from "lucide-react";
import { getMyCertificatesRequest } from "../api/certificatesApi";
import CertificateModal from "../components/CertificateModal";

export default function Certificates() {
  const { user } = useSelector((s) => s.auth);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    getMyCertificatesRequest().then(({ data }) => setCertificates(data.certificates)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="px-4 sm:px-8 py-10 max-w-7xl mx-auto">
      <div className="mb-8">
        <p className="font-mono text-xs text-amber tracking-widest">CERTIFICATES</p>
        <h1 className="font-display font-semibold text-2xl mt-1">Your certificates</h1>
      </div>

      {loading && <p className="text-dim font-mono text-sm">LOADING...</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {certificates.map((c) => (
          <button
            key={c._id}
            onClick={() => setSelected(c)}
            className="console-panel p-6 text-left border-amber/20 hover:border-amber/50 transition"
          >
            <Award className="text-amber mb-3" size={22} />
            <p className="font-display font-semibold">{c.title}</p>
            <p className="text-sm text-dim mt-1">{c.course?.title} · {c.course?.category}</p>
            <div className="flex items-center justify-between mt-5">
              <span className="font-mono text-xs text-dim">{c.certificateId}</span>
              <span className="text-xs text-dim">{new Date(c.issuedAt).toLocaleDateString()}</span>
            </div>
          </button>
        ))}
      </div>

      {!loading && certificates.length === 0 && (
        <p className="text-dim text-sm mt-10">
          No certificates yet — pass a test linked to a course to earn one automatically.
        </p>
      )}

      {selected && (
        <CertificateModal certificate={selected} userName={user?.name} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
