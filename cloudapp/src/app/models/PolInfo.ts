export class PolInfo {
    link:String = 'string';
    owner:any = {"value":"MAIN","desc":"Main Library"};
    type:any = {"value":"PRINTED_BOOK_OT","desc":"纸本图书 – 单次"};
    vendor:any = {"value":"zjxh","desc":"浙江省新华书店集团馆藏图书有限公司"};
    vendor_account:String = "zjxh";
    reclaim_interval:String = "0";
    expected_receipt_interval:String = "0";
    claiming_interval:String = "0";
    acquisition_method:any = {"value":"VENDOR_SYSTEM","desc":"书商系统中的采购"};
    no_charge:boolean = false;
    rush:boolean = false;
    cancellation_restriction:boolean = false;
    price:any = {"sum":"86.0","currency":{"value":"CNY","desc":"Yuan Renminbi"}};
    discount:String = "1";
    vendor_reference_number:String = "我的平台采购批次_888888_16";
    source_type:any = {"value":"API","desc":"API"};
    invoice_reference:String = "";
    resource_metadata:any = {
        "title":"“锻炼锻炼”",
        "author":"赵树理著",
        "issn":null,
        "isbn":"9787517130307",
        "publisher":"中国言实出版社",
        "publication_place":"",
        "publication_year":"2021",
        "vendor_title_number":"",
        "system_control_number":[""]};
    fund_distribution:any = [{"fund_code":{"value":"FY2021/CB","desc":"2021年度中文文献经费"},
        "amount":{"sum":"86.0","currency":{"value":"CNY","desc":"Yuan Renminbi"}}}];
    reporting_code:String = "LIBSTAFF";
    secondary_reporting_code:String = "";
    tertiary_reporting_code:String = "";
    fourth_reporting_code:String = "";
    fifth_reporting_code:String = "";
    vendor_note:String = "";
    receiving_note:String = "";
    portfolios:any = {"portfolio":[],"total_record_count":0};
    note:any = [{"note_text": ""}];
    location:any = [];
    license:any = {"value":"","desc":""};
    url:String = "" ;
    base_status:String = "";
    access_provider:String = "";
    manual_renewal:boolean = false;
    renewal_cycle:any = {"value":null,"desc":null};
    renewal_period:any = 0;
    renewal_note:String = "";
    material_type:any = {"value":"BOOK","desc":"图书"};

    xml_marc21:any = "<searchRetrieveResponse\n" +
        "    xmlns=\"http://www.loc.gov/zing/srw/\">\n" +
        "    <version>1.2</version>\n" +
        "    <numberOfRecords>1</numberOfRecords>\n" +
        "    <records>\n" +
        "        <record>\n" +
        "            <recordIdentifier>5086791</recordIdentifier>\n" +
        "            <recordPosition>1</recordPosition>\n" +
        "            <recordSchema>marcxml</recordSchema>\n" +
        "            <recordPacking>xml</recordPacking>\n" +
        "            <recordData>\n" +
        "                <record\n" +
        "                    xmlns=\"http://www.loc.gov/MARC21/slim\">\n" +
        "                    <leader>00966nam 2200241a 4500</leader>\n" +
        "                    <controlfield tag=\"003\">CCBD</controlfield>\n" +
        "                    <controlfield tag=\"005\">20200909141614.0</controlfield>\n" +
        "                    <controlfield tag=\"008\">200909s2020 cc k a 000 0 chi d</controlfield>\n" +
        "                    <datafield tag=\"020\" ind1=\" \" ind2=\" \">\n" +
        "                        <subfield code=\"a\">9787305232459</subfield>\n" +
        "                        <subfield code=\"c\">CNY62.00</subfield>\n" +
        "                        <subfield code=\"q\">pbk.</subfield>\n" +
        "                    </datafield>\n" +
        "                    <datafield tag=\"040\" ind1=\" \" ind2=\" \">\n" +
        "                        <subfield code=\"a\">CCBD</subfield>\n" +
        "                        <subfield code=\"b\">eng</subfield>\n" +
        "                        <subfield code=\"c\">CCBD</subfield>\n" +
        "                    </datafield>\n" +
        "                    <datafield tag=\"041\" ind1=\"1\" ind2=\" \">\n" +
        "                        <subfield code=\"a\">chi</subfield>\n" +
        "                        <subfield code=\"h\">eng</subfield>\n" +
        "                    </datafield>\n" +
        "                    <datafield tag=\"093\" ind1=\" \" ind2=\" \">\n" +
        "                        <subfield code=\"a\">C913.11</subfield>\n" +
        "                        <subfield code=\"2\">5</subfield>\n" +
        "                    </datafield>\n" +
        "                    <datafield tag=\"100\" ind1=\"1\" ind2=\" \">\n" +
        "                        <subfield code=\"a\">奥克利</subfield>\n" +
        "                        <subfield code=\"h\">(Oakley, Ann) ,</subfield>\n" +
        "                        <subfield code=\"e\">著.</subfield>\n" +
        "                    </datafield>\n" +
        "                    <datafield tag=\"245\" ind1=\"1\" ind2=\"0\">\n" +
        "                        <subfield code=\"a\">看不见的女人 :</subfield>\n" +
        "                        <subfield code=\"b\">家庭事务社会学 =The sociology of housework /</subfield>\n" +
        "                        <subfield code=\"c\">(英) 安·奥克利著 ; 汪丽译.</subfield>\n" +
        "                    </datafield>\n" +
        "                    <datafield tag=\"246\" ind1=\"3\" ind2=\"3\">\n" +
        "                        <subfield code=\"a\">家庭事务社会学</subfield>\n" +
        "                    </datafield>\n" +
        "                    <datafield tag=\"250\" ind1=\" \" ind2=\" \">\n" +
        "                        <subfield code=\"a\">第一版.</subfield>\n" +
        "                    </datafield>\n" +
        "                    <datafield tag=\"260\" ind1=\" \" ind2=\" \">\n" +
        "                        <subfield code=\"a\">南京 :</subfield>\n" +
        "                        <subfield code=\"b\">南京大学出版社,</subfield>\n" +
        "                        <subfield code=\"c\">2020.</subfield>\n" +
        "                    </datafield>\n" +
        "                    <datafield tag=\"300\" ind1=\" \" ind2=\" \">\n" +
        "                        <subfield code=\"a\"> xii, 365 p. ;</subfield>\n" +
        "                        <subfield code=\"c\"> 21 cm</subfield>\n" +
        "                    </datafield>\n" +
        "                    <datafield tag=\"490\" ind1=\"0\" ind2=\" \">\n" +
        "                        <subfield code=\"a\">守望者·人间世</subfield>\n" +
        "                    </datafield>\n" +
        "                    <datafield tag=\"504\" ind1=\" \" ind2=\" \">\n" +
        "                        <subfield code=\"a\">Included bibliographical references.</subfield>\n" +
        "                    </datafield>\n" +
        "                    <datafield tag=\"520\" ind1=\" \" ind2=\" \">\n" +
        "                        <subfield code=\"a\">本书作者将家务作为工作研究,回到女性本身,通过她们的眼睛来看待家庭主妇的职业.作者着眼“女性与家庭事务”这一话题,采访了40位都市家庭主妇,研究女性对家务劳动的认识、对从事繁复单一的家务的感受,以及她们对不同家务抱持的态度等,并从这些表述后透视家庭内部的结构和分工.</subfield>\n" +
        "                    </datafield>\n" +
        "                    <datafield tag=\"650\" ind1=\" \" ind2=\"7\">\n" +
        "                        <subfield code=\"a\">家庭社会学</subfield>\n" +
        "                        <subfield code=\"x\">研究.</subfield>\n" +
        "                        <subfield code=\"2\">cct</subfield>\n" +
        "                    </datafield>\n" +
        "                    <datafield tag=\"700\" ind1=\"1\" ind2=\" \">\n" +
        "                        <subfield code=\"a\">汪丽.</subfield>\n" +
        "                    </datafield>\n" +
        "                </record>\n" +
        "            </recordData>\n" +
        "        </record>\n" +
        "    </records>\n" +
        "</searchRetrieveResponse>"
}


