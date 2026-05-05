import { Card } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, Award, Calendar, Zap, Target, Flame } from "lucide-react";

export default function DataDashboardPage() {
  // Last 7 days workout duration data
  const last7DaysData = [
    { id: "7d-1", day: "3/6", duration: 45, calories: 320 },
    { id: "7d-2", day: "3/7", duration: 60, calories: 450 },
    { id: "7d-3", day: "3/8", duration: 30, calories: 210 },
    { id: "7d-4", day: "3/9", duration: 55, calories: 380 },
    { id: "7d-5", day: "3/10", duration: 40, calories: 280 },
    { id: "7d-6", day: "3/11", duration: 75, calories: 550 },
    { id: "7d-7", day: "3/12", duration: 50, calories: 350 },
  ];

  // Last 30 days workout frequency data (grouped by weeks)
  const last30DaysData = [
    { id: "30d-1", date: "2/13-2/19", duration: 245, calories: 1720 },
    { id: "30d-2", date: "2/20-2/26", duration: 280, calories: 1980 },
    { id: "30d-3", date: "2/27-3/5", duration: 210, calories: 1450 },
    { id: "30d-4", date: "3/6-3/12", duration: 355, calories: 2540 },
  ];

  // Exercise category distribution
  const categoryData = [
    { id: "cat-1", name: "力量训练", value: 35, color: "#2563eb" },
    { id: "cat-2", name: "有氧运动", value: 30, color: "#06b6d4" },
    { id: "cat-3", name: "HIIT", value: 20, color: "#3b82f6" },
    { id: "cat-4", name: "拉伸放松", value: 15, color: "#60a5fa" },
  ];

  // AI suggestions
  const aiSuggestions = [
    {
      id: 1,
      type: "positive",
      icon: Award,
      title: "训练频率优秀",
      description: "本周完成7次训练，达成了设定目标！保持这个节奏能够获得更好的训练效果。",
      color: "from-blue-600 to-blue-700",
    },
    {
      id: 2,
      type: "warning",
      icon: Target,
      title: "建议增加力量训练",
      description: "根据数据分析，你的有氧训练占比较高。建议增加力量训练来提升肌肉力量和基础代谢。",
      color: "from-cyan-500 to-cyan-600",
    },
    {
      id: 3,
      type: "tip",
      icon: Zap,
      title: "注意训练强度变化",
      description: "连续高强度训练后，建议安排1-2天的低强度恢复训练，避免过度疲劳和运动损伤。",
      color: "from-blue-500 to-cyan-500",
    },
  ];

  const totalDuration = last7DaysData.reduce((sum, item) => sum + item.duration, 0);
  const totalCalories = last7DaysData.reduce((sum, item) => sum + item.calories, 0);
  const totalWorkouts = 7; // Based on 7 days of data
  const avgDuration = Math.round(totalDuration / last7DaysData.length);

  // Calculate 30 days stats
  const total30Duration = last30DaysData.reduce((sum, item) => sum + item.duration, 0);
  const total30Calories = last30DaysData.reduce((sum, item) => sum + item.calories, 0);
  const total30Workouts = 22; // Based on 30 days of data
  const avg30Duration = Math.round(total30Duration / last30DaysData.length);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">数据分析</h1>
        <p className="text-gray-600 mt-1">追踪你的健身进度，用数据驱动训练</p>
      </div>

      {/* Charts */}
      <div className="space-y-6">
        {/* Time Filter */}
        <div>
          <h3 className="font-semibold text-lg mb-3">时间范围</h3>
          <Tabs defaultValue="7days" className="space-y-6">
            <TabsList>
              <TabsTrigger value="7days">最近7天</TabsTrigger>
              <TabsTrigger value="30days">最近30天</TabsTrigger>
            </TabsList>

            {/* Last 7 Days View */}
            <TabsContent value="7days" className="space-y-4">
              {/* Overview Stats for 7 days */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-6 bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Calendar className="w-8 h-8 text-blue-200" />
                  </div>
                  <p className="text-blue-100 text-sm">总训练时长</p>
                  <p className="text-3xl font-bold mt-1">{totalDuration}分钟</p>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-cyan-500 to-cyan-600 text-white shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Flame className="w-8 h-8 text-cyan-200" />
                  </div>
                  <p className="text-cyan-100 text-sm">消耗卡路里</p>
                  <p className="text-3xl font-bold mt-1">{totalCalories}</p>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <TrendingUp className="w-8 h-8 text-blue-200" />
                  </div>
                  <p className="text-cyan-100 text-sm">训练次数</p>
                  <p className="text-3xl font-bold mt-1">{totalWorkouts}次</p>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-blue-400 to-blue-500 text-white shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Zap className="w-8 h-8 text-blue-200" />
                  </div>
                  <p className="text-blue-100 text-sm">平均时长</p>
                  <p className="text-3xl font-bold mt-1">{avgDuration}分钟</p>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pie Chart - Exercise Distribution */}
                <Card className="p-6 shadow-lg">
                  <h3 className="font-semibold text-lg mb-4">运动类型分布</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={90}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry) => (
                          <Cell key={`cell-7d-${entry.id}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>

                {/* Bar Chart - Duration Trend */}
                <Card className="p-6 shadow-lg">
                  <h3 className="font-semibold text-lg mb-4">训练时长趋势</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={last7DaysData}>
                      <defs>
                        <linearGradient id="durationGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#2563eb" />
                          <stop offset="100%" stopColor="#06b6d4" />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="day" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#ffffff",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      <Bar dataKey="duration" name="训练时长(分钟)" fill="url(#durationGradient)" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </div>
            </TabsContent>

            {/* Last 30 Days View */}
            <TabsContent value="30days" className="space-y-4">
              {/* Overview Stats for 30 days */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-6 bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Calendar className="w-8 h-8 text-blue-200" />
                  </div>
                  <p className="text-blue-100 text-sm">总训练时长</p>
                  <p className="text-3xl font-bold mt-1">{total30Duration}分钟</p>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-cyan-500 to-cyan-600 text-white shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Flame className="w-8 h-8 text-cyan-200" />
                  </div>
                  <p className="text-cyan-100 text-sm">消耗卡路里</p>
                  <p className="text-3xl font-bold mt-1">{total30Calories}</p>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <TrendingUp className="w-8 h-8 text-blue-200" />
                  </div>
                  <p className="text-cyan-100 text-sm">训练次数</p>
                  <p className="text-3xl font-bold mt-1">{total30Workouts}次</p>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-blue-400 to-blue-500 text-white shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Zap className="w-8 h-8 text-blue-200" />
                  </div>
                  <p className="text-blue-100 text-sm">平均时长</p>
                  <p className="text-3xl font-bold mt-1">{avg30Duration}分钟</p>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pie Chart - Exercise Distribution */}
                <Card className="p-6 shadow-lg">
                  <h3 className="font-semibold text-lg mb-4">运动类型分布</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={90}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry) => (
                          <Cell key={`cell-30d-${entry.id}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>

                {/* Bar Chart - Duration Trend */}
                <Card className="p-6 shadow-lg">
                  <h3 className="font-semibold text-lg mb-4">训练时长趋势</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={last30DaysData}>
                      <defs>
                        <linearGradient id="duration30Gradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#2563eb" />
                          <stop offset="100%" stopColor="#06b6d4" />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="date" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#ffffff",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      <Bar dataKey="duration" name="训练时长(分钟)" fill="url(#duration30Gradient)" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* AI Suggestions */}
      <Card className="p-6 shadow-lg">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <Target className="w-6 h-6 text-blue-600" />
          AI健身建议
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {aiSuggestions.map((suggestion) => {
            const Icon = suggestion.icon;
            return (
              <div
                key={suggestion.id}
                className={`p-5 rounded-xl bg-gradient-to-br ${suggestion.color} text-white shadow-lg`}
              >
                <div className="flex items-start gap-3">
                  <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">{suggestion.title}</h4>
                    <p className="text-sm text-white text-opacity-90">
                      {suggestion.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Achievement */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 via-cyan-50 to-blue-50 border border-blue-200 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-blue-600 to-cyan-500 p-4 rounded-2xl shadow-lg">
            <Award className="w-12 h-12 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800 mb-1">本周成就达成！</h3>
            <p className="text-gray-600">
              恭喜你完成了本周的训练目标！继续保持，你已经超越了80%的用户。💪
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}