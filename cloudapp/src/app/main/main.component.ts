import { Observable  } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import {Component, OnInit, OnDestroy, NgModule} from '@angular/core';
import {HttpClientModule, HttpClient} from '@angular/common/http'
import { CloudAppRestService, CloudAppEventsService, Request, HttpMethod,
  Entity, RestErrorResponse, AlertService,PageInfo,CloudAppSettingsService,EntityType,FormGroupUtil } from '@exlibris/exl-cloudapp-angular-lib';
import { MatRadioChange } from '@angular/material/radio';
import {FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
@NgModule({
  imports: [HttpClientModule, FormsModule]
})
export class MainComponent implements OnInit, OnDestroy {

  loading = false;
  selectedEntity: Entity;
  apiResult: any;

  // entities$: Observable<Entity[]> = this.eventsService.entities$
  // .pipe(tap(() => this.clear()))

  constructor(
    private restService: CloudAppRestService,
    private eventsService: CloudAppEventsService,
    private settingsService: CloudAppSettingsService,
    private translate: TranslateService,
    private alert: AlertService,
    private http: HttpClient,
    private router:Router
  ) { }

  ngOnInit() {
    //检测窗口大小
    // window.onresize = ()=>{
    //     if(window.innerWidth > 450){
    //         console.log( 'onresize:11')
    //     }else{
    //         console.log( 'onresize:222')
    //     }
    // }
    this.getCCKBbooklist()
  }

  ngOnDestroy(): void {

  }

  // entitySelected(event: MatRadioChange) {
  //   const value = event.value as Entity;
  //   this.loading = true;
  //   this.restService.call<any>(value.link)
  //   .pipe(finalize(()=>this.loading=false))
  //   .subscribe(
  //     result => this.apiResult = result,
  //     error => this.alert.error('Failed to retrieve entity: ' + error.message)
  //   );
  // }
  //
  // clear() {
  //   this.apiResult = null;
  //   this.selectedEntity = null;
  //
  //   // this.fetch_z311('0').then((res: any) => {
  //   //   console.log(res)
  //   // })
  // }
  //
  // update(value: any) {
  //   const requestBody = this.tryParseJson(value)
  //   if (!requestBody) return this.alert.error('Failed to parse json');
  //
  //   this.loading = true;
  //   let request: Request = {
  //     url: this.selectedEntity.link,
  //     method: HttpMethod.PUT,
  //     requestBody
  //   };
  //   this.restService.call(request)
  //   .pipe(finalize(()=>this.loading=false))
  //   .subscribe({
  //     next: result => {
  //       this.apiResult = result;
  //       this.eventsService.refreshPage().subscribe(
  //         ()=>this.alert.success('Success!')
  //       );
  //     },
  //     error: (e: RestErrorResponse) => {
  //       this.alert.error('Failed to update data: ' + e.message);
  //       console.error(e);
  //     }
  //   });
  // }
  //
  // private tryParseJson(value: any) {
  //   try {
  //     return JSON.parse(value);
  //   } catch (e) {
  //     console.error(e);
  //   }
  //   return undefined;
  // }
  //
  // fetch_z311(key: string) {
  //   return new Promise((resolve, reject) => {
  //     this.eventsService.getAuthToken().subscribe(
  //         data => {
  //           // this.http.get("http://cckb.lib.tsinghua.edu.cn/cckbapi/selectBookinfo/json", {
  //           //   headers: {
  //           //     'X-Proxy-Host': 'http://aleph20.exlibris.com.cn:8992',
  //           //     'Authorization': 'Bearer ' + data
  //           //   }
  //           // }).subscribe(function (data) {
  //           //   this.loading = false;
  //           //   resolve(data)
  //           // }, error => {
  //           //   this.loading = false;
  //           //   // this.alert.error();
  //           //   reject(error)
  //           // })
  //           var json = {"apikey":"562930543E3E090957C595704CF28BE4"};
  //           this.http.post("http://cckb.lib.tsinghua.edu.cn/cckbapi/selectBookinfo/json",json,{
  //               headers: {
  //                 'X-Proxy-Host': 'http://aleph20.exlibris.com.cn:8992',
  //                 'Authorization': 'Bearer ' + data
  //               }
  //           }).subscribe(function (data){
  //             resolve(data)
  //           },error =>  {
  //             resolve(error)
  //           })
  //         }
  //     );
  //
  //
  //     // resolve({seq: Math.ceil(Math.random() * 99)})
  //   })
  //
  // }




  getCCKBbooklist(){
        // this.eventsService.getAuthToken().subscribe(
        //     data => {
        //       var json = {"apikey":"56DA5ACAA4F823844EC62233EC029293"};
        //       this.http.get("https://api.exldevnetwork.net.cn"+"/cckbapi/almaBooklist",json,{
        //           headers: {
        //             'X-Proxy-Host': 'http://aleph20.exlibris.com.cn:8992',
        //             'Authorization': 'Bearer ' + data
        //           }
        //       }).subscribe(function (data){
        //         console.log(data)
        //       },error =>  {
        //         console.log(data)
        //       })
        //     }
        // );

      this.eventsService.getAuthToken().subscribe(
          data => {
              var json = {"apikey":"562930543E3E090957C595704CF28BE4"};
              this.http.post("https://api.exldevnetwork.net.cn" + "/cckbapi/almaBooklist",json, {
                  headers: {
                      'X-Proxy-Host': 'http://aleph20.exlibris.com.cn:8992',
                      'Authorization': 'Bearer ' + data
                  }
              }).subscribe(function (data) {
                  // this.loading = false;
                  // resolve(data)
              }, error => {
                  // this.loading = false;
                  // this.alert.error(this.translate.instant('i18n.error', {url: "https://api.exldevnetwork.net.cn" + lookupUrl.replace("KEY", key)}), {autoClose: true, delay: 3000});
                  // reject(error)
              })
          }
      );

  }




  setSettings(value: any) {
    this.loading = true;
    if(value){
      this.router.navigate(['/polsettings'])
    }else{
      this.router.navigate(['/cnasettings'])
    }
  }

}
