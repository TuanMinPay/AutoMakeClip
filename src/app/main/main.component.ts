import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import axios from 'axios';
import { environment } from '../../environments/environment';
import { registerLocaleData } from '@angular/common';
import vi from '@angular/common/locales/vi';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { DragulaService } from 'ng2-dragula';

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

  constructor(
    private dragulaService: DragulaService
  ) {
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
    thumb_style: {
      style: null,
      thumb_arr: []
    },
  }

  listIdVideo: any = [];

  validateFormData: any = {
    title: false,
    description: false,
    tags: false
  }

  validateFunc() {
    var x = true;
    if (this.dataVideo.title == null) {
      this.validateFormData.title = true;
      x = false;
    } else {
      this.validateFormData.title = false;
    }
    if (this.dataVideo.description == null) {
      this.validateFormData.description = true;
      x = false;
    } else {
      this.validateFormData.description = false;
    }
    if (this.dataVideo.tags == null) {
      this.validateFormData.tags = true;
      x = false;
    } else {
      this.validateFormData.tags = false;
    }
    return x;
  }

  save() {
    if (this.validateFunc()) {
      console.log(this.dataVideo);
    }

  }

  addVideoToList(item: any) {
    this.dataVideo.list_video.push(item);
    this.listIdVideo.push(item.id);
    this.resetViewVideo();
  }

  removeVideoFromList(item: any) {
    this.dataVideo.list_video = this.dataVideo.list_video.filter((video: { id: any; }) => {
      return video.id != item.id;
    });
    this.listIdVideo = this.listIdVideo.filter((id) => {
      return id != item.id;
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
  noData: boolean = false;

  getData(objSearch, page) {
    const that = this;
    that.keyword = objSearch.keyword;
    axios.get(environment.getByKeyword(objSearch.region, objSearch.order_by, objSearch.sort_by, objSearch.keyword, page), {
      headers: {
        Authorization: 'Token 9b0c3ce80d34e89d40cbc9f3b30eeb2147c98eea'
      }
    }).then(function (response) {
      response.data.results.length == 0 ? that.noData = true : that.noData = false;
      that.searchResults = response.data;
      that.pageControl = that.getPager(response.data.count, page);
      that.currentPage = page;
    }).catch(function (error) {
      that.noData = true;
      console.log(error);
    });
  }

  changePageSearchResult(page) {
    if (this.currentPage == page) return;
    this.getData(this.searchObj, page);
  }

  getItemVideo(id: any) {
    return this.searchResults.results.filter((item: { id: any; }) => {
      return item.id === id;
    })[0];
  }
  dataSelected: any = null;

  openModal: boolean = false;

  captureImage(id: any) {
    this.openModal = true;
    this.dataSelected = this.dataVideo.list_video.filter((item: { id: any; }) => {
      return item.id === id;
    })[0];
  }

  previewVideo(id: any, open: boolean) {
    this.openModal = open;
    this.dataSelected = this.getItemVideo(id);
  }

  resetViewVideo() {
    setTimeout(() => {
      this.dataSelected = null;
      this.openModal = false;
    }, 100);
  }

  styleSelected: any = null;

  chooseStyleThumbnail(item: { id: any; group: number; }) {
    this.styleSelected = item.id;
    this.dataVideo.thumb_style.style = item;

    if (this.dataVideo.thumb_style.thumb_arr.length == 0) {
      for (let i = 1; i <= 5; i++) {
        let obj = {
          id: i,
          image: "/assets/imgs/default_thumbnail.jpg"
        }
        this.dataVideo.thumb_style.thumb_arr.push(obj);
      }
    } else {
      if (item.group == 5) return;
      for (let j = 3; j < this.dataVideo.thumb_style.thumb_arr.length; j++) {
        const el = this.dataVideo.thumb_style.thumb_arr[j];
        if (el == undefined) return;
        if (el.image.indexOf(";base64,") != -1) {
          for (let k = 0; k < 3; k++) {
            const _el = this.dataVideo.thumb_style.thumb_arr[k];
            if (_el == undefined) return;
            if (_el.image.indexOf(";base64,") == -1) {
              _el.image = el.image;
              el.image = "/assets/imgs/default_thumbnail.jpg";
            }
          }
        }
      }
    }
  }

  chooseThumbnail: boolean = false;
  idThumbnailSelect: any = null;

  editThumbnail(id) {
    this.idThumbnailSelect = id;
    this.chooseThumbnail = true;
  }

  searchObj: any = {
    keyword: null,
    region: null,
    order_by: 'id',
    sort_by: 'desc'
  }

  validateSearch: any = {
    keyword: false
  }

  validateSearchFunc() {
    var x = true;
    if (this.searchObj.keyword == null) {
      this.validateSearch.keyword = true;
      x = false;
    } else {
      this.validateSearch.keyword = false;
    }
    return x;
  }

  search() {
    if (this.validateSearchFunc()) {
      this.getData(this.searchObj, 1);
    }
  }

  ngOnInit() {
    this.listThumbnailStyle = environment.listStyle;
    registerLocaleData(vi);
    this.dragulaService.createGroup('LIST_VIDEO', {});
  }
  
  dropThumbnail(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.dataVideo.thumb_style.thumb_arr, event.previousIndex, event.currentIndex);
  }

  gettime(StrTime: number) {
    var mins = Math.floor(StrTime / 60);
    var secs = StrTime - mins * 60;
    var hrs = Math.floor(StrTime / 3600);
    return (hrs > 9 ? hrs : "0" + hrs) + ":" + (mins > 9 ? mins : "0" + mins) + ":" + (secs > 9 ? secs : "0" + secs);
  }

  public async capture() {
    this.canvas.nativeElement.width = this.video.nativeElement.videoWidth;
    this.canvas.nativeElement.height = this.video.nativeElement.videoHeight;
    await this.canvas.nativeElement.getContext("2d").drawImage(this.video.nativeElement, 0, 0, this.video.nativeElement.videoWidth, this.video.nativeElement.videoHeight);
    this.dataVideo.thumb_style.thumb_arr.forEach(item => {
      if (item.id == this.idThumbnailSelect) {
        item.image = this.canvas.nativeElement.toDataURL("image/png");
        this.resetViewVideo();
        setTimeout(() => {
          this.chooseThumbnail = false;
        }, 100);
      }
    });
  }
}
