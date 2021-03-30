import dayjs from 'dayjs'

export class TimeUtils {
    constructor(){
    }
    formatting(date?:number | Date | string,format='YYYY-MM-DD HH:mm:ss'){
        return dayjs(date).format(format);
    }
    getDefaultTime(){
        let now = new Date(),
            start  = dayjs(now).set('hour', 0).set('minute',0).set('second',0),
            end  = dayjs(now).set('hour', 23).set('minute',59).set('second',59);
        return [start,end]
    }
}