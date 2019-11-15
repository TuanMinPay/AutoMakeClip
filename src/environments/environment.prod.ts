export const environment = {
  production: true,
  getByKeyword(region: any, order_by: any, order_type: any, tags: any, page: any) {
    return `/api/v1/video/?order_type=${order_type}&tags_name=${tags}&page=${page}${(region != null) ? `&region=${region}` : ''}${(order_by != null) ? `&order_by=${order_by}` : ''}`
  },
  uploadImage: '/api/v1/upload/',
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
