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

@Component({
    selector: 'app-bookdetail',
    templateUrl: './bookdetail.component.html',
    styleUrls: ['./bookdetail.component.scss']
})
@NgModule({
    imports: [HttpClientModule, FormsModule]
})
export class BookdetailComponent implements OnInit, OnDestroy {

    private pageLoad$: Subscription;
    pageEntities: Entity[];
    private _apiResult: any;
    private _bookInfo:any;
    private name: String = '';
    hasApiResult: boolean = false;
    choosebt: boolean = false; //the judege button is 'Update' or 'Rebuild'
    ifCNor21: boolean = false;
    show: boolean = false;
    loading = false;

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
        this.pageLoad$ = this.eventsService.onPageLoad(this.onPageLoad);
        this.activatedRoute.queryParams.subscribe(param => {
            console.log(param.id)
            this.getCCKBbookdetail(param.id).then((res: any) => {
                this.bookInfo = res.datalist
            })
        })
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
                    // this.parseRes(this.apiResult)
                });
            }

        } else {
            this.apiResult = {};
        }
    }

    getCCKBbookdetail(value: any) {
        let json = {
            "apikey": '562930543E3E090957C595704CF28BE4',
            "libcode": '233030',
            "value": value
        }
        let jsons = `apikey=${json.apikey}&libcode=${json.libcode}&cckbid=${json.value}`
        return new Promise((resolve, reject) => {
            this.eventsService.getAuthToken().subscribe(
                data => {
                    this.http.get(`https://api.exldevnetwork.net.cn/proxy/cckbapi/almaBooklistDetails?${jsons}`, {
                        headers: {
                            'X-Proxy-Host': 'http://cckb.lib.tsinghua.edu.cn',
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

}


