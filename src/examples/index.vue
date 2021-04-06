<template>
    <el-tabs
        v-model="activeName"
        lazy
    >
        <el-tab-pane
            label="table"
            name="table"
        >
            <v-table />
        </el-tab-pane>
        <el-tab-pane
            label="form"
            name="form"
        >
            <v-form />
        </el-tab-pane>
        <el-tab-pane
            label="formTable"
            name="formTable"
        >
            <v-formtable />
        </el-tab-pane>
    </el-tabs>
</template>

<script lang="ts">
import {
    defineComponent, ref
} from 'vue';
import vTable from './table.vue';
import vForm from './form.vue';
import vFormtable from './formTable.vue';
// import test from './test.vue';

export default defineComponent({
    name: 'Example',
    components: {
        vTable,
        vForm,
        vFormtable
        // test
    },
    setup(){
        const activeName = ref<string>('formTable');
        return {
            activeName
        };
    }
});
</script>
