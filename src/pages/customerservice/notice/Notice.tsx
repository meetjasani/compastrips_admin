import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import DatePicker, { registerLocale } from "react-datepicker";
import ko from "date-fns/locale/ko";
import Select from 'react-select'
import RadioButton from '../../../component/radiobutton/RadioButton';
import InputField from '../../../component/InputField/InputField';
import Buttons from '../../../component/Buttons/Buttons';
import NoticeList from './NoticeList';
import moment from 'moment';
import { ApiGet } from '../../../helper/API/ApiData';
import { CustomDateFilter } from '../../../helper/CustomDateFilter';
registerLocale("ko", ko);

export interface notice {
    id: string,
    no_id: string,
    title: string,
    views: string
    registered_date: string
}

function Notice() {
    const [startDate, setStartDate] = useState<Date | null>();
    const [endDate, setEndDate] = useState<Date | null>();
    const [totalSize, setTotalSize] = useState<number>(0)
    const [notice, setNotice] = useState<notice[]>([])
    const [isRadioCheck, setisRadioCheck] = useState(String);

    const [state, setState] = useState({
        option: 'title',
        search_term: '',
    })


    const optionDropdown = [
        { value: 'title', label: '제목' },
        { value: 'content', label: '내용' },
    ]

    const handleSelect = (e: any) => {
        // console.log(e.target.value);

        setisRadioCheck(e.target.value);
        let date = CustomDateFilter(e.target.value);

        setStartDate(moment(date).toDate());
        setEndDate(e.target.value === '어제' ? moment().subtract(1, 'days').toDate() : moment().toDate());
    };

    const getNotice = (page = 1, sizePerPage = 10) => {
        let start = startDate ? moment(startDate).format('YYYY-MM-DD') : '';
        let end = endDate ? moment(endDate).format('YYYY-MM-DD') : '';
        ApiGet(`admin/getFilteredNotices?start_date=${start}&end_date=${end}&option=${state.option}&search_term=${state.search_term}&per_page=${sizePerPage}&page_number=${page}`)
            .then((res: any) => {
                setTotalSize(res.data?.count)
                setNotice(res.data?.notice?.map((x: any, index: any) => {
                    return {
                        id: x.id,
                        no_id: (res.data.count - ((page - 1) * sizePerPage)) - index,
                        title: x.title,
                        views: x.views,
                        registered_date: x.registered_date.slice(0, 10) + " " + x.registered_date.slice(11, 16),
                        language: x.language
                    }
                }))
            })
    }

    const viewMore = (e?: any) => {
        getNotice()
    };

    const onDatePickerClick = (id: string) => {
        document.getElementById(id)?.click();
    }

    // useEffects
    useEffect(() => {
        getNotice()
    }, [])

    return (
        <>
            <div className="col-12 p-0">
                <div className="bg-navigation">
                    <h2 className="text-white">공지사항</h2>
                </div>
            </div>

            <>

                <div className="custom-left">
                    <div className="topfilter-table">
                        <div className="top-filters p-0">

                            <div className="filter-t-box">
                                <div className="head-member">
                                    <h6 className="font-18-bold ln-65">등록일</h6>
                                </div>
                            </div>
                            <div className="filter-d-box">
                                <Form.Row className="stela-row m-0">



                                    <div className="notice-first-date" onClick={() => { onDatePickerClick("startDate") }}>
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
                                            selectsEnd startDate={startDate} endDate={endDate} minDate={startDate}
                                            dateFormat="yyyy.MM.dd"
                                            locale="ko"
                                        />
                                    </div>

                                    <div className="filter-radio d-md-flex ">
                                        <RadioButton
                                            type="checkbox"
                                            name="Open-Private"
                                            id="Open-Private"
                                            value="어제"
                                            BtnLable="어제"
                                            checked={isRadioCheck === "어제" ? true : false}
                                            onSelect={(e) => { handleSelect(e) }}
                                        />
                                        <RadioButton
                                            type="checkbox"
                                            name="Open-Private"
                                            id="Open-Private"
                                            value="오늘"
                                            BtnLable="오늘"
                                            checked={isRadioCheck === "오늘" ? true : false}
                                            onSelect={(e) => { handleSelect(e) }}
                                        />
                                        <RadioButton
                                            type="checkbox"
                                            name="Open-Private"
                                            id="Open-Private"
                                            value="1개월"
                                            BtnLable="1개월"
                                            checked={isRadioCheck === "1개월" ? true : false}
                                            onSelect={(e) => { handleSelect(e) }}
                                        />

                                        <RadioButton
                                            type="checkbox"
                                            name="Open-Private"
                                            id="Open-Private"
                                            value="3개월"
                                            BtnLable="3개월"
                                            checked={isRadioCheck === "3개월" ? true : false}
                                            onSelect={(e) => { handleSelect(e) }}
                                        />

                                        <RadioButton
                                            type="checkbox"
                                            name="Open-Private"
                                            id="Open-Private"
                                            value="6개월"
                                            BtnLable="6개월"
                                            checked={isRadioCheck === "6개월" ? true : false}
                                            onSelect={(e) => { handleSelect(e) }}
                                        />

                                        <RadioButton
                                            type="checkbox"
                                            name="Open-Private"
                                            id="Open-Private"
                                            value="1년"
                                            BtnLable="1년"
                                            checked={isRadioCheck === "1년" ? true : false}
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

                                    <div className="">
                                        <Select
                                            options={optionDropdown}
                                            defaultValue={optionDropdown[0]}
                                            name="reviewTitle"
                                            // placeholder={'제목'}
                                            onChange={(e: any) => setState({
                                                ...state,
                                                option: e.value
                                            })}

                                        />
                                    </div>


                                    <Form.Row className="m-0">

                                        <div className=" d-flex">
                                            <InputField
                                                name="reviewSearch"
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

                                    </Form.Row>
                                </Form.Row>
                            </div>

                        </div>

                        <div className="p-0">

                            <div className="table-width">
                                < NoticeList
                                    data={notice}
                                    getNotice={getNotice}
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

export default Notice
