-- Create social and community tables for posts, likes, comments, follows

-- POSTS
CREATE TABLE IF NOT EXISTS public.posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid NOT NULL,
  content text NOT NULL,
  image_url text,
  tags text[],
  likes_count integer NOT NULL DEFAULT 0,
  comments_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view posts"
ON public.posts FOR SELECT USING (true);

CREATE POLICY "Users can create their own posts"
ON public.posts FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own posts"
ON public.posts FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own posts"
ON public.posts FOR DELETE USING (auth.uid() = author_id);

CREATE TRIGGER update_posts_updated_at
BEFORE UPDATE ON public.posts
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- POST LIKES
CREATE TABLE IF NOT EXISTS public.post_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (post_id, user_id)
);
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view post likes"
ON public.post_likes FOR SELECT USING (true);

CREATE POLICY "Users can like posts"
ON public.post_likes FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike their likes"
ON public.post_likes FOR DELETE USING (auth.uid() = user_id);

-- Like count triggers
CREATE OR REPLACE FUNCTION public.handle_post_like_insert()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.handle_post_like_delete()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.posts SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = OLD.post_id;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS post_like_insert ON public.post_likes;
CREATE TRIGGER post_like_insert
AFTER INSERT ON public.post_likes
FOR EACH ROW EXECUTE FUNCTION public.handle_post_like_insert();

DROP TRIGGER IF EXISTS post_like_delete ON public.post_likes;
CREATE TRIGGER post_like_delete
AFTER DELETE ON public.post_likes
FOR EACH ROW EXECUTE FUNCTION public.handle_post_like_delete();

-- COMMENTS
CREATE TABLE IF NOT EXISTS public.post_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view comments"
ON public.post_comments FOR SELECT USING (true);

CREATE POLICY "Users can create their own comments"
ON public.post_comments FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
ON public.post_comments FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
ON public.post_comments FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_post_comments_updated_at
BEFORE UPDATE ON public.post_comments
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Comment count triggers
CREATE OR REPLACE FUNCTION public.handle_post_comment_insert()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.handle_post_comment_delete()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.posts SET comments_count = GREATEST(comments_count - 1, 0) WHERE id = OLD.post_id;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS post_comment_insert ON public.post_comments;
CREATE TRIGGER post_comment_insert
AFTER INSERT ON public.post_comments
FOR EACH ROW EXECUTE FUNCTION public.handle_post_comment_insert();

DROP TRIGGER IF EXISTS post_comment_delete ON public.post_comments;
CREATE TRIGGER post_comment_delete
AFTER DELETE ON public.post_comments
FOR EACH ROW EXECUTE FUNCTION public.handle_post_comment_delete();

-- FOLLOWS
CREATE TABLE IF NOT EXISTS public.follows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id uuid NOT NULL,
  following_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT follows_unique UNIQUE (follower_id, following_id),
  CONSTRAINT cannot_follow_self CHECK (follower_id <> following_id)
);
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view follows"
ON public.follows FOR SELECT USING (true);

CREATE POLICY "Users can follow others"
ON public.follows FOR INSERT WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can unfollow"
ON public.follows FOR DELETE USING (auth.uid() = follower_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_posts_author ON public.posts(author_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_post ON public.post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_user ON public.post_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_post ON public.post_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_follows_follower ON public.follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following ON public.follows(following_id);

-- EVENTS
CREATE TABLE IF NOT EXISTS public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  starts_at timestamptz NOT NULL,
  location text,
  city text,
  state text,
  country text,
  is_virtual boolean NOT NULL DEFAULT false,
  tags text[],
  image_url text,
  max_attendees integer,
  attendees_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view events"
ON public.events FOR SELECT USING (true);

CREATE POLICY "Users can create their own events"
ON public.events FOR INSERT WITH CHECK (auth.uid() = organizer_id);

CREATE POLICY "Users can update their own events"
ON public.events FOR UPDATE USING (auth.uid() = organizer_id);

CREATE POLICY "Users can delete their own events"
ON public.events FOR DELETE USING (auth.uid() = organizer_id);

CREATE TRIGGER update_events_updated_at
BEFORE UPDATE ON public.events
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_events_starts_at ON public.events(starts_at);

-- EVENT RSVPS
CREATE TABLE IF NOT EXISTS public.event_rsvps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'going',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (event_id, user_id)
);
ALTER TABLE public.event_rsvps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own RSVPs"
ON public.event_rsvps FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can RSVP to events"
ON public.event_rsvps FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can cancel their RSVP"
ON public.event_rsvps FOR DELETE USING (auth.uid() = user_id);

-- RSVP count triggers
CREATE OR REPLACE FUNCTION public.handle_event_rsvp_insert()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.events SET attendees_count = attendees_count + 1 WHERE id = NEW.event_id;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.handle_event_rsvp_delete()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.events SET attendees_count = GREATEST(attendees_count - 1, 0) WHERE id = OLD.event_id;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS event_rsvp_insert ON public.event_rsvps;
CREATE TRIGGER event_rsvp_insert
AFTER INSERT ON public.event_rsvps
FOR EACH ROW EXECUTE FUNCTION public.handle_event_rsvp_insert();

DROP TRIGGER IF EXISTS event_rsvp_delete ON public.event_rsvps;
CREATE TRIGGER event_rsvp_delete
AFTER DELETE ON public.event_rsvps
FOR EACH ROW EXECUTE FUNCTION public.handle_event_rsvp_delete();

-- FORUMS
CREATE TABLE IF NOT EXISTS public.forum_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  color text,
  topics_count integer NOT NULL DEFAULT 0,
  posts_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.forum_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view forum categories"
ON public.forum_categories FOR SELECT USING (true);

CREATE TABLE IF NOT EXISTS public.forum_topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES public.forum_categories(id) ON DELETE CASCADE,
  author_id uuid NOT NULL,
  title text NOT NULL,
  is_pinned boolean NOT NULL DEFAULT false,
  replies_count integer NOT NULL DEFAULT 0,
  last_reply_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.forum_topics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view forum topics"
ON public.forum_topics FOR SELECT USING (true);
CREATE POLICY "Users can create their own topics"
ON public.forum_topics FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update their own topics"
ON public.forum_topics FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Users can delete their own topics"
ON public.forum_topics FOR DELETE USING (auth.uid() = author_id);

CREATE TRIGGER update_forum_topics_updated_at
BEFORE UPDATE ON public.forum_topics
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE IF NOT EXISTS public.forum_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id uuid NOT NULL REFERENCES public.forum_topics(id) ON DELETE CASCADE,
  author_id uuid NOT NULL,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view forum posts"
ON public.forum_posts FOR SELECT USING (true);
CREATE POLICY "Users can create their own forum posts"
ON public.forum_posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update their own forum posts"
ON public.forum_posts FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Users can delete their own forum posts"
ON public.forum_posts FOR DELETE USING (auth.uid() = author_id);

CREATE TRIGGER update_forum_posts_updated_at
BEFORE UPDATE ON public.forum_posts
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Forum counters
CREATE OR REPLACE FUNCTION public.handle_forum_topic_insert()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.forum_categories SET topics_count = topics_count + 1 WHERE id = NEW.category_id;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.handle_forum_topic_delete()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.forum_categories SET topics_count = GREATEST(topics_count - 1, 0) WHERE id = OLD.category_id;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS forum_topic_insert ON public.forum_topics;
CREATE TRIGGER forum_topic_insert
AFTER INSERT ON public.forum_topics
FOR EACH ROW EXECUTE FUNCTION public.handle_forum_topic_insert();

DROP TRIGGER IF EXISTS forum_topic_delete ON public.forum_topics;
CREATE TRIGGER forum_topic_delete
AFTER DELETE ON public.forum_topics
FOR EACH ROW EXECUTE FUNCTION public.handle_forum_topic_delete();

CREATE OR REPLACE FUNCTION public.handle_forum_post_insert()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.forum_topics SET replies_count = replies_count + 1, last_reply_at = now() WHERE id = NEW.topic_id;
  UPDATE public.forum_categories SET posts_count = posts_count + 1 WHERE id = (SELECT category_id FROM public.forum_topics WHERE id = NEW.topic_id);
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.handle_forum_post_delete()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.forum_topics SET replies_count = GREATEST(replies_count - 1, 0) WHERE id = OLD.topic_id;
  UPDATE public.forum_categories SET posts_count = GREATEST(posts_count - 1, 0) WHERE id = (SELECT category_id FROM public.forum_topics WHERE id = OLD.topic_id);
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS forum_post_insert ON public.forum_posts;
CREATE TRIGGER forum_post_insert
AFTER INSERT ON public.forum_posts
FOR EACH ROW EXECUTE FUNCTION public.handle_forum_post_insert();

DROP TRIGGER IF EXISTS forum_post_delete ON public.forum_posts;
CREATE TRIGGER forum_post_delete
AFTER DELETE ON public.forum_posts
FOR EACH ROW EXECUTE FUNCTION public.handle_forum_post_delete();

-- Seed initial forum categories if none exist
INSERT INTO public.forum_categories (name, description, color)
SELECT * FROM (
  VALUES
    ('Startup Ideas', 'Share and discuss innovative startup concepts', 'blue'),
    ('Product Help', 'Get feedback and advice on your products', 'green'),
    ('Tech Talk', 'Technical discussions and programming help', 'purple'),
    ('Marketing & Growth', 'Strategies for growing your business', 'orange')
) AS v(name, description, color)
WHERE NOT EXISTS (SELECT 1 FROM public.forum_categories);

-- Seed a default magazine if table exists and is empty (idempotent)
INSERT INTO public.magazines (title, description, issue_number, cover_image_url, publication_date, embed_url, tags)
SELECT 'Unfold Editorial', 'A curated editorial experience from Unfold Tribe Nigeria.', 'Issue 1', NULL, NULL, 'https://tawfiqm857.github.io/unfold-editorial-web/', ARRAY['Nigeria','Editorial']
WHERE NOT EXISTS (SELECT 1 FROM public.magazines);
