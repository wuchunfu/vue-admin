import {param2Obj} from '@/utils/index.js'

describe('Utils:param2Obj', () => {
  const url = 'https://github.com/wuchunfu/vue-admin?name=mask&age=18&sex=1&field=dGVzdA==&key=%E6%B5%8B%E8%AF%95'

  it('param2Obj test', () => {
    expect(param2Obj(url)).toEqual({
      name: 'mask',
      age: '18',
      sex: '1',
      field: window.btoa('test'),
      key: '测试'
    })
  })
})
