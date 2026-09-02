export function extractRecord(res) {
  return res?.data ?? res
}

export function extractList(res) {
  const payload = res?.data ?? res

  if (Array.isArray(payload)) {
    return { list: payload, meta: res?.meta ?? null }
  }

  if (payload && Array.isArray(payload.data)) {
    const { data, ...meta } = payload
    return { list: data, meta }
  }

  return { list: [], meta: null }
}
