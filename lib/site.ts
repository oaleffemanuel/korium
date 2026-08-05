export const site = {
  name: "Korium",
  legalName: "Korium Contabilidade",
  domain: "korium.co",
  url: "https://korium.co",
  tagline: "Nunca mais corra atrás do seu contador.",
  description:
    "Contabilidade para quem quer menos burocracia e mais tranquilidade. Enquanto você cuida da empresa, a Korium cuida da contabilidade — com resposta no mesmo dia e a troca de contador feita por nós.",
  email: "aleff@korium.co",
  /** Human-readable form, for display only. */
  phone: "+55 31 97596-5032",
  serviceArea: "Atendemos empresas em todo o Brasil",
} as const;

/* ------------------------------------------------------------------
   WhatsApp — the only conversion channel on the page.
   Change the number here and every CTA follows.
------------------------------------------------------------------- */

/** Country code + area code + number, digits only. */
export const WHATSAPP_NUMBER = "5531975965032";

/**
 * Prefilled messages, one per CTA context, so the first thing we read
 * already says where the person came from.
 */
export const WHATSAPP_MESSAGES = {
  default:
    "Olá! Vi o site da Korium e gostaria de conversar sobre a contabilidade da minha empresa.",
  dono: "Olá! Vi o site da Korium e gostaria de conversar com o dono sobre a contabilidade da minha empresa.",
  investimento:
    "Olá! Vi o site da Korium e gostaria de entender qual seria o investimento no caso da minha empresa.",
  duvida:
    "Olá! Vi o site da Korium e fiquei com uma dúvida que não estava nas perguntas frequentes.",
} as const;

export type WhatsAppContext = keyof typeof WHATSAPP_MESSAGES;

/**
 * Builds a wa.me link with a prefilled message.
 * Pass a context key for one of the standard messages, or a custom string.
 */
export function whatsappLink(
  message: WhatsAppContext | (string & {}) = "default",
): string {
  const text =
    message in WHATSAPP_MESSAGES
      ? WHATSAPP_MESSAGES[message as WhatsAppContext]
      : message;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

/** Attributes every WhatsApp link needs. Spread it, don't retype it. */
export const externalLinkProps = {
  target: "_blank",
  rel: "noopener noreferrer",
} as const;
