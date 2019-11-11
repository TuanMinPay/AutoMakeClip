import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import axios from 'axios';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  @ViewChild("video")
  public video: ElementRef;

  @ViewChild("canvas")
  public canvas: ElementRef;

  constructor() {
  }

  searchResults: any = null;

  actionDisplay: any = null;
  actionRemove: any = null;

  listThumbnailStyle: any = [];

  dataVideo: any = {
    title: null,
    description: null,
    tags: null,
    list_video: [],
    thumb_style: null,
    thumb_arr: []
  }

  save() {
    console.log(this.dataVideo);
    
  }

  addVideoToList(item: any) {
    this.dataVideo.list_video.push(item);
  }

  removeVideoFromList(item: any) {
    this.dataVideo.list_video = this.dataVideo.list_video.filter((video: { id: any; }) => {
      return video.id != item.id;
    });
  }

  showAction(id) {
    this.actionDisplay = id;
  }

  hideAction() {
    this.actionDisplay = null;
  }

  showActionRemove(id) {
    this.actionRemove = id;
  }

  hideActionRemove() {
    this.actionRemove = null;
  }

  pageControl: any = [];

  getPager(totalItems: number, currentPage: number = 1, pageSize: number = 10) {
    // calculate total pages
    let totalPages = Math.ceil(totalItems / pageSize);

    // ensure current page isn't out of range
    if (currentPage < 1) {
      currentPage = 1;
    } else if (currentPage > totalPages) {
      currentPage = totalPages;
    }

    let startPage: number, endPage: number;
    if (totalPages <= 10) {
      // less than 10 total pages so show all
      startPage = 1;
      endPage = totalPages;
    } else {
      // more than 10 total pages so calculate start and end pages
      if (currentPage <= 6) {
        startPage = 1;
        endPage = 10;
      } else if (currentPage + 4 >= totalPages) {
        startPage = totalPages - 9;
        endPage = totalPages;
      } else {
        startPage = currentPage - 5;
        endPage = currentPage + 4;
      }
    }

    // calculate start and end item indexes
    let startIndex = (currentPage - 1) * pageSize;
    let endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

    // create an array of pages to ng-repeat in the pager control
    let pages = Array.from(Array((endPage + 1) - startPage).keys()).map(i => startPage + i);

    // return object with all pager properties required by the view
    return {
      totalItems: totalItems,
      currentPage: currentPage,
      pageSize: pageSize,
      totalPages: totalPages,
      startPage: startPage,
      endPage: endPage,
      startIndex: startIndex,
      endIndex: endIndex,
      pages: pages
    };
  }

  keyword: any = null;
  currentPage: any = 1;

  getData(keyword: { trim: () => string; }, page: number) {
    const that = this;
    that.keyword = keyword;
    axios.get(`${environment.getByKeyword}&tags_name=${keyword}&page=${page}`, {
      headers: {
        Authorization: 'Token 9b0c3ce80d34e89d40cbc9f3b30eeb2147c98eea'
      }
    }).then(function (response) {
      // handle success
      that.searchResults = response.data;

      that.pageControl = that.getPager(response.data.count, page);
      that.currentPage = page;
    }).catch(function (error) {
      // handle error
      console.log(error);
    });
  }

  changePageSearchResult(page) {
    if (this.currentPage == page) return;
    this.getData(this.keyword, page);
  }

  getVideoByKeyword(keyword: { trim: () => string; }) {
    if (keyword.trim() == '') return;
    this.getData(keyword, 1);
  }

  getItemVideo(id: any) {
    return this.searchResults.results.filter((item: { id: any; }) => {
      return item.id === id;
    })[0];
  }
  dataSelected: any = null;

  previewVideo(id: any) {
    this.dataSelected = null;
    var data: any = this.getItemVideo(id);
    this.dataSelected = data;
    console.log(data);
  }

  styleSelected: any = null;

  colBind: any = null;

  chooseStyleThumbnail(item: { id: any; group: number; }) {
    this.dataVideo.thumb_arr = [];
    this.styleSelected = item.id;
    if (item.group == 3) {
      this.colBind = 4;
    } else if (item.group == 5) {
      this.colBind = 2;
    }
    for (let i = 0; i < item.group; i++) {
      let obj = {
        id: (i + 1),
        image: "https://i.imgur.com/FWJMQaD.jpg"
      }
      this.dataVideo.thumb_arr.push(obj);
    }
  }

  chooseThumbnail: boolean = false;
  idThumbnailSelect: any = null;

  @ViewChild("target") target: ElementRef;

  editThumbnail(id) {
    this.idThumbnailSelect = id;
    this.chooseThumbnail = true;
    this.target.nativeElement.scrollIntoView();
  }

  ngOnInit() {
    this.listThumbnailStyle = environment.listStyle;
  }

  public async capture() {
    this.canvas.nativeElement.width = this.video.nativeElement.videoWidth;
    this.canvas.nativeElement.height = this.video.nativeElement.videoHeight;
    await this.canvas.nativeElement.getContext("2d").drawImage(this.video.nativeElement, 0, 0, this.video.nativeElement.videoWidth, this.video.nativeElement.videoHeight);
    this.dataVideo.thumb_arr.forEach(item => {
      if (item.id == this.idThumbnailSelect) {
        item.image = this.canvas.nativeElement.toDataURL("image/png");
        setTimeout(() => {
          this.chooseThumbnail = false;
        }, 1000);
      }
    });
  }
}
