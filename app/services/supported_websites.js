export class SupportedWebsitesAPI {
  constructor($http) {
    this.apiUrl = 'http://52.42.17.220:5000'
    this.http = $http

  }

  static serviceName() {
    return ''
  }

  searchSupportedWebsites(query, page, pageSize) {
    return this.http.get(this.apiUrl + '/websitesupport/sites', {
      params: {
        query: query,
        page: page,
        pageSize: pageSize
      }
    }).then(resp => {
        return resp.data.data
    })
  }

  getFeaturedWebsites() {
    return this.http.get(this.apiUrl + '/websitesupport/sites/featured')
      .then(resp => {
        return resp.data.data
      })
  }

}

export var SERVICE_NAME = "SupportedWebsitesAPI"
export var SERVICE = SupportedWebsitesAPI

