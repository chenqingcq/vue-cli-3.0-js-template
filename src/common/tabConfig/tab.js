// export const tab = [
//     {
//         i18n: "bigdata.title",
//         router: "/main/bigdata",
//         show: false,
//         children: [
//             {
//                 i18n: "bigdata.dashboard.title",
//                 router: "/main/bigdata/dashboard",
//                 children: []
//             },
//         ]
//     },
//     {
//         i18n: "statistics.title",
//         router: "/main/statistics",
//         show: false,
//         children: [
//             {
//                 i18n: "statistics.staff.title",
//                 router: "/main/statistics/staff",
//                 children: []
//             },
//             {
//                 i18n: "statistics.visitor.title",
//                 router: "/main/statistics/visitor",
//                 children: []
//             },
//             {
//                 i18n: "statistics.stranger.title",
//                 router: "/main/statistics/stranger",
//                 children: []
//             }
//         ]
//     },
//     {
//         i18n: "agency.title",
//         router: "/main/agency/list",
//         children: []
//     },
//     {
//         i18n: "personnel.title",
//         router: "/main/personnel",
//         show: false,
//         children: [
//             {
//                 i18n: "personnel.staff.title",
//                 router: "/main/staff/list"
//             },
//             {
//                 i18n: "personnel.visitor.title",
//                 router: "/main/visitor/list"
//             },
//             {
//                 i18n: "personnel.stranger.title",
//                 router: "/main/stranger/list"
//             }
//         ]
//     },
//     {
//         i18n: "robots.title",
//         router: "/main/robots/list",
//         children: []
//     },
//     {
//         i18n: "room.title",
//         router: "/main/room/list",
//         show: false,
//         children: [
//             {
//                 i18n: "room.header",
//                 router: "/main/room/list"
//             },
//             {
//                 i18n: "room.authorize.title",
//                 router: "/main/room/authorize"
//             },
//             // {
//             //     i18n: "excel.title",
//             //     router: "/main/excel",
//             //     children: []
//             // },
//         ]
//     },
//     {
//         i18n: "feedback.title",
//         router: "/main/feedback/list",
//         children: []
//     },
//     {
//         i18n: "psw.title",
//         router: "/main/password",
//         children: []
//     }
// ]
export const tab = [{
    i18n: "recept.title",
    router: "/main/recept",
    show: false,
    children: []
}, {
    i18n: "mng.title",
    router: "/main/management",
    show: false,
    children: [
        {
            i18n: "mng.bigdata.title",
            router: "/main/management/bigdata",
            children: []
        },
        {
            i18n: "mng.personnel.title",
            router: "/main/management/personnel",
            children: []
        }
    ]
}, {
    i18n: "check.title",
    router: "/main/check",
    children: []
}, {
    i18n: "equip.title",
    router: "/main/equip",
    children: []
},
{
    i18n: "business.title",
    router: "/main/business",
    show: false,
    children: [
        {
            i18n: "business.excel.title",
            router: "/main/business/excel",
            children: []
        },
        {
            i18n: "business.personnel.title",
            router: "/main/business/staff",
            children: []
        },
        {
            i18n: "business.blacklist.title",
            router: "/main/business/blacklist",
            children: []
        },
    ]
}]