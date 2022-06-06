import siteConfig from '../config/site.config'
import {
  apiGetToken,
} from './index'

async function get(type, id) {
  try {
    let res = await apiGetToken(`${siteConfig.pathwayApiUrl}/${type}/pathway-ui2@1.0.x/${id}`, siteConfig.pathwayToken)
    return Promise.resolve(res)
  } catch (error) {
    return Promise.reject(error)
  }
}

export { get }
