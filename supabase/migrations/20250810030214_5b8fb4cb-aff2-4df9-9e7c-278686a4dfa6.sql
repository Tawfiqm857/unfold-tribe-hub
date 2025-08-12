-- Fix linter: set search_path for all custom functions

CREATE OR REPLACE FUNCTION public.handle_post_like_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  UPDATE public.posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
  RETURN NULL;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_post_like_delete()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  UPDATE public.posts SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = OLD.post_id;
  RETURN NULL;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_post_comment_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  UPDATE public.posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
  RETURN NULL;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_post_comment_delete()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  UPDATE public.posts SET comments_count = GREATEST(comments_count - 1, 0) WHERE id = OLD.post_id;
  RETURN NULL;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_event_rsvp_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  UPDATE public.events SET attendees_count = attendees_count + 1 WHERE id = NEW.event_id;
  RETURN NULL;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_event_rsvp_delete()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  UPDATE public.events SET attendees_count = GREATEST(attendees_count - 1, 0) WHERE id = OLD.event_id;
  RETURN NULL;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_forum_topic_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  UPDATE public.forum_categories SET topics_count = topics_count + 1 WHERE id = NEW.category_id;
  RETURN NULL;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_forum_topic_delete()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  UPDATE public.forum_categories SET topics_count = GREATEST(topics_count - 1, 0) WHERE id = OLD.category_id;
  RETURN NULL;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_forum_post_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  UPDATE public.forum_topics SET replies_count = replies_count + 1, last_reply_at = now() WHERE id = NEW.topic_id;
  UPDATE public.forum_categories SET posts_count = posts_count + 1 WHERE id = (SELECT category_id FROM public.forum_topics WHERE id = NEW.topic_id);
  RETURN NULL;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_forum_post_delete()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  UPDATE public.forum_topics SET replies_count = GREATEST(replies_count - 1, 0) WHERE id = OLD.topic_id;
  UPDATE public.forum_categories SET posts_count = GREATEST(posts_count - 1, 0) WHERE id = (SELECT category_id FROM public.forum_topics WHERE id = OLD.topic_id);
  RETURN NULL;
END;
$$;