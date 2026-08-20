export interface BhajanParagraph {
  id?: string;
  orderNo?: number;
  text: string;
}

export interface Bhajan {
  id: string;
  title: string;
  language?: string;
  description?: string | null;
  titleEnglish?: string;
  mediaUrl?: string | null;
  mainText: string;
  paragraphs?: BhajanParagraph[];
  translations?: Array<{
    title?: string;
    description?: string | null;
    mainText?: string;
    paragraphs?: BhajanParagraph[];
    language?: {
      code?: string;
    };
  }>;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  _count?: { bhajans: number };
};