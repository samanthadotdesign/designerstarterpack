CREATE TABLE users (id SERIAL PRIMARY KEY, user_name TEXT, email TEXT, hashed_password TEXT, profession TEXT);

CREATE TABLE categories (id SERIAL PRIMARY KEY, category_name TEXT, category_img TEXT, section_id INTEGER);

CREATE TABLE skills (id SERIAL PRIMARY KEY, skill_name TEXT, skill_img TEXT, category_id INTEGER);

CREATE TABLE resources (id SERIAL PRIMARY KEY, resource_name TEXT, resource_link TEXT, skill_id INTEGER, contributor_id INTEGER);

CREATE TABLE user_categories (id SERIAL PRIMARY KEY, user_id INTEGER, category_id INTEGER, category_completed BOOLEAN);

CREATE TABLE user_skills (id SERIAL PRIMARY KEY, user_id INTEGER, skill_id INTEGER, skill_completed BOOLEAN);

CREATE TABLE sections (id SERIAL PRIMARY KEY, section_name TEXT, data_bg TEXT);

ALTER TABLE user_skills ADD CONSTRAINT userid_skillid UNIQUE (user_id, skill_id);
ALTER TABLE user_categories ADD CONSTRAINT userid_categoryid UNIQUE (user_id, category_id);