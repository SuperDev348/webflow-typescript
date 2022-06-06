import siteConfig from '../config/site.config'
import {
  apiDeleteToken,
  apiGetToken,
  apiPostToken,
  apiPatchToken,
} from './index'

async function create(data) {
  try {
    const res = await apiPostToken(`${siteConfig.airtableUrl}/${siteConfig.careBundleId}/Bundles`, data)
    return Promise.resolve(res)
  } catch (error) {
    return Promise.reject(error)
  }
}

async function update(data) {
  try {
    const res = await apiPatchToken(`${siteConfig.airtableUrl}/${siteConfig.careBundleId}/Bundles`, data)
    return Promise.resolve(res)
  } catch (error) {
    return Promise.reject(error)
  }
}

async function remove(id) {
  try {
    const res = await apiDeleteToken(`${siteConfig.airtableUrl}/${siteConfig.careBundleId}/Bundles/${id}`)
    return Promise.resolve(res)
  } catch (error) {
    return Promise.reject(error)
  }
}

async function get(id) {
  try {
    let res = await apiGetToken(`${siteConfig.airtableUrl}/${siteConfig.careBundleId}/Bundles/${id}`)
    return Promise.resolve(res)
  } catch (error) {
    return Promise.reject(error)
  }
}

async function getAll() {
  try {
    let res = await apiGetToken(`${siteConfig.airtableUrl}/${siteConfig.careBundleId}/Bundles`)
    return Promise.resolve(res)
  } catch (error) {
    return Promise.reject(error)
  }
}

export { create, update, remove, get, getAll }
