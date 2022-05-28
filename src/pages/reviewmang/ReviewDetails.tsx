import React, { useEffect, useState } from 'react'
import { Col } from 'react-bootstrap'
import Swal from 'sweetalert2';
import Buttons from '../../component/Buttons/Buttons';
import InputField from '../../component/InputField/InputField'
import { useHistory, useParams } from 'react-router';
import { ApiDelete, ApiGet, ApiPut } from '../../helper/API/ApiData';
import moment from 'moment';
import { EngToKor } from "../../helper/util"
const ReviewDetails = () => {

    // variabels and states
    const history = useHistory();
    const [note, setNote] = useState<string>("")
    const [defaultNote, setDefaultNote] = useState<string>()
    var { id }: any = useParams()

    const [reviewData, setReviewData] = useState<any>({
        id: "",
        updated_at: "",
        star: "",
        content: "",
        review: "",
        first_name: "",
        last_name: "",
        full_name: "",
        user_name: "",
        gender: "",
        nationality: "",
        mobile: "",
        birth_date: "",
        host_name: "",
        title: "",
        host_date: "",
    })

    // helper functions
    const getReviewManagementById = () => [
        ApiGet(`admin/review/${id}`).then((res: any) => {
            setDefaultNote(res.data.note)
            setNote(res.data.note)
            let data = {
                id: res.data.id,
                updated_at: `${res.data.updated_at.slice(0, 10)} ${res.data.updated_at.slice(11, 16)}`,
                star: res.data.star.toFixed(1),
                content: res.data.content,
                first_name: res.data.user.first_name,
                last_name: res.data.user.last_name,
                full_name: res.data.user.first_name + " " + res.data.user.last_name,
                user_name: res.data.user.user_name,
                gender: res.data.user.gender,
                nationality: res.data.user.nationality_ko,
                mobile: res.data.user.mobile,
                birth_date: moment(res.data.user.dob).format("YYYY-MM-DD"),
                host_name: res.data.itinerary.host_name,
                title: res.data.itinerary.title,
                host_date: `${res.data.itinerary.date.slice(0, 10)} ${res.data.itinerary.date.slice(11, 16)}`,
                hosting_id: res.data.hosting.id
            };
            setReviewData(data);
        }).catch()
    ]

    const SaveReview = async () => {
        if (defaultNote !== note) {
            await ApiPut(`admin/note?review=${id}`, { note: note })
        }
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

    const deleteReview = async () => {
        await ApiDelete(`admin/review/${id}`)
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

    const backToList = () => {
        history.push('/review-mang')
    }

    const gotoHostedItinerary = () => {
        history.push(`/hosted-itinerary-details/${reviewData.hosting_id}`)
    }

    // useEffects
    useEffect(() => {
        getReviewManagementById()
    }, [])


    return (

        <>
            <div className="col-12 p-0">
                <div className="bg-navigation">
                    <h2 className="text-white">리뷰 관리</h2>
                </div>
            </div>


            <div className="creator-table set-select set-line-height">
                <div className="center-box">
                    <div>

                        <div className="">
                            <div className="text-left align-items-center">
                                <h4 className=" font-25-bold mb-25">리뷰 내용</h4>
                            </div>

                            <div className="border-tabel-b1">
                                <div>
                                    <div className="d-flex">
                                        <div className="yellow-bg-table font-18-bold">평점</div>
                                        <div className="profile-table-td-input align-items-center">
                                            <p className="mb-0 ">{reviewData.star}</p>
                                        </div>
                                    </div>

                                    <div className="d-flex">
                                        <div className="yellow-bg-table font-18-bold">리뷰</div>
                                        <div className="profile-table-td-input align-items-center">
                                            <p className="mb-0 ">{reviewData.content}</p>
                                        </div>
                                    </div>

                                    <div className="d-flex">
                                        <div className="yellow-bg-table font-18-bold">등록일시</div>
                                        <div className="profile-table-td-input align-items-center">
                                            <p className="mb-0 ">{reviewData.updated_at}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div>

                        <div className="mt-62">
                            <div className="text-left align-items-center">
                                <h4 className=" font-25-bold mb-25">여행 참석자 정보</h4>
                            </div>

                            <div className="mt-1 border-tabel-b1">
                                <div>

                                    <div className="d-flex">
                                        <div className="yellow-bg-table font-18-bold">이름</div>
                                        <div className="profile-table-td-input align-items-center">
                                            <p className="mb-0 ">{reviewData.full_name}</p>
                                        </div>
                                    </div>

                                    <div className="d-flex">
                                        <div className="yellow-bg-table font-18-bold">닉네임</div>
                                        <div className="profile-table-td-input align-items-center">
                                            <p className="mb-0 ">{reviewData.user_name}</p>
                                        </div>
                                    </div>

                                    <div className="d-flex">
                                        <div className="yellow-bg-table font-18-bold">휴대폰 번호</div>
                                        <div className="profile-table-td-input align-items-center">
                                            <p className="mb-0 ">{reviewData.mobile}</p>
                                        </div>
                                    </div>

                                    <div className="d-flex">
                                        <div className="yellow-bg-table font-18-bold">국적</div>
                                        <div className="profile-table-td-input align-items-center">
                                            <p className="mb-0 ">{reviewData.nationality}</p>
                                        </div>
                                    </div>

                                    <div className="d-flex">
                                        <div className="yellow-bg-table font-18-bold">성별</div>
                                        <div className="profile-table-td-input align-items-center">
                                            <p className="mb-0 ">{EngToKor(reviewData.gender)}</p>
                                        </div>
                                    </div>

                                    <div className="d-flex">
                                        <div className="yellow-bg-table font-18-bold">생년월일</div>
                                        <div className="profile-table-td-input align-items-center">
                                            <p className="mb-0 ">{reviewData.birth_date}</p>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <Col className="textarea-border"></Col>
                        </div>
                    </div>

                    <div>

                        <div className="">
                            <div className="pb-3 pl-0 pt-5 d-md-flex text-left align-items-center">
                                <h4 className=" font-25-bold">여행 일정 정보</h4>
                            </div>

                            <div className="mt-1 border-tabel-b1">
                                <div>

                                    <div className="d-flex">
                                        <div className="yellow-bg-table font-18-bold">여행 제목</div>
                                        <div className="profile-table-td-input align-items-center d-md-flex">
                                            <p className="mb-0 ">{reviewData.title}</p>
                                            <Buttons
                                                type="submit"
                                                children="호스팅 여행 일정 바로가기"
                                                ButtonStyle="go-host font-16-bold ml-md-3"
                                                onClick={gotoHostedItinerary} />
                                        </div>
                                    </div>

                                    <div className="d-flex">
                                        <div className="yellow-bg-table font-18-bold">호스트</div>
                                        <div className="profile-table-td-input align-items-center">
                                            <p className="mb-0 ">{reviewData.host_name}</p>
                                        </div>
                                    </div>

                                    <div className="d-flex">
                                        <div className="yellow-bg-table font-18-bold">여행 일정</div>
                                        <div className="profile-table-td-input align-items-center">
                                            <p className="mb-0 ">{reviewData.host_date}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Col className="textarea-border"></Col>
                        </div>
                    </div>



                    <div className="">
                        <div className="border-tabel-b1">
                            <div className="d-flex">
                                <div className="yellow-bg-table font-18-bold">관리자 메모</div>
                                <div className="profile-table-td-input">
                                    <div className="py-3">
                                        <InputField
                                            name="text"
                                            value={note}
                                            lablestyleClass=""
                                            InputstyleClass="mb-0 manage-datepicker"
                                            onChange={(e: any) => {
                                                setNote(e.target.value)
                                            }}
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



                    <div className="px-110 w-100">
                        <div className="text-center">
                            <Buttons
                                type="submit"
                                children="목록"
                                ButtonStyle="border-button font-22-bold"
                                onClick={backToList} />

                            <Buttons
                                type="submit"
                                children="저장"
                                ButtonStyle="modal-pink-button font-22-bold"
                                onClick={SaveReview} />



                            <Buttons
                                type="submit"
                                children="삭제"
                                ButtonStyle="border-button font-22-bold"
                                onClick={deleteReview} />


                        </div>
                    </div>
                </div>
            </div>



        </>


    )
}

export default ReviewDetails
