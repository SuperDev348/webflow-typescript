import siteConfig from '../config/site.config'
import {
  apiDeleteToken,
  apiGetToken,
  apiPostToken,
  apiPatchToken,
} from './index'

async function create(data) {
  try {
    await apiPostToken(`${siteConfig.airtableUrl}/${siteConfig.careBundleId}/Presentations`, data)
    return Promise.resolve({ message: 'success' })
  } catch (error) {
    return Promise.reject(error)
  }
}

async function update(data) {
  try {
    await apiPatchToken(`${siteConfig.airtableUrl}/${siteConfig.careBundleId}/Presentations`, data)
    return Promise.resolve({ message: 'success' })
  } catch (error) {
    return Promise.reject(error)
  }
}

async function remove(id) {
  try {
    await apiDeleteToken(`${siteConfig.airtableUrl}/${siteConfig.careBundleId}/Presentations/${id}`)
    return Promise.resolve({ message: 'success' })
  } catch (error) {
    return Promise.reject(error)
  }
}

async function get(id) {
  try {
    let res = await apiGetToken(
      `${siteConfig.airtableUrl}/${siteConfig.careBundleId}/Presentations/${id}`,
    )
    return Promise.resolve(res)
  } catch (error) {
    return Promise.reject(error)
  }
}

async function getAll() {
  try {
    let res = await apiGetToken(`${siteConfig.airtableUrl}/${siteConfig.careBundleId}/Presentations`)
    return Promise.resolve(res)
  } catch (error) {
    return Promise.reject(error)
  }
}

export { create, update, remove, get, getAll }
