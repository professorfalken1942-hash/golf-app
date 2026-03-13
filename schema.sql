-- Courses table
CREATE TABLE courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  location text,
  holes integer DEFAULT 18,
  par integer,
  yardage integer,
  holes_data jsonb,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Rounds table
CREATE TABLE rounds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  course_id uuid REFERENCES courses(id),
  course_name text NOT NULL,
  date text NOT NULL,
  scores integer[],
  total_strokes integer,
  total_putts integer DEFAULT 0,
  status text DEFAULT 'in-progress',
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Round scores detail
CREATE TABLE round_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  round_id uuid NOT NULL REFERENCES rounds(id) ON DELETE CASCADE,
  hole integer NOT NULL,
  strokes integer,
  putts integer DEFAULT 0,
  fairway boolean,
  gir boolean,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Enable RLS
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE rounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE round_scores ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "courses_are_public" ON courses FOR SELECT USING (true);

CREATE POLICY "users_can_see_own_rounds" ON rounds
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "users_can_create_rounds" ON rounds
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users_can_update_own_rounds" ON rounds
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "users_can_see_own_scores" ON round_scores
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM rounds WHERE rounds.id = round_scores.round_id AND rounds.user_id = auth.uid()
    )
  );

CREATE POLICY "users_can_create_scores" ON round_scores
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM rounds WHERE rounds.id = round_scores.round_id AND rounds.user_id = auth.uid()
    )
  );

-- Insert some sample courses
INSERT INTO courses (name, location, holes, par, yardage) VALUES
  ('Pebble Beach Golf Links', 'Monterey, CA', 18, 72, 6818),
  ('Augusta National', 'Augusta, GA', 18, 72, 7435),
  ('Torrey Pines', 'San Diego, CA', 18, 72, 7700);
