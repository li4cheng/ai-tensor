import request from '@/utils/request'

// 数据上传到中心
export function getCoreSync() {
  return request({
    url: '/api/ai/common/pushCenter',
    method: 'get'
  })
}

// 重写人脸库缓存
export function getRewriteToRedis() {
  return request({
    url: '/api/ai/image/rewriteToRedis',
    method: 'get'
  })
}

// 重置人脸库
export function getResetFaceLabel() {
  return request({
    url: '/api/ai/image/resetFaceLabel',
    method: 'get'
  })
}