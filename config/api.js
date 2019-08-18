/**
 * @Author: jrucker
 * @Description
 * @Date: 2018/12/27 下午9:05
 * @Last Modified by: jrucker
 * @Last Modified time: 2018/12/27 下午9:05
 */

const build = {
  static_url: 'http://admin.jrucker.cn/', // 静态资源路径
  common_url: 'http://admin.jrucker.cn',
};
const build_dev = {
  static_url: 'http://static-admin.jrucker.cn:8092/', // 静态资源路径
  common_url: 'http://admin.jrucker.cn:8092',
};
const dev = {
  static_url: 'http://localhost:8092/', // 静态资源路径
  common_url: 'http://localhost:8092',
};

module.exports = {build, build_dev, dev};

