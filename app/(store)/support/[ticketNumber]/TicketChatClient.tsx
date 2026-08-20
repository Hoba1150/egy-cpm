"use client";

import React, { useState } from "react";
import { replyToTicket } from "@/lib/actions/ticket";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Send, Loader2 } from "lucide-react";

export default function TicketChatClient({
  ticketNumber,
  isClosed,
}: {
  ticketNumber: string;
  isClosed: boolean;
}) {
  const router = useRouter();
  const [replyText, setReplyText] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setIsSending(true);
    try {
      await replyToTicket(ticketNumber, replyText.trim());
      toast.success("تم إرسال الرد بنجاح!");
      setReplyText("");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "فشل إرسال الرد.");
    } finally {
      setIsSending(false);
    }
  };

  if (isClosed) {
    return (
      <div className="p-4 rounded-2xl bg-gray-800/40 text-center text-xs text-gray-500">
        تم إغلاق هذه التذكرة. إذا كان لديك استفسار جديد يمكنك فتح تذكرة أخرى.
      </div>
    );
  }

  return (
    <form onSubmit={handleSend} className="pt-4 border-t border-gray-800 space-y-3">
      <textarea
        rows={3}
        placeholder="اكتب ردك أو استفسارك الإضافي هنا..."
        value={replyText}
        onChange={(e) => setReplyText(e.target.value)}
        className="w-full p-3 bg-garage-850 border border-gray-700 rounded-2xl text-xs text-white placeholder-gray-500 focus:border-neon-cyan text-right"
      />

      <button
        type="submit"
        disabled={isSending || !replyText.trim()}
        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-blue text-black font-bold text-xs shadow-glow-cyan flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition disabled:opacity-50"
      >
        {isSending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            <Send className="w-4 h-4" />
            <span>إرسال الرد</span>
          </>
        )}
      </button>
    </form>
  );
}
