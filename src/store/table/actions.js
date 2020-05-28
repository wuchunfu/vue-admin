import {getRequest, postRequest} from '@/utils/api'

export default {
  // get table list
  getList({state}, payload) {
    return new Promise((resolve, reject) => {
      const params = {
        'page': payload.pageIndex,
        'limit': payload.pageSize,
        'title': payload.title
      }
      getRequest('/vue-admin/table/list', params).then(response => {
        // console.log(response)
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // get table info
  getTableInfo({state}, payload) {
    return new Promise((resolve, reject) => {
      getRequest(`/vue-admin/table/info/${payload.rowId}`).then(response => {
        // console.log(response)
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // get table save or update
  getTableSaveOrUpdate({state}, payload) {
    return new Promise((resolve, reject) => {
      postRequest(`/vue-admin/table/${!payload.rowId ? 'save' : 'update'}`, payload).then(response => {
        // console.log(response)
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // delete table row
  getDeleteRow({state}, payload) {
    return new Promise((resolve, reject) => {
      postRequest('/vue-admin/table/delete', payload.rowIds).then(response => {
        // console.log(response)
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  }
}
