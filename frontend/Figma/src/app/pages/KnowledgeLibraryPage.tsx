import { useState } from "react";
import { useNavigate } from "react-router";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Search, Play, Clock, Eye, Heart, BookOpen, Bookmark } from "lucide-react";
import { motion } from "motion/react";

interface KnowledgeItem {
  id: number;
  title: string;
  category: string;
  type: "文章" | "视频";
  description: string;
  duration?: string;
  views: number;
  likes: number;
  thumbnail: string;
}

export default function KnowledgeLibraryPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("全部");
  const [bookmarkedItems, setBookmarkedItems] = useState<number[]>([1, 3]); // 默认收藏了id为1和3的项目

  const toggleBookmark = (id: number, e: React.MouseEvent) => {
    e.stopPropagation(); // 防止触发卡片点击事件
    setBookmarkedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const categories = ["全部", "力量训练", "有氧运动", "营养饮食", "拉伸放松", "运动损伤"];

  const knowledgeItems: KnowledgeItem[] = [
    {
      id: 1,
      title: "如何正确进行深蹲训练",
      category: "力量训练",
      type: "视频",
      description: "深蹲是力量训练的基础动作，本教程详细讲解正确的深蹲姿势和常见错误。",
      duration: "12:30",
      views: 15234,
      likes: 892,
      thumbnail: "🏋️",
    },
    {
      id: 2,
      title: "HIIT高强度间歇训练完整指南",
      category: "有氧运动",
      type: "文章",
      description: "了解HIIT训练的原理、好处以及如何制定适合自己的HIIT计划。",
      views: 8932,
      likes: 634,
      thumbnail: "🔥",
    },
    {
      id: 3,
      title: "增肌期营养搭配建议",
      category: "营养饮食",
      type: "文章",
      description: "详细介绍增肌期间应该如何安排饮食，包括蛋白质、碳水化合物和脂肪的摄入比例。",
      views: 12456,
      likes: 1023,
      thumbnail: "🥗",
    },
    {
      id: 4,
      title: "10分钟全身拉伸教程",
      category: "拉伸放松",
      type: "视频",
      description: "运动后的拉伸非常重要，跟随视频一起完成全身拉伸，缓解肌肉紧张。",
      duration: "10:15",
      views: 23456,
      likes: 1567,
      thumbnail: "🧘",
    },
    {
      id: 5,
      title: "跑步新手常见错误与预防",
      category: "有氧运动",
      type: "视频",
      description: "跑步看似简单，但错误的姿势会导致运动损伤。本视频帮你纠正常见错误。",
      duration: "15:20",
      views: 18765,
      likes: 945,
      thumbnail: "🏃",
    },
    {
      id: 6,
      title: "运动后肌肉酸痛如何缓解",
      category: "运动损伤",
      type: "文章",
      description: "了解肌肉酸痛的原因，以及如何通过正确的方法加速恢复。",
      views: 9876,
      likes: 567,
      thumbnail: "💪",
    },
    {
      id: 7,
      title: "核心力量训练动作详解",
      category: "力量训练",
      type: "视频",
      description: "核心力量是所有运动的基础，学习平板支撑、俄罗斯转体等经典核心训练动作。",
      duration: "18:45",
      views: 14532,
      likes: 876,
      thumbnail: "🎯",
    },
    {
      id: 8,
      title: "减脂期饮食计划推荐",
      category: "营养饮食",
      type: "文章",
      description: "科学的减脂饮食不是节食，而是合理控制热量摄入并保证营养均衡。",
      views: 16789,
      likes: 1234,
      thumbnail: "🍎",
    },
  ];

  const filteredItems = knowledgeItems.filter((item) => {
    const matchesCategory = selectedCategory === "全部" || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">健身知识库</h1>
        <p className="text-gray-600 mt-1">学习专业的健身知识，让训练更科学有效</p>
      </div>

      {/* Search Bar */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索健身知识、训练教程..."
            className="pl-10"
          />
        </div>
      </Card>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
              selectedCategory === category
                ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-200"
                : "bg-white text-gray-700 border border-gray-300 hover:border-blue-400 hover:bg-blue-50"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">全部内容</TabsTrigger>
          <TabsTrigger value="video">视频教程</TabsTrigger>
          <TabsTrigger value="article">文章资讯</TabsTrigger>
          <TabsTrigger value="bookmarked">
            <Bookmark className="w-4 h-4 mr-1" />
            我的收藏
            {bookmarkedItems.length > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-blue-600 text-white rounded-full">
                {bookmarkedItems.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-xl transition-all cursor-pointer group">
                  {/* Thumbnail */}
                  <div
                    onClick={() => navigate(`/knowledge/${item.id}`)}
                    className="relative h-48 bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 flex items-center justify-center"
                  >
                    <div className="text-7xl group-hover:scale-110 transition-transform">
                      {item.thumbnail}
                    </div>
                    {item.type === "视频" && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all">
                        <div className="w-16 h-16 rounded-full bg-white bg-opacity-90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Play className="w-8 h-8 text-blue-600 ml-1" />
                        </div>
                      </div>
                    )}
                    <Badge className="absolute top-3 right-3">
                      {item.type === "视频" ? (
                        <><Play className="w-3 h-3 mr-1" /> 视频</>
                      ) : (
                        <><BookOpen className="w-3 h-3 mr-1" /> 文章</>
                      )}
                    </Badge>
                    {item.duration && (
                      <div className="absolute bottom-3 right-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.duration}
                      </div>
                    )}
                    <div
                      className="absolute top-3 left-3 cursor-pointer"
                      onClick={(e) => toggleBookmark(item.id, e)}
                    >
                      <Bookmark
                        className={`w-4 h-4 ${
                          bookmarkedItems.includes(item.id) ? "text-blue-600" : "text-gray-400"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <Badge
                      variant="outline"
                      className="mb-2 bg-blue-50 text-blue-700 border-blue-200"
                    >
                      {item.category}
                    </Badge>
                    <h3 className="font-semibold text-lg mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">{item.description}</p>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{item.views.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        <span>{item.likes.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="video" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems
              .filter((item) => item.type === "视频")
              .map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden hover:shadow-xl transition-all cursor-pointer group">
                    <div className="relative h-48 bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 flex items-center justify-center">
                      <div className="text-7xl group-hover:scale-110 transition-transform">
                        {item.thumbnail}
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all">
                        <div className="w-16 h-16 rounded-full bg-white bg-opacity-90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Play className="w-8 h-8 text-blue-600 ml-1" />
                        </div>
                      </div>
                      {item.duration && (
                        <div className="absolute bottom-3 right-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {item.duration}
                        </div>
                      )}
                      <div
                        className="absolute top-3 left-3 cursor-pointer"
                        onClick={(e) => toggleBookmark(item.id, e)}
                      >
                        <Bookmark
                          className={`w-4 h-4 ${
                            bookmarkedItems.includes(item.id) ? "text-blue-600" : "text-gray-400"
                          }`}
                        />
                      </div>
                    </div>
                    <div className="p-5">
                      <Badge variant="outline" className="mb-2 bg-blue-50 text-blue-700 border-blue-200">
                        {item.category}
                      </Badge>
                      <h3 className="font-semibold text-lg mb-2 line-clamp-1">{item.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-4">{item.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{item.views.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          <span>{item.likes.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="article" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems
              .filter((item) => item.type === "文章")
              .map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden hover:shadow-xl transition-all cursor-pointer group">
                    <div
                      onClick={() => navigate(`/knowledge/${item.id}`)}
                      className="relative h-48 bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 flex items-center justify-center"
                    >
                      <div className="text-7xl group-hover:scale-110 transition-transform">
                        {item.thumbnail}
                      </div>
                      <Badge className="absolute top-3 right-3">
                        <BookOpen className="w-3 h-3 mr-1" /> 文章
                      </Badge>
                      <div
                        className="absolute top-3 left-3 cursor-pointer"
                        onClick={(e) => toggleBookmark(item.id, e)}
                      >
                        <Bookmark
                          className={`w-4 h-4 ${
                            bookmarkedItems.includes(item.id) ? "text-blue-600" : "text-gray-400"
                          }`}
                        />
                      </div>
                    </div>
                    <div className="p-5">
                      <Badge variant="outline" className="mb-2 bg-blue-50 text-blue-700 border-blue-200">
                        {item.category}
                      </Badge>
                      <h3 className="font-semibold text-lg mb-2 line-clamp-1">{item.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-4">{item.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{item.views.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          <span>{item.likes.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="bookmarked" className="space-y-4">
          {bookmarkedItems.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
                  <Bookmark className="w-10 h-10 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">还没有收藏内容</h3>
                  <p className="text-gray-600">点击内容卡片上的收藏图标，将喜欢的内容添加到收藏夹</p>
                </div>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems
                .filter((item) => bookmarkedItems.includes(item.id))
                .map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="overflow-hidden hover:shadow-xl transition-all cursor-pointer group">
                      {/* Thumbnail */}
                      <div
                        onClick={() => navigate(`/knowledge/${item.id}`)}
                        className="relative h-48 bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 flex items-center justify-center"
                      >
                        <div className="text-7xl group-hover:scale-110 transition-transform">
                          {item.thumbnail}
                        </div>
                        {item.type === "视频" && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all">
                            <div className="w-16 h-16 rounded-full bg-white bg-opacity-90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Play className="w-8 h-8 text-blue-600 ml-1" />
                            </div>
                          </div>
                        )}
                        <Badge className="absolute top-3 right-3">
                          {item.type === "视频" ? (
                            <><Play className="w-3 h-3 mr-1" /> 视频</>
                          ) : (
                            <><BookOpen className="w-3 h-3 mr-1" /> 文章</>
                          )}
                        </Badge>
                        {item.duration && (
                          <div className="absolute bottom-3 right-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {item.duration}
                          </div>
                        )}
                        <div
                          className="absolute top-3 left-3 cursor-pointer"
                          onClick={(e) => toggleBookmark(item.id, e)}
                        >
                          <Bookmark
                            className={`w-4 h-4 ${
                              bookmarkedItems.includes(item.id) ? "text-blue-600" : "text-gray-400"
                            }`}
                          />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <Badge
                          variant="outline"
                          className="mb-2 bg-blue-50 text-blue-700 border-blue-200"
                        >
                          {item.category}
                        </Badge>
                        <h3 className="font-semibold text-lg mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-4">{item.description}</p>

                        {/* Stats */}
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            <span>{item.views.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            <span>{item.likes.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}