import siteConfig from '../config/site.config'

function api(url, method, headers = {}, body = null) {
  try {
    return window
      .fetch(url, {
        method: method,
        headers: headers,
        body: body,
      })
      .then(async response => {
        const res = await response.json()
        if (response.ok) {
          return res
        } else {
          const error = {
            message: res.message,
          }
          return Promise.reject(error)
        }
      })
  } catch (error) {
    console.log(error)
    return Promise.reject(error)
  }
}

async function apiGet(url) {
  try {
    const res = await api(url, 'GET')
    return Promise.resolve(res)
  } catch (error) {
    return Promise.reject(error)
  }
}

async function apiGetToken(url, token = null) {
  try {
    if (token === null)
      token = siteConfig.token
    const res = await api(url, 'GET', {
      Authorization: `Bearer ${token}`,
    })
    return Promise.resolve(res)
  } catch (error) {
    return Promise.reject(error)
  }
}

async function apiGetAllToken(url, params = {}, token = null) {
  try {
    let offset = ""
    let res
    let records = []
    do {
      res = await apiGetToken(`${url}?${ new URLSearchParams({...params, offset: offset})}`, token)
      records = [...records, ...res.records]
      if(res.offset)
        offset = res.offset;
      else
        offset = "";
    } while (offset !== "");
    res.records = records
    return Promise.resolve(res)
  } catch (error) {
    return Promise.reject(error)
  }
}

async function apiPost(url, data) {
  try {
    const res = await api(
      url,
      'POST',
      {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      JSON.stringify(data),
    )
    return Promise.resolve(res)
  } catch (error) {
    return Promise.reject(error)
  }
}

async function apiPostToken(url, data, token = null) {
  try {
    if (token === null)
      token = siteConfig.token
    const res = await api(
      url,
      'POST',
      {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      JSON.stringify(data),
    )
    return Promise.resolve(res)
  } catch (error) {
    return Promise.reject(error)
  }
}

async function apiPut(url, data) {
  try {
    const res = await api(
      url,
      'PUT',
      {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      JSON.stringify(data),
    )
    return Promise.resolve(res)
  } catch (error) {
    return Promise.reject(error)
  }
}

async function apiPutToken(url, data, token = null) {
  try {
    if (token === null)
      token = siteConfig.token
    const res = await api(
      url,
      'PUT',
      {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      JSON.stringify(data),
    )
    return Promise.resolve(res)
  } catch (error) {
    return Promise.reject(error)
  }
}

async function apiPatch(url, data) {
  try {
    const res = await api(
      url,
      'PATCH',
      {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      JSON.stringify(data),
    )
    return Promise.resolve(res)
  } catch (error) {
    return Promise.reject(error)
  }
}

async function apiPatchToken(url, data, token = null) {
  try {
    if (token === null)
      token = siteConfig.token
    const res = await api(
      url,
      'PATCH',
      {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      JSON.stringify(data),
    )
    return Promise.resolve(res)
  } catch (error) {
    return Promise.reject(error)
  }
}

async function apiDelete(url, data = {}) {
  try {
    const res = await api(
      url,
      'DELETE',
      {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      JSON.stringify(data),
    )
    return Promise.resolve(res)
  } catch (error) {
    return Promise.reject(error)
  }
}

async function apiDeleteToken(url, data = {}, token = null) {
  try {
    if (token === null)
      token = siteConfig.token
    const res = await api(
      url,
      'DELETE',
      {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      JSON.stringify(data),
    )
    return Promise.resolve(res)
  } catch (error) {
    return Promise.reject(error)
  }
}

export {
  apiGet,
  apiPost,
  apiPut,
  apiPatch,
  apiDelete,
  apiGetToken,
  apiGetAllToken,
  apiPostToken,
  apiPutToken,
  apiPatchToken,
  apiDeleteToken,
}
