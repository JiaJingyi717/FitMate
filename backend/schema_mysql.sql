CREATE DATABASE IF NOT EXISTS fitmate DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE fitmate;

CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(64) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    goal VARCHAR(255) DEFAULT '',
    coach_gender VARCHAR(32) DEFAULT 'female',
    coach_style VARCHAR(32) DEFAULT 'gentle',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS training_plan (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    plan_name VARCHAR(128) NOT NULL,
    description TEXT,
    status VARCHAR(32) NOT NULL DEFAULT 'todo',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_plan_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS training_record (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    plan_id BIGINT,
    duration INT NOT NULL DEFAULT 0,
    exercise_type VARCHAR(64) NOT NULL,
    record_date DATE NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_record_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_record_plan FOREIGN KEY (plan_id) REFERENCES training_plan(id)
);

CREATE TABLE IF NOT EXISTS knowledge (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(64) NOT NULL,
    content TEXT NOT NULL,
    video_url VARCHAR(255) DEFAULT ''
);

INSERT INTO knowledge (title, category, content, video_url) VALUES
('深蹲入门', '力量训练', '保持背部挺直，膝盖与脚尖方向一致。', ''),
('跑步减脂建议', '有氧训练', '每周 3-4 次中等强度跑步，每次 30 分钟以上。', ''),
('训练后拉伸', '拉伸恢复', '每个动作保持 20-30 秒，避免弹震式拉伸。', '');
