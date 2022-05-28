import React, { useEffect, useState } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import Buttons from '../../component/Buttons/Buttons';
import InputField from '../../component/InputField/InputField';
import DatePicker, { registerLocale } from "react-datepicker";
import ko from "date-fns/locale/ko";
import Select from 'react-select'
import RadioButton from '../../component/radiobutton/RadioButton';
import { ItineraryMngListDB } from './ItineraryMngListDB';
import { ApiGet, ApiPost } from '../../helper/API/ApiData';
import moment from 'moment';
import { CustomDateFilter } from '../../helper/CustomDateFilter';
registerLocale("ko", ko);

export interface dbManagment {
    id: string;
    no_id: string;
    country: string;
    region: string;
    category: string;
    name: string;
}

interface dropDown {
    value: string;
    label: string
}

const ItineraryMngDB = () => {

    // states and variables
    const [state, setState] = useState({
        itneryDBSearch: '',
        // itineryDBDateSearch: 'registration_date',
        itineryDBCountry: '',
        itineryDBRegion: '',
        itineryDBCategory: '',
        itineryDBSeries: 'name',
    })

    const searchOptions = [
        { value: 'name', label: '이름' },
        { value: 'id', label: '고유번호' }
    ]

    const [startDate, setStartDate] = useState<Date | null>();
    const [endDate, setEndDate] = useState<Date | null>();

    const [dbManagment, setDbManagment] = useState<dbManagment[]>([]);
    const [totalSize, setTotalSize] = useState(Number);
    const [isRadioCheck, setisRadioCheck] = useState(String);

    const [region, setRegion] = useState<dropDown[]>([])
    const [category, setCategory] = useState<dropDown[]>([])


    // helper functions
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // console.log("e.target.value", e);
        setState({
            ...state,
            [e.target.name]: e.target.value,
        });
    };

    const viewMore = () => {
        getDbManagment()
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

    const getDbManagment = (page = 1, sizePerPage = 10) => {
        let start = startDate ? moment(startDate).format("YYYY-MM-DD") : "";
        let end = endDate ? moment(endDate).format("YYYY-MM-DD") : "";

        ApiPost(
            `admin/getFilteredTourcourse?per_page=${sizePerPage}&page_number=${page}`, {
            start_date: start,
            end_date: end,
            country: "대한민국",
            region: state.itineryDBRegion,
            category: state.itineryDBCategory,
            option: state.itineryDBSeries,
            search_term: state.itneryDBSearch
        }
        ).then((res: any) => {
            console.log("res.data.courses", res.data.courses);

            setTotalSize(res.data && res.data.count);
            setDbManagment(
                res.data &&
                res.data.courses &&
                res.data.courses.map((x: any, index: any) => {
                    return {
                        id: x.id,
                        no_id: (res.data.count - ((page - 1) * sizePerPage)) - index,
                        country: x.country,
                        region: x.region,
                        category: x.category,
                        name: x.name,
                    };
                })
            );
        });
    }

    const getRegion = async () => {
        await ApiGet("itinerary/region").then((res: any) => {
            setRegion(
                res.data.region.map((x: any) => {
                    return {
                        value: x.region,
                        label: x.region
                    }
                })
            )
        })
            .catch(error => {
                console.log(error);
            })

        setRegion((prev: any) => {
            return [
                { value: "", label: "지역" },
                ...prev
            ]
        })
    }

    const getCategory = async () => {
        await ApiGet("itinerary/category").then((res: any) => {
            setCategory(
                res.data.map((x: any) => {
                    return {
                        value: x.category,
                        label: x.category
                    }
                })
            )
        })
            .catch(error => {
                console.log(error);
            })

        setCategory((prev: any) => {
            return [
                { value: "", label: "카테고리" },
                ...prev
            ]
        })
    }

    // useEffects
    useEffect(() => {
        getDbManagment()
        // getCountry()
        getRegion()
        getCategory()
    }, [])


    return (
        <>
            <div className="col-12 p-0">
                <div className="bg-navigation">
                    <h2 className="text-white">여행 코스 DB 관리</h2>
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
                                                등록일
                                            </InputGroup.Text>
                                        </InputGroup>
                                        {/* <InputField
                                                    name="itineryDBDateSearch"
                                                    value="등록일"
                                                    lablestyleClass=""
                                                    InputstyleClass="mb-0 manage-datepicker"
                                                    onChange={(e: any) => { handleChange(e) }}
                                                    label=""
                                                    placeholder="등록일"
                                                    type="text"
                                                    fromrowStyleclass=""
                                                /> */}
                                    </div>

                                    <div className=" " onClick={() => { onDatePickerClick("startDate") }}>
                                        <DatePicker id="startDate" name="" selected={startDate} startDate={startDate} endDate={endDate}
                                            onChange={(date: Date | null) => setStartDate(date)} dateFormat="yyyy.MM.dd" selectsStart
                                            locale="ko" />

                                    </div>

                                    <div className="tild">
                                        <span>~</span>
                                    </div>

                                    <div className=" " onClick={() => { onDatePickerClick("endDate") }}>
                                        <DatePicker id="endDate" selected={endDate} onChange={(date: Date | null) => setEndDate(date)} selectsEnd startDate={startDate} endDate={endDate} minDate={startDate} dateFormat="yyyy.MM.dd" locale="ko" />
                                    </div>

                                    <div className="filter-radio d-md-flex ">
                                        <RadioButton
                                            type="checkbox"
                                            name="Open-Private"
                                            id="Open-Private"
                                            value="어제"
                                            checked={isRadioCheck === "어제" ? true : false}
                                            BtnLable="어제"
                                            onSelect={(e) => { handleSelect(e) }}
                                        />
                                        <RadioButton
                                            type="checkbox"
                                            name="Open-Private"
                                            id="Open-Private"
                                            value="오늘"
                                            checked={isRadioCheck === "오늘" ? true : false}
                                            BtnLable="오늘"
                                            onSelect={handleSelect}
                                        />
                                        <RadioButton
                                            type="checkbox"
                                            name="Open-Private"
                                            id="Open-Private"
                                            value="1개월"
                                            checked={isRadioCheck === "1개월" ? true : false}
                                            BtnLable="1개월"
                                            onSelect={handleSelect}
                                        />

                                        <RadioButton
                                            type="checkbox"
                                            name="Open-Private"
                                            id="Open-Private"
                                            value="3개월"
                                            checked={isRadioCheck === "3개월" ? true : false}
                                            BtnLable="3개월"
                                            onSelect={handleSelect}
                                        />

                                        <RadioButton
                                            type="checkbox"
                                            name="Open-Private"
                                            id="Open-Private"
                                            value="6개월"
                                            checked={isRadioCheck === "6개월" ? true : false}
                                            BtnLable="6개월"
                                            onSelect={handleSelect}
                                        />

                                        <RadioButton
                                            type="checkbox"
                                            name="Open-Private"
                                            id="Open-Private"
                                            value="1년"
                                            checked={isRadioCheck === "1년" ? true : false}
                                            BtnLable="1년"
                                            onSelect={handleSelect}
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

                                    <div className="">
                                        {/* <Select
                                                    options={country}
                                                    defaultValue={{ value: "", label: "국가" }}
                                                    name="itineryDBCountry"
                                                    placeholder="국가"
                                                    onChange={(e: any) => setState({
                                                        ...state,
                                                        itineryDBCountry: e.value
                                                    })}
                                                /> */}
                                        <InputGroup>
                                            <InputGroup.Text className="inputgroup-text-imp">
                                                대한민국
                                            </InputGroup.Text>
                                        </InputGroup>
                                    </div>


                                    <div className="">
                                        <Select
                                            options={region}
                                            defaultValue={{ value: "", label: "지역" }}
                                            name="itineryDBRegion"
                                            placeholder="지역"
                                            onChange={(e: any) => setState({
                                                ...state,
                                                itineryDBRegion: e.value
                                            })}
                                        />
                                    </div>


                                    <div className="">
                                        <Select
                                            options={category}
                                            defaultValue={{ value: "", label: "카테고리" }}
                                            name="itineryDBCategory"
                                            placeholder={'카테고리'}
                                            onChange={(e: any) => setState({
                                                ...state,
                                                itineryDBCategory: e.value
                                            })}

                                        />
                                    </div>


                                    <div className="">
                                        <Select
                                            options={searchOptions}
                                            defaultValue={searchOptions[0]}
                                            name="itineryDBSeries"
                                            placeholder={'이름 고유번호'}
                                            onChange={(e: any) => setState({
                                                ...state,
                                                itineryDBSeries: e.value
                                            })}

                                        />
                                    </div>



                                    <div className=" d-flex">
                                        <InputField
                                            name="itneryDBSearch"
                                            value={state.itneryDBSearch}
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

                                </Form.Row>
                            </div>

                        </div>

                        <div className="p-0">

                            <div className="table-width">
                                <ItineraryMngListDB
                                    data={dbManagment}
                                    getDbManagment={getDbManagment}
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

export default ItineraryMngDB