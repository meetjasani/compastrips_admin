
import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import Buttons from '../../component/Buttons/Buttons';
import InputField from '../../component/InputField/InputField';
import DatePicker, { registerLocale } from "react-datepicker";
import ko from "date-fns/locale/ko";
import Select from 'react-select'
import RadioButton from '../../component/radiobutton/RadioButton';
import { ApiGet, ApiGetNoAuth } from '../../helper/API/ApiData';
import moment from 'moment';
import { CustomDateFilter } from '../../helper/CustomDateFilter';
import AppliedHostList from './AppliedHostList';
import { EngToKor } from "../../helper/util";
registerLocale("ko", ko);
export interface appliedHosting {
    id: string,
    no_id: string,
    name: string,
    nick_name: string
    nationality: string
    gender: string
    age_group: string
    tour_title: string
    host: number
    acceptance_status: string
    application_date: Date
}
export interface itineraryCommon {
    isSelected?: boolean,
    lable: string,
    value: string
}
const AppliedHost = () => {

    // variabels and states


    const [appliedHosting, setAppliedHosting] = useState<appliedHosting[]>([])
    const [startDate, setStartDate] = useState<Date | null>();
    const [endDate, setEndDate] = useState<Date | null>(new Date());
    const [state, setState] = useState({
        date_option: '',
        nationality: '',
        gender: '',
        age_group: '',
        acceptance_status: '',
        option: 'tour_title',
        search_term: '',
    })
    const [totalSize, setTotalSize] = useState<number>(0)
    const [isRadioCheck, setisRadioCheck] = useState<string>()
    const [countryDropDown, setCountryDropDown] = useState([
        { value: '', label: '국적' }
    ])

    const dateOption = [
        { value: '', label: '' },
        { value: 'registration_date', label: '신청일' }
    ]

    const genderDropDown = [
        { value: '', label: '성별' },
        { value: 'MALE', label: '남' },
        { value: 'FEMALE', label: '여' }
    ]

    const ageDropDown = [
        { value: '', label: '연령대' },
        { value: '20', label: '20대' },
        { value: '30', label: '30대' },
        { value: '40', label: '40대' },
        { value: '50', label: '50대' },
        { value: '60', label: '60대' },
    ]

    const statusDropDown = [
        { value: '', label: '승인 상태' },
        { value: 'STAND_BY', label: '승인 대기' },
        { value: 'ACCEPTED', label: '승인 완료' },
        { value: 'DECLINED', label: '승인 불가' },
    ]

    const searchOptionDropDown = [
        { value: 'tour_title', label: '여행 제목' },
        { value: 'host', label: '호스트' },
        { value: 'name', label: '이름' },
        { value: 'nick_name', label: '닉네임' }
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setState({
            ...state,
            [e.target.name]: e.target.value,
        });
    };

    const viewMore = () => {
        getAppliedHosting();
    }

    const getAppliedHosting = (page = 1, sizePerPage = 10) => {
        let start = startDate ? moment(startDate).format('YYYY-MM-DD') : '';
        let end = endDate ? moment(endDate).format('YYYY-MM-DD') : '';
        ApiGet(`admin/filteredAppliedHosting?date_option=${state.date_option}&start_date=${start}&end_date=${end}&nationality=${state.nationality}&gender=${state.gender}&age_group=${state.age_group}&acceptance_status=${state.acceptance_status}&option=${state.option}&search_term=${state.search_term}&per_page=${sizePerPage}&page_number=${page}`)
            .then((res: any) => {
                setTotalSize(res.data?.count)
                setAppliedHosting(res.data?.hosting?.map((x: any, index: any) => {
                    return {
                        id: x.id,
                        no_id: (res.data.count - ((page - 1) * sizePerPage)) - index,
                        name: x.first_name + " " + x.last_name,
                        nick_name: x.nick_name,
                        nationality: x.nationality,
                        gender: EngToKor(x.gender),
                        age_group: x.age_group + "대",
                        tour_title: x.tour_title.length >= 30 ? x.tour_title.slice(0, 30) + ".." : x.tour_title,
                        host: x.host_first_name + " " + x.host_last_name,
                        acceptance_status: EngToKor(x.acceptance_status),
                        application_date: x.application_date + "," + x.accepted_date
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
        getAppliedHosting()
        getCountryData()
    }, [])

    return (

        <>
            <div className="col-12 p-0">
                <div className="bg-navigation">
                    <h2 className="text-white">여행 참석 신청 내역 관리</h2>
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
                                        <Select
                                            defaultValue={dateOption[0]}
                                            options={dateOption}
                                            name="itineryCountry"
                                            // placeholder="국가"
                                            onChange={(e: any) => setState({
                                                ...state,
                                                date_option: e.value
                                            })}
                                        />
                                    </div>

                                    <div className="" onClick={() => { onDatePickerClick("startDate") }}>
                                        <DatePicker id="startDate" name="" selected={startDate} startDate={startDate} endDate={endDate}
                                            onChange={(date: Date | null) => setStartDate(date)} dateFormat="yyyy.MM.dd"
                                            selectsStart
                                            locale="ko"
                                        />

                                    </div>

                                    <div className="tild">
                                        <span>~</span>
                                    </div>

                                    <div className=" " onClick={() => { onDatePickerClick("endDate") }}>
                                        <DatePicker id="endDate" selected={endDate} onChange={(date: Date | null) => setEndDate(date)}
                                            selectsEnd startDate={startDate}
                                            endDate={endDate}
                                            minDate={startDate}
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
                                                value: state.nationality,
                                                label: state.nationality === '' ? '국가' : state.nationality
                                            }}
                                            options={countryDropDown}
                                            name="itineryCountry"
                                            // placeholder="국가"
                                            onChange={(e: any) => setState({
                                                ...state,
                                                nationality: e.value
                                            })}
                                        />
                                    </div>


                                    <div className="">
                                        <Select
                                            defaultValue={genderDropDown[0]}
                                            options={genderDropDown}
                                            name="itineryRegion"
                                            // placeholder="성별"
                                            onChange={(e: any) => setState({
                                                ...state,
                                                gender: e.value
                                            })}
                                        />
                                    </div>


                                    <div className="">
                                        <Select
                                            defaultValue={ageDropDown[0]}
                                            options={ageDropDown}
                                            name="itineryCategory"
                                            // placeholder={'연령대'}
                                            onChange={(e: any) => setState({
                                                ...state,
                                                age_group: e.value
                                            })}

                                        />
                                    </div>

                                    <div className="">
                                        <Select
                                            defaultValue={statusDropDown[0]}
                                            options={statusDropDown}
                                            name="itineryStatus"
                                            // placeholder={'승인 상태'}
                                            onChange={(e: any) => setState({
                                                ...state,
                                                acceptance_status: e.value
                                            })}

                                        />
                                    </div>

                                    <div className="">
                                        <Select
                                            defaultValue={searchOptionDropDown[0]}
                                            options={searchOptionDropDown}
                                            name="itineryTitle"
                                            // placeholder={'여행 제목'}
                                            onChange={(e: any) => setState({
                                                ...state,
                                                option: e.value
                                            })}

                                        />
                                    </div>


                                    <Form.Row className="m-0">
                                        <div>
                                            <div className=" d-flex">
                                                <InputField
                                                    name="search_term"
                                                    value={state.search_term}
                                                    lablestyleClass=""
                                                    InputstyleClass="mb-0 manage-datepicker"
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
                                        </div>
                                    </Form.Row>
                                </Form.Row>
                            </div>

                        </div>

                        <div className="p-0">

                            <div className="table-width">
                                <AppliedHostList
                                    data={appliedHosting}
                                    getAppliedHosting={getAppliedHosting}
                                    totalSize={totalSize}
                                // ltineraryRegBtn={ltineraryRegBtn}
                                />
                            </div>

                        </div>
                    </div>
                </div>

            </>
        </>
    )
}


export default AppliedHost
