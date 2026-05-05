import { useState } from "react";
import { useNavigate } from "react-router";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Avatar } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Switch } from "../components/ui/switch";
import { User, Mail, Phone, Calendar, MapPin, Award, Settings, Bell, Shield, Edit, Ruler, Weight, Activity, LogOut } from "lucide-react";

export default function UserProfilePage() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "李明",
    email: "liming@example.com",
    phone: "138****8888",
    gender: "男",
    age: "28岁",
    height: 175, // 单位：cm
    weight: 70,  // 单位：kg
    location: "北京市朝阳区",
    joinDate: "2024年1月",
  });

  const [settings, setSettings] = useState({
    emailNotification: true,
    pushNotification: true,
    weeklyReport: true,
    soundEffects: false,
  });

  const achievements = [
    { id: 1, name: "坚持之星", description: "连续训练7天", icon: "⭐", earned: true },
    { id: 2, name: "燃脂达人", description: "累计消耗10000卡路里", icon: "🔥", earned: true },
    { id: 3, name: "力量之王", description: "完成100次力量训练", icon: "💪", earned: true },
    { id: 4, name: "马拉松挑战", description: "跑步累计100公里", icon: "🏃", earned: false },
    { id: 5, name: "早起鸟", description: "早晨6点前训练30次", icon: "🌅", earned: false },
    { id: 6, name: "健身大师", description: "累计训练365天", icon: "🏆", earned: false },
  ];

  const trainingStats = [
    { label: "累计训练天数", value: "89天", color: "from-blue-600 to-blue-700" },
    { label: "总训练时长", value: "156小时", color: "from-cyan-500 to-cyan-600" },
    { label: "消耗卡路里", value: "23,456", color: "from-blue-500 to-cyan-500" },
    { label: "完成计划", value: "12个", color: "from-blue-400 to-blue-500" },
  ];

  const handleToggleSetting = (key: keyof typeof settings) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  // 计算BMI
  const calculateBMI = () => {
    if (userInfo.height && userInfo.weight) {
      const heightInMeters = userInfo.height / 100;
      const bmi = userInfo.weight / (heightInMeters * heightInMeters);
      return bmi.toFixed(1);
    }
    return "—";
  };

  // 获取BMI状态和颜色
  const getBMIStatus = () => {
    const bmi = parseFloat(calculateBMI());
    if (isNaN(bmi)) return { status: "—", color: "text-gray-500" };
    if (bmi < 18.5) return { status: "偏瘦", color: "text-blue-500" };
    if (bmi < 24) return { status: "正常", color: "text-green-500" };
    if (bmi < 28) return { status: "偏胖", color: "text-yellow-500" };
    return { status: "肥胖", color: "text-red-500" };
  };

  // 处理输入变化
  const handleInputChange = (field: string, value: string) => {
    if (field === "height" || field === "weight") {
      const numValue = parseFloat(value);
      setUserInfo({ ...userInfo, [field]: isNaN(numValue) ? 0 : numValue });
    } else {
      setUserInfo({ ...userInfo, [field]: value });
    }
  };

  // 处理退出登录
  const handleLogout = () => {
    // 模拟退出登录逻辑
    if (confirm("确定要退出登录吗？")) {
      console.log("用户已退出登录");
      navigate("/login");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">个人中心</h1>
        <p className="text-gray-600 mt-1">管理你的个人信息和偏好设置</p>
      </div>

      {/* Profile Card */}
      <Card className="p-8 bg-gradient-to-br from-blue-50 via-cyan-50 to-white border border-blue-100 shadow-lg">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 p-1">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                  <div className="text-6xl">👤</div>
                </div>
              </div>
              <button className="absolute bottom-0 right-0 bg-gradient-to-r from-blue-600 to-cyan-500 text-white p-2 rounded-full shadow-lg hover:from-blue-700 hover:to-cyan-600 transition-colors">
                <Edit className="w-4 h-4" />
              </button>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left w-full">
              {/* Name */}
              <div className="mb-3">
                {isEditing ? (
                  <Input
                    value={userInfo.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="text-2xl font-bold text-center md:text-left"
                    placeholder="姓名"
                  />
                ) : (
                  <h2 className="text-2xl font-bold text-gray-800">{userInfo.name}</h2>
                )}
              </div>

              {/* Contact Info */}
              <div className="space-y-2 text-gray-600">
                {/* Email */}
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  {isEditing ? (
                    <Input
                      type="email"
                      value={userInfo.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="flex-1"
                      placeholder="邮箱"
                    />
                  ) : (
                    <span>{userInfo.email}</span>
                  )}
                </div>

                {/* Phone */}
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  {isEditing ? (
                    <Input
                      type="tel"
                      value={userInfo.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="flex-1"
                      placeholder="手机号"
                    />
                  ) : (
                    <span>{userInfo.phone}</span>
                  )}
                </div>

                {/* Location */}
                

                {/* Join Date - Read Only */}
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <Calendar className="w-4 h-4 flex-shrink-0" />
                  <span>加入于 {userInfo.joinDate}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex md:flex-col gap-2">
              <Button
                variant={isEditing ? "default" : "outline"}
                onClick={() => setIsEditing(!isEditing)}
                className={isEditing ? "bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600" : ""}
              >
                <Edit className="w-4 h-4 mr-2" />
                {isEditing ? "保存" : "编辑"}
              </Button>
            </div>
          </div>

          {/* Body Stats Section */}
          <div className="border-t border-blue-200 pt-6">
            <h3 className="font-semibold text-lg mb-4 text-gray-800">身体数据</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Height */}
              <div className="space-y-2">
                <Label className="text-gray-700 flex items-center gap-2">
                  <Ruler className="w-4 h-4 text-blue-600" />
                  身高
                </Label>
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={userInfo.height}
                      onChange={(e) => handleInputChange("height", e.target.value)}
                      className="flex-1"
                      placeholder="175"
                    />
                    <span className="text-gray-600 text-sm">cm</span>
                  </div>
                ) : (
                  <div className="p-3 bg-white rounded-lg border border-blue-100">
                    <p className="text-2xl font-bold text-gray-800">{userInfo.height}</p>
                    <p className="text-sm text-gray-500">厘米</p>
                  </div>
                )}
              </div>

              {/* Weight */}
              <div className="space-y-2">
                <Label className="text-gray-700 flex items-center gap-2">
                  <Weight className="w-4 h-4 text-cyan-600" />
                  体重
                </Label>
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={userInfo.weight}
                      onChange={(e) => handleInputChange("weight", e.target.value)}
                      className="flex-1"
                      placeholder="70"
                    />
                    <span className="text-gray-600 text-sm">kg</span>
                  </div>
                ) : (
                  <div className="p-3 bg-white rounded-lg border border-blue-100">
                    <p className="text-2xl font-bold text-gray-800">{userInfo.weight}</p>
                    <p className="text-sm text-gray-500">千克</p>
                  </div>
                )}
              </div>

              {/* BMI */}
              <div className="space-y-2">
                <Label className="text-gray-700 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-green-600" />
                  BMI指数
                </Label>
                <div className="p-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                  <p className="text-2xl font-bold text-gray-800">{calculateBMI()}</p>
                  <p className={`text-sm font-medium ${getBMIStatus().color}`}>
                    {getBMIStatus().status}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Training Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {trainingStats.map((stat, index) => (
          <Card key={index} className={`p-6 bg-gradient-to-br ${stat.color} text-white`}>
            <p className="text-white text-opacity-90 text-sm mb-1">{stat.label}</p>
            <p className="text-3xl font-bold">{stat.value}</p>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="achievements" className="space-y-4">
        <TabsList className="grid grid-cols-2 w-full md:w-auto">
          <TabsTrigger value="achievements">成就徽章</TabsTrigger>
          <TabsTrigger value="settings">设置</TabsTrigger>
        </TabsList>

        {/* Achievements Tab */}
        <TabsContent value="achievements">
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
              <Award className="w-6 h-6 text-yellow-500" />
              成就徽章
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    achievement.earned
                      ? "bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300 shadow-md"
                      : "bg-gray-50 border-gray-200 opacity-60"
                  }`}
                >
                  <div className="text-center">
                    <div className="text-5xl mb-3">{achievement.icon}</div>
                    <h4 className="font-semibold text-gray-800 mb-1">{achievement.name}</h4>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                    {achievement.earned && (
                      <Badge className="mt-3 bg-gradient-to-r from-yellow-400 to-orange-400">
                        已获得
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          {/* Notification Settings */}
          

          {/* Privacy Settings */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
              <Shield className="w-6 h-6 text-green-500" />
              隐私与安全
            </h3>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                修改密码
              </Button>
              
              
              <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700" onClick={handleLogout}>
                注销账号
              </Button>
            </div>
          </Card>

          {/* App Settings */}
          

          {/* Logout */}
          <Card className="p-6 border-red-200 bg-red-50">
            <Button 
              onClick={handleLogout}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
            >
              <LogOut className="w-4 h-4 mr-2" />
              退出登录
            </Button>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}