import siteConfig from '../config/site.config'
import {
  apiDeleteToken,
  apiGetToken,
  apiPostToken,
  apiPatchToken,
} from './index'

async function create(data) {
  try {
    const res = await apiPostToken(`${siteConfig.airtableUrl}/${siteConfig.careBundleId}/Blocks`, data)
    return Promise.resolve(res)
  } catch (error) {
    return Promise.reject(error)
  }
}

async function updateFields(data) {
  try {
    const tmp = {
      fields: {
        block_type: data?.fields?.block_type,
        edges: data?.fields?.edges ? data?.fields?.edges : [],
        protocol: data?.fields?.protocol,
        dosages: data?.fields?.dosages ? data?.fields?.dosages : [],
        qualifiers: data?.fields?.qualifiers ? data?.fields?.qualifiers : [],
        tests: data?.fields?.tests ? data?.fields?.tests : [],
        findings: data?.fields?.findings ? data?.fields?.findings : [],
        presentations: data?.fields?.presentations
          ? data?.fields?.presentations
          : [],
        keypoints: data?.fields?.keypoints ? data?.fields?.keypoints : [],
        diseases: data?.fields?.diseases ? data?.fields?.diseases : [],
        specialties: data?.fields?.specialties
          ? data?.fields?.specialties
          : [],
        pathways: data?.fields?.pathways ? data?.fields?.pathways : [],
        calculators: data?.fields?.calculators
          ? data?.fields?.calculators
          : [],
        references: data?.fields?.references ? data?.fields?.references : [],
        periods: data?.fields?.periods ? data?.fields?.periods : [],
        handouts: data?.fields?.handouts ? data?.fields?.handouts : [],
        expressions: data?.fields?.expressions
          ? data?.fields?.expressions
          : [],
        custom: data?.fields?.custom ? data?.fields?.custom : '',
        note: data?.fields?.note ? data?.fields?.note : '',
        contact_methods: data?.fields?.contact_methods ? data?.fields?.contact_methods : '',
      },
    }
    const res = await apiPatchToken(`${siteConfig.airtableUrl}/${siteConfig.careBundleId}/Blocks/${data.id}`, tmp)
    return Promise.resolve(res)
  } catch (error) {
    return Promise.reject(error)
  }
}

async function update(data) {
  try {
    await apiPatchToken(`${siteConfig.airtableUrl}/${siteConfig.careBundleId}/Blocks`, data)
    return Promise.resolve({ message: 'success' })
  } catch (error) {
    return Promise.reject(error)
  }
}

async function remove(id) {
  try {
    await apiDeleteToken(`${siteConfig.airtableUrl}/${siteConfig.careBundleId}/Blocks/${id}`)
    return Promise.resolve({ message: 'success' })
  } catch (error) {
    return Promise.reject(error)
  }
}

async function get(id) {
  try {
    let res = await apiGetToken(`${siteConfig.airtableUrl}/${siteConfig.careBundleId}/Blocks/${id}`)
    return Promise.resolve(res)
  } catch (error) {
    return Promise.reject(error)
  }
}

async function getAll() {
  try {
    let res = await apiGetToken(`${siteConfig.airtableUrl}/${siteConfig.careBundleId}/Blocks`)
    return Promise.resolve(res)
  } catch (error) {
    return Promise.reject(error)
  }
}

async function getFilter(data) {
  try {
    let res = await apiGetToken(`${siteConfig.airtableUrl}/${siteConfig.careBundleId}/Blocks?` + new URLSearchParams(data))
    return Promise.resolve(res)
  } catch (error) {
    return Promise.reject(error)
  }
}

export { create, updateFields, update, remove, get, getAll, getFilter }
