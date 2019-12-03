// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  getByKeyword(region: any, order_by: any, order_type: any, tags: any, page: any) {
    return `http://xx.xx.xx.xx.xxx/api/v1/video/?order_type=${order_type}&tags_name=${tags}&page=${page}${(region != null) ? `&region=${region}` : ''}${(order_by != null) ? `&order_by=${order_by}` : ''}`
  },
  uploadImage: `http://xx.xx.xx.xx.xxx/api/v1/upload/`,
  saveApi: `http://xx.xx.xx.xx.xxx/api/v1/make/`,
  configApi: 'http://xx.xx.xx.xx.xxx/api/v1/config/',
  getOldClip(channel_id: any) { return `http://xx.xx.xx.xx.xxx/api/v1/make/?channel_id=${channel_id}` },
  make: 'http://xx.xx.xx.xx.xxx/makevideo',
  updateConfig(id: any) { return `http://xx.xx.xx.xx.xxx/api/v1/config/${id}/` },
  getConfig(channel_id: any) { return `http://xx.xx.xx.xx.xxx/api/v1/config/?channel_id=${channel_id}` },
  youtubeChannelInfo(id: any) { return `/api/v1/channel/${id}` },
  listStyle: [{
    id: 1,
    group: 3,
    tilt: "right",
    name: "Style 1",
    image: "https://i.imgur.com/83xaPSq.jpg"
  }, {
    id: 2,
    group: 3,
    tilt: "left",
    name: "Style 2",
    image: "https://i.imgur.com/SzSbT0V.jpg"
  }, {
    id: 3,
    group: 3,
    tilt: "center",
    name: "Style 3",
    image: "https://i.imgur.com/FWJMQaD.jpg"
  }, {
    id: 4,
    group: 5,
    tilt: "right",
    name: "Style 4",
    image: "https://i.imgur.com/GmU3ZJq.jpg"
  }, {
    id: 5,
    group: 5,
    tilt: "left",
    name: "Style 5",
    image: "https://i.imgur.com/T1DwCQV.jpg"
  }]
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
