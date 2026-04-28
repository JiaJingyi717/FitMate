import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  ArrowLeft,
  Play,
  Clock,
  Eye,
  Heart,
  Share2,
  Bookmark,
  ThumbsUp,
  MessageCircle,
  BookOpen,
  Calendar,
} from "lucide-react";
import { motion } from "motion/react";

interface KnowledgeDetail {
  id: number;
  title: string;
  category: string;
  type: "文章" | "视频";
  description: string;
  duration?: string;
  views: number;
  likes: number;
  thumbnail: string;
  publishDate: string;
  content?: string;
  videoUrl?: string;
  tags: string[];
}

export default function KnowledgeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // 模拟数据 - 实际应该根据ID从API获取
  const knowledgeData: Record<string, KnowledgeDetail> = {
    "1": {
      id: 1,
      title: "如何正确进行深蹲训练",
      category: "力量训练",
      type: "视频",
      description: "深蹲是力量训练的基础动作，本教程详细讲解正确的深蹲姿势和常见错误。",
      duration: "12:30",
      views: 15234,
      likes: 892,
      thumbnail: "🏋️",
      publishDate: "2026-03-10",
      videoUrl: "https://example.com/video.mp4",
      tags: ["深蹲", "力量训练", "下肢训练", "基础动作"],
    },
    "2": {
      id: 2,
      title: "HIIT高强度间歇训练完整指南",
      category: "有氧运动",
      type: "文章",
      description: "了解HIIT训练的原理、好处以及如何制定适合自己的HIIT计划。",
      views: 8932,
      likes: 634,
      thumbnail: "🔥",
      publishDate: "2026-03-08",
      content: `
# HIIT高强度间歇训练完整指南

## 什么是HIIT？

HIIT（High-Intensity Interval Training）即高强度间歇训练，是一种将高强度运动和低强度运动或休息交替进行的训练方式。这种训练方法能在短时间内达到最大的运动效果。

## HIIT的核心原理

HIIT训练的核心在于：
- **高强度爆发**：在短时间内将心率提升到最大心率的80-95%
- **短暂恢复**：通过低强度运动或休息让心率降下来
- **循环重复**：多个回合的高强度和恢复期交替

## HIIT训练的五大好处

### 1. 高效燃脂
HIIT训练能在运动后的24-48小时内持续燃烧卡路里，这种效应被称为"后燃效应"或EPOC（运动后过量氧耗）。

### 2. 节省时间
一次完整的HIIT训练通常只需要15-30分钟，非常适合忙碌的现代人。

### 3. 提升心肺功能
通过反复刺激心血管系统，能有效提升最大摄氧量（VO2 max）。

### 4. 保持肌肉量
与传统有氧运动相比，HIIT更能保持甚至增加肌肉量。

### 5. 改善代谢健康
研究表明，HIIT能改善胰岛素敏感性，降低血糖水平。

## 初学者HIIT训练计划

### 第1-2周：入门阶段
- **训练频率**：每周2-3次
- **训练时长**：15分钟
- **工作时间**：30秒
- **休息时间**：60秒
- **动作选择**：开合跳、高抬腿、波比跳

### 第3-4周：进阶阶段
- **训练频率**：每周3-4次
- **训练时长**：20分钟
- **工作时间**：40秒
- **休息时间**：40秒
- **动作选择**：深蹲跳、登山跑、俯卧撑

### 第5-8周：高级阶段
- **训练频率**：每周4-5次
- **训练时长**：25-30分钟
- **工作时间**：45秒
- **休息时间**：30秒
- **动作选择**：箱式跳、壶铃摆动、战绳

## 经典HIIT训练动作

### 1. 波比跳（Burpee）
全身性复合动作，能同时锻炼上肢、下肢和核心。

**动作要点**：
- 站立姿势开始
- 快速下蹲，双手撑地
- 双脚向后跳成俯卧撑姿势
- 完成一个俯卧撑（可选）
- 双脚跳回蹲姿
- 向上跳起，双手过头

### 2. 登山跑（Mountain Climbers）
优秀的核心和心肺训练动作。

**动作要点**：
- 从俯卧撑姿势开始
- 保持核心稳定
- 交替将膝盖快速拉向胸部
- 保持臀部不要过高

### 3. 深蹲跳（Jump Squats）
强化下肢力量和爆发力。

**动作要点**：
- 站立，双脚与肩同宽
- 下蹲至大腿与地面平行
- 爆发式向上跳起
- 轻柔落地，立即进入下一次深蹲

## 注意事项

### 训练前准备
- 充分热身5-10分钟
- 确保身体状态良好
- 穿着合适的运动鞋

### 训练中注意
- 保持正确的动作姿势
- 根据自己的能力调整强度
- 及时补充水分

### 训练后恢复
- 进行5-10分钟的拉伸
- 补充蛋白质和碳水化合物
- 保证充足睡眠

## 常见问题解答

**Q: HIIT适合每天做吗？**
A: 不建议。HIIT强度很高，建议每周3-5次，给身体充足的恢复时间。

**Q: 空腹做HIIT好吗？**
A: 因人而异。如果你容易低血糖，建议在训练前1-2小时摄入少量碳水化合物。

**Q: HIIT和传统有氧哪个更好？**
A: 两者各有优势。HIIT更省时高效，传统有氧更温和持久。可以根据目标和身体状况选择。

## 总结

HIIT是一种高效的训练方式，适合想要在短时间内获得最大运动效果的人群。但要注意循序渐进，不要操之过急，始终将安全和正确的动作姿势放在首位。

记住：**最好的训练计划，是你能坚持下去的计划！**
      `,
      tags: ["HIIT", "有氧运动", "高强度训练", "减脂"],
    },
    "3": {
      id: 3,
      title: "增肌期营养搭配建议",
      category: "营养饮食",
      type: "文章",
      description: "详细介绍增肌期间应该如何安排饮食，包括蛋白质、碳水化合物和脂肪的摄入比例。",
      views: 12456,
      likes: 1023,
      thumbnail: "🥗",
      publishDate: "2026-03-05",
      content: `
# 增肌期营养搭配建议

## 营养基础概念

增肌的核心公式：**摄入热量 > 消耗热量 + 力量训练**

### 三大营养素比例

在增肌期，建议的营养素摄入比例为：
- **蛋白质**：30-35%
- **碳水化合物**：45-50%
- **健康脂肪**：20-25%

## 蛋白质摄入指南

### 每日需求量
- **增肌期**：体重(kg) × 1.6-2.2g
- **例如**：70kg的人需要112-154g蛋白质/天

### 优质蛋白质来源
1. **动物性蛋白**
   - 鸡胸肉：每100g含23g蛋白质
   - 鸡蛋：每个含6-7g蛋白质
   - 牛肉：每100g含26g蛋白质
   - 三文鱼：每100g含20g蛋白质

2. **植物性蛋白**
   - 豆腐：每100g含8g蛋白质
   - 鹰嘴豆：每100g含19g蛋白质
   - 藜麦：每100g含14g蛋白质

### 蛋白质摄入时机
- **训练前1-2小时**：20-30g
- **训练后30分钟内**：30-40g
- **睡前**：20-30g（缓释蛋白）

## 碳水化合物策略

### 为什么需要碳水
- 提供训练能量
- 刺激胰岛素分泌，促进肌肉合成
- 补充肌糖原储备

### 优质碳水来源
- **复合碳水**：糙米、燕麦、红薯、全麦面包
- **简单碳水**（训练后）：香蕉、米饭、面包

### 碳水摄入时机
- **训练前2-3小时**：复合碳水
- **训练后**：快速碳水 + 蛋白质
- **其他时段**：以复合碳水为主

## 健康脂肪的重要性

### 脂肪的作用
- 合成睾酮等激素
- 吸收脂溶性维生素
- 提供长效能量

### 优质脂肪来源
- **Omega-3**：三文鱼、核桃、亚麻籽
- **单不饱和脂肪**：橄榄油、牛油果、坚果
- **中链甘油三酯**：椰子油

## 增肌期一日饮食示例

### 早餐（7:00）
- 燕麦片 80g
- 鸡蛋 3个（2个全蛋 + 1个蛋白）
- 香蕉 1根
- 牛奶 250ml

### 上午加餐（10:00）
- 希腊酸奶 200g
- 坚果 30g
- 蓝莓 50g

### 午餐（12:30）
- 糙米饭 200g
- 鸡胸肉 150g
- 西兰花 150g
- 牛油果半个

### 训练前加餐（15:00）
- 全麦面包 2片
- 花生酱 20g
- 香蕉 1根

### 训练后（17:30）
- 蛋白粉 30g
- 白米饭 150g
- 鸡胸肉 100g

### 晚餐（19:00）
- 红薯 200g
- 牛肉 150g
- 蔬菜沙拉 200g
- 橄榄油 10ml

### 睡前（22:00）
- 酪蛋白粉 30g 或
- 低脂奶酪 100g

## 补剂建议

### 必需补剂
1. **蛋白粉**
   - 乳清蛋白：训练后快速吸收
   - 酪蛋白：睡前缓释

2. **肌酸**
   - 每日5g，提升力量和肌肉增长

### 可选补剂
- **支链氨基酸（BCAA）**：训练中防止肌肉分解
- **谷氨酰胺**：促进恢复
- **复合维生素**：保证微量营养素摄入

## 水分补充

- **日常**：体重(kg) × 40ml
- **训练日**：额外增加500-1000ml
- **训练中**：每15分钟补充150-200ml

## 常见错误

### 1. 蛋白质摄入过量
超过体重×2.5g/kg不会带来额外收益，反而增加肾脏负担。

### 2. 忽视碳水化合物
碳水不足会导致训练表现下降，肌肉合成受限。

### 3. 脂肪摄入过低
脂肪太少会影响激素分泌，不利于增肌。

### 4. 用餐时间不规律
建议每3-4小时进食一次，保持稳定的营养供应。

## 进度监控

### 每周监测
- **体重变化**：每周增加0.25-0.5kg为宜
- **镜子检查**：观察肌肉线条
- **力量提升**：记录训练重量

### 调整策略
- 体重增长过快：减少200-300卡路里
- 体重不增长：增加300-500卡路里
- 脂肪增加过多：调整碳水和脂肪比例

## 总结

增肌营养的关键：
1. **热量盈余**：比维持热量多300-500卡路里
2. **充足蛋白质**：体重×1.6-2.2g
3. **合理碳水**：为训练提供能量
4. **优质脂肪**：支持激素合成
5. **规律进食**：每3-4小时一次

记住：**三分练，七分吃。持之以恒，效果自现！**
      `,
      tags: ["增肌", "营养", "饮食计划", "蛋白质"],
    },
  };

  const article = knowledgeData[id || "2"] || knowledgeData["2"];

  const relatedArticles = [
    { id: 4, title: "10分钟全身拉伸教程", thumbnail: "🧘", category: "拉伸放松" },
    { id: 5, title: "跑步新手常见错误与预防", thumbnail: "🏃", category: "有氧运动" },
    { id: 6, title: "运动后肌肉酸痛如何缓解", thumbnail: "💪", category: "运动损伤" },
  ];

  const comments = [
    {
      id: 1,
      author: "健身爱好者",
      avatar: "👨",
      content: "讲解非常详细，对我帮助很大！",
      likes: 23,
      date: "2天前",
    },
    {
      id: 2,
      author: "小明",
      avatar: "👦",
      content: "请问初学者应该从哪个阶段开始呢？",
      likes: 8,
      date: "3天前",
    },
    {
      id: 3,
      author: "运动达人",
      avatar: "💪",
      content: "很实用的内容，已经收藏了！",
      likes: 15,
      date: "1周前",
    },
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate("/knowledge")}
        className="gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        返回知识库
      </Button>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Article Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <Card className="p-8">
            <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
              {article.type === "视频" ? (
                <><Play className="w-3 h-3 mr-1" /> 视频教程</>
              ) : (
                <><BookOpen className="w-3 h-3 mr-1" /> 文章</>
              )}
            </Badge>

            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              {article.title}
            </h1>

            <p className="text-lg text-gray-600 mb-6">{article.description}</p>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 pb-6 border-b">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{article.publishDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>{article.views.toLocaleString()} 浏览</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                <span>{article.likes.toLocaleString()} 点赞</span>
              </div>
              {article.duration && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{article.duration}</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-6">
              <Button
                onClick={() => setIsLiked(!isLiked)}
                variant={isLiked ? "default" : "outline"}
                className={
                  isLiked
                    ? "bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                    : ""
                }
              >
                <ThumbsUp className="w-4 h-4 mr-2" />
                {isLiked ? "已点赞" : "点赞"}
              </Button>
              <Button
                onClick={() => setIsBookmarked(!isBookmarked)}
                variant={isBookmarked ? "default" : "outline"}
                className={
                  isBookmarked
                    ? "bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                    : ""
                }
              >
                <Bookmark className="w-4 h-4 mr-2" />
                {isBookmarked ? "已收藏" : "收藏"}
              </Button>
              <Button variant="outline">
                <Share2 className="w-4 h-4 mr-2" />
                分享
              </Button>
            </div>
          </Card>

          {/* Video Player or Article Content */}
          {article.type === "视频" ? (
            <Card className="overflow-hidden">
              <div className="relative aspect-video bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 flex items-center justify-center">
                <div className="text-9xl">{article.thumbnail}</div>
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                  <div className="w-20 h-20 rounded-full bg-white bg-opacity-90 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                    <Play className="w-10 h-10 text-blue-600 ml-1" />
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-lg mb-3">视频简介</h3>
                <p className="text-gray-600 leading-relaxed">
                  {article.description}
                </p>
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-sm text-gray-700">
                    💡 <strong>提示：</strong>
                    建议使用全屏模式观看以获得最佳体验。视频支持暂停、快进和回放功能。
                  </p>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-8">
              <div className="prose prose-blue max-w-none">
                <div
                  className="text-gray-700 leading-relaxed space-y-6"
                  dangerouslySetInnerHTML={{
                    __html: article.content
                      ?.split("\n")
                      .map((line) => {
                        if (line.startsWith("# ")) {
                          return `<h1 class="text-3xl font-bold text-gray-800 mt-8 mb-4">${line.slice(2)}</h1>`;
                        } else if (line.startsWith("## ")) {
                          return `<h2 class="text-2xl font-bold text-gray-800 mt-6 mb-3">${line.slice(3)}</h2>`;
                        } else if (line.startsWith("### ")) {
                          return `<h3 class="text-xl font-semibold text-gray-700 mt-4 mb-2">${line.slice(4)}</h3>`;
                        } else if (line.startsWith("- ")) {
                          return `<li class="ml-6 text-gray-700">${line.slice(2)}</li>`;
                        } else if (line.startsWith("**") && line.endsWith("**")) {
                          return `<p class="font-semibold text-gray-800">${line.slice(2, -2)}</p>`;
                        } else if (line.trim() === "") {
                          return "";
                        } else {
                          return `<p class="text-gray-700">${line}</p>`;
                        }
                      })
                      .join("") || "",
                  }}
                />
              </div>
            </Card>
          )}

          {/* Tags */}
          

          {/* Comments */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-blue-600" />
              评论 ({comments.length})
            </h3>

            {/* Comment Input */}
            <div className="mb-6">
              <textarea
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={3}
                placeholder="写下你的评论..."
              />
              <div className="flex justify-end mt-2">
                <Button className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600">
                  发表评论
                </Button>
              </div>
            </div>

            {/* Comments List */}
            <div className="space-y-4">
              {comments.map((comment) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3 p-4 bg-gray-50 rounded-lg"
                >
                  <div className="text-2xl">{comment.avatar}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="font-semibold text-gray-800">
                          {comment.author}
                        </span>
                        <span className="text-sm text-gray-500 ml-3">
                          {comment.date}
                        </span>
                      </div>
                      <Button variant="ghost" size="sm" className="gap-1">
                        <ThumbsUp className="w-3 h-3" />
                        <span className="text-sm">{comment.likes}</span>
                      </Button>
                    </div>
                    <p className="text-gray-700">{comment.content}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Category Card */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">分类</h3>
            <Badge className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-base px-4 py-2">
              {article.category}
            </Badge>
          </Card>

          {/* Related Articles */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">相关推荐</h3>
            <div className="space-y-4">
              {relatedArticles.map((related) => (
                <div
                  key={related.id}
                  onClick={() => navigate(`/knowledge/${related.id}`)}
                  className="flex gap-3 cursor-pointer group"
                >
                  <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                    {related.thumbnail}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm text-gray-800 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {related.title}
                    </h4>
                    <Badge variant="outline" className="text-xs">
                      {related.category}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          
        </div>
      </div>
    </div>
  );
}