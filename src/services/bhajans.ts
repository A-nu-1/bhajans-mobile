import axios from "axios";

const API = process.env.EXPO_PUBLIC_API_URL;

export const api = axios.create({
  baseURL: API,
  timeout: 10000,
});

function getPreferredTranslation(translations: any[] = []) {
  if (!Array.isArray(translations)) return null;

  const preferredCodes = ["kn", "en"];

  for (const code of preferredCodes) {
    const match = translations.find((translation) => translation?.language?.code === code);
    if (match) return match;
  }

  return translations[0] ?? null;
}

function sortParagraphs(paragraphs: any[] = []) {
  return [...paragraphs]
    .sort((a, b) => (a?.orderNo ?? 0) - (b?.orderNo ?? 0))
    .map((paragraph) => ({ ...paragraph, text: paragraph?.text ?? "" }));
}

function normalizeTranslation(translation: any, fallbackLanguageCode?: string) {
  const languageCode = translation?.language?.code ?? translation?.languageCode ?? fallbackLanguageCode ?? "unknown";
  const paragraphs = Array.isArray(translation?.paragraphs) ? translation.paragraphs : [];

  return {
    ...translation,
    title: translation?.title ?? null,
    description: translation?.description ?? null,
    mainText: translation?.mainText ?? "",
    paragraphs: sortParagraphs(paragraphs),
    language: {
      ...(translation?.language ?? {}),
      code: languageCode,
      name:
        translation?.language?.name ??
        translation?.language?.nativeName ??
        translation?.language?.label ??
        languageCode.toUpperCase(),
    },
  };
}

export function normalizeBhajan(raw: any) {
  const translations = Array.isArray(raw?.translations) ? raw.translations : [];
  const preferredTranslation = getPreferredTranslation(translations);
  const englishTranslation = translations.find((translation: any) => translation?.language?.code === "en");

  const baseParagraphs = Array.isArray(raw?.paragraphs)
    ? raw.paragraphs
    : Array.isArray(preferredTranslation?.paragraphs)
      ? preferredTranslation.paragraphs
      : [];

  const sortedBaseParagraphs = sortParagraphs(baseParagraphs);
  const baseLanguageCode = raw?.language ?? preferredTranslation?.language?.code ?? "kn";

  const normalizedTranslations = translations
    .map((translation: any) => normalizeTranslation(translation, baseLanguageCode))
    .filter((translation: any) => Boolean(translation?.language?.code));

  const baseTranslation = normalizeTranslation(
    {
      title: raw?.title ?? null,
      description: raw?.description ?? null,
      mainText: raw?.mainText ?? "",
      paragraphs: sortedBaseParagraphs,
      language: {
        code: baseLanguageCode,
        name:
          raw?.languageName ??
          raw?.language?.name ??
          raw?.language?.nativeName ??
          baseLanguageCode.toUpperCase(),
      },
    },
    baseLanguageCode
  );

  const dedupedTranslations = [baseTranslation, ...normalizedTranslations].filter(
    (translation: any, index: number, list: any[]) =>
      Boolean(translation?.language?.code) &&
      list.findIndex((item: any) => item?.language?.code === translation.language.code) === index
  );

  const title = raw?.title ?? preferredTranslation?.title ?? "Untitled";

  return {
    ...raw,
    id: raw?.id ?? "",
    title,
    titleEnglish: raw?.titleEnglish ?? englishTranslation?.title ?? preferredTranslation?.title ?? title,
    language: baseLanguageCode,
    description: raw?.description ?? preferredTranslation?.description ?? null,
    mediaUrl: raw?.mediaUrl ?? null,
    mainText: raw?.mainText ?? preferredTranslation?.mainText ?? "",
    paragraphs: sortedBaseParagraphs,
    translations: dedupedTranslations,
  };
}

export async function getBhajans(params?: {
  search?: string;
  category?: string | null;
}) {
  const res = await api.get("/bhajans", {
    params: {
      search: params?.search || undefined,
      category: params?.category || undefined,
    },
  });

  const payload = Array.isArray(res.data) ? res.data : [];
  return payload.map(normalizeBhajan);
}

export async function getBhajanById(id: string) {
  const res = await api.get(`/bhajans/${id}`);
  return normalizeBhajan(res.data);
}

export async function searchBhajans(q: string) {
  const res = await api.get("/bhajans/search", {
    params: { q },
  });

  const payload = Array.isArray(res.data) ? res.data : [];
  return payload.map(normalizeBhajan);
}

export async function getCategories() {
  const res = await api.get("/categories");
  return res.data;
}