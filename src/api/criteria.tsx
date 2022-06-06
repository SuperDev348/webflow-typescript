import siteConfig from '../config/site.config'
import {
  apiDeleteToken,
  apiGetToken,
  apiPostToken,
  apiPatchToken,
} from './index'

async function create(data) {
  try {
    const res = await apiPostToken(`${siteConfig.airtableUrl}/${siteConfig.careBundleId}/Criteria`, data)
    return Promise.resolve(res)
  } catch (error) {
    return Promise.reject(error)
  }
}

async function update(data) {
  try {
    const res = await apiPatchToken(`${siteConfig.airtableUrl}/${siteConfig.careBundleId}/Criteria`, data)
    return Promise.resolve(res)
  } catch (error) {
    return Promise.reject(error)
  }
}

async function remove(id) {
  try {
    await apiDeleteToken(`${siteConfig.airtableUrl}/${siteConfig.careBundleId}/Criteria/${id}`)
    return Promise.resolve({ message: 'success' })
  } catch (error) {
    return Promise.reject(error)
  }
}

async function get(id) {
  try {
    let res = await apiGetToken(`${siteConfig.airtableUrl}/${siteConfig.careBundleId}/Criteria/${id}`)
    return Promise.resolve(res)
  } catch (error) {
    return Promise.reject(error)
  }
}

async function getAll() {
  try {
    let res = await apiGetToken(`${siteConfig.airtableUrl}/${siteConfig.careBundleId}/Criteria`)
    return Promise.resolve(res)
  } catch (error) {
    return Promise.reject(error)
  }
}

async function getFilter(data) {
  try {
    let res = await apiGetToken(`${siteConfig.airtableUrl}/${siteConfig.careBundleId}/Criteria?` + new URLSearchParams(data))
    return Promise.resolve(res)
  } catch (error) {
    return Promise.reject(error)
  }
}
export { create, update, remove, get, getAll, getFilter }
