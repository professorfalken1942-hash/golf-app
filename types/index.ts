export interface Course {
  id: string;
  name: string;
  location: string;
  holes: number;
  par: number;
  yardage: number;
  holes_data: HoleData[];
}

export interface HoleData {
  hole: number;
  par: number;
  handicap: number;
  length: number;
}

export interface Round {
  id: string;
  user_id: string;
  course_id: string;
  course_name: string;
  date: string;
  scores: number[];
  total_strokes: number;
  total_putts: number;
  status: "in-progress" | "completed";
  created_at: string;
  updated_at: string;
}

export interface RoundScore {
  hole: number;
  strokes: number;
  putts: number;
  fairway?: boolean;
  gir: boolean;
}

export interface RoundStats {
  total_strokes: number;
  total_putts: number;
  total_gir: number;
  total_birdie: number;
  total_eagle: number;
  fairways_hit: number;
}
