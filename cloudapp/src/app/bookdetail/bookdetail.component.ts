import {Subscription} from 'rxjs';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Component, OnInit, OnDestroy, NgModule} from '@angular/core';
import {HttpClientModule, HttpClient} from '@angular/common/http'
import {TranslateService} from '@ngx-translate/core';
import {
    CloudAppRestService, CloudAppEventsService, Request, HttpMethod,
    Entity, PageInfo, RestErrorResponse, AlertService, CloudAppSettingsService, EntityType, FormGroupUtil
} from '@exlibris/exl-cloudapp-angular-lib';
import {Router, ActivatedRoute} from '@angular/router';
import {GlobalService} from "../models/GlobalService";
import {PolInfo} from "../models/PolInfo";


@Component({
    selector: 'app-bookdetail',
    templateUrl: './bookdetail.component.html',
    styleUrls: ['./bookdetail.component.scss']
})
@NgModule({
    imports: [HttpClientModule, FormsModule],
})
export class BookdetailComponent implements OnInit, OnDestroy {

    private pageLoad$: Subscription;
    pageEntities: Entity[];
    private _apiResult: any;
    private _bookInfo:any;
    cfmarcstr: String = '';
    private isTab = false
    hasApiResult: boolean = false;
    boxSize = GlobalService.boxSize;
    choosebt: boolean = false; //the judege button is 'Update' or 'Rebuild'
    ifCNor21: boolean = false;
    show: boolean = false;
    loading = true;
    tabIndex = 0;
    isShowInfo = false;
    libcode = "233030";
    metadata:any;
    showLargePic = false;
    mmsid = '';

    constructor(private restService: CloudAppRestService,
                private eventsService: CloudAppEventsService,
                private router: Router,
                private activatedRoute: ActivatedRoute,
                private translate: TranslateService,
                private http: HttpClient,
                private fb: FormBuilder,
                private alert: AlertService) {
    }

    ngOnInit() {
        this.eventsService.getInitData().subscribe(data=> {
            this.libcode = data.instCode
            this.activatedRoute.queryParams.subscribe(param => {
                this.getCCKBbookdetail(param.id).then((res: any) => {
                    this.loading = false;
                    if(res.almalist.marc21str){
                        var reg = new RegExp( 'src="images/bluemarc.png"' , "g" )
                        var newstr = res.almalist.marc21str.replace( reg , `src='../../assets/blue.png'` );
                        this.cfmarcstr = newstr
                    }
                    this.bookInfo = res.almalist
                })
            })
        });
        //检测窗口大小
        window.onresize = () => {
            if (window.innerWidth > 450) {
                GlobalService.boxSize = true;
            } else {
                GlobalService.boxSize = false;
            }
            this.boxSize = GlobalService.boxSize
        }
        this.pageLoad$ = this.eventsService.onPageLoad(this.onPageLoad);
    }

    ngOnDestroy(): void {
        this.pageLoad$.unsubscribe();
    }

    get apiResult() {
        return this._apiResult;
    }

    set apiResult(result: any) {
        this._apiResult = result;
        this.hasApiResult = result && Object.keys(result).length > 0;
    }

    get bookInfo() {
        return this._bookInfo;
    }

    set bookInfo(result: any) {
        this._bookInfo = result;
    }

    onPageLoad = (pageInfo: PageInfo) => {
        this.pageEntities = pageInfo.entities;
        if ((pageInfo.entities || []).length == 1) {
            const entity = pageInfo.entities[0];
            if (entity.type === EntityType.BIB_MMS) {
                this.restService.call(entity.link).subscribe(result => {
                    this.apiResult = result
                    this.mmsid = this.apiResult.mms_id
                    // this.parseRes(this.apiResult)
                });

                this.show = true;
                //是否显示更新bid的按钮
            }

        } else {
            this.apiResult = {};
            this.show = false;
        }
    }

    getCCKBbookdetail(value: any) {
        let json = {
            "apikey": '562930543E3E090957C595704CF28BE4',
            "libcode": this.libcode,
            "value": value
        }
        let jsons = `apikey=${json.apikey}&libcode=${json.libcode}&cckbid=${json.value}`
        return new Promise((resolve, reject) => {
            this.eventsService.getAuthToken().subscribe(
                data => {
                    this.http.get(`https://api.exldevnetwork.net.cn/proxy/cckbapi/almaBooklistDetails?${jsons}`, {
                        headers: {
                            'X-Proxy-Host': 'https://cckb.lib.tsinghua.edu.cn',
                            'Authorization': 'Bearer ' + data
                        }
                    }).subscribe(function (data) {
                        resolve(data)
                    }, error => {
                        resolve(error)
                    })
                }
            );
        })
    }
    showConfig(){
        history.back()
    }

    createpol(){
        let info = new PolInfo();
        //创建订单信息中的 resource_metadata
        this.metadata = {
                "title":this.bookInfo.booktitle,
                "author":this.bookInfo.author,
                "issn":null,
                "isbn":this.bookInfo.isbn,
                "publisher":this.bookInfo.publish,
                "publication_place":"",
                "publication_year":this.bookInfo.publishdate.substring(0,4),
                "vendor_title_number":"",
                "system_control_number":[""]
        }
        info.resource_metadata = this.metadata
        info.price.sum = this.bookInfo.bookprice

        this.router.navigate(['/polsettings'],{queryParams:{info:JSON.stringify(info)}})
    }

    updatebid(){
        // this.router.navigate(['/cnasettings'])
        //更新bib
        this.eventsService.getAuthToken().subscribe(
            data => {
                this.http.get(`https://api.exldevnetwork.net.cn/proxy/sru/sruMarc_marc21?operation=searchRetrieve&recordSchema=marcxml&version=1.2&startRecord=1&maximumRecords=10&query=isbn+%3D+"9787305232459"+`, {
                    headers: {
                        'X-Proxy-Host': 'https://cckb.lib.tsinghua.edu.cn',
                        'Authorization': 'Bearer ' + data
                    }
                }).subscribe(res=>{
                    console.log(res)

                    // const doc = new DOMParser().parseFromString(value, "application/xml");
                    // let recordData = doc.getElementsByTagName("recordData")[0].innerHTML
                    // console.log(recordData)

                })
            }
        );

        // let request: Request = {
        //     url: `/almaws/v1/bibs/${this.mmsid}`,
        //     method: HttpMethod.PUT,
        //     headers: {
        //         "Content-Type": "application/xml",
        //         Accept: "application/json"
        //     },
        //     requestBody: `<bib>${anies}</bib>`,
        // };
        // this.restService.call(request).subscribe({
        //     next: result => {
        //
        //     },
        //     error: (e: RestErrorResponse) => {
        //         // this.alert.error(this.translate.instant('i18n.errorupdate'), {autoClose: true, delay: 3000});
        //         // console.error(e);
        //         // this.loading = false;
        //     }
        // });



    }

    imgerror(e){
        const defaultImg = '../../assets/fm_img.png';
        e.srcElement.src = defaultImg;
    }

    chooseTabs(tab:any){
        this.tabIndex = tab;
    }

    buypop(){
        this.isShowInfo = !this.isShowInfo
    }

    openLargePic(){
        this.showLargePic = !this.showLargePic;
    }
}


