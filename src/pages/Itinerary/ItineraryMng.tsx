import React, { useEffect, useState } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import Buttons from '../../component/Buttons/Buttons';
import InputField from '../../component/InputField/InputField';
import DatePicker, { registerLocale } from "react-datepicker";
import ko from "date-fns/locale/ko";
import Select from 'react-select'
import ItineraryMngList from '../Itinerary/ItineraryMngList'
import RadioButton from '../../component/radiobutton/RadioButton';
import { ApiGet, ApiGetNoAuth, ApiPost } from '../../helper/API/ApiData';
import moment from 'moment';
import { CustomDateFilter } from '../../helper/CustomDateFilter';
import { EngToKor } from "../../helper/util";
registerLocale("ko", ko);
export interface intineraryProduct {
    id: string,
    Itinerary_itineryCountry: string
    Itinerary_itineryRegion: string
    Itinerary_Category: string
    Itinerary_Title: string
    Itinerary_Creator: string
    Itinerary_HostedNumber: number
    Itinerary_Status: string
    Itinerary_RegistrationDate: Date
    language: string
}
export interface itineraryCommon {
    isSelected?: boolean,
    lable: string,
    value: string
}
const ItineraryMng = () => {

    const [startDate, setStartDate] = useState<Date | null>();
    const [endDate, setEndDate] = useState<Date | null>();
    const [itineryRegion, setItineryRegionData] = useState<any[]>([])
    const [itineryCategory, setItItineryCategoryData] = useState<any[]>([])
    const [totalSize, setTotalSize] = useState<number>(0)
    const [isRadioCheck, setisRadioCheck] = useState<string>()
    const [products, setProductsData] = useState<[]>([])
    const [itineryCountry, setItineryCountry] = useState([
        { value: '', label: '국적' }
    ])

    const itineryStatus = [
        { value: '', label: '상태' },
        { value: 'OPEN', label: '공개' },
        { value: 'PRIVATE', label: '비공개' },
    ]

    const itineryTitle = [
        { value: 'title', label: '제목' },
        { value: 'creator', label: '작성자 정보' }
    ]
    const [state, setState] = useState({
        itnerySearch: '',
        itineryDateSearch: '',
        itineryCountry: itineryCountry[0].value,
        itineryRegion: "",
        itineryCategory: "",
        itineryStatus: '',
        itineryTitle: itineryTitle[0].value,
    })

    const getRegion = async () => {
        await ApiGet('itinerary/region')
            .then((res: any) => {
                setItineryRegionData(
                    res.data.region.map((x: any) => {
                        return {
                            value: x.region,
                            label: x.region,
                        }
                    })
                )
            })


        setItineryRegionData((prev: any) => {
            return [

                { value: "", label: "지역" },
                ...prev
            ]
        })


    }

    const getCategory = async () => {
        await ApiGet(`itinerary/category`)
            .then((res: any) => {
                setItItineryCategoryData(res.data.map((x: any) => {
                    return {
                        value: x.category,
                        label: x.category,
                    }
                }))
            })
        setItItineryCategoryData((prev: any) => {
            return [

                { value: "", label: "카테고리" },
                ...prev
            ]
        })
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setState({
            ...state,
            [e.target.name]: e.target.value,
        });
    };

    const viewMore = () => {
        getItineraries();
    }
    function formatDate(date: Date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('-');
    }

    const getItineraries = (page = 1, sizePerPage = 10) => {
        let start = startDate ? moment(startDate).format('YYYY-MM-DD') : '';
        let end = endDate ? moment(endDate).format('YYYY-MM-DD') : '';
        const data = {
            start_date: start,
            end_date: end,
            country: state.itineryCountry,
            region: state.itineryRegion,
            category: state.itineryCategory,
            status: state.itineryStatus,
            option: state.itineryTitle,
            search_term: state.itnerySearch
        }
        ApiPost(`admin/getFilteredItineraries?&per_page=${sizePerPage}&page_number=${page}`, data)
            .then((res: any) => {
                setTotalSize(res.data && res.data.count)
                setProductsData(res.data && res.data.itineraries && res.data.itineraries.map((x: any, index: number) => {
                    return {
                        id: x.id,
                        no_id: (res.data.count - ((page - 1) * sizePerPage)) - index,
                        Itinerary_Country: x.country,
                        Itinerary_Region: x.region,
                        Itinerary_Category: x.category,
                        Itinerary_Title: x.title,
                        Itinerary_Creator: x.creator_show,
                        Itinerary_HostedNumber: x.hosted_number,
                        Itinerary_Status: EngToKor(x.status),
                        Itinerary_RegistrationDate: formatDate(x.registration_date),
                        language: x.language
                    }
                }))
            })
    }

    const handleSelect = (e: any) => {
        setisRadioCheck(e.target.value);
        let date = CustomDateFilter(e.target.value);

        setStartDate(moment(date).toDate());
        setEndDate(e.target.value === '어제' ? moment().subtract(1, 'days').toDate() : moment().toDate());
    };

    const getCountryData = () => {
        ApiGetNoAuth("general/country").then((res: any) => {
            let data = res.data.map((x: any) => {
                return {
                    value: x.name,
                    label: x.name
                }
            })
            data.unshift({
                value: "",
                label: "국가"
            })
            setItineryCountry(data)
        })
            .catch(error => {
                console.log(error);
            })
    }

    // useEffects

    useEffect(() => {
        getItineraries()
        getRegion();
        getCategory();
        getCountryData()
    }, [])

    return (

        <>
            <div className="col-12 p-0">
                <div className="bg-navigation">
                    <h2 className="text-white">여행 일정  관리</h2>
                </div>
            </div>

            <>

                <div className="custom-left">
                    <div className="topfilter-table">
                        <div className="top-filters p-0">

                            <div className="filter-t-box">
                                <div className="head-member">
                                    <h6 className="font-18-bold ln-65">검색 기간</h6>
                                </div>
                            </div>
                            <div className="filter-d-box">
                                <Form.Row className="stela-row m-0">


                                    <div className="input-126">

                                        <InputGroup>
                                            <InputGroup.Text className="inputgroup-text-imp">
                                                대한민국
                                            </InputGroup.Text>
                                        </InputGroup>
                                    </div>

                                    <div className=" ">
                                        <DatePicker name="" selected={startDate} startDate={startDate} endDate={endDate}
                                            onChange={(date: Date | null) => setStartDate(date)}
                                            dateFormat="yyyy.MM.dd" selectsStart
                                            locale="ko" />

                                    </div>

                                    <div className="tild">
                                        <span>~</span>
                                    </div>
                                    <div className=" ">
                                        <DatePicker selected={endDate} startDate={startDate} endDate={endDate}
                                            minDate={startDate} onChange={(date: Date | null) => setEndDate(date)}
                                            selectsEnd dateFormat="yyyy.MM.dd"
                                            locale="ko"
                                        />
                                    </div>

                                    <div className="filter-radio d-md-flex ">
                                        <RadioButton
                                            type="radio"
                                            name="Open-Private"
                                            id="Open-Private"
                                            value="어제"
                                            checked={isRadioCheck === '어제' ? true : false}
                                            BtnLable="어제"
                                            onSelect={(e) => { handleSelect(e) }}
                                        />
                                        <RadioButton
                                            type="radio"
                                            name="Open-Private"
                                            id="Open-Private"
                                            value="오늘"
                                            checked={isRadioCheck === '오늘' ? true : false}
                                            BtnLable="오늘"
                                            onSelect={(e) => { handleSelect(e) }}
                                        />
                                        <RadioButton
                                            type="radio"
                                            name="Open-Private"
                                            id="Open-Private"
                                            value="1개월"
                                            checked={isRadioCheck === '1개월' ? true : false}
                                            BtnLable="1개월"
                                            onSelect={(e) => { handleSelect(e) }}
                                        />

                                        <RadioButton
                                            type="radio"
                                            name="Open-Private"
                                            id="Open-Private"
                                            value="3개월"
                                            checked={isRadioCheck === '3개월' ? true : false}
                                            BtnLable="3개월"
                                            onSelect={(e) => { handleSelect(e) }}
                                        />

                                        <RadioButton
                                            type="radio"
                                            name="Open-Private"
                                            id="Open-Private"
                                            value="6개월"
                                            checked={isRadioCheck === '6개월' ? true : false}
                                            BtnLable="6개월"
                                            onSelect={(e) => { handleSelect(e) }}
                                        />

                                        <RadioButton
                                            type="radio"
                                            name="Open-Private"
                                            id="Open-Private"
                                            value="1년"
                                            checked={isRadioCheck === '1년' ? true : false}
                                            BtnLable="1년"
                                            onSelect={(e) => { handleSelect(e) }}
                                        />

                                    </div>
                                </Form.Row>
                            </div>
                        </div>


                        <div className="condition-select p-0">

                            <div className="filter-t-box">
                                <div className="head-member">
                                    <h6 className="font-18-bold ln-65">조건 검색</h6>
                                </div>
                            </div>
                            <div className="filter-d-box">
                                <Form.Row className="stela-row m-0">




                                    <div className="select">

                                        <Select
                                            value={{
                                                value: state.itineryCountry,
                                                label: state.itineryCountry === '' ? '국가' : state.itineryCountry
                                            }}
                                            options={itineryCountry}
                                            name="itineryCountry"
                                            // placeholder="국가"
                                            onChange={(e: any) => setState({
                                                ...state,
                                                itineryCountry: e.value
                                            })}
                                        />
                                    </div>


                                    <div className="">
                                        <Select
                                            options={itineryRegion}
                                            defaultValue={{ value: "", label: "지역" }}
                                            name="itineryRegion"
                                            placeholder="지역"
                                            onChange={(e: any) => setState({
                                                ...state,
                                                itineryRegion: e.value
                                            })}
                                        />
                                    </div>


                                    <div className="">
                                        <Select
                                            options={itineryCategory}
                                            defaultValue={{ value: "", label: "카테고리" }}

                                            name="itineryCategory"
                                            placeholder={'카테고리'}
                                            onChange={(e: any) => setState({
                                                ...state,
                                                itineryCategory: e.value
                                            })}

                                        />
                                    </div>

                                    <div className="">
                                        <Select
                                            options={itineryStatus}
                                            defaultValue={itineryStatus[0]}

                                            name="itineryStatus"
                                            placeholder={'상태'}
                                            onChange={(e: any) => setState({
                                                ...state,
                                                itineryStatus: e.value
                                            })}

                                        />
                                    </div>

                                    <div className="">
                                        <Select
                                            options={itineryTitle}
                                            name="itineryTitle"
                                            defaultValue={itineryTitle[0]}
                                            placeholder={'제목'}
                                            onChange={(e: any) => setState({
                                                ...state,
                                                itineryTitle: e.value
                                            })}

                                        />
                                    </div>




                                    <div className=" d-flex">
                                        <InputField
                                            name="itnerySearch"
                                            value={state.itnerySearch}
                                            lablestyleClass=""
                                            InputstyleClass="mb-0 manage-datepicker w-auto"
                                            onChange={(e: any) => { handleChange(e) }}
                                            label=""
                                            placeholder="검색어 입력"
                                            type="text"
                                            fromrowStyleclass=""
                                        />

                                        <Buttons
                                            type="submit"
                                            children="검색"
                                            ButtonStyle="search-button ml-2"
                                            onClick={viewMore} />
                                    </div>


                                </Form.Row>
                            </div>

                        </div>

                        <div className="p-0">

                            <div className="table-width">
                                <ItineraryMngList data={products} getItineraries={getItineraries} totalSize={totalSize} />
                            </div>

                        </div>
                    </div>
                </div>

            </>

        </>
    )
}

export default ItineraryMng