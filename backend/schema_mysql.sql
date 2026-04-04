-- FitMate 数据库建表脚本 (与 models/*.py 同步)
-- MySQL 5.7+ / 8.0+
CREATE DATABASE IF NOT EXISTS fitmate DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE fitmate;

-- --------------------------------------------------------
-- 1. users
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(64) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(128) UNIQUE,
    phone VARCHAR(32) UNIQUE,
    name VARCHAR(64) DEFAULT '',
    avatar VARCHAR(255) DEFAULT '',
    gender VARCHAR(16) DEFAULT '',
    height FLOAT,
    weight FLOAT,
    age INT,
    location VARCHAR(128) DEFAULT '',
    goal VARCHAR(128) DEFAULT '',
    current_coach_id BIGINT,
    coach_gender VARCHAR(16),
    coach_personality VARCHAR(32),
    join_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- 2. coaches
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS coaches (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(64) NOT NULL,
    gender VARCHAR(16) DEFAULT 'female',
    style VARCHAR(32) DEFAULT 'gentle',
    personality VARCHAR(32) DEFAULT 'gentle',
    avatar VARCHAR(255) DEFAULT '',
    introduction TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- 3. achievements
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS achievements (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    achievement_name VARCHAR(128) NOT NULL,
    description TEXT DEFAULT '',
    icon VARCHAR(255) DEFAULT '',
    badge_type VARCHAR(32) DEFAULT 'bronze',
    condition_type VARCHAR(32) DEFAULT '',
    condition_value INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- 4. user_achievements
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_achievements (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    achievement_id BIGINT NOT NULL,
    earned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ua_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_ua_achievement FOREIGN KEY (achievement_id) REFERENCES achievements(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- 5. training_plan
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS training_plan (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    name VARCHAR(128) NOT NULL,
    description TEXT DEFAULT '',
    plan_type VARCHAR(32) DEFAULT '手动创建',
    difficulty VARCHAR(16) DEFAULT '中级',
    duration_str VARCHAR(16) DEFAULT '',
    start_date DATE,
    end_date DATE,
    status VARCHAR(32) DEFAULT 'todo',
    total_calories INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_plan_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- 6. plan_tasks
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS plan_tasks (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    plan_id BIGINT NOT NULL,
    name VARCHAR(128) NOT NULL,
    task_type VARCHAR(64) DEFAULT '综合',
    duration INT DEFAULT 30,
    duration_str VARCHAR(32) DEFAULT '',
    calories INT DEFAULT 0,
    sets INT,
    reps INT,
    rest VARCHAR(32),
    description TEXT DEFAULT '',
    target_date DATE,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at DATETIME,
    CONSTRAINT fk_task_plan FOREIGN KEY (plan_id) REFERENCES training_plan(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- 7. training_record
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS training_record (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    plan_id BIGINT,
    duration INT DEFAULT 0,
    exercise_type VARCHAR(64) NOT NULL,
    calories INT DEFAULT 0,
    record_date DATE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_record_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_record_plan FOREIGN KEY (plan_id) REFERENCES training_plan(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- 8. articles
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS articles (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(64) DEFAULT '',
    article_type VARCHAR(16) DEFAULT 'article',
    summary TEXT,
    thumbnail VARCHAR(255) DEFAULT '',
    content TEXT NOT NULL,
    video_url VARCHAR(255) DEFAULT '',
    duration VARCHAR(16),
    views INT DEFAULT 0,
    like_count INT DEFAULT 0,
    collect_count INT DEFAULT 0,
    comment_count INT DEFAULT 0,
    author VARCHAR(64) DEFAULT '官方',
    publish_date DATE,
    tags VARCHAR(255) DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- 9. article_likes
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS article_likes (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    article_id BIGINT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_like_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_like_article FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
    UNIQUE KEY uk_user_article_like (user_id, article_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- 10. article_collects
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS article_collects (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    article_id BIGINT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_collect_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_collect_article FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
    UNIQUE KEY uk_user_article_collect (user_id, article_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- 11. article_comments
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS article_comments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    article_id BIGINT NOT NULL,
    parent_id BIGINT,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_comment_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_comment_article FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- 12. coach_sessions
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS coach_sessions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    coach_id BIGINT,
    messages TEXT DEFAULT '[]',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_session_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_session_coach FOREIGN KEY (coach_id) REFERENCES coaches(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
