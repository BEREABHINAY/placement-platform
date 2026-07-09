import { X, Printer, Award } from "lucide-react";

export default function CertificateModal({ certificate, userName, onClose }) {
  const issuedDate = new Date(certificate.issuedAt).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4 py-8 overflow-y-auto print:bg-white print:p-0">
      <div className="w-full max-w-2xl">
        <div className="flex justify-end gap-2 mb-3 print:hidden">
          <button onClick={() => window.print()} className="btn-ghost text-sm py-2 px-4 flex items-center gap-1.5">
            <Printer size={15} /> Print / Save PDF
          </button>
          <button onClick={onClose} className="btn-ghost text-sm py-2 px-4 flex items-center gap-1.5">
            <X size={15} /> Close
          </button>
        </div>

        {/* The certificate itself */}
        <div
          id="certificate-print-area"
          className="relative bg-[#0d1220] border-[3px] border-amber/40 rounded-sm p-10 sm:p-14 print:border-amber print:bg-white print:text-black"
          style={{
            backgroundImage:
              "radial-gradient(circle at 15% 15%, rgba(255,180,71,0.06), transparent 40%), radial-gradient(circle at 85% 85%, rgba(79,216,232,0.06), transparent 40%)",
          }}
        >
          {/* corner ornaments */}
          <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-amber/50" />
          <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-amber/50" />
          <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-amber/50" />
          <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-amber/50" />

          <div className="text-center">
            <p className="font-mono text-[10px] tracking-[0.4em] text-cyan print:text-cyan-700">PLACEMENT PREP</p>
            <div className="w-14 h-14 rounded-full bg-amber/10 border border-amber/40 flex items-center justify-center mx-auto my-6 print:bg-amber-50">
              <Award className="text-amber print:text-amber-600" size={26} />
            </div>
            <p className="font-display text-sm tracking-[0.3em] text-dim uppercase">Certificate of Completion</p>
            <p className="font-display font-semibold text-3xl sm:text-4xl mt-4 text-mist print:text-black">{userName}</p>
            <div className="w-24 h-px bg-amber/40 mx-auto my-5" />
            <p className="text-dim text-sm print:text-gray-700">has successfully completed</p>
            <p className="font-display font-semibold text-xl mt-2 text-mist print:text-black">{certificate.course?.title}</p>
            <p className="text-xs text-dim mt-1 print:text-gray-600">{certificate.course?.category}</p>

            <div className="flex items-center justify-center gap-10 mt-10 pt-6 border-t border-white/10 print:border-gray-300">
              <div>
                <p className="text-xs text-dim print:text-gray-500">Issued on</p>
                <p className="text-sm font-medium mt-0.5">{issuedDate}</p>
              </div>
              <div>
                <p className="text-xs text-dim print:text-gray-500">Certificate ID</p>
                <p className="text-sm font-mono mt-0.5 text-cyan print:text-cyan-700">{certificate.certificateId}</p>
              </div>
            </div>
          </div>
        </div>
        <p className="text-center text-xs text-dim mt-3 print:hidden">
          Anyone can verify this certificate using its ID at <span className="font-mono">/certificates/verify</span>.
        </p>
      </div>
    </div>
  );
}
