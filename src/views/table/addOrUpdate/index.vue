<template>
  <el-dialog
    :title="!dataForm.rowId ? $t('common.add') : $t('common.edit')"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form
      ref="dataForm"
      :model="dataForm"
      :rules="dataRule"
      label-width="80px"
      @keyup.enter.native="dataFormSubmit()"
    >
      <el-form-item :label="$t('table.title')" prop="title">
        <el-input v-model="dataForm.title" type="text" style="width: 90%;" :placeholder="$t('table.title')"/>
      </el-form-item>
      <el-form-item :label="$t('common.status')" prop="status">
        <el-select
          v-model="dataForm.status"
          class="filter-item"
          style="width: 90%;"
          :placeholder="$t('common.Please select')"
        >
          <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item"/>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('common.date')" prop="createTime">
        <el-date-picker
          v-model="dataForm.createTime"
          type="datetime"
          style="width: 90%;"
          :placeholder="$t('common.Please select')"
        />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">{{ $t('common.cancel') }}</el-button>
      <el-button type="primary" @click="dataFormSubmit()">{{ $t('common.save') }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {mapActions} from 'vuex'
import i18n from '@/i18n'

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
          {required: true, message: i18n.t('table.Title cannot be empty'), trigger: 'blur'}
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
          if (result && result.code === 200) {
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
            if (result && result.code === 200) {
              this.$notify({
                title: i18n.t('common.success'),
                showClose: true,
                message: i18n.t('common.Operation succeeded'),
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
                title: i18n.t('common.fail'),
                showClose: true,
                message: i18n.t('common.Operation failed'),
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
