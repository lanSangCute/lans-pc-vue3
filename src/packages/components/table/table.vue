<template>
    <div class="component-configTable">
        <slot
            name="head"
            v-bind="getFullData"
        />
        <el-table
            ref="refTable"
            v-bind="$attrs"
            v-loading="loading"
            :data="tableData"
            :border="border"
            size="small"
            style="width: 100%"
            :height="$attrs.height"
            highlight-current-row
            @selection-change="selectionChange"
        >
            <template
                v-if="showEmptyImg"
                #empty
                class="flex-ju-al-center"
            >
                <img
                    class="my-24"
                    src="./noContent.svg"
                    alt
                >
            </template>
            <template v-for="(cln, index) in tableColumn">
                <template v-if="cln.type == 'select'">
                    <el-table-column
                        :key="`select${index}`"
                        type="selection"
                        :fixed="cln.fixed"
                        :width="cln.width || 50"
                        align="center"
                        :selectable="cln.selectable"
                    />
                </template>
                <template v-else-if="cln.type === 'radio'">
                    <el-table-column
                        :key="`radio${index}`"
                        :label="cln.label"
                        :fixed="cln.fixed"
                        :width="cln.width || 60"
                        align="center"
                    >
                        <template #default="scope">
                            <el-radio
                                v-model="radioSelect"
                                :label="scope.$index"
                                @change="radioChange"
                            >
                                &nbsp;&nbsp;
                            </el-radio>
                        </template>
                    </el-table-column>
                </template>
                <template v-else-if="cln.type == 'index'">
                    <el-table-column
                        :key="`index${index}`"
                        :label="'序号'"
                        align="center"
                        type="index"
                        :prop="cln.value"
                        :width="cln.width || 50"
                    />
                </template>
                <template v-else-if="cln.type == 'operate'">
                    <el-table-column
                        :key="`operate${index}`"
                        :fixed="cln.fixed"
                        :label="cln.label"
                        :width="cln.width || autoWith(cln.buttons)"
                        :class-name="cln.className"
                        :align="cln.align || align"
                    >
                        <template #default="scope">
                            <template v-for="btn in cln.buttons">
                                <el-button
                                    v-if="btnCondition(btn, scope.row)"
                                    :key="btn.click"
                                    :disabled="btnDisabled(btn, scope.row)"
                                    size="small"
                                    :class="btn.className"
                                    type="text"
                                    @click="btnClick(btn, scope.row)"
                                >
                                    {{ btn.label }}
                                </el-button>
                            </template>
                        </template>
                    </el-table-column>
                </template>
                <template v-else-if="cln.type === 'render' && cln.render">
                    <el-table-column
                        :key="`render${index}`"
                        :label="cln.label"
                        :sortable="cln.sortable"
                        :fixed="cln.fixed"
                        :class-name="cln.className"
                        :align="cln.align || align"
                        :show-overflow-tooltip="cln.label!=='操作'"
                    >
                        <template #default="scope">
                            <div class="flex">
                                <func-render
                                    :render="cln.render"
                                    :data="{
                                        row: scope.row,
                                        column: cln,
                                        index: scope.$index
                                    }"
                                />
                                <div
                                    v-if="cln.columnMove"
                                    class="ml-8"
                                >
                                    <el-button
                                        type="text"
                                        icon="el-icon-top"
                                        :disabled="scope.$index === 0"
                                        @click="columnMove('top',scope.row,cln,scope.$index)"
                                    />
                                    <el-button
                                        type="text"
                                        icon="el-icon-bottom"
                                        :disabled="scope.$index === (tableData || []).length -1"
                                        @click="columnMove('bottom',scope.row,cln,scope.$index)"
                                    />
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                </template>
                <template v-else>
                    <el-table-column
                        :key="`otable${index}`"
                        :prop="cln.value"
                        :label="cln.label"
                        :sortable="cln.sortable"
                        :type="cln.type === 'expand' ? 'expand' : ''"
                        :width="cln.width || 'auto'"
                        :align="cln.align || align"
                        :class-name="cln.className"
                        :formatter="formatFun"
                        show-overflow-tooltip
                    >
                        <template
                            v-if="cln.header"
                            #header="scope"
                        >
                            <slot
                                v-bind="scope"
                                :name="cln.header"
                            />
                        </template>
                        <template
                            v-if="cln.slot"
                            #default="scope"
                        >
                            <slot
                                v-bind="scope"
                                :name="cln.slot"
                            />
                        </template>
                    </el-table-column>
                </template>
            </template>
        </el-table>
        <!-- 加form表单disabled-false，保证在表单的列表不受表单的状态影响 -->
        <el-form :disabled="false">
            <lans-v-pagination
                v-if="pagination"
                class="tncm-pagination"
                :page="pager"
                :total="total"
                @change="pageChange"
            />
            <slot
                name="foot"
                v-bind="getFullData"
            />
        </el-form>
    </div>
</template>
<script src="./table.ts"></script>
