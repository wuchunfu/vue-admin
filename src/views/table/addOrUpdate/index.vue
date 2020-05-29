<template>
  <el-dialog
    :title="!dataForm.rowId ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form
      ref="dataForm"
      :model="dataForm"
      :rules="dataRule"
      label-width="80px"
      @keyup.enter.native="dataFormSubmit()"
    >
      <el-form-item label="标题" prop="title">
        <el-input v-model="dataForm.title" type="text" style="width: 90%;" placeholder="标题"/>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="dataForm.status" class="filter-item" style="width: 90%;" placeholder="请选择">
          <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item"/>
        </el-select>
      </el-form-item>
      <el-form-item label="日期" prop="createTime">
        <el-date-picker v-model="dataForm.createTime" type="datetime" style="width: 90%;" placeholder="请选择日期"/>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">保存</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import {mapActions} from 'vuex'

  export default {
    data() {
      return {
        visible: false,
        dataForm: {
          rowId: 0,
          title: '',
          author: 'admin',
          pageViews: 0,
          status: 'published',
          createTime: new Date()
        },
        statusOptions: ['published', 'draft', 'deleted'],
        dataRule: {
          title: [
            {required: true, message: '标题不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      ...mapActions('table', ['getTableInfo', 'getTableSaveOrUpdate']),

      init(row) {
        this.dataForm.rowId = row !== undefined ? row.rowId || 0 : undefined
        this.visible = true
        if (this.dataForm.rowId) {
          this.getTableInfo({rowId: this.dataForm.rowId}).then((res) => {
            // console.log(res.data)
            const result = res.data
            if (result && result.code === 0) {
              this.dataForm.rowId = result.data.items.rowId
              this.dataForm.title = result.data.items.title
              this.dataForm.author = result.data.items.author
              this.dataForm.pageViews = result.data.items.pageViews
              this.dataForm.status = result.data.items.status
              this.dataForm.createTime = result.data.items.createTime.replace(/-/g, '/')
            }
          })
        } else {
          this.dataForm = {
            rowId: 0,
            title: '',
            author: 'admin',
            pageViews: 0,
            status: 'published',
            createTime: new Date()
          }
        }
      },
      // 表单提交
      dataFormSubmit() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.visible = true
            const params = {
              'rowId': this.dataForm.rowId || undefined,
              'title': this.dataForm.title,
              'author': this.dataForm.author,
              'pageViews': this.dataForm.pageViews,
              'status': this.dataForm.status,
              'createTime': this.dataForm.createTime
            }
            this.getTableSaveOrUpdate(params).then((res) => {
              // console.log(res.data)
              const result = res.data
              if (result && result.code === 0) {
                this.$notify({
                  title: '成功',
                  showClose: true,
                  message: '操作成功',
                  type: 'success',
                  duration: 3000
                })
                this.dataForm = {
                  rowId: 0,
                  title: '',
                  author: 'admin',
                  pageViews: 0,
                  status: 'published',
                  createTime: new Date()
                }
                this.visible = false
                this.$emit('refreshDataList')
              } else {
                this.$notify({
                  title: '失败',
                  showClose: true,
                  message: '操作失败',
                  type: 'error',
                  duration: 3000
                })
                this.dataForm = {
                  rowId: 0,
                  title: '',
                  author: 'admin',
                  pageViews: 0,
                  status: 'published',
                  createTime: new Date()
                }
                this.visible = false
                this.$emit('refreshDataList')
              }
            })
          }
        })
      }
    }
  }
</script>
