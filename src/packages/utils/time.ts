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

export class DebounceTime {
    timer: any;
    time: number;
    constructor(time?:number) {
        this.timer = null;
        this.time = time || 1000 * 0.5;
    }
    run(cb:Function) {
        this.timer && clearTimeout(this.timer);
        this.timer = setTimeout(cb, this.time);
    }
}