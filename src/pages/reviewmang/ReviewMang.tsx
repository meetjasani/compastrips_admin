import React, { useEffect, useState } from "react";
import { Form, InputGroup } from "react-bootstrap";
import Buttons from "../../component/Buttons/Buttons";
import InputField from "../../component/InputField/InputField";
import DatePicker, { registerLocale } from "react-datepicker";
import ko from "date-fns/locale/ko";
import Select from "react-select";
import RadioButton from "../../component/radiobutton/RadioButton";
import ReviewMangList from "./ReviewMangList";
import { CustomDateFilter } from "../../helper/CustomDateFilter";
import moment from "moment";
import { ApiGet } from "../../helper/API/ApiData";
registerLocale("ko", ko);
export interface reviewManagment {
  id: string;
  no_id: string;
  user_first_name: string,
  user_last_name: string,
  user_Name: string;
  user_RegistrationDate: Date;
  tour_Title: string;
  host_first_name: string,
  host_last_name: string,
  host_Name: string;
  content:string;
  star: number;
}
const ReviewMang = () => {
  const [startDate, setStartDate] = useState<Date | null>();
  const [endDate, setEndDate] = useState<Date | null>();
  const [reviewManagment, setreviewManagmentData] = useState<reviewManagment[]>([]);
  const [totalSize, setTotalSize] = useState<number>(0);

  const [isRadioCheck, setisRadioCheck] = useState<string>();

  const [state, setState] = useState({
    reviewSearch: "",
    reviewDateSearch: "",
    reviewTitle: "name",
  });

  const reviewTitle = [
    { value: "tour_title", label: "여행 제목" },
    { value: "name", label: "이름" },
    { value: "host", label: "호스트" },
  ];

  const getReviewManagment = (page = 1, sizePerPage = 10) => {
    let start = startDate ? moment(startDate).format("YYYY-MM-DD") : "";
    let end = endDate ? moment(endDate).format("YYYY-MM-DD") : "";

    ApiGet(
      `hosting/getFilteredReview?start_date=${start}&end_date=${end}&option=${state.reviewTitle}&search_term=${state.reviewSearch}&page_number=${page}&per_page=${sizePerPage}`
    ).then((res: any) => {
      setTotalSize(res.data && res.data.count);
      setreviewManagmentData(
        res.data &&
        res.data.users &&
        res.data.users.map((x: any, index: any) => {
          const user_RegistrationDate = `${x.registration_date.slice(0, 10)} ${x.registration_date.slice(11, 16)}`;
          return {
            id: x.id,
            no_id: res.data.count - (page - 1) * sizePerPage - index,
            user_first_name: x.user_first_name,
            user_last_name: x.user_last_name,
            user_Name: x.user_first_name + " " + x.user_last_name,
            tour_Title: x.tour_title,
            star: x.star.toFixed(1),
            host_first_name: x.host_first_name,
            host_last_name: x.host_last_name,
            host_Name: x.host_first_name + " " + x.host_last_name,
            content:x.content.length >= 23 ? x.content.slice(0, 23) + ".." : x.content,
            user_RegistrationDate: user_RegistrationDate,
          };
        })
      );
    });
  };

  useEffect(() => {
    getReviewManagment()
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
    // console.log("e.target.value", e);
  };

  const handleSelect = (e: any) => {
    setisRadioCheck(e.target.value);

    let date = CustomDateFilter(e.target.value);

    setStartDate(moment(date).toDate());
    setEndDate(
      e.target.value === "어제"
        ? moment().subtract(1, 'days').toDate()
        : moment().toDate()
    );
  };

  const searchReview = () => {
    getReviewManagment()
  };
  return (
    <>
      <div className="col-12 p-0">
        <div className="bg-navigation">
          <h2 className="text-white">리뷰 관리</h2>
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
                  </div>

                  <div className=" ">
                    <DatePicker
                      name=""
                      selected={startDate}
                      startDate={startDate}
                      endDate={endDate}
                      onChange={(date: Date | null) => setStartDate(date)}
                      dateFormat="yyyy.MM.dd"
                      selectsStart
                      locale="ko"
                    />
                  </div>

                  <div className="tild">
                    <span>~</span>
                  </div>

                  <div className=" ">
                    <DatePicker
                      selected={endDate}
                      onChange={(date: Date | null) => setEndDate(date)}
                      selectsEnd
                      startDate={startDate}
                      endDate={endDate}
                      minDate={startDate}
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
                      checked={isRadioCheck === "어제" ? true : false}
                      BtnLable="어제"
                      onSelect={(e) => {
                        handleSelect(e);
                      }}
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
                    <Select
                      defaultValue={reviewTitle[0]}
                      options={reviewTitle}
                      name="reviewTitle"
                      // placeholder={'여행 제목'}
                      onChange={(e: any) =>
                        setState({
                          ...state,
                          reviewTitle: e.value,
                        })
                      }
                     
                    />
                  </div>

                  <Form.Row className="m-0">

                    <div className=" d-flex">
                      <InputField
                        name="reviewSearch"
                        value={state.reviewSearch}
                        lablestyleClass=""
                        InputstyleClass="mb-0 manage-datepicker"
                        onChange={(e: any) => {
                          handleChange(e);
                        }}
                        label=""
                        placeholder="검색어 입력"
                        type="text"
                        fromrowStyleclass=""
                      />

                      <Buttons
                        type="submit"
                        children="검색"
                        ButtonStyle="search-button ml-2"
                        onClick={searchReview}
                      />
                    </div>

                  </Form.Row>
                </Form.Row>
              </div>

            </div>

            <div className="p-0">

              <div className="table-width">
                <ReviewMangList
                  data={reviewManagment}
                  getReviewManagment={getReviewManagment}
                  totalSize={totalSize} />
              </div>

            </div>
          </div>
        </div>
      </>
    </>
  );
};

export default ReviewMang;
