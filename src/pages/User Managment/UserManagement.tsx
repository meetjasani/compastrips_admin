import React, { useEffect, useState } from "react";
import {Form } from "react-bootstrap";
import Buttons from "../../component/Buttons/Buttons";
import InputField from "../../component/InputField/InputField";
import DatePicker, { registerLocale } from "react-datepicker";
import ko from "date-fns/locale/ko";
import Select from "react-select";
import RadioButton from "../../component/radiobutton/RadioButton";
import UserMagList from "./UserMagList";
import { CustomDateFilter } from "../../helper/CustomDateFilter";
import moment from "moment";
import { ApiGet, ApiGetNoAuth } from "../../helper/API/ApiData";
import exportFile from "../../helper/ExportExcelFile";
registerLocale("ko", ko);
export interface userManagment {
  id: string;
  no_id: string,
  user_Name: string;
  user_Nick: string;
  user_email: string;
  user_Mo: number;
  user_National: string;
  user_Hosting: string;
  user_SignDate: Date;
}
const UserManagement = () => {
  const [startDate, setStartDate] = useState<Date | null>();
  const [endDate, setEndDate] = useState<Date | null>();
  const [userManagment, setuserManagmentData] = useState<userManagment[]>([]);
  const [totalSize, setTotalSize] = useState<number>(0);
  const [isRadioCheck, setisRadioCheck] = useState<string>();
  const [userMng_National, setUserMng_National] = useState([
    { value: '', label: '국적' }
  ])

  const [state, setState] = useState({
    itneryDBSearch: "",
    itineryDBDateSearch: "",
    userMng_National: "",
    userMng_Host: "",
    userMng_Info: "name",
    signDelDate: "sign_up",
    itineryDBCategory: "",
    itineryDBSeries: "",
  });

  const userMng_Host = [
    { value: "", label: "호스팅한 여행" },
    { value: "YES", label: "있음" },
    { value: "NO", label: "없음" },
  ];

  const userMng_Info = [
    { value: "name", label: "이름" },
    { value: "user_name", label: "닉네임" },
    { value: "email", label: "이메일 주소" },
    { value: "mobile", label: "휴대폰 번호" },
  ];

  const signDelDate = [
    { value: "sign_up", label: "가입일" },
    { value: "deletion", label: "탈퇴일" },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const viewMore = () => {
    getUserManagment();
  };

  const ltineraryRegBtn = () => {

    exportFile(
      {
        startDate,
        endDate,
        signDelDate: state.signDelDate,
        userMng_National: state.userMng_National,
        userMng_Host: state.userMng_Host,
        userMng_Info: state.userMng_Info,
        itneryDBSearch: state.itneryDBSearch
      }
    )

  }




  const getUserManagment = (page = 1, sizePerPage = 10) => {
    let start = startDate ? moment(startDate).format("YYYY-MM-DD") : "";
    let end = endDate ? moment(endDate).format("YYYY-MM-DD") : "";
    ApiGet(
      `admin/getFilteredUser?date_option=${state.signDelDate}&start_date=${start + ''}&end_date=${end + ''}&nationality=${state.userMng_National}&my_hosting=${state.userMng_Host}&user_information=${state.userMng_Info}&search_term=${state.itneryDBSearch}&per_page=${sizePerPage}&page_number=${page}&is_deleted=false`
    ).then((res: any) => {
      setTotalSize(res.data && res.data.count);
      setuserManagmentData(
        res.data &&
        res.data.users &&
        res.data.users.map((x: any, index: any) => {
          const user_SignDate = `${x.created_at.slice(0, 10)} ${x.created_at.slice(11, 16)}`
            return {
              id: x.id,
              no_id: (res.data.count - ((page - 1) * sizePerPage)) - index,
              user_Name: x.first_name + " " + x.last_name,
              user_Nick: x.user_name,
              user_email: x.email,
              user_Mo: x.mobile,
              user_National: x.nationality,
              user_Hosting: x.my_hosting === 0 ? "없음" : `있음(${x.my_hosting})`,
              user_SignDate
            };
        })
      );
    });
  };

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
      setUserMng_National(data)
    })
      .catch(error => {
        console.log(error);
      })
  }

  useEffect(() => {
    getUserManagment()
    getCountryData()
  }, [])

  return (
    <>
      <div className="col-12 p-0">
        <div className="bg-navigation">
          <h2 className="text-white">회원 관리</h2>
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
                      defaultValue={signDelDate[0]}
                      options={signDelDate}
                      name="signDelDate"
                      autosize={true}
                      // placeholder="가입일 탈퇴일"
                      onChange={(e: any) =>
                        setState({
                          ...state,
                          signDelDate: e.value,
                        })
                      }
                    />
                  </div>

                  <div className="">
                    <DatePicker
                      name=""
                      selected={startDate}
                      startDate={startDate}
                      endDate={endDate}
                      maxDate={endDate}
                      onChange={(date: Date | null) => setStartDate(date)}
                      dateFormat="yyyy.MM.dd"
                      selectsStart
                      locale="ko"
                    />
                  </div>

                  <div className="tild">
                    <span>~</span>
                  </div>

                  <div className="">
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
                      type="radio"
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
                      type="radio"
                      name="Open-Private"
                      id="Open-Private"
                      value="오늘"
                      checked={isRadioCheck === "오늘" ? true : false}
                      BtnLable="오늘"
                      onSelect={(e) => {
                        handleSelect(e);
                      }}
                    />
                    <RadioButton
                      type="radio"
                      name="Open-Private"
                      id="Open-Private"
                      value="1개월"
                      checked={isRadioCheck === "1개월" ? true : false}
                      BtnLable="1개월"
                      onSelect={(e) => {
                        handleSelect(e);
                      }}
                    />

                    <RadioButton
                      type="radio"
                      name="Open-Private"
                      id="Open-Private"
                      value="3개월"
                      checked={isRadioCheck === "3개월" ? true : false}
                      BtnLable="3개월"
                      onSelect={(e) => {
                        handleSelect(e);
                      }}
                    />

                    <RadioButton
                      type="radio"
                      name="Open-Private"
                      id="Open-Private"
                      value="6개월"
                      checked={isRadioCheck === "6개월" ? true : false}
                      BtnLable="6개월"
                      onSelect={(e) => {
                        handleSelect(e);
                      }}
                    />

                    <RadioButton
                      type="radio"
                      name="Open-Private"
                      id="Open-Private"
                      value="1년"
                      checked={isRadioCheck === "1년" ? true : false}
                      BtnLable="1년"
                      onSelect={(e) => {
                        handleSelect(e);
                      }}
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
                        value: state.userMng_National,
                        label: state.userMng_National === '' ? '국적' : state.userMng_National
                      }}
                      options={userMng_National}
                      name="userMng_National"
                      autosize={true}
                      // placeholder="국가"
                      onChange={(e: any) => setState({
                        ...state,
                        userMng_National: e.value
                      })}
                    />
                  </div>

                  <div className="select">
                    <Select
                      defaultValue={userMng_Host[0]}
                      options={userMng_Host}
                      name="userMng_Host"
                      // placeholder="호스팅한"
                      onChange={(e: any) =>
                        setState({
                          ...state,
                          userMng_Host: e.value,
                        })
                      }
                    />
                  </div>

                  <div className="select">
                    <Select
                      defaultValue={userMng_Info[0]}
                      options={userMng_Info}
                      name="userMng_Info"
                      // placeholder="회원정보"
                      onChange={(e: any) =>
                        setState({
                          ...state,
                          userMng_Info: e.value,
                        })
                      }
                    />
                  </div>

                  <Form.Row className="m-0">
                    <div>
                      <div className=" d-flex">
                        <InputField
                          name="itneryDBSearch"
                          value={state.itneryDBSearch}
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
                          onClick={viewMore}
                        />
                      </div>
                    </div>
                  </Form.Row>
                </Form.Row>
              </div>

            </div>
          </div>

          <div className="p-0">

            <div className="table-width">
              <UserMagList
                data={userManagment}
                getUserManagment={getUserManagment}
                totalSize={totalSize}
                ltineraryRegBtn={ltineraryRegBtn}
              />
            </div>

          </div>
        </div>
      </>
    </>
  );
};

export default UserManagement;
