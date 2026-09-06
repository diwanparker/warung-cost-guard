import React, { useState } from "react";
import { Send, ShieldAlert, X, MessageSquare } from "lucide-react";
import type { Supplier } from "@/types/supplier";

interface SupplierNegotiateModalProps {
  isOpen: boolean;
  supplier?: Supplier;
  initialMessage: string;
  commodityName: string;
  onClose: () => void;
  onConfirm: (supplierId: string, message: string) => void;
}

export function SupplierNegotiateModal({
  isOpen,
  supplier,
  initialMessage,
  commodityName,
  onClose,
  onConfirm,
}: SupplierNegotiateModalProps) {
  const [message, setMessage] = useState(initialMessage);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSend = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm(supplier?.id || "SUP-01", message);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              <MessageSquare className="w-4 h-4" aria-hidden="true" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Konfirmasi Negosiasi Supplier (Human-in-the-Loop)
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Komoditas: {commodityName}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 text-xs">
          {supplier ? (
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <div className="font-bold text-slate-900 dark:text-white">{supplier.name}</div>
              <div className="text-slate-500 dark:text-slate-400 mt-0.5">
                Kontak: {supplier.contactPerson} ({supplier.phone}) • Lokasi: {supplier.location}
              </div>
            </div>
          ) : null}

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Draf Pesan Negosiasi (Dapat Diubah):
            </label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-emerald-500"
            />
          </div>

          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
            <div className="text-[11px] leading-relaxed">
              <strong>Prinsip Otorisasi Manusia:</strong> Pesan ini tidak akan terkirim secara otomatis oleh kecerdasan buatan. Pengiriman hanya dieksekusi setelah persetujuan eksplisit Anda.
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            Batalkan
          </button>
          <button
            type="button"
            disabled={isSubmitting || !message.trim()}
            onClick={handleSend}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
          >
            <Send className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{isSubmitting ? "Mengirim..." : "Konfirmasi & Kirim Pesan"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
