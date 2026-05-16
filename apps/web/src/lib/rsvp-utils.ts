export type Guest = {
  id: string;
  nome: string;
  convidados: number;
  convidadosConfirmados: number | null;
  lado: "noivo" | "noiva";
  telefone: string;
  confirmado: boolean;       // respondeu (sim ou não)
  confirmadoEm: string | null;
  comparecera: boolean | null; // null=pendente, true=vai, false=não vai
  ultimaAtualizacao: string | null;
};

export function isDeadlinePassed(deadline: string): boolean {
  return new Date() > new Date(deadline + "T23:59:59");
}

export function formatDateShort(isoStr: string): string {
  try {
    const d = new Date(isoStr);
    const day = String(d.getDate()).padStart(2, "0");
    const mon = String(d.getMonth() + 1).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return `${day}/${mon} · ${hh}:${mm}`;
  } catch {
    return isoStr;
  }
}

export function buildRsvpMessage(template: string, nome: string, id: string, baseUrl: string): string {
  return template
    .replace(/\{nome\}/g, nome)
    .replace(/\{link\}/g, `${baseUrl}/rsvp/${id}`);
}

export function buildWhatsAppUrl(phone: string, message: string): string {
  const cleaned = phone.replace(/\D/g, "");
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`;
}
