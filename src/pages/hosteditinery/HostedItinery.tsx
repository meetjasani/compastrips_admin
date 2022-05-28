
import React, { useEffect, useState } from 'react';
import { Col, Form, InputGroup } from 'react-bootstrap';
import Buttons from '../../component/Buttons/Buttons';
import InputField from '../../component/InputField/InputField';
import DatePicker, { registerLocale } from "react-datepicker";
import ko from "date-fns/locale/ko";
import Select from 'react-select'
import RadioButton from '../../component/radiobutton/RadioButton';
import { ApiGet, ApiGetNoAuth } from '../../helper/API/ApiData';
import moment from 'moment';
import { CustomDateFilter } from '../../helper/CustomDateFilter';
import HostedItineryList from './HostedItineryList';
import { EngToKor } from "../../helper/util";
registerLocale("ko", ko);
export interface hostedItinerary {
    id: string,
    no_id: string,
    country: string,
    region: string
    tour_title: string
    nickname: string
    host_date: string
    vacancies: string
    status: string
    disclosure: string
    registration_date: Date
}
export interface itineraryCommon {
    isSelected?: boolean,
    label: string,
    value: string
}
const HostedItinery = () => {

    // variabels and useStates


    const [startDate, setStartDate] = useState<Date | null>();
    const [endDate, setEndDate] = useState<Date | null>();
    const [state, setState] = useState({
        country: '',
        region: '',
        vacancy: '',
        status: '',
        disclosure: '',
        option: 'title',
        search_term: '',
    })
    const [regionDropDown, setRegionDropDown] = useState<itineraryCommon[]>([])
    const [totalSize, setTotalSize] = useState<number>(0)
    const [isRadioCheck, setisRadioCheck] = useState<string>()
    const [hostedItinerary, setHostedItinerary] = useState<hostedItinerary[]>([])
    const [countryDropDown, setCountryDropDown] = useState([
        { value: '', label: '국적' }
    ])

    const vacancyDropDown = [
        { value: '', label: '잔여인원' },
        { value: 'vacancies', label: '있음' },
        { value: 'not_available', label: '없음' }
    ]
    const statusDropDown = [
        { value: '', label: '진행상태' },
        { value: 'coming_up', label: '진행중' },
        { value: 'completed', label: '종료' }
    ]
    const disclosureDropDown = [
        { value: '', label: '공개 상태' },
        { value: 'OPEN', label: '공개' },
        { value: 'PRIVATE', label: '비공개' }
    ]
    const optionsDropDown = [
        { value: 'title', label: '여행제목' },
        { value: 'user_name', label: '닉네임' },
    ]

    // helper functions
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
            setCountryDropDown(data)
        })
            .catch(error => {
                console.log(error);
            })
    }

    const getRegion = async () => {
        await ApiGet('itinerary/region')
            .then((res: any) => {
                setRegionDropDown(
                    res.data.region.map((x: any) => {
                        return {
                            value: x.region,
                            label: x.region,
                        }
                    })
                )
            })
        setRegionDropDown((prev: any) => {
            return [
                { value: "", label: "지역" },
                ...prev
            ]
        })
    }

    // const DetailProfile = (row: any) => {
    //     history.push('/creatorprofile');
    // }

    const viewMore = () => {
        getItineraries();
    }

    const getItineraries = (page = 1, sizePerPage = 10) => {
        let start = startDate ? moment(startDate).format('YYYY-MM-DD') : '';
        let end = endDate ? moment(endDate).format('YYYY-MM-DD') : '';
        ApiGet(`admin/filteredHostedItineraries?start_date=${start}&end_date=${end}&country=${state.country}&region=${state.region}&vacancy=${state.vacancy}&status=${state.status}&disclosure=${state.disclosure}&option=${state.option}&search_term=${state.search_term}&per_page=${sizePerPage}&page_number=${page}&is_deleted=false`)
            .then((res: any) => {
                res.data && setTotalSize(res.data.count)
                setHostedItinerary(res.data && res.data.itinerary && res.data.itinerary.map((x: any, index: any) => {
                    return {
                        id: x.id,
                        no_id: (res.data.count - ((page - 1) * sizePerPage)) - index,
                        country: x.country,
                        region: x.region,
                        tour_title: x.title,
                        nickname: x.nick_name,
                        host_date: [x.host_date, x.start_time, x.end_time],
                        vacancies: x.vacancies,
                        status: EngToKor(x.status),
                        disclosure: EngToKor(x.disclosure),
                        registration_date: x.registration_date.slice(0, 10) + " " + x.registration_date.slice(11, 16),
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

    const onDatePickerClick = (id: string) => {
        document.getElementById(id)?.click();
    }


    // useEffects
    useEffect(() => {
        getItineraries();
        getCountryData();
        getRegion();
    }, [])

    useEffect(() => {
        console.log("countryDropDown", countryDropDown);
    }, [countryDropDown])

    return (

        <>
            <div className="col-12 p-0">
                <div className="bg-navigation">
                    <h2 className="text-white">호스팅 여행 일정 내역</h2>
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


                                    <div className="">
                                        <InputGroup>
                                            <InputGroup.Text className="inputgroup-text-imp">
                                                신청일
                                            </InputGroup.Text>
                                        </InputGroup>
                                    </div>

                                    <div className=" " onClick={() => { onDatePickerClick("startDate") }}>
                                        <DatePicker id="startDate" selected={startDate} startDate={startDate} endDate={endDate}
                                            minDate={new Date()} maxDate={endDate} onChange={(date: Date | null) => setStartDate(date)}
                                            dateFormat="yyyy.MM.dd" selectsStart
                                            locale="ko"
                                        />
                                    </div>

                                    <div className="tild">
                                        <span>~</span>
                                    </div>

                                    <div className=" " onClick={() => { onDatePickerClick("endDate") }}>
                                        <DatePicker id="endDate" selected={endDate} onChange={(date: Date | null) => setEndDate(date)}
                                            selectsEnd startDate={startDate} endDate={endDate} minDate={startDate}
                                            dateFormat="yyyy.MM.dd"
                                            locale="ko" />
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
                                            checked={isRadioCheck ===

                                                '1년' ? true : false}
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
                                                value: state.country,
                                                label: state.country === '' ? '국가' : state.country
                                            }}
                                            options={countryDropDown}
                                            name="itineryCountry"
                                            // placeholder="국가"
                                            onChange={(e: any) => setState({
                                                ...state,
                                                country: e.value
                                            })}
                                        />
                                    </div>


                                    <div className="">
                                        <Select
                                            defaultValue={{ value: "", label: "지역" }}
                                            options={regionDropDown}
                                            name="itineryRegion"
                                            // placeholder="지역"
                                            onChange={(e: any) => setState({
                                                ...state,
                                                region: e.value
                                            })}
                                        />
                                    </div>


                                    <div className="">
                                        <Select
                                            defaultValue={vacancyDropDown[0]}
                                            options={vacancyDropDown}
                                            name="itineryCategory"
                                            placeholder={'잔여인원'}
                                            onChange={(e: any) => setState({
                                                ...state,
                                                vacancy: e.value
                                            })}

                                        />
                                    </div>

                                    <div className="">
                                        <Select
                                            defaultValue={statusDropDown[0]}
                                            options={statusDropDown}
                                            name="itineryStatus"
                                            placeholder={'진행상태'}
                                            onChange={(e: any) => setState({
                                                ...state,
                                                status: e.value
                                            })}

                                        />
                                    </div>

                                    <div className="">
                                        <Select
                                            defaultValue={disclosureDropDown[0]}
                                            options={disclosureDropDown}
                                            name="itineryTitle"
                                            placeholder={'공개 상태'}
                                            onChange={(e: any) => setState({
                                                ...state,
                                                disclosure: e.value
                                            })}

                                        />
                                    </div>
                                    <div className="">
                                        <Select
                                            defaultValue={optionsDropDown[0]}
                                            options={optionsDropDown}
                                            name="itineryTitle"
                                            placeholder={'여행제목'}
                                            onChange={(e: any) => setState({
                                                ...state,
                                                option: e.value
                                            })}

                                        />
                                    </div>


                                    <Form.Row className="m-0">
                                        <Col>
                                            <div className=" d-flex">
                                                <InputField
                                                    name="itnerySearch"
                                                    value={state.search_term}
                                                    lablestyleClass=""
                                                    InputstyleClass="mb-0 manage-datepicker"
                                                    onChange={(e: any) => setState({
                                                        ...state,
                                                        search_term: e.target.value
                                                    })}
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
                                        </Col>
                                    </Form.Row>
                                </Form.Row>
                            </div>

                        </div>


                        <div className="p-0">

                            <div className="table-width">
                                <HostedItineryList
                                    data={hostedItinerary}
                                    getItineraries={getItineraries}
                                    totalSize={totalSize}
                                />
                            </div>

                        </div>
                    </div>
                </div>

            </>
        </>
    )
}

export default HostedItinery
