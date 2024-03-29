import {Observable, Subscription} from 'rxjs';
import {finalize, switchMap, tap} from 'rxjs/operators';
import {Component, OnInit, OnDestroy, NgModule, ChangeDetectorRef, OnChanges, SimpleChanges} from '@angular/core';
import {HttpClientModule, HttpClient, HttpHeaders} from '@angular/common/http'
import {
    CloudAppRestService, CloudAppEventsService, Request, HttpMethod,
    Entity, RestErrorResponse, AlertService, PageInfo, CloudAppSettingsService, EntityType, FormGroupUtil
} from '@exlibris/exl-cloudapp-angular-lib';
import {MatRadioChange} from '@angular/material/radio';
import {FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import { GlobalService } from '../models/GlobalService';

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
    hasApiResult: boolean = false;
    types: String = 'all';
    booktypes = '0';
    loading = true;
    values: String = '';
    private almaList: any;
    private _almaBooklist: any;
    boxSize = GlobalService.boxSize;
    private _almabooktypes: any;
    publish = '';
    publishyear = '';
    isbn = '';
    pagenum = 1;
    pagesize = 16;
    totals:any;
    private sortOnMark = '';
    private apikey = "A1E4D4AE9734F16DBE01DE331C893F97";
    libcode:any;
    lang:boolean = false;

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
        let meta = document.createElement('meta')
        let firstChild = document.head.firstChild
        meta.name = "referrer"
        meta.content = "no-referrer"
        document.head.insertBefore(meta, firstChild)
        this.eventsService.getInitData().subscribe(data=> {
            if(data.lang === 'en'){
                this.lang = false
            }else{
                this.lang = true
            }
            this.libcode = data.instCode
            this.getCCKBbooklist('').then((res: any) => {
                this.loading = false;
                // let results = res.datalist;
                let results = res
                this.almaBooklist = results
                this.totals = results.total
                // this.almaList = results.datalist
                // let list = results || [];
                // list.forEach((item, index) => {
                //     let img = item.picfile.replace('http://cckb.lib.tsinghua.edu.cn',"https://api.exldevnetwork.net.cn/proxy")
                //     item['imgs'] = img;
                //     this.getCCKBpic(img).then((img:any)=>{
                //         // console.log(img)
                //     })
                //     this.almaBooklist.push(item);
                // });

            })

        });
        //检测窗口大小
        window.onresize = () => {
            if (window.innerWidth > 450) {
                GlobalService.boxSize = true;
                this.pagenum = 1
            } else {
                this.pagenum = 1
                GlobalService.boxSize = false;
            }
            this.boxSize = GlobalService.boxSize
        }
        this.pageLoad$ = this.eventsService.onPageLoad(this.onPageLoad);

        this.getAlmaBooktype().then((res: any) => {
            let result = res
            this.almabooktypes = result.almalist
        })

    }

    ngOnDestroy(): void {
        this.pageLoad$.unsubscribe();
    }

    onPageLoad = (pageInfo: PageInfo) => {
        this.pageEntities = pageInfo.entities;
        if ((pageInfo.entities || []).length == 1) {
            const entity = pageInfo.entities[0];
            if (entity.type === EntityType.BIB_MMS) {
                this.restService.call(entity.link).subscribe(result => {
                    this._apiResult = result
                    this.parseRes(this._apiResult)
                });

            }

        } else {
            this._apiResult = {};
        }
    }

    parseRes(value: any) {
        //parse api for page
        let anies = value.anies[0]
        const doc = new DOMParser().parseFromString(anies, "application/xml");
        Array.from(doc.getElementsByTagName("datafield")).forEach(datafield => {
            if (datafield.getAttribute("tag") == '010') {
                Array.from(datafield.getElementsByTagName("subfield")).forEach(subfield => {
                    if ('a' == subfield.getAttribute("code")) {
                        let isbnKeyWord = subfield.textContent.replace(/-/g, "");
                        this.isbn = isbnKeyWord
                    }
                });

            }
        })

        this.pagenum = 1
        this.types = 'isbn'
        this.getCCKBbooklist(this.isbn).then((res: any) => {
            let results = res
            // this.almaBooklist = results
            let almaList = []
            almaList = results.almalist
            if (almaList.length > 0) {
                let id = almaList[0].cckbid
                this.router.navigate(['/bookdetail'], {queryParams: {id: id}})
            }
        })

    }

    get apiResult() {
        return this._apiResult;
    }

    set apiResult(result: any) {
        this._apiResult = result;
        this.hasApiResult = result && Object.keys(result).length > 0;
    }

    get almaBooklist() {
        return this._almaBooklist;
    }

    set almaBooklist(result: any) {
        this._almaBooklist = result;
    }

    get almabooktypes() {
        return this._almabooktypes;
    }

    set almabooktypes(result: any) {
        this._almabooktypes = result;
    }

    imgerror(e) {
        const defaultImg = '/assets/fm_img.png';
        e.srcElement.src = defaultImg;
    }

    toDetails(id: any) {
        this.router.navigate(['/bookdetail'], {queryParams: {id: id}})
    }

    search() {
        this.pagenum = 1
        this.getCCKBbooklist(this.values).then((res: any) => {
            this.almaBooklist = res
            this.totals = res.total
        })
    }

    getCCKBbooklist(value: String) {
        let field;
        if(this.boxSize){
            // field = `[{"key":"${this.types}","value":"${value}"},
            //     {"key":"publish","value":"${this.publish}",
            //     {"key":"publishyear","value":"${this.publishyear}"
            // ]`
            let fieldlist = []
            if(value){
                let item = {"key":`${this.types}`,"value":`${value}`}
                fieldlist.push(item)
            }
            if(this.publish){
                let item = {"key":"publish","value":`${this.publish}`}
                fieldlist.push(item)
            }

            if(this.publishyear){
                let item = {"key":"publishyear","value":`${this.publishyear}`}
                fieldlist.push(item)
            }

            field = JSON.stringify(fieldlist)

        }else{
            field = `[{"key":"${this.types}","value":"${value}"}]`
        }
        let json = {
            "apikey": 'A1E4D4AE9734F16DBE01DE331C893F97',
            "libcode": this.libcode,
            "pagesize": this.pagesize,
            "pagenum": this.pagenum,
            "field": field,
            "booktype": this.booktypes,//书单id
        }
        let jsons = encodeURI(`apikey=${json.apikey}&libcode=${json.libcode}&pagesize=${json.pagesize}&pagenum=${json.pagenum}&booktype=${json.booktype}&searcharray=${json.field}`)
        return new Promise((resolve, reject) => {
            this.eventsService.getAuthToken().subscribe(
                data => {
                    this.http.get(`https://api.exldevnetwork.net.cn/proxy/cckbapi/almaBooklist?${jsons}`, {
                        headers: {
                            'X-Proxy-Host': 'https://cckb.lib.tsinghua.edu.cn',
                            'Authorization': 'Bearer ' + data
                        }
                    }).subscribe(function (data) {
                        this.loading = false;
                        resolve(data)
                    }, error => {
                        this.loading = false;
                        reject(error)
                    })
                }
            );

        })
    }

    getCCKBpic(value: any) {
        return new Promise((resolve, reject) => {
            this.eventsService.getAuthToken().subscribe(
                data => {
                    // https://api.exldevnetwork.net.cn/proxy/${value}
                    this.http.get(value, {
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

    getAlmaBooktype() {
        return new Promise((resolve, reject) => {
            this.eventsService.getAuthToken().subscribe(
                data => {
                    this.http.get(`https://api.exldevnetwork.net.cn/proxy/cckbapi/almaBooktype?apikey=A1E4D4AE9734F16DBE01DE331C893F97`, {
                        headers: {
                            'X-Proxy-Host': 'https://cckb.lib.tsinghua.edu.cn',
                            'Authorization': 'Bearer ' + data
                        }
                    }).subscribe(function (data) {
                        resolve(data)
                    }, error => {
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

    searchtype() {
        this.values = ''
        this.getCCKBbooklist(this.values).then((res: any) => {
            this.almaBooklist = res
            // this.almaList = res.datalist
            this.totals = res.total
        })
    }

    searchpublish(publish:any){
        this.publish = publish
        this.search()
    }

    searchpublishyear(publishyear:any){
        this.publishyear = publishyear
        this.search()
    }

    prev() {
        if(this.pagenum <= 1){
            return
        }else{
            this.pagenum --
            this.almaBooklist = ''
            this.loading = true
            this.getCCKBbooklist(this.values).then((res: any) => {
                this.loading = false;
                let results = res
                this.almaBooklist = results
                this.almaList = results.datalist

            })
        }
    }

    next() {
        if(this.pagenum >= 99){
            return
        }else{
            this.pagenum ++
            this.almaBooklist = ''
            this.loading = true
            this.getCCKBbooklist(this.values).then((res: any) => {
                this.loading = false;
                let results = res
                this.almaBooklist = results
                this.almaList = results.datalist

            })
        }
    }

    close(value:any){
        if(value === 1){
            this.publish = ''
        }else{
            this.publishyear = ''
        }
        this.search()
    }
}
