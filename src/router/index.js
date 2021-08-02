import Vue from 'vue'
import Router from 'vue-router'
import home from '../components/home'
import loginPage from '../components/login'
import index from '../components/index'
import userInfoQuery from '../components/basic/userInfoQuery'
import noticeInfoQuery from '../components/notice/noticeInfoQuery'
import adminOrderSt from '../components/order/adminOrderSt'
import riskInfoQuery from '../components/notice/riskInfoQuery'

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      name: 'login',
      component: loginPage,
      meta: {
        title: 'login'
      },
    },
    {
      path: '/index',
      component: index,
      children: [{
          path: '/',
          component: home,
          meta: {
            title: '',
            requireAuth: true
          }
        },
        {
          path: '/baseSet',
          component: () => import('@/components/basic/baseSet'),
          meta: {
            title: '基本信息', //商户、代理.
            requireAuth: true
          }
        }, {
          path: '/home',
          component: home,
          meta: {
            title: '',
            requireAuth: true
          }
        }, {
          path: '/userInfoQuery',
          component: userInfoQuery, //管理员.
          meta: {
            title: '商户查询',
            requireAuth: true
          }
        }, {
          path: '/riskInfoQuery',
          component: riskInfoQuery, //管理员.
          meta: {
            title: '系统设置',
            requireAuth: true
          }
        }, {
          path: '/noticeInfoQuery',
          component: noticeInfoQuery, //管理员.
          meta: {
            title: '公告设置',
            requireAuth: true
          }
        },
        {
          path: '/adminBuyQueryInfo',
          component: () => import('@/components/transfer/adminBuyQueryInfo'),
          meta: {
            title: "买入订单", //管理员.
            requireAuth: true
          }
        },
        {
          path: '/adminSellQueryInfo',
          component: () => import('@/components/transfer/adminSellQueryInfo'),
          meta: {
            title: "卖出订单", //管理员.
            requireAuth: true
          }
        },
        {
          path: '/balanceQueryInfo',
          component: () => import('@/components/order/balanceQueryInfo'),
          meta: {
            title: '资金日志', //商户、代理.
            requireAuth: true
          }
        },
        {
          path: '/adminBalanceQueryInfo',
          component: () => import('@/components/order/adminBalanceQueryInfo'),
          meta: {
            title: '资金日志', //管理员.
            requireAuth: true
          }
        },
        {
          path: '/memberOrderSt',
          component: () => import('@/components/order/memberOrderSt'),
          meta: {
            title: '交易统计', //商户.
            requireAuth: true
          }
        },
        {
          path: '/adminOrderSt',
          component: adminOrderSt,
          meta: {
            title: '交易统计', //管理员.
            requireAuth: true
          }
        },
        {
          path: '/transactionOrder',
          component: () => import('@/components/order/transactionOrder'),
          meta: {
            title: '申请交易', //商户.
            requireAuth: true
          }
        },
        {
          path: '/buyOrderQueryInfo',
          component: () => import('@/components/transfer/buyOrderQueryInfo'),
          meta: {
            title: '买入订单', //商户买入订单.
            requireAuth: true
          }
        },
        {
          path: '/sellOrderQueryInfo',
          component: () => import('@/components/transfer/sellOrderQueryInfo'),
          meta: {
            title: '卖出订单', //商户卖出订单.
            requireAuth: true
          }
        },
        {
          path: '/txorderQueryInfo',
          component: () => import('@/components/txOrder/txorderQueryInfo'),
          meta: {
            title: '提现订单', //代理.
            requireAuth: true
          }
        },
        {
          path: '/adminTxorderQueryInfo',
          component: () => import('@/components/txOrder/adminTxorderQueryInfo'),
          meta: {
            title: '提现订单', //管理员.
            requireAuth: true
          }
        },
        {
          path: '/teamManager',
          component: () => import('@/components/basic/teamManager'),
          meta: {
            title: '团队管理', //管理员.
            requireAuth: true
          }
        },
        {
          path: '/commonChild',
          component: () => import('@/components/basic/commonChild'),
          meta: {
            title: '下级查询', //代理.
            requireAuth: true
          }
        },
        {
          path: '/receivePay',
          component: () => import('@/components/basic/receivePay'),
          meta: {
            title: '收款管理', //管理员.
            requireAuth: true
          }
        },
        {
          path: '/proxyInfoQuery',
          component: () => import('@/components/basic/proxyInfoQuery'),
          meta: {
            title: '代理查询', //管理员.
            requireAuth: true
          }
        },
        {
          path: '/adminRechargeQueryInfo',
          component: () => import('@/components/order/adminRechargeQueryInfo'),
          meta: {
            title: '充值订单', //管理员.
            requireAuth: true
          }
        },
        {
          path: '/rechargeQueryInfo',
          component: () => import('@/components/order/rechargeQueryInfo'),
          meta: {
            title: '充值订单', //商户.
            requireAuth: true
          }
        },
        {
          path: '/proxyTransferQueryInfo',
          component: () => import('@/components/transfer/proxyTransferQueryInfo'),
          meta: {
            title: '交易订单', //代理.
            requireAuth: true
          },
        },
        {
          path: '/proxyOrderSt',
          component: () => import('@/components/order/proxyOrderSt'),
          meta: {
            title: '交易统计', //代理.
            requireAuth: true
          }
        },
      ]
    }, {
      path: '/login',
      name: 'loginPage',
      component: loginPage,
      meta: {
        title: '登录'
      },
    },
  ]
})
