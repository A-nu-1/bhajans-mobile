export interface Bhajan {
  id: string;
  title: string;
  language: string;
  description?: string;
  titleEnglish: string;
  mediaUrl: string;
  mainText: string;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  _count?: { bhajans: number };
};