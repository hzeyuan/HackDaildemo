// 使用 fetch 发送 POST 请求

export async function fetchCharacters(pagination, filters = [], order = []) {
  // 定义请求的 URL 和参数
  const url = 'https://aibackend.usesless.com/api/cms/public/characters'

  let queryStr = `pagination[page]=${pagination.page}&pagination[pageSize]=${pagination.pageSize}`

  if (order.length === 1) {
    queryStr += `&sort=${order[0].field}${order[0].order ? `:${order[0].order}` : ''}`
  }
  // Handle multiple sort fields
  else if (order.length > 1) {
    for (let i = 0; i < order.length; i++)
      queryStr += `&sort[${i}]=${order[i].field}${order[i].order ? `:${order[i].order}` : ''}`
  }

  for (let i = 0; i < filters.length; i++) {
    const filter = filters[i]
    if (filter.operator === '=') {
      queryStr += `&filters[${filter.field}]=${filter.value}`
    } else {
      queryStr += `&filters[${filter.field}][${filter.operator}]=${filter.value}`
    }
  }

  // alert(`${url}?${queryStr}`)

  return (
    fetch(`${url}?${queryStr}`, {
      method: 'GET',
    })
      .then((response) => {
        // if (!response.ok) {
        //     throw new Error('Network response was not ok ' + response.statusText);
        // }
        return response.json() // 解析并返回 JSON 数据
      })
      // .then(data => {
      //     console.log(data);  // 在控制台中打印获取到的数据
      // })
      .catch((error) => {
        console.error('There has been a problem with your fetch operation:', error)
      })
  )
}
