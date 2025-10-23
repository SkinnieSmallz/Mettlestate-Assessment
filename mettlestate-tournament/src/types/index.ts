export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

export interface LeaderboardEntry extends User {
  points: number;
}

export interface FAQItem {
  question: string;
  answer: string;
}