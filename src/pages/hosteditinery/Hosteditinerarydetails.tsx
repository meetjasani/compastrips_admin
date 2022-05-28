
import { Col } from 'react-bootstrap'
import BootstrapTable from 'react-bootstrap-table-next'
import Buttons from '../../component/Buttons/Buttons'
import InputField from '../../component/InputField/InputField'
import Swal from 'sweetalert2';
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { ApiDelete, ApiGet, ApiPut } from '../../helper/API/ApiData';
import RadioButton from '../../component/radiobutton/RadioButton';
import { checkImageURL, EngToKor } from "../../helper/util"

function Hosteditinerarydetails() {

    // variables and states
    const { id }: any = useParams()
    const history = useHistory();
    const [hostedItinerary, setHostedItinerary] = useState<any>()
    const [note, setNote] = useState<string>("")
    const [defaultNote, setDefaultNote] = useState<string>()
    const [viewReviews, setViewReviews] = useState<boolean>(false)
    const [disclosure, setDisclosure] = useState<string>()

    // helper functions
    const getHostedItinerary = () => {
        ApiGet(`hosting/get/${id}`).then((res: any) => {
            setDefaultNote(res.data.admin_note)
            setNote(res.data.admin_note)
            setDisclosure(res.data.itinerary_information.disclosure)
            setHostedItinerary(res.data)
        })
            .catch((error) => {
                console.log(error);
            })
    }


    const imgset = (cell: any, row: any, rowIndex: any, formatExtraData: any) => {
        return (
            <div className="w-h-45">
                <div className="set-img-text">
                    <img src={row.avatar} alt="" />
                    <p>{row.nick_name}</p>
                </div>
            </div>
        );
    }

    const star = (cell: any, row: any, rowIndex: any, formatExtraData: any) => {
        return (
            <p className="mb-0">
                ★ {row.star.toFixed(1)}
            </p>
        );
    }

    const date = (cell: any, row: any, rowIndex: any, formatExtraData: any) => {
        return (
            <p className="mb-0">
                {row.registration_date.slice(0, 10).replace(/-/g, '.')}
            </p>
        );
    }

    const backToList = () => {
        history.push('/hosted-itinery')
    }

    const saveHostedItinerary = async () => {
        Swal.fire({
            title: '저장 완료',
            text: "저장이 완료되었습니다!",
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
            .then(async (result: { isConfirmed: any; }) => {
                if (result.isConfirmed) {
                    if (defaultNote !== note) {
                        await ApiPut(`admin/note?hosting=${id}`, { note: note })
                    }
                    await ApiPut(`admin/editDisclosure`, {
                        disclosure: disclosure,
                        id: hostedItinerary.itinerary_information.id
                    })
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
                                backToList()
                            }
                        });
                }
            })
    }

    const deleteHostedItinerary = async () => {
        await ApiDelete(`admin/deleteHosting/${id}`)
        Swal.fire({
            title: '삭제 완료',
            text: "삭제되었습니다.",
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
                    backToList()
                }
            });
    }

    const gotoItinerary = () => {
        history.push(`/itinerary-management-reg/${hostedItinerary.itinerary_information.id}`)
    }

    const gotoUserInformation = () => {
        history.push(`/user-management-edit/${hostedItinerary.host_information.id}`)
    }

    const columns = [

        {
            dataField: "nick_name",
            text: "닉네임",
            formatter: imgset,
        },
        {
            dataField: "star",
            text: "평점",
            formatter: star,
        },
        {
            dataField: "registration_date",
            text: "등록일",
            formatter: date,
        },
        {
            dataField: "review",
            text: "리뷰",
        },
    ]

    // useEffects
    useEffect(() => {
        getHostedItinerary()
    }, [])


    return (
        <>
            <div className="col-12 p-0">
                <div className="bg-navigation">
                    <h2 className="text-white">호스팅 여행 일정 내역</h2>
                </div>
            </div>


            <div className="creator-table set-select set-line-height">
                <div className="center-box">


                    <div>

                        <div className="">
                            <div className="text-left align-items-center">
                                <h4 className="font-27-bold mb-25">여행 일정 정보</h4>
                            </div>

                            <div className="border-tabel-b1">
                                <div>
                                    <div className="d-flex">
                                        <div className="yellow-bg-table font-18-bold">여행 제목</div>
                                        <div className="profile-table-td-input align-items-center d-md-flex">
                                            <p className="mb-0 ">{hostedItinerary?.itinerary_information.tour_title}</p>
                                            <Buttons
                                                type="submit"
                                                children="여행 정보 바로가기"
                                                ButtonStyle="go-host font-16-bold ml-md-3 w-171"
                                                onClick={() => { gotoItinerary() }} />
                                        </div>
                                    </div>

                                    <div className="d-flex">
                                        <div className="yellow-bg-table font-18-bold">국가</div>
                                        <div className="profile-table-td-input align-items-center">
                                            <p className="mb-0 ">{hostedItinerary?.itinerary_information.country}</p>
                                        </div>
                                    </div>

                                    <div className="d-flex">
                                        <div className="yellow-bg-table font-18-bold">지역</div>
                                        <div className="profile-table-td-input align-items-center">
                                            <p className="mb-0 ">{hostedItinerary?.itinerary_information.region}</p>
                                        </div>
                                    </div>

                                    <div className="d-flex">
                                        <div className="yellow-bg-table font-18-bold">작성자 정보</div>
                                        <div className="profile-table-td-input align-items-center">
                                            <p className="mb-0 ">Created by {hostedItinerary?.itinerary_information.creator}</p>
                                        </div>
                                    </div>

                                    <div className="d-flex">
                                        <div className="yellow-bg-table font-18-bold">호스트 수</div>
                                        <div className="profile-table-td-input align-items-center">
                                            <p className="mb-0 ">{hostedItinerary?.itinerary_information.number_of_hosts}명</p>
                                        </div>
                                    </div>

                                    <div className="d-flex">
                                        <div className="yellow-bg-table font-18-bold">공개</div>
                                        <div className=" profile-table-td-input">
                                            {/* <Col md={9} className="profile-table-td-input"> */}
                                            <div className="d-flex">
                                                <div
                                                    className={`open-radio ${disclosure === "OPEN" ? `active-radio` : ``
                                                        }`}
                                                >
                                                    <RadioButton
                                                        type="radio"
                                                        name="disclosure"
                                                        id="Open"
                                                        value="OPEN"
                                                        BtnLable="공개"
                                                        onSelect={() => { setDisclosure("OPEN") }}
                                                    />
                                                </div>
                                                <div
                                                    className={`private-radio ${disclosure === "PRIVATE" ? `active-radio` : ``
                                                        }`}
                                                >
                                                    <RadioButton
                                                        type="radio"
                                                        name="disclosure"
                                                        id="Private"
                                                        value="PRIVATE"
                                                        BtnLable="비공개"
                                                        onSelect={() => { setDisclosure("PRIVATE") }}
                                                    />
                                                </div>
                                            </div>
                                            {/* </Col> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>



                    <div>

                        <div className="mt-62">
                            <div className="text-left align-items-center">
                                <h4 className="font-27-bold mb-25">호스트 정보</h4>
                            </div>

                            <div className="mt-1 border-tabel-b1">
                                <div>

                                    <div className="d-flex">
                                        <div className="yellow-bg-table font-18-bold">이름</div>
                                        <div className="profile-table-td-input align-items-center d-md-flex">
                                            <p className="mb-0 ">{hostedItinerary?.host_information.first_name} {hostedItinerary?.host_information.last_name}</p>
                                            <Buttons
                                                type="submit"
                                                children="회원관리 바로가기"
                                                ButtonStyle="go-host font-16-bold p-set w-171 ml-4"
                                                onClick={() => { gotoUserInformation() }} />
                                        </div>
                                    </div>

                                    <div className="d-flex">
                                        <div className="yellow-bg-table font-18-bold">닉네임</div>
                                        <div className="profile-table-td-input align-items-center">
                                            <p className="mb-0 ">{hostedItinerary?.host_information.nick_name}</p>
                                        </div>
                                    </div>

                                    <div className="d-flex">
                                        <div className="yellow-bg-table font-18-bold">여행 일시</div>
                                        <div className="profile-table-td-input align-items-center">
                                            <p className="mb-0 ">
                                                {
                                                    hostedItinerary?.host_information.host_date.date.replace(/-/g, '.')
                                                }{" "}
                                                {
                                                    parseInt(hostedItinerary?.host_information.host_date.start_time.slice(0, 2)) < 12 ? "오전" : "오후"
                                                }{" "}
                                                {
                                                    hostedItinerary?.host_information.host_date.start_time.slice(0, 5)
                                                }{" - "}
                                                {
                                                    parseInt(hostedItinerary?.host_information.host_date.start_time.slice(0, 2)) < 12 ? "오전" : "오후"
                                                }{" "}
                                                {
                                                    hostedItinerary?.host_information.host_date.end_time.slice(0, 5)
                                                }
                                            </p>
                                        </div>
                                    </div>

                                    <div className="d-flex">
                                        <div className="yellow-bg-table font-18-bold">여행 시작 장소</div>
                                        <div className="profile-table-td-input align-items-center">
                                            <p className="mb-0 ">{hostedItinerary?.host_information.starts_at}</p>
                                        </div>
                                    </div>

                                    <div className="d-flex">
                                        <div className="yellow-bg-table font-18-bold">이동수단</div>
                                        <div className="profile-table-td-input align-items-center">
                                            <p className="mb-0 ">{hostedItinerary?.host_information.transportation}</p>
                                        </div>
                                    </div>

                                    <div className="d-flex">
                                        <div className="yellow-bg-table font-18-bold">여행 인원</div>
                                        <div className="profile-table-td-input align-items-center">
                                            <p className="mb-0 ">{hostedItinerary?.host_information.pax_number}명</p>
                                        </div>
                                    </div>

                                    <div className="d-flex">
                                        <div className="yellow-bg-table font-18-bold"> 호스트 기본 정보 </div>
                                        <div className="profile-table-td-input align-items-center">
                                            <p className="mb-0 ">성별 <b>{EngToKor(hostedItinerary?.host_information.host_profile.gender)}</b> ｜ 연령대 <b>{hostedItinerary?.host_information.host_profile.age_group}</b> 년생 ｜ 국적 <b>{hostedItinerary?.host_information.host_profile.nationality}</b></p>
                                        </div>
                                    </div>

                                    <div className="d-flex">
                                        <div className="yellow-bg-table font-18-bold">호스트 타입</div>
                                        <div className="profile-table-td-input align-items-center">
                                            <p className="mb-0 ">{EngToKor(hostedItinerary?.host_information.host_type)}</p>
                                        </div>
                                    </div>

                                    <div className="d-flex">
                                        <div className="yellow-bg-table font-18-bold">소개글</div>
                                        <div className="profile-table-td-input align-items-center">
                                            <p className="mb-0 ">{hostedItinerary?.host_information.introduction}</p>
                                        </div>
                                    </div>

                                    <div className="d-flex">
                                        <div className="yellow-bg-table font-18-bold">등록일</div>
                                        <div className="profile-table-td-input align-items-center">
                                            <p className="mb-0 ">{hostedItinerary?.host_information.registration_date.slice(0, 10)} {hostedItinerary?.host_information.registration_date.slice(11, 16)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>


                    <div className="mt-62">
                        <div className="">
                            <div className="">
                                <h4 className=" font-25-bold mb-25">진행현황</h4>
                            </div>

                            <div className="mt-1 border-tabel-b1">
                                <div>

                                    <div className="d-flex">
                                        <div className="yellow-bg-table font-18-bold">진행상태 (진행중/종료)</div>
                                        <div className="profile-table-td-input align-items-center">
                                            <p className="mb-0">{EngToKor(hostedItinerary?.status.status)}</p>
                                        </div>
                                    </div>

                                    <div className="d-flex">
                                        <div className="yellow-bg-table font-18-bold">신청자 목록 </div>
                                        <div className="profile-table-td-input align-items-center">
                                            <p className="mb-0">전체
                                                {
                                                    hostedItinerary?.host_information.pax_number
                                                }명, 신청
                                                {
                                                    hostedItinerary?.status.applied_count
                                                }명, 잔여
                                                {
                                                    hostedItinerary?.host_information.pax_number - hostedItinerary?.status.applied_count
                                                }명
                                                <br></br>
                                                <span className="span-color-pink">
                                                    승인 전{" "}
                                                    {
                                                        hostedItinerary?.status.applicants.filter((x: any) => {
                                                            return x.req_status === "STAND_BY"
                                                        }).length
                                                    }
                                                </span> | 승인 완료{" "}
                                                {
                                                    hostedItinerary?.status.applicants.filter((x: any) => {
                                                        return x.req_status === "ACCEPTED"
                                                    }).length
                                                } | 승인 불가{" "}
                                                {
                                                    hostedItinerary?.status.applicants.filter((x: any) => {
                                                        return x.req_status === "DECLINED"
                                                    }).length
                                                }
                                            </p>
                                            {
                                                hostedItinerary?.status.applicants.map((x: any) => (
                                                    <div className="Applicants_center">
                                                        <div className="d-flex">
                                                            <div className="Applicants_user_img">
                                                                <img src={x.avatar} alt="" />
                                                            </div>
                                                            <div>
                                                                <div className="d-flex Applicants_button_type_p_tag pt-18">
                                                                    <p><span className="text-ize">{x.gender === 'MALE' ? '남' : '여'}</span></p>
                                                                    <p><span className="text-ize">{x.age_group}</span></p>
                                                                    <img src={checkImageURL(x.flag)} alt=""></img>
                                                                </div>
                                                                <div className="Applicants_user_name">
                                                                    <p>{x.first_name} {x.last_name}  |  {x.mobile}  </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="Applicants_center_last">
                                                            <p>참가신청 : {x.applied_at.slice(0, 10).replace(/-/g, '.')}</p>
                                                        </div>
                                                    </div>
                                                ))
                                            }

                                        </div>
                                    </div>

                                    <div className="d-flex">
                                        <div className="yellow-bg-table font-18-bold">평점</div>
                                        <div className="profile-table-td-input align-items-center">
                                            <p className="mb-0">
                                                {
                                                    hostedItinerary?.status.star_rating ? "★ " + hostedItinerary.status.star_rating.toFixed(1) : "내역이 없습니다."
                                                }
                                            </p>
                                        </div>
                                    </div>

                                    <div className="d-flex">
                                        <div className="yellow-bg-table font-18-bold">리뷰</div>
                                        <div className="profile-table-td-input align-items-center">
                                            {
                                                hostedItinerary?.status.star_review.length ?
                                                    viewReviews ?
                                                        <>
                                                            <div className="py-2 total-results mt-4 mb-3 d-flex">
                                                                <div><h5 className="font-27-bold"> 총 <span className="span-color-pink"> {hostedItinerary?.status.star_review.length} </span> 개</h5></div>
                                                            </div>

                                                            <div className="App text-center">
                                                                <BootstrapTable
                                                                    bootstrap4
                                                                    keyField="id"
                                                                    data={hostedItinerary?.status.star_review}
                                                                    columns={columns}
                                                                />
                                                            </div>
                                                        </>
                                                        :
                                                        <Buttons
                                                            type="submit"
                                                            children="리뷰 보기"
                                                            ButtonStyle="go-host font-16-bold p-set w-140-h-49 "
                                                            onClick={() => { setViewReviews(true) }} />
                                                    :
                                                    "내역이 없습니다."
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Col className="textarea-border"></Col>
                        </div>
                    </div>


                    <div >
                        <div className="mt-1 border-tabel-b1 d-flex">

                            <div className="yellow-bg-table font-18-bold">관리자 메모</div>
                            <div className="profile-table-td-input">
                                <div className="py-3">
                                    <InputField
                                        name="text"
                                        value={note}
                                        lablestyleClass=""
                                        InputstyleClass="mb-0 manage-datepicker"
                                        onChange={(e: any) => { setNote(e.target.value) }}
                                        label=""
                                        placeholder=""
                                        type="textarea"
                                        fromrowStyleclass=""
                                    />
                                </div>
                            </div>

                        </div>
                    </div>



                    <div className="px-110 w-100">
                        <div className="text-center">
                            <Buttons
                                type="submit"
                                children="목록"
                                ButtonStyle="border-button font-22-bold"
                                onClick={() => { backToList() }} />

                            <Buttons
                                type="submit"
                                children="저장"
                                ButtonStyle="modal-pink-button font-22-bold"
                                onClick={() => { saveHostedItinerary() }} />



                            <Buttons
                                type="submit"
                                children="삭제"
                                ButtonStyle="border-button font-22-bold"
                                onClick={() => { deleteHostedItinerary() }} />
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}


export default Hosteditinerarydetails
