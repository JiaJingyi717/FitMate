<script setup>
import { login,register } from '../api/auth'      
import { getPlanOverview,getPlanList,createPlan,getPlanDetail,deletePlan,generateAiPlan} from '../api/plan'   // 改成你的函数名

// 挂到全局
window.loginApi = login
window.registerApi = register
window.getPlanOverviewApi = getPlanOverview
window.getPlanListApi = getPlanList
window.createPlanApi = createPlan
window.getPlanDetailApi = getPlanDetail
window.deletePlanApi = deletePlan
window.generateAiPlanApi = generateAiPlan
</script>

<template>
  <div>API测试页面</div>
</template>