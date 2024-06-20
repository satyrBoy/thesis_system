import { createRouter, createWebHistory } from 'vue-router'
import { useTokenStore } from '@/stores/token'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: { name: 'login' }
    },
    {
      path: '/stu',
      name: 'stuHome',
      meta: {
        requiresAuth: true,
        requiresStu: true
      }, // 定义判断的具体路由
      component: () => import('@/components/layout/HomeLayout.vue'),
      children: [
        {
          path: '/stu/notInPhase',
          name: 'notInPhase',
          component: () => import('@/views/NotInPhase/NotInPhaseView.vue'),
          meta: {
            requiresNoPhase: true
          }
        },
        {
          path: '/stu/chooseMentor',
          name: 'stuChooseMentor',
          component: () => import('@/views/chooseMentor/StuChooseMentorView.vue')
        },
        {
          path: '/stu/proposalDraft',
          name: 'stuProposalDraft',
          component: () => import('@/views/proposalDraft/ProposalDraftView.vue')
        },
        {
          path: '/stu/proposalFormal',
          name: 'stuProposalFormal',
          component: () => import('@/views/proposalFormal/ProposalFormalView.vue')
        },
        {
          path: '/stu/paperDraft',
          name: 'stuPaperDraft',
          component: () => import('@/views/paperDraft/PaperDraftView.vue')
        },
        {
          path: '/stu/paperFormal',
          name: 'stuPaperFormal',
          component: () => import('@/views/paperFormal/PaperFormalView.vue')
        },
        {
          path: '/stu/paperFinal',
          name: 'stuPaperFinal',
          component: () => import('@/views/paperFinal/PaperFinalView.vue')
        }
      ]
    },

    {
      path: '/teach',
      name: 'teachHome',
      meta: {
        requiresAuth: true,
        requiresMentor: true
      },
      component: () => import('@/components/layout/TeachHomeLayout.vue'),
      children: [
        {
          path: '/teach/notInPhase',
          name: 'notInTeachPhase',
          component: () => import('@/views/NotInPhase/NotInPhaseView.vue'),
          meta: {
            requiresNoPhase: true
          }
        },
        {
          path: '/teach/stuList',
          name: 'stuList',
          component: () => import('@/views/stuList/StuListView.vue')
        },
        {
          path: '/teach/:stuId/stuInfo',
          name: 'stuInfo',
          component: () => import('@/views/stuList/StuInfoView.vue')
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/LoginView.vue')
    },
    {
      path: '/admin-login',
      name: 'admin-login',
      component: () => import('@/views/adminLogin/AdminLoginView.vue')
    },
    {
      path: '/admin',
      name: 'admin',
      meta: {
        requiresAuth: true,
        requiresAdmin: true
      },
      children: [
        {
          path: '/admin/',
          name: 'phaseList',
          component: () => import('@/views/adminHome/AdminHomeView.vue')
        },
        {
          path: '/admin/test',
          name: 'test',
          component: () => import('@/views/TestView.vue')
        },
        {
          path: '/admin/addPhase',
          name: 'addPhase',
          meta: {
            requiresEduAdmin: true
          },
          component: () => import('@/views/phasesManage/AddPhaseView.vue')
        },
        {
          path: '/admin/createUser',
          name: 'createUser',
          meta: {
            requiresEduAdmin: true
          },
          component: () => import('@/views/createAccount/CreateUserView.vue')
        },
        {
          path: '/admin/:id/userList',
          name: 'userList',
          component: () => import('@/views/phasesManage/PhaseUsersListView.vue')
        },
        {
          path: '/admin/:id/:phaseid/phaseStuInfo',
          name: 'phaseStuInfo',
          component: () => import('@/views/phasesManage/PhaseStuInfoView.vue')
        },
        {
          path: '/admin/:id/:phaseid/phaseMentorInfo',
          name: 'phaseMentorInfo',
          component: () => import('@/views/phasesManage/PhaseMentorInfoView.vue')
        }
      ],
      component: () => import('@/components/layout/AdminLayout.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  const store = useTokenStore() // 获取存储状态
  const identity = window.localStorage.getItem('identity')
  if (to.matched.some((r) => r.meta.requiresAuth)) {
    if (store.token.token && store.token.token !== '') {
      if (to.matched.some((r) => r.meta.requiresStu)) {
        if (identity === '学生') {
          const phaseid = window.localStorage.getItem('phaseid')
          if (to.meta.requiresNoPhase) {
            if (phaseid === '' || window.localStorage.getItem('process') !== '2') {
              next()
            } else {
              next(false)
            }
          } else {
            if (phaseid !== '' && window.localStorage.getItem('process') === '2') {
              next()
            } else {
              next(false)
            }
          }
        } else {
          next(false)
        }
      }

      if (to.matched.some((r) => r.meta.requiresMentor)) {
        if (identity === '导师') {
          const phaseid = window.localStorage.getItem('phaseid')
          if (to.meta.requiresNoPhase) {
            if (phaseid === '' || window.localStorage.getItem('process') !== '2') {
              next()
            } else {
              next(false)
            }
          } else {
            if (phaseid !== '' && window.localStorage.getItem('process') === '2') {
              next()
            } else {
              next(false)
            }
          }
        } else {
          next(false)
        }
      }

      if (to.matched.some((r) => r.meta.requiresAdmin)) {
        if (identity === '教务' || identity === '领导') {
          if (to.meta.requiresEduAdmin) {
            if (identity === '教务') {
              next()
            } else {
              next(false)
            }
          }
          next()
        } else {
          next(false)
        }
      }

      next()
    } else {
      if (to.matched.some((r) => r.name === 'admin')) {
        next({ name: 'admin-login', query: { redirect: to.fullPath } })
      }

      next({ name: 'login', query: { redirect: to.fullPath } })
    }
  }
  next() // 如果不要求权限，就按原地址跳转
})

export default router
