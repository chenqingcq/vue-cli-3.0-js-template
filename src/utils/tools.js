
export function getDay(type, index) {
    console.log(index)
    let weekMap = {
        "zh": ['星期天', "星期一", "星期二", "星期三", "星期四", "星期五", '星期六'],
        "en": ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        "ru": ['Воскресенье', "Понедельник ", " вторник ", " среда ", " четверг ", " пятница "]
    }
    return weekMap[type][index]
}
export function simplifyDay(type, index) {

    let weekMap = {
        "zh": ['日', "一", "二", "三", "四", "五", '六'],
        "en": ['Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat'],
        "ru": ['ВС', "ПН ", "ВТ", "СР ", " ЧТ ", "ПТ", "СБ"]
    }
    return weekMap[type][index]
}