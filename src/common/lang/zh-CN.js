import zhLocale from 'element-ui/lib/locale/lang/zh-CN';
export default {
    common: {
        sunrise: "日出",
        sunset: "日落",
        uploadError: "图片上传失败",
        total: "共",
        hour: "小时",
        minutes: "分钟",
        submitText: '确定提交',
        select: "请选择",
        status: '状态',
        default: "默认分组",
        operate: '操作',
        operateError: '操作失败',
        operateSuccess: '操作成功',
        edit: '编辑',
        agree: "同意",
        reject: "拒绝",
        view: "详情",
        add: "添加",
        delete: "删除",
        dltInbatch: "批量删除",
        search: "搜索人员",
        save: "保存",
        cancel: "取消",
        confirm: "确认",
        submit: "提交",
        export: "导出",
        searchError: "查询失败",
        noData: '暂无记录',
        addSuccess: "添加成功",
        deleteSuccess: "删除成功",
        saveSuccess: '保存成功',
        addFailure: "添加失败",
        deleteFailure: "删除失败",
        saveFailure: '保存失败',
        plzEnterStartTime: "请输入开始时间",
        plzEnterEndTime: "请输入结束时间",
        templateError: '请勿修改模板，确保与模板文件要求一致'
    },
    recept: {
        title: "VIP接待",
    },
    mng: {
        title: "VIP管理",
        bigdata: {
            title: "VIP大数据",
        },
        personnel: {
            title: "VIP人员管理"
        }
    },
    check: {
        title: "入住管理",
    },
    equip: {
        title: "设备管理",
    },
    business: {
        title: "运营管理",
        excel: {
            title: "接待报表"
        },
        personnel: {
            title: "员工管理"
        },
        blacklist: {
            title: "黑名单"
        }
    },
    login: {
        system: "后台管理系统",
        title: "账号登录",
        netWorkError: "网络连接错误",
        loginError: "账号或密码错误 , 请重新登录",
        loginText: '登录',
        logoutText: '退出',
        plzIptCheckcode: "请输入图形验证码",
        loging: '登录中...',
        plzIptAccount: '请输入账户名',
        plzIptPsw: "请输入密码",
        company: "公司登录",
        property: "物业登录"
    },
    header: {
        fullscreen: "全屏",
        exitFullScreen: "退出全屏",
        logoutError: '退出失败,请重试'
    },
    bigdata: {
        title: "大数据",
        dashboard: {
            title: '大数据平台',
            platform: '园区大数据平台',
            item: "个",
            people: '人',
            yuan: '元',
            vehicle: "辆",
            left: {
                center: "科创中心",
                kw: "度",
                ton: '吨',
                person: {
                    title: '人员数据',
                    staff: "常驻人数占比",
                    visitor: "访客人数占比",
                    reg: "人数统计",
                    visitorIn: "访客总人数统计",
                    visitorNum: "今日访客统计",
                    rate: "楼宇内人数占比"
                },
                electron: {
                    title: "智能水电表统计",
                    water: "园区用水情况",
                    week: "本周用度情况",
                    month: "本月用度情况",
                    title1: "园区用电情况",
                },
            },
            middle: {
                good: "优",
                normal: "良",
                bad: '差',
                air: "空气质量指数",
                ml: '毫升',
                rain: '局部降雨量',
            },
            right: {
                car: {
                    title: "车辆管理",
                    left: '剩余停车位',
                    used: '已用停车位',
                    violation: "违占停车位",
                    overview: "查看监控"
                },
                space: {
                    title: '公共空间',
                    rent: "已出租",
                    new: "本月新租",
                    deadLine: '本月到期',
                    vacant: "空置房间",
                    item1: "会议室订单",
                    item2: "娱乐区会员增长",
                    item3: "路演厅使用情况",
                    item4: "充值订单",
                    week: '本周房间情况',
                    month: "本月房间情况",
                    rate: "空间出租率",
                    order: '订单数量'
                }
            }
        }
    },
    statistics: {
        title: "人员统计",
        staff: {
            title: '员工统计',
            group: "分组",
            selectGroup: "请选择分组",
            selectCompany: "请选择公司",
            all: "全部",
            status: "状态",
            recent: "最近员工",
            more: "查看更多 >>",
            accessTime: "进出时间",
            deadLine: "有效日期",
            robot: "拍摄设备",
            type: "进出类型",
            accessCount: "出入次数统计"
        },
        visitor: {
            title: "访客统计",
            approve: "已同意",
            pedding: "待审批",
            reject: "已拒绝",
            recent: "最近访客",
            data: "数据统计",
            registerState: "申请单状态",
            originSource: '访客申请来源',
            registerType1: "app注册",
            registerType2: "vbook注册",
            registerType3: "批量注册",
            registerType4: "第三方api注册",
            registerType5: "扫码注册",
            registerType6: "拜访个人",
            registerType7: "Alpha注册",
            registerType8: "平台注册",
            registerType9: "陌生人注册",
        },
        stranger: {
            title: "陌生人统计",
            recent: "最近陌生人"
        }
    },
    agency: {
        title: '组织管理',
        list: {
            add: "新增公司",
            search: "搜索组织",
            logo: "公司logo",
            name: '公司名称',
            robots: "机器人数目",
            account: '主账号',
            subAccount: "子管理员数目",
            scan: '是否支持扫码进出',
            plzIptScan: "请选择是否支持扫码进出"
        },
        add: {
            yes: '是',
            no: '否',
            upload: '上传图片',
            plzUpload: '请上传公司图片',
            plzAddName: "请输入公司名称",
            address: "楼层地址",
            plzIptAddress: "请输入楼层地址",
            account: "管理员账户",
            plzIptAccount: "请输入管理员账户",
            accountName: "管理员名称",
            plzIptAccountName: "请输入管理员名称",
            psw: "管理员密码",
            plzIptPsw: '请输入管理员密码',
            theshold: '阈值',
            plzIptTheshold: '请输入阈值',
            model: '模型版本',
            plzSelectModel: "请输入模型版本",
            filter: "是否开启注册过滤",
            plzSelectFilter: "请选择是否开启注册过滤"
        },
        edit: {
            title: '编辑公司',
        }
    },
    personnel: {
        title: "人员管理",
        staff: {
            title: "员工管理",
            list: "员工列表",
            header: "员工管理",
            picture: "照片",
            name: "姓名",
            group: '所属分组',
            $register: '注册日期',
            deadLine: '有效日期',
            record: "活动记录",
            type: '进出类型',
            in: '进',
            out: "出",
            idCard: "证件号",
            register: "批量注册"
        },
        visitor: {
            title: "访客管理",
            list: "访客列表",
            header: "访客管理",
        },
        stranger: {
            title: '陌生人管理',
            list: {
                delete: "确认删除",
                name: "陌生人",
                search: "搜索陌生人",
                searchRobot: "搜索机器人",
                robotName: "抓拍机器人",
                time: "抓拍时间",
                record: "陌生人记录"
            }
        },
        edit: {
            title: '资料编辑',
            avator: '头像',
            upload: "上传头像",
            plzUpload: '请上传头像',
            name: '姓名',
            plzIptName: "请输入姓名",
            deadLine: "有效期",
            plzIptDeadLine: "请输入有效期",
            account: '账号',
            reset: '重置密码',
            submitHint: "确定提交编辑内容?",
            resetHint: "确定重置密码?",
            success: "编辑成功",
            error: "编辑失败"
        },
        add: {
            noRepeatable: "不可重复预定",
            repeatable: "可重复预定",
            noAppoint: "无需预定",
            byTime: "30分钟",
            byDay: "按天",
            byWeek: "按周",
            byMon: '按月',
            byTimes: "按次数",
            open: '常开',
            close: "常闭",
            authorized: '仅授权人员开门'
        },
        register: {
            download: "下载模板",
            item: "照片要求：",
            item1: "正面近照，光线正常，曝光适度",
            item2: "脸部无遮挡，露出眉毛、额头、耳朵",
            item3: "扩展字段填写说明：",
            item4: "不支持特殊符号录入（支持符号_,-,\）",
            drag: "将文件拖到此处，或",
            click: "点击上传",
            hint: "只能上传zip文件，且不超过10M",
            faildTitle: "注册失败说明",
            successTitle: "注册成功说明",
            name: "名称",
            location: "出错位置",
            msg: "原因 ",
            notice: "说明",
            plzSelectZip: "请上传zip文件!",
            submitError: "提交失败",
            registerError: "注册失败",
            regBatchError: "批量注册失败",
            regBatchSuccess: "批量注册成功",
            sizeError: "文件大小不能超过10M!",
            exceed: "文件超出个数限制,请重新选择"
        }
    },
    robots: {
        title: "设备管理",
        list: {
            title: '设备列表',
            search: "搜索设备",
            name: "设备名称",
            online: "是否在线",
            yes: "在线",
            no: "离线",
            SN: "SN号",
            type: "型号",
            version: "软件版本号",
            room: '所属空间',
            reset: "重置"
        },
        add: {
            title: "添加设备",
            name: '设备名称',
            plzIptName: '请输入设备名称',
            SN: "设备SN号",
            plzIptSN: '请输入设备SN号',
            type: "设备类型",
            plzSelectType: '请选择设备类型',
            model: "设备模型",
            plzSelectModel: '请选择设备模型',
            confirm: "确认添加"
        }
    },
    room: {
        title: "空间管理",
        header: "空间列表",
        table: {
            search: "搜索空间",
            add: "添加空间",
            picture: "照片",
            name: "名称",
            equip: '授权设备',
            overview: "查看预约",
            isFree: "是否忙碌",
            yes: '空闲',
            no: "忙碌",
            remindHour: "提醒时间",
            cancelTime: '取消时间',
            rules: "预定规则",
            time: "预定时间"
        },
        authorize: {
            title: "预约授权",
            time: '预约时段 | 次数',
            space: "预约空间",
            times: "次数",
            avator: "空间照片",
            name: "姓名",
            company: "所属公司",
            group: "分组",
            cancel: "取消该预约",
            agree: "同意该申请",
            reject: "拒绝该申请",
            expired: "时间已过期"
        },
        overview: {
            title: "预约",
            time: '预约时段',
            appointer: '预约人',
            Mon: "一",
            Tue: '二',
            Wed: "三",
            Thr: "四",
            Fri: "五",
            Sat: "六",
            Sun: '日'
        },
        edit: {
            avator: '头像',
            upload: "上传照片",
            plzUpload: "请上传空间照片",
            maxlimit: "请上传不超过5张图片",
            space: "空间名称",
            plzIptSpace: '请输入空间名称',
            address: "空间地址",
            plzIptAddress: '请输入空间地址',
            access: "门禁管理",
            remark: "备注",
            plzIptRmk: "请输入备注",
            rule: '预定规则',
            accessHint: "选择门禁管理",
            ruleHint: '选择预定规则',
            ruleTime: "选择预定时间",
            tags: "空间标签",
            addTag: "添加标签",
            robot: "选择机器人",
            selected: "已选择的机器人",
            selectable: "可选择的机器人",
            success: "编辑成功",
            error: "编辑失败",
            plzSelect: '请选择机器人',
            plzAdd: "请添加机器人",
            setRemindTime: "设置提醒时间",
            setCancelTime: "设置取消时间"
        },
    },
    excel: {
        title: '预约报表',
        export: {
            to: "至",
            startTime: "开始日期",
            endTime: "结束日期",
            selectDate: "选择日期",
            selectOnes: "选择人员",
            plzSelectDate: "请选择日期",
            plzSelectOnes: '请选择人员',
            staff: "员工",
            visitor: "访客",
            success: "导出成功",
            error: "导出失败",
            all: '全部',
            group: "指定分组",
            personnel: "指定人员",
            plzEnterTime: '请选择导出时间',
            plzEnterStaff: "请选择人员",
            fileName: "预约消费报表"
        }
    },
    feedback: {
        title: "反馈管理",
        header: "反馈管理",
        table: {
            picture: "照片",
            name: "姓名",
            email: "邮箱",
            content: "内容",
            time: "时间",
            reply: "回复"
        },
        detail: {
            title: "反馈",
            send: "发送",
            plzIptContent: "请输入回复内容",
            success: "回复成功",
            error: "回复失败",
        }
    },
    psw: {
        title: "密码修改",
        header: "密码修改",
        modify: {
            old: "请输入旧密码",
            new: "请输入新密码",
            confirm: "请确认新密码",
            differ: "输入密码不一致,请重新输入",
            pswError: "原始密码错误,请确认",
            success: "密码修改成功",
            error: "密码修改失败"
        }
    },
    ...zhLocale
}