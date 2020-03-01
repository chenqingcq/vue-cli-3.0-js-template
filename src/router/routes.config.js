export const routes = [
    {
        path: "/",
        redirect: "/login",
    },
    {
        path: '/login',
        component: (resolve) => require(['@/views/login/Login'], resolve),
        meta: {}
    },
    {
        path: '/main',
        component: (resolve) => require(['@/components/Main'], resolve),
        children: [
            {
                path: '/main/recept',
                component: (resolve) => require(['@/views/recept/Recept'], resolve),
                redirect: "/main/recept/receptlist",
                meta: {},
                children: [
                    {
                        path: '/main/recept/receptlist',
                        component: (resolve) => require(['@/views/recept/Receptlist'], resolve),
                        meta: {},
                        children: []
                    },
                    {
                        path: '/main/recept/edit',
                        component: (resolve) => require(['@/views/recept/ReceptorEdit'], resolve),
                        meta: {}
                    },
                ]
            },
            {
                path: '/main/management',
                component: (resolve) => require(['@/views/management/Management'], resolve),
                meta: {},
                children: [
                    {
                        path: '/main/management/bigdata',
                        component: (resolve) => require(['@/views/management/BigData'], resolve),
                        meta: {},
                        children: [

                        ]
                    },
                    {
                        path: '/main/management/personnel',
                        component: (resolve) => require(['@/views/management/Personnel'], resolve),
                        meta: {},
                        children: [

                        ]
                    }
                ]
            },
            {
                path: '/main/check',
                component: (resolve) => require(['@/views/check/Check'], resolve),
                redirect: "/main/check/checklist",
                meta: {},
                children: [
                    {
                        path: '/main/check/checklist',
                        component: (resolve) => require(['@/views/check/Checklist'], resolve),
                        meta: {},
                        children: [

                        ]
                    },
                ]
            },
            {
                path: '/main/equip',
                component: (resolve) => require(['@/views/equip/Equip'], resolve),
                redirect: "/main/equip/equiplist",
                meta: {},
                children: [
                    {
                        path: '/main/equip/equiplist',
                        component: (resolve) => require(['@/views/equip/Equiplist'], resolve),
                        meta: {},
                        children: [

                        ]
                    },
                    {
                        path: '/main/equip/add',
                        component: (resolve) => require(['@/views/equip/EquipAdd'], resolve),
                        meta: {},
                    },
                ]
            },
            {
                path: '/main/business',
                component: (resolve) => require(['@/views/business/Business'], resolve),
                meta: {},
                children: [
                    {
                        path: '/main/business/excel',
                        component: (resolve) => require(['@/views/business/Excel'], resolve),
                        meta: {},
                        children: []
                    },
                    {
                        path: '/main/business/staff',
                        component: (resolve) => require(['@/views/business/Staff'], resolve),
                        meta: {},
                        children: []
                    },
                    {
                        path: '/main/business/blacklist',
                        component: (resolve) => require(['@/views/business/Blacklist'], resolve),
                        meta: {},
                        children: []
                    },
                    {
                        path: '/main/business/addStaff',
                        component: (resolve) => require(['@/views/business/AddStaff'], resolve),
                        meta: {},
                        children: []
                    },
                ]
            }
        ]
    },
]