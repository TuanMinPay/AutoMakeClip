export const environment = {
  production: true,
  getByKeyword(limit: any, region: { trim: () => void; }, order_by: { trim: () => void; }, order_type: any, tags: { trim: () => void; }, page: any) { return `http://54.37.84.131:8088/api/v1/video/?limit=${limit}&region=${region.trim()}&order_by=${order_by.trim()}&order_type=${order_type}&tags_name=${tags.trim()}&page=${page}` },
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
