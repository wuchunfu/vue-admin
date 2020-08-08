const tokens = {
  admin: {
    token: 'admin-token'
  }
}

export default [
  // user login
  {
    url: '/vue-admin/user/login',
    type: 'post',
    response: config => {
      const {username} = config.body
      const token = tokens[username]
      if (!token) {
        return {
          code: 1,
          data: null,
          msg: 'Wrong account or password.'
        }
      }
      return {
        code: 0,
        data: token,
        msg: 'Account login succeeded.'
      }
    }
  },
  // user logout
  {
    url: '/vue-admin/user/logout',
    type: 'post',
    response: () => {
      return {
        code: 0,
        data: null,
        msg: 'Account exit succeeded.'
      }
    }
  }
]
