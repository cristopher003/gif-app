import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';


@Injectable({
  providedIn: 'root'
})

export class GifsService {

 public gifsList:Gif[]=[];

  private _tagsHistory:string[]=[]; 
  private APIKEY:string="F8xLj4VT74apCAdYjowBvEp2vFBIEZiS";
  private APIURL:string="https://api.giphy.com/v1/gifs";

  constructor(private hpptClient:HttpClient) { 
    this.loadLocalStorage();
  }

  get tagsHistory(){
    return [...this._tagsHistory];
  }

  public searchTag(newTag:string):void{
    if (newTag.length===0) {
      return;
    }

    const params=new HttpParams()
    .set('api_key',this.APIKEY )
    .set('limit','10')
    .set('q',newTag);

    this.hpptClient.get<SearchResponse>(`${this.APIURL}/search`,{params})
    .subscribe((resp)=>{ this.gifsList=resp.data});
  
    this.organizeHistiryTags(newTag);
  }


  private organizeHistiryTags(tag:string){
    tag=tag.toLowerCase();
    if (this._tagsHistory.includes(tag)) {
      this._tagsHistory=this._tagsHistory.filter((oldTag)=>oldTag!==tag);
    }
    this._tagsHistory.unshift(tag);
    this._tagsHistory=this._tagsHistory.slice(0,10);
    this.SaveLocalStorage();
  }

 private SaveLocalStorage(){
  localStorage.setItem("history",JSON.stringify(this._tagsHistory));
 }

 private loadLocalStorage(){
  if (!localStorage.getItem("history")) {
    return;
  }
  this._tagsHistory=JSON.parse(localStorage.getItem("history")!);
  if ( this._tagsHistory[0].length>0) {
    this.searchTag(this._tagsHistory[0]);
  }
 }
}
