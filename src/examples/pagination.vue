<template>
    <lans-v-pagination
        :page="pager"
        @change="selectChange"
    />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { reactive } from 'vue';
import { Pager } from '../packages/types';
export default defineComponent({
    name: 'e-pagination',
    setup(){
        const pager = reactive<Pager>({ 
            pageNo: 1,//当前页数
            pageSize: 10//每页显示条目个数
        });
        return {
            pager
        };
    },
    methods:{
      /**
       * @method 分页变化
       * @param {Pager} data
       */
      selectChange(data:Pager){
          this.pager = Object.assign(this.pager, data);
          console.log(this.pager,'pager');
      }
    }
})
</script>
