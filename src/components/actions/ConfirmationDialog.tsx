import React, { useState } from "react";
import {
  ShieldAlert,
  Send,
  X,
  CheckCircle2,
  Users,
  AlertTriangle,
} from "lucide-react";

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (recipients: string[], message: string) => Promise<void>;
  defaultMessage: string;
}

const DEFAULT_RECIPIENTS = [
  { id: "sec", label: "Petugas Keamanan (Security)", email: "security@pens.ac.id" },
  { id: "evt", label: "Koordinator Lapangan / Acara", email: "event@pens.ac.id" },
  { id: "fac", label: "Tim Sarana & Prasarana (Sarpras)", email: "sarpras@pens.ac.id" },
];

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  defaultMessage,
}) => {
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>(
    DEFAULT_RECIPIENTS.map((r) => r.email)
  );
  const [message, setMessage] = useState(defaultMessage);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  React.useEffect(() => {
    setMessage(defaultMessage);
    setIsSuccess(false);
  }, [defaultMessage, isOpen]);

  if (!isOpen) return null;

  const toggleRecipient = (email: string) => {
    setSelectedRecipients((prev) =>
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]
    );
  };

  const handleConfirm = async () => {
    if (selectedRecipients.length === 0) return;
    setIsSubmitting(true);
    try {
      await onConfirm(selectedRecipients, message);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2000);
    } catch (err) {
      console.error("Confirmation error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h3 id="confirm-dialog-title" className="text-base font-bold text-slate-900 dark:text-slate-100">
                Kirim Peringatan ke Tim?
              </h3>
              <p className="text-xs text-slate-500">
                Otorisasi Konfirmasi Manusia (Responsible AI)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 transition"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          {isSuccess ? (
            <div className="p-6 text-center space-y-2">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7" aria-hidden="true" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Pemberitahuan Berhasil Dikirim!
              </h4>
              <p className="text-slate-500 text-xs">
                Notifikasi telah terkirim ke {selectedRecipients.length} tim tujuan.
              </p>
            </div>
          ) : (
            <>
              {/* Recipients Checklist */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-blue-600" aria-hidden="true" />
                  <span>Pesan Akan Dikirimkan Kepada:</span>
                </label>
                <div className="space-y-1.5">
                  {DEFAULT_RECIPIENTS.map((rec) => {
                    const checked = selectedRecipients.includes(rec.email);
                    return (
                      <label
                        key={rec.id}
                        className={`p-2.5 rounded-xl border flex items-center gap-2.5 cursor-pointer transition ${
                          checked
                            ? "bg-blue-50/60 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800"
                            : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 opacity-60"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleRecipient(rec.email)}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="flex-1 min-w-0">
                          <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                            {rec.label}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {rec.email}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Message Content Area */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px] mb-1.5">
                  Isi Ringkasan Pesan Kesiapsiagaan:
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs leading-relaxed focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Mandatory Responsible AI Notice */}
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 flex items-start gap-2.5 text-amber-900 dark:text-amber-200 text-[11px]">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
                <p className="leading-relaxed">
                  <strong>Jaminan Keamanan:</strong> SIAGA <strong>tidak akan</strong>{" "}
                  mengirim pesan atau melakukan tindakan eksternal apapun sebelum
                  Anda menekan tombol konfirmasi di bawah.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {!isSuccess && (
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            >
              Batalkan
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isSubmitting || selectedRecipients.length === 0}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white shadow-xs transition"
            >
              <Send className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{isSubmitting ? "Mengirim..." : "Konfirmasi & Kirim"}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
