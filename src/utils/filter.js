import moment from 'moment';
export const filters = {
    fomateTime(time, type = 'YYYY-MM-DD HH:mm:ss') {
        return moment(time).format(type);
    }
}