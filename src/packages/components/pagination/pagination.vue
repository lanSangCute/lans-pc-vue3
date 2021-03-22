<template>
    <el-pagination
        v-bind="$attrs"
        :page-size="pager.pageSize"
        :current-page="pager.pageNo"
        layout="total, sizes, prev, pager, next, jumper"
        class="flex-ju-end mt-20"
        @size-change="sizeChange"
        @current-change="currentChange"
    >
    </el-pagination>
</template>
<script lang="ts">
import { Pager } from '../../interface';
import { PropType,toRefs,reactive,watch,defineComponent } from 'vue' 

export default defineComponent({
    name: 'v-pagination',
    props: {
        page: {
            type: Object as PropType<Pager>,
            default: ()=>{}
        }
    },
    emits:['change'],
    setup(props,context){
        const { page } = toRefs(props)
        let pager = reactive<Pager>({ 
            pageNo: 1,//当前页数
            pageSize: 10//每页显示条目个数
        })

        watch(page, (val, oVal) => {
            pager = {...val}
        })

        /**
         * @method pageSize 改变时会触发
        */
        const sizeChange = (val:Number):void => {
            pager.pageSize = val;
            pager.pageNo = 1;
            context.emit('change', pager);
        } 

        /**
         * @method currentPage 改变时会触发
        */
        const currentChange = (val:Number):void => {
            pager.pageNo = val;
            context.emit('change', pager);
        }

        return {
            pager,
            sizeChange,
            currentChange
        };
    },
});
</script>
