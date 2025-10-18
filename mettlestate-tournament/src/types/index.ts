export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

export interface LeaderboardEntry extends User {
  points: number;
}

// export interface FormData {
//   fullName: string;
//   gamerTag: string;
//   email: string;
//   favoriteGame: string;
// }

export interface FAQItem {
  question: string;
  answer: string;
}