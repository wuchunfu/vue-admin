<template>
  <el-row class="row-box">
    <el-col class="col-box">
      <el-card class="card-box">
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
          <el-form-item>
            <el-input v-model="dataForm.title" :placeholder="$t('table.title')" clearable/>
          </el-form-item>
          <el-form-item>
            <el-button @click="getDataList()">{{ $t('common.search') }}</el-button>
            <el-button type="primary" @click="addOrUpdateHandle()">{{ $t('common.add') }}</el-button>
            <el-button
              type="danger"
              :disabled="dataListSelections.length <= 0"
              @click="deleteHandle()"
            >
              {{ $t('common.batchDelete') }}
            </el-button>
          </el-form-item>
        </el-form>
        <el-table
          v-loading="loading"
          :data="dataList"
          element-loading-text="Loading"
          border
          fit
          style="width: 100%;"
          highlight-current-row
          @selection-change="selectionChangeHandle"
        >
          <el-table-column
            type="selection"
            header-align="center"
            align="center"
            width="50"
          />
          <el-table-column
            :label="$t('table.title')"
            header-align="center"
            align="center"
          >
            <template slot-scope="scope">
              {{ scope.row.title }}
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('table.author')"
            header-align="center"
            align="center"
            width="110"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.author }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('table.pageView')"
            header-align="center"
            align="center"
            width="110"
          >
            <template slot-scope="scope">
              {{ scope.row.pageViews }}
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('common.status')"
            class-name="status-col"
            header-align="center"
            align="center"
            width="110"
          >
            <template slot-scope="scope">
              <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('common.createTime')"
            header-align="center"
            align="center"
            width="200"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.createTime }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('common.operation')"
            header-align="center"
            align="center"
            width="155"
            fixed="right"
          >
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="small"
                @click="addOrUpdateHandle(scope.row)"
              >
                {{ $t('common.edit') }}
              </el-button>
              <el-button
                v-loading="loading"
                type="danger"
                size="small"
                @click="deleteHandle(scope.row.rowId)"
              >
                {{ $t('common.delete') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          :total="totalPage"
          :page.sync="pageIndex"
          :limit.sync="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          @pagination="getDataList"
        />
        <!-- 弹窗, 新增 / 修改 -->
        <add-or-update
          v-if="addOrUpdateVisible"
          ref="addOrUpdate"
          @refreshDataList="getDataList"
        />
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import {mapActions} from 'vuex'
import Pagination from '@/components/Pagination'
import AddOrUpdate from '../addOrUpdate/index'
import i18n from '@/i18n'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  components: {
    Pagination,
    AddOrUpdate
  },
  data() {
    return {
      loading: true,
      dataForm: {
        title: ''
      },
      dataListSelections: [],
      dataList: [],
      addOrUpdateVisible: false,
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0
    }
  },
  created() {
    this.getDataList()
  },
  methods: {
    ...mapActions('table', ['getList', 'getDeleteRow']),
    getDataList() {
      this.loading = true
      const params = {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        title: this.dataForm.title
      }
      this.getList(params).then((res) => {
        // console.log(res.data)
        const result = res.data
        if (result && result.code === 200) {
          this.dataList = result.data.items
          this.totalPage = result.data.total
        } else {
          this.dataList = []
          this.totalPage = 0
          this.$notify({
            title: i18n.t('common.fail'),
            showClose: true,
            message: i18n.t('common.Failed to get data'),
            type: 'error',
            duration: 3000
          })
        }
        this.loading = false
      }).catch((res) => {
        this.$notify({
          title: i18n.t('common.fail'),
          showClose: true,
          message: i18n.t('common.Failed to get data'),
          type: 'error',
          duration: 3000
        })
        this.loading = false
      })
    },
    // 新增 / 修改
    addOrUpdateHandle(row) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(row)
      })
    },
    //  删除
    deleteHandle(id) {
      const rowIds = id ? [id] : this.dataListSelections.map(item => {
        return item.rowId
      })
      this.$confirm(
        i18n.t('common.Are you sure you want to delete'),
        i18n.t('common.tips'), {
          confirmButtonText: i18n.t('common.confirm'),
          cancelButtonText: i18n.t('common.cancel'),
          type: 'warning'
        }).then(() => {
        this.loading = true
        this.getDeleteRow({rowIds: rowIds}).then((res) => {
          // console.log(res.data)
          const result = res.data
          if (result && result.code === 200) {
            this.$notify({
              title: i18n.t('common.success'),
              showClose: true,
              message: i18n.t('common.Delete successfully'),
              type: 'success',
              duration: 3000
            })
            this.getDataList()
            this.loading = false
          } else {
            this.$notify({
              title: i18n.t('common.fail'),
              showClose: true,
              message: i18n.t('common.Delete failed'),
              type: 'error',
              duration: 3000
            })
            this.getDataList()
            this.loading = false
          }
        })
      })
    },
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val
    }
  }
}
</script>

<style lang="scss" scoped>
.row-box {
  height: auto;

  .col-box {
    width: 100%;
    height: 100%;
  }

  .card-box {
    width: 100%;
    height: 100%;
  }
}
</style>
