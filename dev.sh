if [ ! -f "src/examples/index.vue" ];then
  mkdir src/examples
  echo "<template>
    
  </template>

  <script lang="ts">
  import { defineComponent } from 'vue'
  // import pagination from './pagination.vue'
  export default defineComponent({
    name: 'example',
    components: {
      // pagination,
    },
  })
  </script>" >> src/examples/index.vue

echo -e "\033[42;30m examples/index.vue创建完成 \033[0m"
else
  echo -e "\033[42;30m examples/index.vue文件已存在 \033[0m"
fi
