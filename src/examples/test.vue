<template>
    <div>test</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {
    reactive, ref
} from 'vue';
export default defineComponent({
    name: 'test',
    setup(){
        /**
         * @desc ref和reactive
        */
        const num1 = 10,
            num2 = ref(100),
            num4 = reactive({val:10000});
        console.log(num1,num2,num4);

        enum Color {
            Red=1,
            Green,
            Blue
        }

        // 枚举数值默认从0开始依次递增
        // 根据特定的名称得到对应的枚举数值
        let myColor: Color = Color.Green  // 1
        console.log(myColor, Color.Red, Color.Blue);

        // const getLength = (x: number | string): number => {
        //     if ((<string>x).length) {
        //         return (x as string).length;
        //     } else {
        //         return x.toString().length;
        //     }
        // }
        // console.log(getLength('abcd'), getLength(1234))

        interface SearchFunc {
            (source: string, subString: string): boolean
        }

        const mySearch: SearchFunc = (source: string, sub: string):boolean =>{
          return source.search(sub) > -1;
        }
        console.log(mySearch('abcd', 'bc'));

        interface Route {[key: string]: string}
        const  ROUTERCONFIG: Route = {
            "2000121": "/material",
        };
        console.log(ROUTERCONFIG);

        const getA:(x:String) => String = function(x:String):String {
            return x;
        }
        let getA1: (x: number, y: number) => number = 
        function(x: number, y: number): number {
            return x + y
        }
        return {
            num1,
            num2,
            num4
        }
    }
})
</script>
