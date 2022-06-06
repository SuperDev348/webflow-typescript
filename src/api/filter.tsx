import siteConfig from '../config/site.config'
import {
  apiDeleteToken,
  apiGetToken,
  apiPostToken,
  apiPatchToken,
} from './index'

async function create(data) {
  try {
    await apiPostToken(`${siteConfig.airtableUrl}/${siteConfig.careBundleId}/Filters`, data)
    return Promise.resolve({ message: 'success' })
  } catch (error) {
    return Promise.reject(error)
  }
}

async function update(data) {
  try {
    await apiPatchToken(`${siteConfig.airtableUrl}/${siteConfig.careBundleId}/Filters`, data)
    return Promise.resolve({ message: 'success' })
  } catch (error) {
    return Promise.reject(error)
  }
}

async function remove(id) {
  try {
    await apiDeleteToken(`${siteConfig.airtableUrl}/${siteConfig.careBundleId}/Filters/${id}`)
    return Promise.resolve({ message: 'success' })
  } catch (error) {
    return Promise.reject(error)
  }
}

async function get(id) {
  try {
    let res = await apiGetToken(`${siteConfig.airtableUrl}/${siteConfig.careBundleId}/Filters/${id}`)
    return Promise.resolve(res)
  } catch (error) {
    return Promise.reject(error)
  }
}

async function getAll() {
  try {
    let res = await apiGetToken(`${siteConfig.airtableUrl}/${siteConfig.careBundleId}/Filters`)
    return Promise.resolve(res)
  } catch (error) {
    return Promise.reject(error)
  }
}

async function getFilter(data) {
  try {
    let res = await apiGetToken(`${siteConfig.airtableUrl}/${siteConfig.careBundleId}/Filters?` + new URLSearchParams(data))
    return Promise.resolve(res)
  } catch (error) {
    return Promise.reject(error)
  }
}
export { create, update, remove, get, getAll, getFilter }
