import { useState } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "../components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Plus, Edit, Trash2, CheckCircle2, Clock, Flame, Target, Sparkles, Dumbbell, X, ChevronRight, Calendar, GripVertical } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import type { Identifier, XYCoord } from 'dnd-core';

interface WorkoutTask {
  id: number;
  name: string;
  type: string;
  duration: string;
  calories: number;
  completed: boolean;
  sets?: number;
  reps?: number;
  rest?: string;
}

interface DailyTraining {
  date: string;
  dayOfWeek: string;
  tasks: WorkoutTask[];
}

interface WeekSchedule {
  weekNumber: number;
  days: DailyTraining[];
}

interface WorkoutPlan {
  id: number;
  name: string;
  description: string;
  type: "AI生成" | "手动创建";
  duration: string;
  difficulty: "初级" | "中级" | "高级";
  startDate?: string; // 计划开始日期
  endDate?: string; // 计划结束日期
  tasks: WorkoutTask[]; // 用于今日任务显示
  weeklySchedule?: WeekSchedule[]; // 每周详细计划
}

// 预设训练项目库
const PRESET_EXERCISES = [
  // 有氧运动
  { name: "跑步", type: "有氧", duration: "20分钟", calories: 200, sets: undefined, reps: undefined, rest: undefined },
  { name: "快走", type: "有氧", duration: "30分钟", calories: 150, sets: undefined, reps: undefined, rest: undefined },
  { name: "跳绳", type: "有氧", duration: "15分钟", calories: 180, sets: undefined, reps: undefined, rest: undefined },
  { name: "骑车", type: "有氧", duration: "25分钟", calories: 170, sets: undefined, reps: undefined, rest: undefined },
  
  // HIIT
  { name: "波比跳", type: "HIIT", duration: "12分钟", calories: 150, sets: 5, reps: 10, rest: "30秒" },
  { name: "开合跳", type: "HIIT", duration: "10分钟", calories: 120, sets: 4, reps: 30, rest: "30秒" },
  { name: "高抬腿", type: "HIIT", duration: "10分钟", calories: 110, sets: 4, reps: 30, rest: "30秒" },
  { name: "登山跑", type: "HIIT", duration: "8分钟", calories: 90, sets: 4, reps: 20, rest: "30秒" },
  
  // 力量训练 - 上肢
  { name: "俯卧撑", type: "胸部", duration: "10分钟", calories: 80, sets: 3, reps: 12, rest: "60秒" },
  { name: "引体向上", type: "背部", duration: "10分钟", calories: 90, sets: 3, reps: 8, rest: "60秒" },
  { name: "哑铃卧推", type: "胸部", duration: "15分钟", calories: 100, sets: 4, reps: 10, rest: "60秒" },
  { name: "哑铃划船", type: "背部", duration: "12分钟", calories: 95, sets: 3, reps: 12, rest: "60秒" },
  { name: "肩上推举", type: "肩部", duration: "12分钟", calories: 85, sets: 3, reps: 10, rest: "60秒" },
  { name: "二头弯举", type: "手臂", duration: "10分钟", calories: 70, sets: 3, reps: 12, rest: "45秒" },
  { name: "三头屈伸", type: "手臂", duration: "10分钟", calories: 70, sets: 3, reps: 12, rest: "45秒" },
  
  // 力量训练 - 下肢
  { name: "深蹲", type: "腿部", duration: "15分钟", calories: 100, sets: 4, reps: 15, rest: "60秒" },
  { name: "箭步蹲", type: "腿部", duration: "12分钟", calories: 90, sets: 3, reps: 12, rest: "60秒" },
  { name: "硬拉", type: "腿部", duration: "15分钟", calories: 110, sets: 4, reps: 10, rest: "90秒" },
  { name: "腿举", type: "腿部", duration: "12分钟", calories: 95, sets: 3, reps: 15, rest: "60秒" },
  
  // 核心训练
  { name: "平板支撑", type: "核心", duration: "8分钟", calories: 60, sets: 3, reps: 60, rest: "45秒" },
  { name: "卷腹", type: "核心", duration: "10分钟", calories: 70, sets: 3, reps: 20, rest: "45秒" },
  { name: "俄罗斯转体", type: "核心", duration: "10分钟", calories: 75, sets: 3, reps: 30, rest: "45秒" },
  { name: "仰卧举腿", type: "核心", duration: "8分钟", calories: 65, sets: 3, reps: 15, rest: "45秒" },
  
  // 拉伸与恢复
  { name: "全身拉伸", type: "拉伸", duration: "10分钟", calories: 30, sets: undefined, reps: undefined, rest: undefined },
  { name: "瑜伽放松", type: "恢复", duration: "15分钟", calories: 40, sets: undefined, reps: undefined, rest: undefined },
  { name: "泡沫轴放松", type: "恢复", duration: "10分钟", calories: 25, sets: undefined, reps: undefined, rest: undefined },
];

export default function WorkoutPlanPage() {
  const [plans, setPlans] = useState<WorkoutPlan[]>([
    {
      id: 1,
      name: "燃脂减肥计划",
      description: "针对减脂目标的综合训练计划",
      type: "AI生成",
      duration: "4周",
      difficulty: "中级",
      startDate: "2026-02-10",
      endDate: "2026-03-10",
      tasks: [
        { id: 1, name: "热身跑步", type: "有氧", duration: "10分钟", calories: 80, completed: true },
        { id: 2, name: "波比跳", type: "HIIT", duration: "15分钟", calories: 150, completed: true, sets: 5, reps: 10, rest: "30秒" },
        { id: 3, name: "平板支撑", type: "核心", duration: "5分钟", calories: 40, completed: false, sets: 3, reps: 60, rest: "45秒" },
        { id: 4, name: "慢跑放松", type: "有氧", duration: "10分钟", calories: 70, completed: false },
      ],
      weeklySchedule: [
        {
          weekNumber: 1,
          days: [
            {
              date: "2.10",
              dayOfWeek: "周一",
              tasks: [
                { id: 101, name: "热身跑步", type: "有氧", duration: "10分钟", calories: 80, completed: true },
                { id: 102, name: "波比跳", type: "HIIT", duration: "15分钟", calories: 150, completed: true, sets: 5, reps: 10, rest: "30秒" },
                { id: 103, name: "慢跑放松", type: "有氧", duration: "10分钟", calories: 70, completed: false },
              ],
            },
            {
              date: "2.12",
              dayOfWeek: "周三",
              tasks: [
                { id: 104, name: "热身跑步", type: "有氧", duration: "10分钟", calories: 80, completed: true },
                { id: 105, name: "平板支撑", type: "核心", duration: "5分钟", calories: 40, completed: false, sets: 3, reps: 60, rest: "45秒" },
                { id: 106, name: "登山跑", type: "核心", duration: "8分钟", calories: 90, completed: false, sets: 4, reps: 20, rest: "30秒" },
              ],
            },
            {
              date: "2.14",
              dayOfWeek: "周五",
              tasks: [
                { id: 107, name: "开合跳", type: "HIIT", duration: "10分钟", calories: 120, completed: false, sets: 4, reps: 30, rest: "30秒" },
                { id: 108, name: "波比跳", type: "HIIT", duration: "12分钟", calories: 150, completed: false, sets: 5, reps: 10, rest: "45秒" },
                { id: 109, name: "拉伸放松", type: "恢复", duration: "10分钟", calories: 30, completed: false },
              ],
            },
          ],
        },
        {
          weekNumber: 2,
          days: [
            {
              date: "2.17",
              dayOfWeek: "周一",
              tasks: [
                { id: 201, name: "热身跑步", type: "有氧", duration: "12分钟", calories: 90, completed: false },
                { id: 202, name: "波比跳", type: "HIIT", duration: "18分钟", calories: 180, completed: false, sets: 6, reps: 10, rest: "30秒" },
                { id: 203, name: "慢跑放松", type: "有氧", duration: "12分钟", calories: 80, completed: false },
              ],
            },
            {
              date: "2.19",
              dayOfWeek: "周三",
              tasks: [
                { id: 204, name: "热身跑步", type: "有氧", duration: "10分钟", calories: 80, completed: false },
                { id: 205, name: "平板支撑", type: "核心", duration: "6分钟", calories: 50, completed: false, sets: 4, reps: 60, rest: "40秒" },
                { id: 206, name: "卷腹", type: "核心", duration: "8分钟", calories: 60, completed: false, sets: 4, reps: 25, rest: "30秒" },
              ],
            },
            {
              date: "2.21",
              dayOfWeek: "周五",
              tasks: [
                { id: 207, name: "跳绳", type: "有氧", duration: "15分钟", calories: 150, completed: false },
                { id: 208, name: "高抬腿", type: "HIIT", duration: "10分钟", calories: 100, completed: false, sets: 5, reps: 30, rest: "30秒" },
                { id: 209, name: "拉伸放松", type: "恢复", duration: "10分钟", calories: 30, completed: false },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 2,
      name: "力量增肌计划",
      description: "专注于肌肉增长的力量训练",
      type: "手动创建",
      duration: "8周",
      difficulty: "高级",
      startDate: "2026-03-01",
      endDate: "2026-04-25",
      tasks: [
        { id: 5, name: "深蹲", type: "腿部", duration: "20分钟", calories: 120, completed: false, sets: 4, reps: 12, rest: "90秒" },
        { id: 6, name: "卧推", type: "胸部", duration: "20分钟", calories: 110, completed: false, sets: 4, reps: 10, rest: "90秒" },
        { id: 7, name: "硬拉", type: "背部", duration: "20分钟", calories: 130, completed: false, sets: 3, reps: 8, rest: "120秒" },
      ],
      weeklySchedule: [
        {
          weekNumber: 1,
          days: [
            {
              date: "3.1",
              dayOfWeek: "周六",
              tasks: [
                { id: 301, name: "杠铃深蹲", type: "腿部", duration: "25分钟", calories: 140, completed: false, sets: 4, reps: 10, rest: "90秒" },
                { id: 302, name: "腿举", type: "腿部", duration: "20分钟", calories: 100, completed: true, sets: 3, reps: 12, rest: "60秒" },
                { id: 303, name: "腿弯举", type: "腿部", duration: "15分钟", calories: 80, completed: false, sets: 3, reps: 15, rest: "60秒" },
              ],
            },
            {
              date: "3.3",
              dayOfWeek: "周一",
              tasks: [
                { id: 304, name: "卧推", type: "胸部", duration: "20分钟", calories: 120, completed: true, sets: 4, reps: 8, rest: "90秒" },
                { id: 305, name: "上斜卧推", type: "胸部", duration: "18分钟", calories: 110, completed: false, sets: 3, reps: 10, rest: "90秒" },
                { id: 306, name: "哑铃飞鸟", type: "胸部", duration: "15分钟", calories: 90, completed: false, sets: 3, reps: 12, rest: "60秒" },
              ],
            },
            {
              date: "3.5",
              dayOfWeek: "周三",
              tasks: [
                { id: 307, name: "硬拉", type: "背部", duration: "25分钟", calories: 150, completed: false, sets: 3, reps: 8, rest: "120秒" },
                { id: 308, name: "引体向上", type: "背部", duration: "15分钟", calories: 100, completed: false, sets: 4, reps: 8, rest: "90秒" },
                { id: 309, name: "杠铃划船", type: "背部", duration: "20分钟", calories: 120, completed: true, sets: 4, reps: 10, rest: "90秒" },
              ],
            },
          ],
        },
      ],
    },
  ]);

  const [selectedPlan, setSelectedPlan] = useState<WorkoutPlan | null>(null);
  const [showPlanDetail, setShowPlanDetail] = useState(false);
  
  // AI Generation Dialog State
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [aiStep, setAiStep] = useState(1);
  const [aiFormData, setAiFormData] = useState({
    goal: "",
    level: "",
    daysPerWeek: "",
    timePerDay: "",
    focus: "",
    startDate: "",
    endDate: "",
    additionalRequirements: "", // 额外要求
    trainingDays: [] as string[], // 具体训练日期
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<WorkoutPlan | null>(null);

  // Manual Creation Dialog State
  const [showManualDialog, setShowManualDialog] = useState(false);
  const [manualFormData, setManualFormData] = useState({
    name: "",
    description: "",
    duration: "",
    difficulty: "中级" as "初级" | "中级" | "高级",
    startDate: "",
    endDate: "",
    trainingDays: [] as string[], // 训练日期
  });
  const [manualTasks, setManualTasks] = useState<WorkoutTask[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("全部"); // 预设项目分类过滤
  const [newTask, setNewTask] = useState({
    name: "",
    type: "",
    duration: "",
    calories: "",
    sets: "",
    reps: "",
    rest: "",
  });

  const toggleTaskComplete = (planId: number, taskId: number) => {
    setPlans(
      plans.map((plan) =>
        plan.id === planId
          ? {
              ...plan,
              tasks: plan.tasks.map((task) =>
                task.id === taskId ? { ...task, completed: !task.completed } : task
              ),
            }
          : plan
      )
    );
  };

  const getTodayStats = () => {
    const todayTasks = plans.flatMap((p) => p.tasks);
    const completedTasks = todayTasks.filter((t) => t.completed);
    const totalCalories = completedTasks.reduce((sum, t) => sum + t.calories, 0);
    const totalDuration = completedTasks.reduce((sum, t) => {
      const mins = parseInt(t.duration);
      return sum + (isNaN(mins) ? 0 : mins);
    }, 0);

    return { completedTasks: completedTasks.length, totalTasks: todayTasks.length, totalCalories, totalDuration };
  };

  const stats = getTodayStats();

  const difficultyColors = {
    初级: "bg-green-100 text-green-700",
    中级: "bg-yellow-100 text-yellow-700",
    高级: "bg-red-100 text-red-700",
  };

  // AI Generation Functions
  const handleAIGenerate = () => {
    setIsGenerating(true);
    
    // Simulate AI generation
    setTimeout(() => {
      const goalTemplates: Record<string, any> = {
        "减脂": {
          name: "AI智能减脂计划",
          description: "基于你的目标定制的科学减脂方案",
          tasks: [
            { id: Date.now() + 1, name: "热身慢跑", type: "有氧", duration: "10分钟", calories: 80, completed: false },
            { id: Date.now() + 2, name: "开合跳", type: "HIIT", duration: "10分钟", calories: 120, completed: false, sets: 4, reps: 30, rest: "30秒" },
            { id: Date.now() + 3, name: "波比跳", type: "HIIT", duration: "12分钟", calories: 150, completed: false, sets: 5, reps: 10, rest: "45秒" },
            { id: Date.now() + 4, name: "登山跑", type: "核心", duration: "8分钟", calories: 90, completed: false, sets: 4, reps: 20, rest: "30秒" },
            { id: Date.now() + 5, name: "拉伸放松", type: "恢复", duration: "10分钟", calories: 30, completed: false },
          ],
        },
        "增肌": {
          name: "AI智能增肌计划",
          description: "基于你的体能水平设计的力量训练方案",
          tasks: [
            { id: Date.now() + 1, name: "动态拉伸", type: "热身", duration: "5分钟", calories: 30, completed: false },
            { id: Date.now() + 2, name: "杠铃深蹲", type: "腿部", duration: "20分钟", calories: 140, completed: false, sets: 4, reps: 10, rest: "90秒" },
            { id: Date.now() + 3, name: "卧推", type: "胸部", duration: "20分钟", calories: 120, completed: false, sets: 4, reps: 8, rest: "90秒" },
            { id: Date.now() + 4, name: "引体向上", type: "背部", duration: "15分钟", calories: 100, completed: false, sets: 4, reps: 8, rest: "60秒" },
            { id: Date.now() + 5, name: "肩推", type: "肩部", duration: "15分钟", calories: 90, completed: false, sets: 3, reps: 12, rest: "60秒" },
          ],
        },
        "塑形": {
          name: "AI智能塑形计划",
          description: "结合力量和有氧的综合塑形方案",
          tasks: [
            { id: Date.now() + 1, name: "热身运动", type: "热身", duration: "5分钟", calories: 40, completed: false },
            { id: Date.now() + 2, name: "深蹲", type: "腿部", duration: "15分钟", calories: 100, completed: false, sets: 3, reps: 15, rest: "60秒" },
            { id: Date.now() + 3, name: "俯卧撑", type: "胸部", duration: "10分钟", calories: 80, completed: false, sets: 3, reps: 12, rest: "45秒" },
            { id: Date.now() + 4, name: "平板支撑", type: "核心", duration: "8分钟", calories: 60, completed: false, sets: 3, reps: 45, rest: "30秒" },
            { id: Date.now() + 5, name: "跳绳", type: "有氧", duration: "12分钟", calories: 130, completed: false },
          ],
        },
      };

      const template = goalTemplates[aiFormData.goal] || goalTemplates["减脂"];
      const difficultyMap: Record<string, "初级" | "中级" | "高级"> = {
        "初学者": "初级",
        "有基础": "中级",
        "健身达人": "高级",
      };

      const newPlan: WorkoutPlan = {
        id: Date.now(),
        ...template,
        type: "AI生成",
        duration: `${aiFormData.daysPerWeek}周`,
        difficulty: difficultyMap[aiFormData.level] || "中级",
        startDate: aiFormData.startDate,
        endDate: aiFormData.endDate,
      };

      setGeneratedPlan(newPlan);
      setIsGenerating(false);
      setAiStep(3);
    }, 2000);
  };

  const saveAIPlan = () => {
    if (generatedPlan) {
      setPlans([generatedPlan, ...plans]);
      resetAIDialog();
      setShowAIDialog(false);
    }
  };

  const resetAIDialog = () => {
    setAiStep(1);
    setAiFormData({
      goal: "",
      level: "",
      daysPerWeek: "",
      timePerDay: "",
      focus: "",
      startDate: "",
      endDate: "",
      additionalRequirements: "",
      trainingDays: [],
    });
    setGeneratedPlan(null);
  };

  // Manual Creation Functions
  const addPresetExercise = (exercise: typeof PRESET_EXERCISES[0]) => {
    const task: WorkoutTask = {
      id: Date.now() + Math.random(), // 确保唯一
      name: exercise.name,
      type: exercise.type,
      duration: exercise.duration,
      calories: exercise.calories,
      completed: false,
      sets: exercise.sets,
      reps: exercise.reps,
      rest: exercise.rest,
    };
    setManualTasks([...manualTasks, task]);
  };

  const addManualTask = () => {
    if (!newTask.name || !newTask.type) return;

    const task: WorkoutTask = {
      id: Date.now(),
      name: newTask.name,
      type: newTask.type,
      duration: newTask.duration || "0分钟",
      calories: parseInt(newTask.calories) || 0,
      completed: false,
      sets: newTask.sets ? parseInt(newTask.sets) : undefined,
      reps: newTask.reps ? parseInt(newTask.reps) : undefined,
      rest: newTask.rest || undefined,
    };

    setManualTasks([...manualTasks, task]);
    setNewTask({
      name: "",
      type: "",
      duration: "",
      calories: "",
      sets: "",
      reps: "",
      rest: "",
    });
  };

  const removeManualTask = (taskId: number) => {
    setManualTasks(manualTasks.filter((t) => t.id !== taskId));
  };

  const saveManualPlan = () => {
    if (!manualFormData.name || manualTasks.length === 0 || !manualFormData.startDate || !manualFormData.endDate) return;

    const newPlan: WorkoutPlan = {
      id: Date.now(),
      name: manualFormData.name,
      description: manualFormData.description || "自定义训练计划",
      type: "手动创建",
      duration: manualFormData.duration || "自定义",
      difficulty: manualFormData.difficulty,
      startDate: manualFormData.startDate,
      endDate: manualFormData.endDate,
      tasks: manualTasks,
    };

    setPlans([newPlan, ...plans]);
    resetManualDialog();
    setShowManualDialog(false);
  };

  const resetManualDialog = () => {
    setManualFormData({
      name: "",
      description: "",
      duration: "",
      difficulty: "中级",
      startDate: "",
      endDate: "",
      trainingDays: [],
    });
    setManualTasks([]);
    setSelectedCategory("全部");
  };

  const deletePlan = (planId: number) => {
    setPlans(plans.filter((p) => p.id !== planId));
  };

  const openPlanDetail = (plan: WorkoutPlan) => {
    setSelectedPlan(plan);
    setShowPlanDetail(true);
  };

  // 判断计划是否已结束
  const isPlanEnded = (plan: WorkoutPlan): boolean => {
    if (!plan.endDate) return false;
    const today = new Date("2026-03-12"); // 使用当前日期
    const endDate = new Date(plan.endDate);
    return today > endDate;
  };

  // 计算计划总体完成情况
  const getPlanProgress = (plan: WorkoutPlan): { completed: number; total: number; percentage: number } => {
    if (!plan.weeklySchedule || plan.weeklySchedule.length === 0) {
      const total = plan.tasks.length;
      const completed = plan.tasks.filter(t => t.completed).length;
      return { completed, total, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
    }

    let total = 0;
    let completed = 0;
    plan.weeklySchedule.forEach(week => {
      week.days.forEach(day => {
        total += day.tasks.length;
        completed += day.tasks.filter(t => t.completed).length;
      });
    });

    return { completed, total, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
  };

  // 获取排序后的计划列表（已结束的放最后）
  const getSortedPlans = () => {
    const activePlans = plans.filter(p => !isPlanEnded(p));
    const endedPlans = plans.filter(p => isPlanEnded(p));
    return [...activePlans, ...endedPlans];
  };

  // Drag and Drop Functions
  const useTaskDrag = (task: WorkoutTask) => {
    const [{ isDragging }, drag] = useDrag({
      type: 'TASK',
      item: task,
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });
    return { isDragging, drag };
  };

  const useTaskDrop = (index: number) => {
    const [{ isOver }, drop] = useDrop({
      accept: 'TASK',
      drop: (item: WorkoutTask) => moveTask(index, item),
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    });
    return { isOver, drop };
  };

  const moveTask = (index: number, task: WorkoutTask) => {
    const currentPlan = selectedPlan;
    if (!currentPlan) return;

    const updatedPlan = {
      ...currentPlan,
      weeklySchedule: currentPlan.weeklySchedule?.map(week =>
        week.days.map(day =>
          day.tasks.map((t, idx) => {
            if (t.id === task.id) {
              const removedTask = day.tasks.splice(idx, 1)[0];
              day.tasks.splice(index, 0, removedTask);
            }
            return t;
          })
        )
      ),
    };

    setSelectedPlan(updatedPlan);
    setPlans(plans.map(p => (p.id === updatedPlan.id ? updatedPlan : p)));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">训练计划</h1>
          <p className="text-gray-600 mt-1">管理你的健身训练计划</p>
        </div>
        <div className="flex gap-3">
          {/* AI Generation Dialog */}
          <Dialog open={showAIDialog} onOpenChange={(open) => { setShowAIDialog(open); if (!open) resetAIDialog(); }}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 shadow-md">
                <Sparkles className="w-5 h-5 mr-2" />
                AI生成计划
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-blue-600" />
                  AI智能生成训练计划
                </DialogTitle>
                <DialogDescription className="text-gray-500">
                  填写你的健身目标和体能水平，AI将为你生成一个专属的训练计划。
                </DialogDescription>
              </DialogHeader>

              {/* Step 1: Basic Info */}
              {aiStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6 py-4"
                >
                  <div>
                    <Label className="text-base font-semibold mb-3 block">你的健身目标是什么？</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {["减脂", "增肌", "塑形"].map((goal) => (
                        <button
                          key={goal}
                          onClick={() => setAiFormData({ ...aiFormData, goal })}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            aiFormData.goal === goal
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-blue-300"
                          }`}
                        >
                          <div className="text-3xl mb-2">
                            {goal === "减脂" ? "🔥" : goal === "增肌" ? "💪" : "⭐"}
                          </div>
                          <div className="font-medium">{goal}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-base font-semibold mb-3 block">你的健身水平？</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {["初学者", "有基础", "健身达人"].map((level) => (
                        <button
                          key={level}
                          onClick={() => setAiFormData({ ...aiFormData, level })}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            aiFormData.level === level
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-blue-300"
                          }`}
                        >
                          <div className="font-medium">{level}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-base font-semibold mb-3 block">每周训练哪几天？</Label>
                    <div className="grid grid-cols-7 gap-2">
                      {["周一", "周二", "周三", "周四", "周五", "周六", "周日"].map((day) => (
                        <button
                          key={day}
                          type="button"
                          onClick={() => {
                            const isSelected = aiFormData.trainingDays.includes(day);
                            setAiFormData({
                              ...aiFormData,
                              trainingDays: isSelected
                                ? aiFormData.trainingDays.filter(d => d !== day)
                                : [...aiFormData.trainingDays, day]
                            });
                          }}
                          className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                            aiFormData.trainingDays.includes(day)
                              ? "border-blue-500 bg-blue-50 text-blue-700"
                              : "border-gray-200 hover:border-blue-300"
                          }`}
                        >
                          {day.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>每次训练时长（分钟）</Label>
                      <Input
                        type="number"
                        placeholder="例如：45"
                        value={aiFormData.timePerDay}
                        onChange={(e) => setAiFormData({ ...aiFormData, timePerDay: e.target.value })}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label>每周训练天数</Label>
                      <Input
                        type="text"
                        value={aiFormData.trainingDays.length > 0 ? `${aiFormData.trainingDays.length}天` : ""}
                        disabled
                        placeholder="选择训练日期后自动填充"
                        className="mt-2 bg-gray-50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>计划开始日期 *</Label>
                      <Input
                        type="date"
                        value={aiFormData.startDate || ''}
                        onChange={(e) => setAiFormData({ ...aiFormData, startDate: e.target.value })}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label>计划结束日期 *</Label>
                      <Input
                        type="date"
                        value={aiFormData.endDate || ''}
                        onChange={(e) => setAiFormData({ ...aiFormData, endDate: e.target.value })}
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-base font-semibold mb-2 block">额外要求（可选）</Label>
                    <textarea
                      placeholder="例如：希望加强核心训练、避免膝盖压力大的动作、需要在家就能完成..."
                      value={aiFormData.additionalRequirements}
                      onChange={(e) => setAiFormData({ ...aiFormData, additionalRequirements: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg min-h-[80px] resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <Button
                    onClick={() => setAiStep(2)}
                    disabled={!aiFormData.goal || !aiFormData.level || !aiFormData.startDate || !aiFormData.endDate}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                  >
                    下一步
                  </Button>
                </motion.div>
              )}

              {/* Step 2: Generating */}
              {aiStep === 2 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-12"
                  onAnimationComplete={() => handleAIGenerate()}
                >
                  <div className="flex flex-col items-center gap-6">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                      className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center"
                    >
                      <Sparkles className="w-10 h-10 text-white" />
                    </motion.div>
                    <div className="text-center">
                      <h3 className="text-xl font-semibold mb-2">AI正在为你生成专属计划...</h3>
                      <p className="text-gray-600">分析你的目标和体能水平</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Show Generated Plan */}
              {aiStep === 3 && generatedPlan && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6 py-4"
                >
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{generatedPlan.name}</h3>
                        <p className="text-gray-600 mt-1">{generatedPlan.description}</p>
                      </div>
                      <Badge className={difficultyColors[generatedPlan.difficulty]}>
                        {generatedPlan.difficulty}
                      </Badge>
                    </div>
                    <div className="flex gap-4 text-sm text-gray-600 flex-wrap">
                      <span>📅 {generatedPlan.duration}</span>
                      <span>💪 {generatedPlan.tasks.length} 个训练动作</span>
                      {aiFormData.trainingDays.length > 0 && (
                        <span>🗓️ {aiFormData.trainingDays.join("、")}</span>
                      )}
                    </div>
                    {aiFormData.additionalRequirements && (
                      <div className="mt-3 p-3 bg-white rounded-lg border text-sm">
                        <p className="text-gray-500 mb-1">额外要求：</p>
                        <p className="text-gray-700">{aiFormData.additionalRequirements}</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">训练内容</h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {generatedPlan.tasks.map((task, index) => (
                        <div
                          key={task.id}
                          className="flex items-center gap-3 p-3 bg-white rounded-lg border"
                        >
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{task.name}</p>
                            <div className="flex gap-3 text-xs text-gray-600 mt-1">
                              <span>🏷️ {task.type}</span>
                              <span>⏱️ {task.duration}</span>
                              {task.sets && <span>💪 {task.sets}组×{task.reps}次</span>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setAiStep(1)}
                      className="flex-1"
                    >
                      重新生成
                    </Button>
                    <Button
                      onClick={saveAIPlan}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                    >
                      保存计划
                    </Button>
                  </div>
                </motion.div>
              )}
            </DialogContent>
          </Dialog>

          {/* Manual Creation Dialog */}
          <Dialog open={showManualDialog} onOpenChange={(open) => { setShowManualDialog(open); if (!open) resetManualDialog(); }}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="w-5 h-5 mr-2" />
                手动创建
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Dumbbell className="w-6 h-6 text-blue-600" />
                  手动创建训练计划
                </DialogTitle>
                <DialogDescription className="text-gray-500">
                  填写计划的基本信息，并添加训练动作。
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* Plan Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label>计划名称 *</Label>
                    <Input
                      placeholder="例如：周一胸部训练"
                      value={manualFormData.name}
                      onChange={(e) => setManualFormData({ ...manualFormData, name: e.target.value })}
                      className="mt-2"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>计划描述</Label>
                    <Input
                      placeholder="简单描述这个训练计划"
                      value={manualFormData.description}
                      onChange={(e) => setManualFormData({ ...manualFormData, description: e.target.value })}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>计划周期</Label>
                    <Input
                      placeholder="例如：4周"
                      value={manualFormData.duration}
                      onChange={(e) => setManualFormData({ ...manualFormData, duration: e.target.value })}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>难度等级</Label>
                    <select
                      value={manualFormData.difficulty}
                      onChange={(e) => setManualFormData({ ...manualFormData, difficulty: e.target.value as any })}
                      className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="初级">初级</option>
                      <option value="中级">中级</option>
                      <option value="高级">高级</option>
                    </select>
                  </div>
                  <div>
                    <Label>开始日期 *</Label>
                    <Input
                      type="date"
                      value={manualFormData.startDate || ''}
                      onChange={(e) => setManualFormData({ ...manualFormData, startDate: e.target.value })}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>结束日期 *</Label>
                    <Input
                      type="date"
                      value={manualFormData.endDate || ''}
                      onChange={(e) => setManualFormData({ ...manualFormData, endDate: e.target.value })}
                      className="mt-2"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label className="text-base font-semibold mb-3 block">每周训练哪几天？</Label>
                    <div className="grid grid-cols-7 gap-2">
                      {["周一", "周二", "周三", "周四", "周五", "周六", "周日"].map((day) => (
                        <button
                          key={day}
                          type="button"
                          onClick={() => {
                            const isSelected = manualFormData.trainingDays.includes(day);
                            setManualFormData({
                              ...manualFormData,
                              trainingDays: isSelected
                                ? manualFormData.trainingDays.filter(d => d !== day)
                                : [...manualFormData.trainingDays, day]
                            });
                          }}
                          className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                            manualFormData.trainingDays.includes(day)
                              ? "border-blue-500 bg-blue-50 text-blue-700"
                              : "border-gray-200 hover:border-blue-300"
                          }`}
                        >
                          {day.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Task List */}
                <div>
                  <Label className="text-base font-semibold">训练动作列表</Label>
                  {manualTasks.length > 0 && (
                    <div className="space-y-2 mt-3 max-h-48 overflow-y-auto">
                      {manualTasks.map((task, index) => (
                        <div
                          key={task.id}
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-sm">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{task.name}</p>
                            <div className="flex gap-3 text-xs text-gray-600 mt-1">
                              <span>{task.type}</span>
                              <span>{task.duration}</span>
                              {task.sets && <span>{task.sets}组×{task.reps}次</span>}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeManualTask(task.id)}
                          >
                            <X className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Add Task Form - Preset Exercises */}
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-semibold">从训练库选择动作</Label>
                  </div>
                  
                  {/* Category Filter */}
                  <div className="flex gap-2 flex-wrap">
                    {["全部", "有氧", "HIIT", "胸部", "背部", "肩部", "手臂", "腿部", "核心", "拉伸", "恢复"].map((category) => (
                      <button
                        key={category}
                        type="button"
                        onClick={() => setSelectedCategory(category)}
                        className={`px-3 py-1 rounded-full text-sm transition-all ${
                          selectedCategory === category
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>

                  {/* Exercise List */}
                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {PRESET_EXERCISES
                      .filter(ex => selectedCategory === "全部" || ex.type === selectedCategory)
                      .map((exercise, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 bg-white rounded-lg border hover:border-blue-300 transition-all"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-sm">{exercise.name}</p>
                            <div className="flex gap-3 text-xs text-gray-600 mt-1">
                              <span>🏷️ {exercise.type}</span>
                              <span>⏱️ {exercise.duration}</span>
                              <span>🔥 {exercise.calories}卡</span>
                              {exercise.sets && <span>💪 {exercise.sets}组×{exercise.reps}次</span>}
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addPresetExercise(exercise)}
                            className="ml-2"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setShowManualDialog(false)}
                    className="flex-1"
                  >
                    取消
                  </Button>
                  <Button
                    onClick={saveManualPlan}
                    disabled={!manualFormData.name || manualTasks.length === 0 || !manualFormData.startDate || !manualFormData.endDate}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                  >
                    保存计划
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Today Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">已完成任务</p>
              <p className="text-3xl font-bold mt-1">
                {stats.completedTasks}/{stats.totalTasks}
              </p>
            </div>
            <CheckCircle2 className="w-12 h-12 text-blue-200" />
          </div>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-cyan-500 to-cyan-600 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-cyan-100 text-sm">训练时长</p>
              <p className="text-3xl font-bold mt-1">{stats.totalDuration}分钟</p>
            </div>
            <Clock className="w-12 h-12 text-cyan-200" />
          </div>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">消耗卡路里</p>
              <p className="text-3xl font-bold mt-1">{stats.totalCalories}</p>
            </div>
            <Flame className="w-12 h-12 text-blue-200" />
          </div>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-blue-400 to-blue-500 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">训练计划</p>
              <p className="text-3xl font-bold mt-1">{plans.length}</p>
            </div>
            <Target className="w-12 h-12 text-blue-200" />
          </div>
        </Card>
      </div>

      {/* Plans List */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">全部计划</TabsTrigger>
          <TabsTrigger value="today">今日任务</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <AnimatePresence>
            {getSortedPlans().map((plan) => {
              const isEnded = isPlanEnded(plan);
              const progress = getPlanProgress(plan);
              
              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                >
                  <Card 
                    className={`p-6 hover:shadow-lg transition-all cursor-pointer group ${
                      isEnded ? 'bg-gray-50 opacity-75' : ''
                    }`}
                    onClick={() => openPlanDetail(plan)}
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h3 className={`text-xl font-semibold transition-colors ${
                            isEnded ? 'text-gray-500' : 'group-hover:text-blue-600'
                          }`}>
                            {plan.name}
                          </h3>
                          <Badge
                            variant="outline"
                            className={`${
                              plan.type === "AI生成"
                                ? "bg-blue-100 text-blue-700 border-blue-300"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {plan.type === "AI生成" && <Sparkles className="w-3 h-3 mr-1" />}
                            {plan.type}
                          </Badge>
                          <Badge className={difficultyColors[plan.difficulty]}>
                            {plan.difficulty}
                          </Badge>
                          {isEnded && (
                            <Badge className="bg-gray-500 text-white">
                              已结束
                            </Badge>
                          )}
                        </div>
                        <p className={`mb-3 ${
                          isEnded ? 'text-gray-500' : 'text-gray-600'
                        }`}>{plan.description}</p>
                        <div className="flex gap-4 text-sm flex-wrap mb-2">
                          {plan.weeklySchedule && plan.weeklySchedule.length > 0 ? (
                            <>
                              <span className={isEnded ? 'text-gray-400' : 'text-gray-500'}>
                                📅 {plan.weeklySchedule.length}周计划
                              </span>
                              <span className={isEnded ? 'text-gray-400' : 'text-gray-500'}>
                                📆 {plan.weeklySchedule[0].days[0].date}-
                                {plan.weeklySchedule[plan.weeklySchedule.length - 1].days[
                                  plan.weeklySchedule[plan.weeklySchedule.length - 1].days.length - 1
                                ].date}
                              </span>
                              <span className={isEnded ? 'text-gray-400' : 'text-gray-500'}>
                                💪 {plan.weeklySchedule.reduce((total, week) => 
                                  total + week.days.reduce((sum, day) => sum + day.tasks.length, 0), 0
                                )}次训练
                              </span>
                              <span className={isEnded ? 'text-gray-400' : 'text-gray-500'}>
                                🔥 {plan.weeklySchedule.reduce((total, week) => 
                                  total + week.days.reduce((sum, day) => 
                                    sum + day.tasks.reduce((cal, task) => cal + task.calories, 0), 0
                                  ), 0
                                )}卡路里
                              </span>
                            </>
                          ) : (
                            <>
                              <span className={isEnded ? 'text-gray-400' : 'text-gray-500'}>📅 {plan.duration}</span>
                              <span className={isEnded ? 'text-gray-400' : 'text-gray-500'}>💪 {plan.tasks.length}次训练</span>
                              <span className={isEnded ? 'text-gray-400' : 'text-gray-500'}>🔥 {plan.tasks.reduce((sum, t) => sum + t.calories, 0)}卡路里</span>
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all ${
                                isEnded ? 'bg-gray-400' : 'bg-green-500'
                              }`}
                              style={{ width: `${progress.percentage}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-600">
                            {progress.completed}/{progress.total}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            deletePlan(plan.id);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        <ChevronRight className={`w-5 h-5 transition-all ${
                          isEnded ? 'text-gray-400' : 'text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1'
                        }`} />
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {plans.length === 0 && (
            <Card className="p-12 text-center">
              <div className="text-6xl mb-4">🏋️</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">还没有训练计划</h3>
              <p className="text-gray-600 mb-6">开始创建你的第一个训练计划吧！</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="today" className="space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">今日训练任务</h3>
            <div className="space-y-3">
              {plans
                .filter(plan => !isPlanEnded(plan))
                .flatMap((plan) =>
                  plan.tasks.map((task) => (
                    <div
                      key={task.id}
                      className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                        task.completed ? "bg-green-50 border-green-200" : "bg-white border-gray-200"
                      }`}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <button
                          onClick={() => toggleTaskComplete(plan.id, task.id)}
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                            task.completed ? "bg-green-500 border-green-500" : "border-gray-300 hover:border-blue-500"
                          }`}
                        >
                          {task.completed && <CheckCircle2 className="w-5 h-5 text-white" />}
                        </button>
                        <div className="flex-1">
                          <p className={`font-medium ${task.completed ? "line-through text-gray-500" : ""}`}>
                            {task.name}
                          </p>
                          <div className="flex gap-3 text-sm text-gray-500 mt-1 flex-wrap">
                            <span>⏱️ {task.duration}</span>
                            <span>🔥 {task.calories} 卡路里</span>
                            {task.sets && task.reps && (
                              <span>💪 {task.sets}组×{task.reps}次</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <Badge>{task.type}</Badge>
                    </div>
                  ))
                )}
              {plans.filter(p => !isPlanEnded(p)).flatMap((p) => p.tasks).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>今天还没有训练任务</p>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Plan Detail Dialog */}
      <Dialog open={showPlanDetail} onOpenChange={setShowPlanDetail}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="w-6 h-6 text-blue-600" />
              {selectedPlan?.name}
            </DialogTitle>
            <DialogDescription className="text-gray-500">
              查看完整的训练计划详情
            </DialogDescription>
          </DialogHeader>

          {selectedPlan && (() => {
            const isEnded = isPlanEnded(selectedPlan);
            const progress = getPlanProgress(selectedPlan);
            
            return (
              <div className="space-y-6 py-4">
                {/* Plan Info */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{selectedPlan.name}</h3>
                      <p className="text-gray-600 mt-1">{selectedPlan.description}</p>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <Badge className={difficultyColors[selectedPlan.difficulty]}>
                        {selectedPlan.difficulty}
                      </Badge>
                      <Badge variant="outline" className={selectedPlan.type === "AI生成" ? "bg-blue-100 text-blue-700 border-blue-300" : ""}>
                        {selectedPlan.type === "AI生成" && <Sparkles className="w-3 h-3 mr-1" />}
                        {selectedPlan.type}
                      </Badge>
                      {isEnded && (
                        <Badge className="bg-gray-500 text-white">
                          已结束
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-4 text-sm text-gray-600 mb-3">
                    <span>📅 时长：{selectedPlan.duration}</span>
                    <span>💪 动作数：{selectedPlan.tasks.length}</span>
                    <span>🔥 卡路里：{selectedPlan.tasks.reduce((sum, t) => sum + t.calories, 0)}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">完成进度</span>
                      <span className="font-semibold text-gray-800">{progress.percentage}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 h-2.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all ${
                            isEnded ? 'bg-gray-400' : 'bg-green-500'
                          }`}
                          style={{ width: `${progress.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-600">
                        {progress.completed}/{progress.total}
                      </span>
                    </div>
                  </div>
                </div>

              {/* Weekly Schedule */}
              {selectedPlan.weeklySchedule && selectedPlan.weeklySchedule.length > 0 ? (
                <div className="space-y-6">
                  {selectedPlan.weeklySchedule.map((week) => (
                    <div key={week.weekNumber} className="space-y-3">
                      <h4 className="font-semibold text-lg flex items-center gap-2 text-gray-800">
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm">
                          {week.weekNumber}
                        </div>
                        第 {week.weekNumber} 周
                      </h4>
                      
                      {/* Days as Tabs */}
                      <Tabs defaultValue={`day-0`} className="space-y-4">
                        <TabsList className="w-full flex-wrap justify-start h-auto">
                          {week.days.map((day, dayIndex) => (
                            <TabsTrigger 
                              key={dayIndex} 
                              value={`day-${dayIndex}`}
                              className="flex-1 min-w-fit"
                            >
                              {day.date} {day.dayOfWeek}
                            </TabsTrigger>
                          ))}
                        </TabsList>

                        {week.days.map((day, dayIndex) => (
                          <TabsContent key={dayIndex} value={`day-${dayIndex}`}>
                            <Card className="p-5 bg-white shadow-md">
                              <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                                <span className="flex items-center gap-1">
                                  <Dumbbell className="w-4 h-4" />
                                  {day.tasks.length} 个动作
                                </span>
                                <span className="text-gray-300">·</span>
                                <span className="flex items-center gap-1">
                                  <Flame className="w-4 h-4" />
                                  {day.tasks.reduce((sum, t) => sum + t.calories, 0)} 卡路里
                                </span>
                              </div>
                              <div className="space-y-2">
                                {day.tasks.map((task, taskIndex) => (
                                  <div
                                    key={task.id}
                                    className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                                  >
                                    <div
                                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                                        task.completed ? "bg-green-500 border-green-500" : "border-gray-300"
                                      }`}
                                    >
                                      {task.completed && <CheckCircle2 className="w-5 h-5 text-white" />}
                                    </div>
                                    <div className="flex-1">
                                      <p className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>{task.name}</p>
                                      <div className="flex gap-3 text-xs text-gray-600 mt-1.5 flex-wrap">
                                        <span className="bg-white px-2 py-0.5 rounded">🏷️ {task.type}</span>
                                        <span className="bg-white px-2 py-0.5 rounded">⏱️ {task.duration}</span>
                                        <span className="bg-white px-2 py-0.5 rounded">🔥 {task.calories} 卡路里</span>
                                        {task.sets && task.reps && (
                                          <span className="bg-white px-2 py-0.5 rounded">
                                            💪 {task.sets}组×{task.reps}次
                                          </span>
                                        )}
                                        {task.rest && (
                                          <span className="bg-white px-2 py-0.5 rounded">⏸️ 休息{task.rest}</span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </Card>
                          </TabsContent>
                        ))}
                      </Tabs>
                    </div>
                  ))}
                </div>
              ) : (
                <Card className="p-8 text-center">
                  <div className="text-gray-400 mb-2">📋</div>
                  <p className="text-gray-600">该计划暂无详细的每周日程安排</p>
                  <p className="text-sm text-gray-500 mt-1">请在今日任务中查看和完成训练</p>
                </Card>
              )}
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}