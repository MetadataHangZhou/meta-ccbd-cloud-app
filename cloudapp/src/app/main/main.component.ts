import {Observable, Subscription} from 'rxjs';
import {finalize, switchMap, tap} from 'rxjs/operators';
import {Component, OnInit, OnDestroy, NgModule,ChangeDetectorRef} from '@angular/core';
import {HttpClientModule, HttpClient, HttpHeaders} from '@angular/common/http'
import {
    CloudAppRestService, CloudAppEventsService, Request, HttpMethod,
    Entity, RestErrorResponse, AlertService, PageInfo, CloudAppSettingsService, EntityType, FormGroupUtil
} from '@exlibris/exl-cloudapp-angular-lib';
import {MatRadioChange} from '@angular/material/radio';
import {FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
@NgModule({
    imports: [HttpClientModule, FormsModule]
})
export class MainComponent implements OnInit, OnDestroy {

    private pageLoad$: Subscription;
    pageEntities: Entity[];
    private _apiResult: any;

    private loading = false;
    private values:String = '';
    private _almaBooklist:any;
    private apikey= "562930543E3E090957C595704CF28BE4";
    private libcode= "233030";
    private img = "https://api.exldevnetwork.net.cn/proxy/proxy/C/35043/4299354-fm.jpg!cckb_b"

    constructor(
        private restService: CloudAppRestService,
        private eventsService: CloudAppEventsService,
        private settingsService: CloudAppSettingsService,
        private translate: TranslateService,
        private alert: AlertService,
        private http: HttpClient,
        private router: Router,
        public changeDetector: ChangeDetectorRef
    ) {
    }

    ngOnInit() {
        //检测窗口大小
        // window.onresize = ()=>{
        //     if(window.innerWidth > 450){
        //         console.log( 'onresize:11')
        //     }else{
        //         console.log( 'onresize:222')
        //     }
        // }
        this.pageLoad$ = this.eventsService.onPageLoad(this.onPageLoad);
        this.getCCKBbooklist(this.values).then((res: any) => {
            let results = res.datalist;
            this.almaBooklist = results
            let list = results || [];
            // list.forEach((item, index) => {
            //     let img = item.picfile.replace('http://cckb.lib.tsinghua.edu.cn',"https://api.exldevnetwork.net.cn/proxy")
            //     item['imgs'] = img;
            //     this.getCCKBpic(img).then((img:any)=>{
            //         // console.log(img)
            //     })
            //     this.almaBooklist.push(item);
            // });

        })
    }

    ngOnDestroy(): void {
        this.pageLoad$.unsubscribe();
    }

    onPageLoad = (pageInfo: PageInfo) => {
        this.pageEntities = pageInfo.entities;
        // if ((pageInfo.entities || []).length == 1) {
        //     const entity = pageInfo.entities[0];
        //     if (entity.type === EntityType.BIB_MMS) {
        //         this.restService.call(entity.link).subscribe(result => {
        //             this._apiResult = result
        //             this.parseRes(this._apiResult)
        //         });
        //     }
        //
        // } else {
        //     this._apiResult = {};
        // }
    }

    parseRes(value:any){
        //parse api for page
        let anies = value.anies[0]
        // const doc = new DOMParser().parseFromString(anies, "application/xml");
        // let field100='';
        // // console.log(doc)
        // //extract the data in field "ldr"
        // let fieldldr = doc.getElementsByTagName("leader")[0].innerHTML
        // // console.log(fieldldr.substring(7,8))
        //
        // //extract the data in field "100"
        // Array.from(doc.getElementsByTagName("datafield")).forEach(datafield =>{
        //     if(datafield.getAttribute("tag") == '100'){
        //         Array.from(datafield.getElementsByTagName("subfield")).forEach(subfield => {
        //             if ('a' == subfield.getAttribute("code")) {
        //                 field100 = subfield.textContent
        //             }
        //         });
        //
        //     }
        // })

        // if(fieldldr.substring(7,8) == 'm' && field100.substring(22,25) == 'chi'){
        //     //When conditions are unique, the year of publication must be carried
        //     this.Publishedyear = true;
        // }
        // this.year = field100.substring(9,13);
    }

    get almaBooklist() {
        return this._almaBooklist;
    }

    set almaBooklist(result: any) {
        this._almaBooklist = result;
    }

    imgerror(e){
        const defaultImg = '../../assets/fm_img.png';
        e.srcElement.src = defaultImg;
    }

    toDetails(id:any){
        this.router.navigate(['/bookdetail'],{queryParams: { id: id }})
    }

    search() {
        this.getCCKBbooklist(this.values).then((res: any) => {
            this.almaBooklist = res.datalist
        })

    }

    getCCKBbooklist(value:any) {
        let json = {
            "apikey":'562930543E3E090957C595704CF28BE4',
            "libcode":'233030',
            "pagesize":'10',
            "field":'isbn',
            "value":value
        }
        let jsons = `apikey=${json.apikey}&libcode=${json.libcode}&pagesize=${json.pagesize}&field=${json.field}&value=${json.value}`
        return new Promise((resolve, reject) => {
            this.eventsService.getAuthToken().subscribe(
                data => {
                    this.http.get(`https://api.exldevnetwork.net.cn/proxy/cckbapi/almaBooklist?${jsons}`, {
                        headers: {
                            'X-Proxy-Host': 'https://cckb.lib.tsinghua.edu.cn',
                            'Authorization': 'Bearer ' + data
                        }
                    }).subscribe(function (data) {
                        // this.loading = false;
                        resolve(data)
                    }, error => {
                        // this.loading = false;
                        // this.alert.error(this.translate.instant('i18n.error', {url: "https://api.exldevnetwork.net.cn" + lookupUrl.replace("KEY", key)}), {autoClose: true, delay: 3000});
                        reject(error)
                    })
                }
            );

        })
    }

    getCCKBpic(value:any) {
        return new Promise((resolve, reject) => {
            this.eventsService.getAuthToken().subscribe(
                data => {
                    // https://api.exldevnetwork.net.cn/proxy/${value}
                    this.http.get(value, {
                        headers: {
                            'X-Proxy-Host': 'http://cckb.lib.tsinghua.edu.cn',
                            'Authorization': 'Bearer ' + data
                        }
                    }).subscribe(function (data) {
                        // this.loading = false;
                        resolve(data)
                    }, error => {
                        // this.loading = false;
                        // this.alert.error(this.translate.instant('i18n.error', {url: "https://api.exldevnetwork.net.cn" + lookupUrl.replace("KEY", key)}), {autoClose: true, delay: 3000});
                        reject(error)
                    })
                }
            );

        })
    }



    setSettings(value: any) {
        this.loading = true;
        if (value) {
            this.router.navigate(['/polsettings'])
        } else {
            this.router.navigate(['/cnasettings'])
        }
    }

}
