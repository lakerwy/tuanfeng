export const menuList = [
  {
    name: `sourceManage`,
    meta: {
      title: '资源管理'
    },
    children:[
      {
        name: `registServe`,
        meta: {
          title: '服务注册'
        },
        icon: 'logo-buffer'
      },
      {
        name: `serveManage`,
        meta: {
          title: '服务管理'
        },
        icon: 'logo-buffer'
      },
      {
        name: `specialAut`,
        meta: {
          title: '专题授权'
        },
        icon: 'logo-buffer'
      },
      {
        name: `specialApplove`,
        meta: {
          title: '专题申请'
        },
        icon: 'logo-buffer'
      },
      {
        name: `specialserve`,
        meta: {
          title: '专题服务接口'
        },
        icon: 'logo-buffer'
      },
      {
        name: `specialControl`,
        meta: {
          title: '专题资源监控'
        },
        icon: 'logo-buffer'
      },
    ]
  },
  {
    name: `userManage`,
    meta: {
      title: '用户管理'
    },
    children: [
      {
        name: `home`,
        meta: {
          title: '用户设置'
        },
        icon: 'logo-buffer'
      },
      {
        name: `role`,
        icon: 'md-document',
        meta: {
          title: '角色管理'
        }
      },
      {
        name: `authManage`,
        icon: 'md-document',
        meta: {
          title: '权限管理'
        }
      },
      {
        name: `organManage`,
        meta: {
          title: '机构管理'
        }
      },
      {
        name: `serveauth`,
        meta: {
          title: '服务鉴权'
        }
      }
      // {
      //   name: `userAuth`,
      //   icon: 'md-document',
      //   meta: {
      //     title: '用户实名认证管理'
      //   }
      // }
    ]
  },
  {
    name: `monitor`,
    meta: {
      title: '平台巡检与监控'
    },
    children: [
      {
        name: `allPatrol`,
        meta: {
          title: '巡检总体'
        },
        icon: 'logo-buffer'
      },
      {
        name: `dataPollPatrol`,
        meta: {
          title: '数据库巡检'
        },
        icon: 'logo-buffer'
      },
      {
        name: `servePatrol`,
        meta: {
          title: '服务器巡检'
        },
        icon: 'logo-buffer'
      },
      {
        name: `platformPatrol`,
        meta: {
          title: '平台服务巡检'
        },
        icon: 'logo-buffer'
      },
      {
        name: `logPatrol`,
        meta: {
          title: '健康巡检异常日志'
        },
        icon: 'logo-buffer'
      },
    ]
  },
  {
    name: `monitor`,
    meta: {
      title: '平台检测'
    },
    icon: 'logo-buffer',
    children:[
      {
        name: `home`,
        meta: {
          title: '当前在线用户'
        },
        icon: 'logo-buffer'
      },
      {
        name: `home`,
        meta: {
          title: '用户在线时长'
        },
        icon: 'logo-buffer'
      },
    ]
  },
  {
    name: `organ`,
    meta: {
      title: '机构设置'

    },
    children: [
      {
        name: `organManage`,
        meta: {
          title: '机构管理'
        }
      },
      {
        name: `organMember`,
        meta: {
          title: '机构成员管理'
        }
      },
      {
        name: `organAuth`,
        icon: 'md-document',
        meta: {
          title: '机构部门认证管理'
        }
      },
      {
        name: `transfer`,
        meta: {
          title: '机构部门转移管理'
        }
      }
    ]
  },
  {
    name: `systemManage`,
    meta: {
      title: '系统管理'
    },
    children: [
      {
        name: `submenu`,
        meta: {
          title: '子系统管理'
        },
        icon: 'md-cog'
      },
      {
        name: `menu`,
        meta: {
          title: '功能菜单'
        }
      },
      {
        name: `deviceManage`,
        meta: {
          access: [],
          hideInMenu: false,
          title: '设备管理',
          notCache: true,
          icon: 'logo-codepen',
          hideInBread: false
        },
        icon: 'logo-codepen'
      }
    ]
  },
  {
    name: `systemSet`,
    icon: 'md-document',
    meta: {
      hideInMenu: false,
      title: '系统设置',
      notCache: true,
      icon: 'md-document',
      hideInBread: false
    },
    children: [
      {
        name: `AMD`,
        icon: 'md-document',
        meta: {
          access: [],
          hideInMenu: false,
          title: '行政区管理',
          notCache: true,
          icon: 'md-document',
          hideInBread: false
        }
      },
      {
        name: `dataType`,
        meta: {
          access: [],
          hideInMenu: false,
          title: '数据类型管理',
          notCache: true,
          icon: 'md-document',
          hideInBread: false
        },
        icon: 'md-document'
      }
    ]
  }]
