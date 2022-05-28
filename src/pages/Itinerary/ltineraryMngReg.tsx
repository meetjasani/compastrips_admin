import React, { useEffect, useState } from "react";
import { Row, Col, Form, Modal, Image, Nav } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import DatePicker, { registerLocale } from "react-datepicker";
import ko from "date-fns/locale/ko";
import Buttons from "../../component/Buttons/Buttons";
import InputField from "../../component/InputField/InputField";
import { InputGroup } from "react-bootstrap"
import RadioButton from "../../component/radiobutton/RadioButton";
import Select from "react-select";
import { useHistory, useParams } from "react-router";
import CheckBox from "../../component/checkbox/Checkbox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretLeft, faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { ApiDelete, ApiGet, ApiPost, ApiPut } from "../../helper/API/ApiData";
import moment from "moment";
import { itineraryCommon } from "./ItineraryMng";
import ItineraryTourDetail from "./ItineraryTourDetail";
import Swal from "sweetalert2";
registerLocale("ko", ko);
export interface tourCourses {
  id: string;
  country: string;
  region: string;
  category: string;
  name: string;
  image: any;
  opening_date: string;
  closing_date: string;
  summary: string;
  address: string;
  website: string;
  n_p_transportation: string;
  mobile: string;
  language: string;
}
export interface tourCourseFilters {
  country: string;
  region: string;
  category: string[];
  itnerySearch: string;
}

const initial: any = {
  data: [{
    value: "전체",
    label: "전체"
  }, {
    value: "현지인만 아는",
    label: "현지인만 아는"
  }, {
    value: 'K-pop',
    label: `K-pop`
  }, {
    value: "축제와 이벤트",
    label: "축제와 이벤트"
  }, {
    value: "인기명소",
    label: "인기명소"
  }
  ]
}
const ItineraryMngReg = () => {
  ///////////////////////////_____________________States ////////////////////////////
  const history = useHistory();
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [showAddItinerary, setshowAddItinerary] = useState(false); // to show hide popup
  const [tourDetailsflag, settourDetailsFlag] = useState(false);
  const [cards, setcardsDetails] = useState<tourCourses>();
  const [tourcoursesDetail, settourcoursesDetail] = useState<tourCourses[]>([]);
  const [tourcoursesCount, settourcoursesCount] = useState<number>(1);
  const [itineryRegion, setItineryRegionData] = useState<itineraryCommon[]>([]);

  const [itineryCategory, setItItineryCategoryData] = useState<
    itineraryCommon[]
  >([]);
  const [itinerary, setItinerary] = useState<any[]>([]);
  const [colorOfError, setcolorOfError] = useState("#b931b8");

  const { id }: any = useParams();
  const [page, setPage] = useState(1);
  const [pagePerSize, setPagePerSize] = useState(8);
  const [pageCount, setPageCount] = useState<number>(1);
  const [defaultNote, setdefaultNote] = useState("");
  const [regionErr, setRegionErr] = useState(false);

  const [state, setState] = useState<any>({
    title: "",
    information: "",
    disclosure: "OPEN",
    creator: "",
    hosted_count: "",
    hosts: [],
    region: "",
    tourcourses: [],
    courseImages: [],
    star: "",
    reviews: [],
    wishlist: "",
    nationality: "aa",
    adminNote: "",
    creator_show: id ? "" : "Compastrips",
    created_by_show: id ? "" : "Created by",
    language: ""
  });
  const [tourCourseFilters, settourCourseFilters] = useState<tourCourseFilters>(
    {
      country: "",
      region: "",
      category: [],
      itnerySearch: "",
    }
  );

  ///////////////////////////////////////

  /////////////////_____________useEffect_________________//////////////

  useEffect(() => {
    settourCourseFilters({
      ...tourCourseFilters,
      category: itineryCategory.filter((x) => x.isSelected).map((y) => y.value),
    });
  }, [itineryCategory]);

  useEffect(() => {
    changeColorOfError();
  }, [state]);

  useEffect(() => {
  }, [state]);

  useEffect(() => {
    setItinerary(state.tourcourses);
  }, [state]);

  useEffect(() => {
    if (id) getItineraryById();
  }, []);

  useEffect(() => {
    filterTourCourse();
  }, [page]);

  useEffect(() => {
    paginationCount();
  }, [tourcoursesCount]);

  useEffect(() => {
    filterTourCourse();
  }, [tourCourseFilters.category, tourCourseFilters.region]);

  useEffect(() => {
    checkRegion()
  }, [state.tourcourses])

  /////////////////////////////////////////


  //Checking Region
  const checkRegion = () => {
    setRegionErr(false);
    for (let i = 0; i < state.tourcourses.length - 1; i++) {
      if (state.tourcourses[i].region !== state.tourcourses[i + 1].region) {
        setRegionErr(true);
        break;
      }
    }
  }

  const handleChange = (e: any) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangedisclosure = (e: any) => {
    setState({
      ...state,
      disclosure: e.target.value,
    });
  };

  const handleChangelang = (e: any) => {
    setState({
      ...state,
      language: e.target.value,
    });
  };

  const handleCategory = (category: itineraryCommon) => {
    setItItineryCategoryData(
      itineryCategory.map((data) => {
        if (data.value === category.value) {
          data.isSelected = !data.isSelected;
        }
        return data;
      })
    );
  };

  const changeColorOfError = () => {
    if (checkUniqueRegionError()) {
      setcolorOfError("#b931b8");
    } else {
      setcolorOfError("red");
    }
  };

  const saveItinery = () => {
    setState({
      ...state,
      tourcourses: itinerary.map((data: any, index: number) => ({
        ...data,
        Tid: index + 1,
        Itinerary_Cate: data.category,
        Itinerary_title: data.name,
      })),
      courseImages: itinerary.map((data: any) => ({
        id: data.id,
        img: data.image,
      })),
    });

    changeColorOfError();

    setshowAddItinerary(false);
  };

  const DetailProfile = (row: any) => {
    getTourCourseById(row.id);
    settourDetailsFlag(true);
  };
  const addItinerary = (e: React.ChangeEvent<HTMLInputElement>, iti: any) => {

    if (e.target.checked) {
      setItinerary([...itinerary, iti]);
    } else {
      setItinerary((prev) =>
        prev.filter((x) => {
          return x.id !== iti.id;
        })
      );
    }
  };

  const checkForCreateItineraryError = () => {
    return !(state.title === "" || state.information === "")

  };
  const createNewItinerary = () => {
    // if (checkUniqueRegionError() && checkForCreateItineraryError()) {
    if (!regionErr && checkForCreateItineraryError()) {
      setState({
        ...state,
        country: getUniqueCountryFromRegion(),
      })

      const body = {
        "title": state.title,
        "information": state.information,
        "disclosure": state.disclosure,
        "language": state.language,
        "start_date": startDate,
        "end_date": endDate,
        "courses": state.tourcourses.map((course: any) => course.id),
        "creator_show": state.creator_show,
        "created_by_show": state.created_by_show
      };

      Swal.fire({
        title: '여행 일정 저장',
        text: "입력된 내용으로 저장하시겠습니까?",
        showClass: {
          popup: 'animated fadeInDown faster',
          icon: 'animated heartBeat delay-1s'
        },
        hideClass: {
          popup: 'animated fadeOutUp faster',
        },
        showCancelButton: true,
        confirmButtonText: '저장',
        cancelButtonText: '취소',
        reverseButtons: true,
        showCloseButton: true,
      }).then(async (result: { isConfirmed: any; }) => {
        try {
          if (result.isConfirmed) {
            await ApiPost("itinerary/create", body)
            const willClick = await Swal.fire({
              title: '저장 완료',
              text: "저장되었습니다.",
              showClass: {
                popup: 'animated fadeInDown faster',
                icon: 'animated heartBeat delay-1s'
              },
              hideClass: {
                popup: 'animated fadeOutUp faster',
              },
              confirmButtonText: `확인`,
              showConfirmButton: true,
              showCloseButton: true

            })
            // swal("저장 완료", "저장되었습니다.", {})
            if (willClick) {
              window.location.href = '/itinerary-management'
            }
          }
        }
        catch (error) {
          console.log(error);
        }
      });
    }
  };

  const convertDate = (inputFormat: any) => {
    function pad(s: any) {
      return s < 10 ? "0" + s : s;
    }
    var d = new Date(inputFormat);
    return [d.getFullYear(), pad(d.getMonth() + 1), pad(d.getDate())].join("-");
  };

  const numberOfUniqueRegions = () => {
    const regions = new Set(state.tourcourses.map((x: any) => x.region));
    return regions.size;
  };

  const getUniqueCountryFromRegion = () => {
    if (numberOfUniqueRegions() === 1) {
      const country = state.tourcourses.map((x: any) => x.country);
      return country[0]
    }
    else
      return null;
  }
  const checkUniqueRegionError = () => {
    if (numberOfUniqueRegions() === 1) {
      return true;
    } else return false;
  };



  const modifyItinery = () => {

    // if (checkUniqueRegionError()) {
    if (!regionErr) {
      Swal.fire({
        title: '여행 일정 수정',
        text: "입력된 내용으로 수정하시겠습니까?",
        showClass: {
          popup: 'animated fadeInDown faster',
          icon: 'animated heartBeat delay-1s'
        },
        hideClass: {
          popup: 'animated fadeOutUp faster',
        },
        showCancelButton: true,
        confirmButtonText: '저장',
        cancelButtonText: '취소',
        reverseButtons: true,
        showCloseButton: true,
      })
        .then((result: { isConfirmed: any; }) => {
          if (result.isConfirmed) {

            const TourCourseIds = state.tourcourses.map(
              (course: any) => course.id
            );

            const data = {
              title: state.title,
              information: state.information,
              disclosure: state.disclosure,
              start_date: convertDate(startDate),
              end_date: convertDate(endDate),
              courses: TourCourseIds,
              creator_show: state.creator_show,
              created_by_show: state.created_by_show,
              language: state.language
            };


            if (defaultNote !== state.adminNote) {
              ApiPut(`admin/note?itinerary=${id}`, { note: state.adminNote });
            }

            ApiPut(`admin/editItinerary/${id}`, data);


            Swal.fire({
              title: '여행 일정 수정',
              text: "일정이 수정되었습니다!",
              showClass: {
                popup: 'animated fadeInDown faster',
                icon: 'animated heartBeat delay-1s'
              },
              hideClass: {
                popup: 'animated fadeOutUp faster',
              },
              confirmButtonText: `확인`,
              showConfirmButton: true,
              showCloseButton: true

            })
              .then((data) => {
                if (data) {
                  window.location.href = '/itinerary-management'
                }
              });
          }
        })
    }
  }

  const deletefullItinery = () => {
    Swal.fire({
      title: '여행 일정 삭제',
      text: "이 일정을 삭제하시겠습니까? ",
      showClass: {
        popup: 'animated fadeInDown faster',
        icon: 'animated heartBeat delay-1s'
      },
      hideClass: {
        popup: 'animated fadeOutUp faster',
      },
      showCancelButton: true,
      confirmButtonText: '삭제',
      cancelButtonText: '취소',
      reverseButtons: true,
      showCloseButton: true,
    }).then((result: { isConfirmed: any; }) => {
      if (result.isConfirmed) {

        ApiDelete(`admin/deleteItinerary/${id}`).then(() => {
          Swal.fire({
            title: '여행 일정 삭제',
            text: "일정이 삭제되었습니다!",
            showClass: {
              popup: 'animated fadeInDown faster',
              icon: 'animated heartBeat delay-1s'
            },
            hideClass: {
              popup: 'animated fadeOutUp faster',
            },
            confirmButtonText: `확인`,
            showConfirmButton: true,
            showCloseButton: true

          }).then((data) => {
            if (data) {
              window.location.href = '/itinerary-management'
            }
          });
        })

      }
    })
  }

  const BacktoItineryList = () => {
    history.push("/itinerary-management");
  };

  const deleteItineraryFromTable = (row: any) => {
    Swal.fire({
      title: '코스 삭제',
      text: "해당 코스를 삭제하시겠습니까?",
      showClass: {
        popup: 'animated fadeInDown faster',
        icon: 'animated heartBeat delay-1s'
      },
      hideClass: {
        popup: 'animated fadeOutUp faster',
      },
      showCancelButton: true,
      confirmButtonText: '삭제',
      cancelButtonText: '취소',
      reverseButtons: true,
      showCloseButton: true,
    }).then((result: { isConfirmed: any; }) => {
      if (result.isConfirmed) {

        setState((prev: any) => {
          return {
            ...prev,
            tourcourses: prev.tourcourses.filter(
              (data: any) => data.id !== row.id
            ),
            courseImages: prev.courseImages.filter(
              (data: any) => data.id !== row.id
            ),
          };
        });


        Swal.fire({
          title: '여행 일정 삭제',
          text: "일정이 삭제되었습니다!",
          showClass: {
            popup: 'animated fadeInDown faster',
            icon: 'animated heartBeat delay-1s'
          },
          hideClass: {
            popup: 'animated fadeOutUp faster',
          },
          confirmButtonText: `확인`,
          showConfirmButton: true,
          showCloseButton: true

        })
      }
    })
  };

  const showInfoTourCourse = (
    cell: any,
    row: any,
    rowIndex: any,
    formatExtraData: any
  ) => {
    return (
      <Buttons
        type="button"
        children="정보"
        ButtonStyle="rounded-0 bg-custom-black"
        onClick={() => DetailProfile(row)}
      />
    );
  };

  const dellinkFollow = (
    cell: any,
    row: any,
    rowIndex: any,
    formatExtraData: any
  ) => {
    return (
      <Buttons
        type="button"
        children="삭제 "
        ButtonStyle="rounded-0 bg-custom-black"
        onClick={() => deleteItineraryFromTable(row)}
      />
    );
  };

  const priceFormatter = (
    cell:
      | boolean
      | React.ReactChild
      | React.ReactFragment
      | React.ReactPortal
      | null
      | undefined,
    row: any
  ) => {
    return <strong style={{ color: "#B931B8" }}>{cell}</strong>;
  };

  const columns = [
    {
      dataField: "Tid",
      text: "No",
    },
    {
      dataField: "Itinerary_Cate",
      text: "카테고리명",
    },
    {
      dataField: "Itinerary_title",
      text: "제목",
      formatter: priceFormatter,
    },

    {
      dataField: "Itinerary_info",
      text: "정보",
      formatter: showInfoTourCourse,
    },

    {
      dataField: "Itinerary_del",
      text: "삭제",
      formatter: dellinkFollow,
    },
  ];

  const reviewProfile = (
    cell: any,
    row: any,
    rowIndex: any,
    formatExtraData: any
  ) => {
    return (
      <div className="flex table-review-img">
        <img src={row.avatar} alt="" />
        <span className="font-16-bold-pink ">{row.review_nickname}</span>
      </div>
    );
  };

  const starColumn = (
    cell: any,
    row: any,
    rowIndex: any,
    formatExtraData: any
  ) => {
    return (
      <p>
        {row.review_score.slice(0, 1)} {parseInt(row.review_score.slice(1, 3)).toFixed(1)}
      </p>
    )
  }

  const dateColumn = (
    cell: any,
    row: any,
    rowIndex: any,
    formatExtraData: any
  ) => {
    return (
      <p>
        {moment(row.review_date).format('YYYY.MM.DD')}
      </p>
    )
  }

  const reviewlistHead = [
    {
      dataField: "review_nickname",
      text: "닉네임",
      formatter: reviewProfile,
    },
    {
      dataField: "review_score",
      text: "별점",
      formatter: starColumn,
    },

    {
      dataField: "review_date",
      text: "등록일",
      formatter: dateColumn,
    },

    {
      dataField: "review_review",
      text: "리뷰",
    },
  ];

  const counder = [
    { value: "10", label: "10개" },
    { value: "20", label: "20개" },
    { value: "30", label: "30개" },
  ];

  const getSignupdata = () => {
    getRegion();
    getCategory();
    setshowAddItinerary(true);
    filterTourCourse();
  };

  const getRegion = () => {
    ApiGet("itinerary/region").then((res: any) => {
      setItineryRegionData(
        [{ isSelected: true, value: "전체", label: "전체" },
        ...res.data.region.map((x: any) => {
          return {
            isSelected: false,
            value: x.region,
            label: x.region,
          };
        })
        ]

      );
    });
  };
  const getCategory = () => {
    // ApiGet(`itinerary/category`).then((res: any) => {
    setItItineryCategoryData(
      initial.data.map((x: any) => {
        return {
          isSelected: false,
          value: x.value,
          label: x.label,
        };
      })
    );
    // });
  };
  const getTourCourseById = (id: any) => {
    ApiGet(`itinerary/tourcourse/${id}`).then((res: any) =>
      setcardsDetails(res.data)
    );
  };
  const getItineraryById = () => {
    ApiGet(`itinerary/get/${id}`).then((res: any) => {
      setdefaultNote(res?.data.note);

      setState({
        tourcourses:
          res.data &&
          res.data.tourcourse &&
          res.data.tourcourse.map((tour: any, index: number) => {
            return {
              ...tour,
              Tid: index + 1,
              Itinerary_Cate: tour.category,
              Itinerary_title: tour.name,
            };
          }),
        reviews:
          res.data &&
          res.data.reviews &&
          res.data.reviews.map((review: any) => {
            return {
              avatar: review.avatar,
              review_nickname: review.nick_name,
              review_score: "★" + review.star,
              review_date: review.registration_date,
              review_review: review.content,
            };
          }),
        courseImages:
          res.data &&
          res.data.tourcourse &&
          res.data.tourcourse.map((tour: any, index: number) => {
            return {
              id: tour.id,
              img: tour.image,
            };
          }),
        title: res.data && res.data.title,
        information: res.data && res.data.information,
        disclosure: res.data && res.data.disclosure,
        creator: res.data && res.data.creator,
        hosted_count: res.data && res.data.hosted_count,
        hosts: res.data && res.data.hosts,
        star: res.data && res.data.star,
        wishlist: res.data && res.data.wishlist,
        // counder:'10',
        region: res.data && res.data.region,
        country: res.data && res.data.country,
        nationality: "",
        adminNote: res.data && res.data.note,
        creator_show: res.data.creator_show,
        created_by_show: res.data.created_by_show,
        language: res.data.language
      });
      changeColorOfError();
      setItinerary(
        res.data &&
        res.data.tourcourse &&
        res.data.tourcourse.map((tour: any, index: number) => {
          return {
            ...tour,
            Tid: index + 1,
            Itinerary_Cate: tour.category,
            Itinerary_title: tour.name,
          };
        })
      );
      setStartDate(
        new Date(res.data && res.data.start_date && res.data.start_date)
      );
      setEndDate(new Date(res.data && res.data.end_date && res.data.end_date));
    });
  };
  const onFilterChnage = (i: number) => {
    setPage(i);
  };

  const paginationCount = () => {
    let pagecount = Math.ceil(tourcoursesCount / pagePerSize);
    setPageCount(pagecount);
  };

  const filterTourCourse = () => {
    ApiPost(
      `itinerary/tourcourse/filter?per_page=${pagePerSize}&page_number=${page}&keyword=${tourCourseFilters.itnerySearch}`,
      {
        region: tourCourseFilters.region,
        category: tourCourseFilters.category.toString(),
      }
    )
      .then((res: any) => {
        settourcoursesDetail(res?.data && res?.data.data);
        settourcoursesCount(res?.data && res?.data.count);
      })
      .catch((err: any) => {
        if (err) {
        }
      });
  };

  const showItineraryTourDetail = (cards: any) => {
    settourDetailsFlag(true);
    setcardsDetails(cards);
  };
  const hideItineraryTourDetail = () => {
    settourDetailsFlag(false);
  };

  useEffect(() => {
  }, [state])

  return (
    <>
      <div className="col-12 p-0">
        <div className="bg-navigation">
          <h2 className="text-white">여행 일정 관리</h2>
        </div>
      </div>

      <div className="creator-table ">
        <div className="center-box">
          <div>
            <Form>
              <div className="">
                <div
                  className="text-left align-items-center d-flex mb-25"
                >
                  <h4 className="font-25-bold">여행 코스</h4>
                  <Buttons
                    type="button"
                    children="추가하기"
                    ButtonStyle="gray-button-modal ml-md-4 ml-0 mt-2 mt-md-0"
                    onClick={getSignupdata}
                  />
                  <h4
                    className=" mt-2 mt-md-0 ml-md-4 ml-0 font-25-normal-pink"
                    style={{ color: `${colorOfError}` }}
                  >
                    {regionErr ? "※ 같은 지역의 코스만 선택하실 수 있습니다." : ""}
                  </h4>
                </div>

                {state.tourcourses && !state.tourcourses.length ? (
                  <div className="border-tabel-b1">
                    <div>
                      <div className="">
                        <h4 className="blank-tour">
                          여행 코스를 추가해 주세요.
                        </h4>
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}

                {state.tourcourses && state.tourcourses.length ? (
                  <div className="mt-46">
                    <h4 className="font-25-bold mb-25">대한민국, 서울</h4>
                    <div className="text-center data-show-table">
                      <div>
                        <BootstrapTable
                          bootstrap4
                          keyField="id"
                          data={state.tourcourses}
                          columns={columns}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </Form>
          </div>
        </div>
      </div>
      {state.tourcourses &&
        state.tourcourses.length &&
        state.courseImages &&
        state.courseImages.length ? (
        <div>
          <div className="image-upload-box">
            <div className="">
              <div className="upload-pic  d-custom-flex  border-tabel-b1">
                {state &&
                  state.courseImages.map((data: any) =>
                    data.img.map((img: any) => (
                      <div>
                        <img src={img} alt="" />
                        {/* <p className="text-center">이미지명</p> */}
                      </div>
                    ))
                  )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}

      <div className="creator-table ">
        <div className="center-box mt-100">
          <div>
            <Form>
              <div className="">
                <div className="">
                  <h4 className=" font-25-bold mb-25">여행 정보</h4>
                </div>

                <div className="border-tabel-b1">
                  <div>

                    <div className="d-flex">
                      <div className="yellow-bg-table font-18-bold">
                        제목
                      </div>
                      <div className="profile-table-td-input">
                        <div className="py-3">
                          <InputField
                            name="title"
                            value={state.title}
                            lablestyleClass=""
                            InputstyleClass="mb-0 manage-datepicker"
                            onChange={(e: any) => {
                              handleChange(e);
                            }}
                            label=""
                            placeholder="여행 제목을 입력하세요"
                            type="text"
                            fromrowStyleclass=""
                          />
                        </div>
                      </div>
                    </div>

                    <div className="d-flex">
                      <div className="yellow-bg-table font-18-bold">
                        세부 정보
                      </div>
                      <div className="profile-table-td-input">
                        <div className="py-3">
                          <InputField
                            name="information"
                            value={state.information}
                            lablestyleClass=""
                            InputstyleClass="mb-0 manage-datepicker"
                            onChange={handleChange}
                            label=""
                            placeholder="세부 정보를 입력해 주세요."
                            type="textarea"
                            fromrowStyleclass=""
                          />
                        </div>
                      </div>
                    </div>

                    <div className="d-flex">
                      <div className="yellow-bg-table font-18-bold">
                        공개
                      </div>
                      <div className="profile-table-td-input">
                        <div className="d-flex">
                          <div
                            className={`open-radio ${state.disclosure === "OPEN" ? `active-radio` : ``
                              }`}
                          >
                            <RadioButton
                              type="radio"
                              name="disclosure"
                              id="Open"
                              value="OPEN"
                              BtnLable="공개"
                              onSelect={(e) => handleChangedisclosure(e)}
                            />
                          </div>
                          <div
                            className={`private-radio ${state.disclosure === "PRIVATE" ? `active-radio` : ``
                              }`}
                          >
                            <RadioButton
                              type="radio"
                              name="disclosure"
                              id="Private"
                              value="PRIVATE"
                              BtnLable="비공개"
                              onSelect={(e) => handleChangedisclosure(e)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex">
                      <div className="yellow-bg-table font-18-bold">
                        언어
                      </div>
                      <div className="profile-table-td-input">
                        <div className="py-3 d-flex">
                          <div>
                            <input
                              type="radio"
                              id="test3"
                              name="radio-group"
                              value="ko"
                              checked={state.language == "ko" ? true : false}
                              onChange={(e) => handleChangelang(e)}
                            />
                            <label htmlFor="test3">한국어</label>
                          </div>
                          <div className="ml-4">
                            <input
                              type="radio"
                              id="test4"
                              name="radio-group"
                              value="en"
                              checked={state.language == "en" ? true : false}
                              onChange={(e) => handleChangelang(e)}
                            />
                            <label htmlFor="test4">영어</label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex">
                      <div className="yellow-bg-table font-18-bold">
                        작성자 정보
                      </div>
                      <div className="profile-table-td-input created-by">
                        <div className="w-100">
                          {
                            state.creator === 'Host' ?
                              <InputGroup className="">
                                <InputGroup.Text className="userinputs ">
                                  Created by
                                </InputGroup.Text>
                                <InputGroup.Text className="userinputs  ml-2">
                                  {state.creator || "Compastrips"}
                                </InputGroup.Text>
                              </InputGroup>
                              :
                              <div className="d-flex">
                                <div className="">
                                  <InputField
                                    name="created_by_show"
                                    value={state.created_by_show}
                                    lablestyleClass=""
                                    InputstyleClass="mb-0 userinputs"
                                    onChange={(e: any) => {
                                      handleChange(e);
                                    }}
                                    label=""
                                    placeholder=""
                                    type="text"
                                    fromrowStyleclass=""
                                  />
                                </div>
                                <div className="">
                                  <InputField
                                    name="creator_show"
                                    value={state.creator_show}
                                    lablestyleClass=""
                                    InputstyleClass="mb-0 userinputs  ml-2"
                                    onChange={(e: any) => {
                                      handleChange(e);
                                    }}
                                    label=""
                                    placeholder=""
                                    type="text"
                                    fromrowStyleclass=""
                                  />
                                </div>
                              </div>
                          }

                        </div>
                      </div>
                    </div>

                    <div className="d-flex">
                      <div className="yellow-bg-table font-18-bold ">
                        여행게시기간
                      </div>
                      <div className="profile-table-td-input-1">
                        <div className="table-date  d-flex">
                          <DatePicker
                            selected={startDate}
                            onChange={(date: Date | null) => setStartDate(date)}
                            selectsStart
                            startDate={startDate}
                            endDate={endDate}
                            dateFormat="yyyy.MM.dd"
                            disabledKeyboardNavigation
                            placeholderText="This has disabled keyboard navigation"
                            locale="ko"
                          />
                          <span>-</span>
                          <DatePicker
                            selected={endDate}
                            onChange={(date: Date | null) => setEndDate(date)}
                            selectsEnd
                            startDate={startDate}
                            endDate={endDate}
                            minDate={startDate}
                            dateFormat="yyyy.MM.dd"
                            disabledKeyboardNavigation
                            placeholderText="This has disabled keyboard navigation"
                            locale="ko"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Form>
          </div>

          {id && state.hosts ? (
            <div>
              <div className="mt-62">
                <div className="">
                  <h4 className="font-25-bold mb-25">호스팅/리뷰 현황</h4>
                </div>

                <div className="border-tabel-b1">
                  <div>
                    <div className="d-flex">
                      <div className="yellow-bg-table font-18-bold position-set">
                        호스팅/리뷰 현황
                      </div>
                      <div
                        className="profile-table-td-input align-items-center position-set"
                      >
                        <p className="mb-0">{state.hosted_count}</p>
                      </div>
                    </div>

                    <div className="d-flex">
                      <div className="yellow-bg-table font-18-bold">
                        호스트
                      </div>
                      <div
                        className="profile-table-td-input align-items-center"
                      >
                        {state &&
                          state.hosts.map((host: any) => {
                            return (
                              <div>
                                <p className="mb-0">
                                  {host.name}({host.type} 호스트, {host.gender},{" "}
                                  {host.age}대, {host.nationality})| ｜ Before
                                  proceeding ｜ {host.participate_count} 명 참가
                                  중 ｜{moment(host.date).format("YYYY.MM.DD")}{" "}
                                  ({moment(host.date).format("dddd")}) {host.start_time} - {host.end_time}
                                </p>
                              </div>
                            );
                          })}
                      </div>
                    </div>

                    <div className="d-flex">
                      <div className="yellow-bg-table font-18-bold">
                        평점
                      </div>
                      <div
                        className="profile-table-td-input align-items-center"
                      >
                        <p className="mb-0">★ {state.star}</p>
                      </div>
                    </div>

                    <div className="d-flex">
                      <div className="yellow-bg-table font-18-bold">
                        리뷰{" "}
                      </div>
                      <div
                        className="profile-table-td-input align-items-center"
                      >
                        <p className="mb-0">
                          총{" "}
                          <span className="span-color-pink">
                            {state.reviews.length}
                          </span>
                          개
                        </p>
                        <div className="mt-3 text-center itireview-table">
                          {state.reviews.length !== 0 && (
                            <BootstrapTable
                              bootstrap4
                              keyField="id"
                              data={state.reviews}
                              columns={reviewlistHead}
                            />
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="d-flex">
                      <div className="yellow-bg-table font-18-bold">
                        찜
                      </div>
                      <div
                        className="profile-table-td-input align-items-center"
                      >
                        <p className="mb-0">{state.wishlist}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <Col className="textarea-border"></Col>
              </div>
            </div>
          ) : (
            ""
          )}

          {id ? (
            <div className="">
              <div className="border-tabel-b1">
                <div className="d-flex">
                  <div className="yellow-bg-table font-18-bold">
                    관리자 메모
                  </div>
                  <div className="profile-table-td-input">
                    <div className="py-3">
                      <InputField
                        name="adminNote"
                        value={state.adminNote}
                        lablestyleClass=""
                        InputstyleClass="mb-0 manage-datepicker"
                        onChange={(e: any) => handleChange(e)}
                        label=""
                        placeholder=""
                        type="textarea"
                        fromrowStyleclass=""
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}

          <div className="px-110 w-100">
            <div className="text-center z_index_1">
              <Buttons
                type="submit"
                children="목록"
                ButtonStyle="border-button font-22-bold"
                onClick={BacktoItineryList}
              />

              {!id && (
                <Buttons
                  type="submit"
                  children="저장"
                  ButtonStyle="modal-pink-button font-22-bold"
                  onClick={createNewItinerary}
                />
              )}
              {id && (
                <Buttons
                  type="submit"
                  children="수정"
                  ButtonStyle="modal-pink-button font-22-bold"
                  onClick={modifyItinery}
                />
              )}
              {id && <Buttons
                type="submit"
                children="삭제"
                ButtonStyle="border-button font-22-bold"
                onClick={deletefullItinery}
              />}
            </div>
          </div>
        </div>
      </div>

      <ItineraryTourDetail
        cards={cards}
        flag={tourDetailsflag}
        hideItineraryTourDetail={hideItineraryTourDetail}
      />

      <Modal
        show={showAddItinerary}
        onHide={() => {
          setshowAddItinerary(false);
          setItinerary(state.tourcourses);
        }}
        dialogClassName="modal-90w itinerary-bigmodal"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Header closeButton className="p-0">
          <Modal.Title id="example-custom-modal-styling-title">
            <h6 className="font-30-bold">여행 코스 검색</h6>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="additinery_modal p-0">
          <Col lg={12} className="p-0">
            <Row className="radio-list ml-0">
              <Col md={2} className="p-0">
                <h5 className="font-20-normal text-black">국가</h5>
              </Col>
              <Col md={10} className=" p-0 font-18-normal">
                <RadioButton
                  type="checkbox"
                  name="country"
                  id="Open-Private"
                  value="Open-Private"
                  BtnLable="대한민국"
                  checked={true}
                  onSelect={(e: any) => {
                    settourCourseFilters({
                      ...tourCourseFilters,
                      country: e.target.value,
                    });
                  }}
                />
              </Col>

              <Col md={2} className="p-0">
                <h5 className="font-20-normal text-black">지역</h5>
              </Col>
              <Col md={10} className="p-0 d-md-flex radio-flex ">
                {itineryRegion.map((region: any) => (
                  <div
                    className="font-18-normal"
                    key={region.value}
                  >
                    <RadioButton
                      type="radio"
                      name="region"
                      id="region"
                      value={region.value}
                      checked={region.value === tourCourseFilters.region}
                      BtnLable={region.label}
                      onSelect={(e: any) => {
                        settourCourseFilters({
                          ...tourCourseFilters,
                          region: e.target.value,
                        });
                      }}
                    />
                  </div>
                ))}
              </Col>
              <Col md={2} className="p-0">
                <h5 className="font-20-normal text-black">
                  카테고리 <br /> (복수선택 가능)
                </h5>
              </Col>
              <Col md={10} className="p-0 d-md-flex radio-flex ">
                {/* <RadioButton
                  type="checkbox"
                  name="category"
                  id="Open-Private"
                  checked={!tourCourseFilters?.category?.length}
                  value=""
                  BtnLable="All"
                  onSelect={() => {
                    setItItineryCategoryData(
                      itineryCategory.map((data) => {
                        data.isSelected = false;
                        return data;
                      })
                    );
                  }}
                /> */}
                {itineryCategory.map((category: any) => (
                  <div
                    className="font-18-normal"
                    key={category.value}
                  >
                    <RadioButton
                      type="checkbox"
                      name="category"
                      id="Open-Private"
                      checked={category.isSelected}
                      value={category.value}
                      BtnLable={category.label}
                      onSelect={() => {
                        handleCategory(category);
                      }}
                    />
                  </div>
                ))}
              </Col>
            </Row>

            <div className="modal-search">
              <div className="d-md-flex ">
                <InputField
                  name="itnerySearch"
                  value={tourCourseFilters.itnerySearch}
                  lablestyleClass=""
                  InputstyleClass="mb-0 w-100 manage-datepicker"
                  onChange={(e: any) => {
                    settourCourseFilters({
                      ...tourCourseFilters,
                      itnerySearch: e.target.value,
                    });
                  }}
                  label=""
                  placeholder="검색어 입력"
                  type="text"
                  fromrowStyleclass=""
                />
              </div>
              <div className="text-right">
                <Buttons
                  type="submit"
                  children="검색"
                  ButtonStyle="search-button ml-0 py-3  px-4"
                  onClick={filterTourCourse}
                />
              </div>
            </div>

            <Row className="">
              <Col>
                <h3 className="font-27-bold h-35">
                  총{" "}
                  <span className="span-color-pink">
                    {tourcoursesCount ?? 0}
                  </span>
                  개 ｜ 선택 <span className="span-color-pink">0</span> 개
                </h3>
              </Col>
            </Row>
            {!(tourcoursesDetail.length) ? (
              <Row className=" mt-4">
                <Col lg={12}>
                  <div className="no-data-found-modal">
                    <p className="font-20-normal text-center">
                      검색 내역이 없습니다.
                    </p>
                  </div>
                </Col>
              </Row>
            ) : (
              <div className="d-custom-flex modal-card-wrapper">
                {tourcoursesDetail.map((cards, i) => (
                  <div key={cards.id} className="p-0 single-itinery-card">
                    <div className={itinerary.map((x) => x.id).includes(cards.id) ? "modal-card b-purple" : "modal-card b-trans"}>
                      <div>
                        <div className="checkboxes p-0  ml-auto pr-11">
                          {/* <CheckBox
                          label=""
                          type="checkbox"
                          name="agree"
                          id="agree"
                          value="agree"
                          styleCheck="checkmark"
                          onChange={(e: any) => {}}
                        /> */}
                          <CheckBox
                            label=""
                            type="checkbox"
                            name="agree"
                            id="agree"
                            value="agree"
                            checked={itinerary
                              .map((x) => x.id)
                              .includes(cards.id)}
                            styleCheck="checkmark"
                            onChange={(e: any) => {
                              addItinerary(e, cards);
                            }}
                          />
                        </div>

                        <div
                          className="modal-card-content pl-26 pr-29"
                          onClick={() => showItineraryTourDetail(cards)}
                        >
                          <Image src={cards.image[0]} className="w-100" />
                          <h3 className="font-23-bold h-28 mt-19">{cards.name}</h3>
                          <h4 className="font-18-bold h-22 mt-6 over-h">
                            {cards.address} , {cards.region}{" "}
                          </h4>
                          <h5 className="font-18-normal h-22 mt-12">
                            {cards.category}
                          </h5>
                          <h5 className="font-18-bold h-29 mt-6">
                            {cards.opening_date ? `
                              ${moment(cards.opening_date).format('YYYY.MM.DD')} (${moment(cards.opening_date).format('dddd')})
                            `:
                              "-"}
                            {/* {cards.opening_date} */}
                          </h5>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}


            {tourcoursesDetail?.length ? (
              <Row className="">
                <Col lg={12}>
                  <Row>
                    {/* <Col xl={2} xs={6} className="select-card-apge">
                      <div>
                        <h6 className="font-16-bold">
                          <span className="font-16-bold-pink">1</span> of{" "}
                          {pageCount} pages
                        </h6>
                      </div>
                    </Col> */}
                    {tourcoursesDetail.length > 10 ? (
                      <Col
                        xl={2}
                        xs={6}
                        className="select-card-apge order-xl-12"
                      >
                        <Select
                          options={counder}
                          name="counder"
                          defaultValue={[counder[0]]}
                          className="ml-auto"
                          onChange={(e: any) => setPagePerSize(e.value)}
                          theme={(theme) => ({
                            ...theme,
                            borderRadius: 0,
                            colors: {
                              ...theme.colors,
                              primary25: "",
                              primary: "#B931B8",
                            },
                          })}
                        />
                      </Col>
                    ) : (
                      ""
                    )}

                    <Col xl={12} className="order-xl-1">
                      <ul className="list-pagination text-center ">
                        <li className="border-li">
                          <Nav.Link className="p-0 border-0" onClick={() => {
                            onFilterChnage(1);
                          }}>
                            {" "}
                            <img src="../../img/firstarrow.svg" alt="" />
                            {/* <FontAwesomeIcon icon={faCaretLeft} />
                            <FontAwesomeIcon icon={faCaretLeft} /> */}
                          </Nav.Link>
                        </li>
                        <li className="border-li">
                          <Nav.Link className="p-0 border-0" onClick={() => {
                            onFilterChnage((page - 1 > 0) ? page - 1 : 1);
                          }}>
                            {/* <FontAwesomeIcon icon={faCaretLeft} /> */}
                            <img src="../../img/nextarrow.svg" alt="" />

                          </Nav.Link>
                        </li>
                        {[...Array(pageCount)].map((item: any, i: any) => (
                          <li key={i}>
                            <Nav.Link
                              onClick={() => {
                                onFilterChnage(i + 1);
                              }}
                              className={(i + 1 === page) ? `active-page arrow-link` : "arrow-link"}
                            >
                              {i + 1}
                            </Nav.Link>
                          </li>
                        ))}
                        <li className="border-li">
                          <Nav.Link className="p-0 border-0" onClick={() => {
                            onFilterChnage(page + 1 <= pageCount ? page + 1 : pageCount);
                          }}>
                            {/* <FontAwesomeIcon icon={faCaretRight} /> */}
                            <img src="../../img/prevarrow.svg" alt="" />

                          </Nav.Link>
                        </li>
                        <li className="border-li">
                          <Nav.Link className="p-0 border-0" onClick={() => {
                            onFilterChnage(pageCount);
                          }}>
                            {/* <FontAwesomeIcon icon={faCaretRight} />
                            <FontAwesomeIcon icon={faCaretRight} /> */}
                            <img src="../../img/lastarrow.svg" alt="" />

                          </Nav.Link>
                        </li>
                      </ul>
                    </Col>
                  </Row>
                </Col>
              </Row>
            ) : (
              ""
            )}

            <div className="text-center">
              <Buttons
                type="submit"
                children="취소"
                ButtonStyle="border-button font-22-bold"
                onClick={saveItinery}
              />

              <Buttons
                type="submit"
                children="적용"
                ButtonStyle={itinerary.length > 0 ? "modal-pink-button font-22-bold" : "modal-gray-button font-22-bold"}
                onClick={itinerary[0] && saveItinery}
              />
            </div>
          </Col>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ItineraryMngReg;
