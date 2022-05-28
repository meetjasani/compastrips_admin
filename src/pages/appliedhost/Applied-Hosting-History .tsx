import React, { useEffect, useState } from 'react'
import { Col } from 'react-bootstrap'
import { useHistory, useParams } from 'react-router';
import Buttons from '../../component/Buttons/Buttons'
import InputField from '../../component/InputField/InputField'
import Swal from 'sweetalert2';
import { ApiDelete, ApiGet, ApiPut } from '../../helper/API/ApiData';
import moment from 'moment';
import { EngToKor } from "../../helper/util"
function AppliedHostingHistory() {

    // variabels and states
    const { id }: any = useParams()
    const history = useHistory();
    const [appliedHosting, setAppliedHosting] = useState<any>()
    const [note, setNote] = useState<string>("")
    const [defaultNote, setDefaultNote] = useState<string>()

    // helper functions
    const getAppliedHosting = () => {
        ApiGet(`admin/participant/${id}`).then((res: any) => {
            setDefaultNote(res.data.note)
            setNote(res.data.note)
            setAppliedHosting(res.data)
        })
            .catch((error) => {
                console.log(error);
            })
    }

    const gotoTourPage = () => {
        history.push(`/itinerary-management-reg/${appliedHosting.itinerary_id}`)
    }

    const gotoAppList = () => {
        history.push('/applied-host')
    }

    // design problem
    const saveAppList = () => {
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
                        await ApiPut(`admin/note?participant=${id}`, { note: note })
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
                                window.location.href = '/applied-host'
                            }
                        });
                }
            })
    }

    const deleteAppList = async () => {
        await ApiDelete(`admin/participant/${id}`)
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
                    window.location.href = '/applied-host'
                }
            });
    }

    // useEffects
    useEffect(() => {
        id && getAppliedHosting()
    }, [])

    return (
        <>
            <div className="col-12 p-0">
                <div className="bg-navigation">
                    <h2 className="text-white">여행 참석 신청 내역</h2>
                </div>
            </div>


            <div className="creator-table set-select set-line-height">
                <div className="center-box">

                    <div>

                        <div className="">
                            <div className="text-left align-items-center">
                                <h4 className="font-27-bold mb-25">여행 참석 신청자 정보</h4>
                            </div>

                            <div className="mt-1 border-tabel-b1">
                                <div>

                                    <div className="d-flex">
                                        <div className="yellow-bg-table font-18-bold">이름</div>
                                        <div className="profile-table-td-input align-items-center">
                                            <p className="mb-0 ">{appliedHosting?.name}</p>
                                        </div>
                                    </div>

                                    <div className="d-flex">
                                        <div className="yellow-bg-table font-18-bold">닉네임</div>
                                        <div className="profile-table-td-input align-items-center">
                                            <p className="mb-0 ">{appliedHosting?.nickname}</p>
                                        </div>
                                    </div>

                                    <div className="d-flex">
                                        <div className="yellow-bg-table font-18-bold">휴대폰 번호</div>
                                        <div className="profile-table-td-input align-items-center">
                                            <p className="mb-0 ">({appliedHosting?.mobile.slice(0, 3)}) {appliedHosting?.mobile.slice(3, 14)}</p>
                                        </div>
                                    </div>

                                    <div className="d-flex">
                                        <div className="yellow-bg-table font-18-bold">국적</div>
                                        <div className="profile-table-td-input align-items-center">
                                            <p className="mb-0 ">{appliedHosting?.nationality}</p>
                                        </div>
                                    </div>

                                    <div className="d-flex">
                                        <div className="yellow-bg-table font-18-bold">성별</div>
                                        <div className="profile-table-td-input align-items-center">
                                            <p className="mb-0 ">{EngToKor(appliedHosting?.gender)}</p>
                                        </div>
                                    </div>

                                    <div className="d-flex">
                                        <div className="yellow-bg-table font-18-bold">생년월일   </div>
                                        <div className="profile-table-td-input align-items-center">
                                            <p className="mb-0 ">{appliedHosting?.dob.replace(/-/g, '. ')}</p>
                                        </div>
                                    </div>


                                    <div className="d-flex">
                                        <div className="yellow-bg-table font-18-bold">승인 상태</div>
                                        <div className="profile-table-td-input align-items-center">
                                            <p className="mb-0 ">{EngToKor(appliedHosting?.req_status)}</p>
                                        </div>
                                    </div>

                                    {appliedHosting?.req_status === "DECLINED" &&
                                        <div className="d-flex">
                                            <div className="yellow-bg-table font-18-bold">승인불가일</div>
                                            <div className="profile-table-td-input align-items-center">
                                                <p className="mb-0 ">{appliedHosting.accepted_date.slice(0, 10) + " " + appliedHosting?.accepted_date.slice(11, 16)}</p>
                                            </div>
                                        </div>
                                    }

                                    <div className="d-flex">
                                        <div className="yellow-bg-table font-18-bold">신청일/승인일</div>
                                        <div className="profile-table-td-input align-items-center">
                                            <p className="mb-0 ">{
                                                appliedHosting?.application_date.slice(0, 10)} {appliedHosting?.application_date.slice(11, 16)} / {appliedHosting?.accepted_date && appliedHosting?.req_status !== "DECLINED" ? appliedHosting.accepted_date.slice(0, 10) + " " + appliedHosting?.accepted_date.slice(11, 16) : "-"}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="mt-62">

                        <div className="text-left align-items-center">
                            <h4 className="font-27-bold mb-25">여행 일정 정보</h4>
                        </div>

                        <div className="border-tabel-b1">
                            <div>
                                <div className="d-flex">
                                    <div className="yellow-bg-table font-18-bold">여행 제목</div>
                                    <div className="profile-table-td-input align-items-center d-md-flex">
                                        <p className="mb-0 ">{EngToKor(appliedHosting?.req_status)}</p>
                                        <Buttons
                                            type="submit"
                                            children="호스팅 여행 일정 바로가기"
                                            ButtonStyle="go-host font-16-bold ml-md-3"
                                            onClick={gotoTourPage} />
                                    </div>
                                </div>

                                <div className="d-flex">
                                    <div className="yellow-bg-table font-18-bold">호스트</div>
                                    <div className="profile-table-td-input align-items-center">
                                        <p className="mb-0 ">{appliedHosting?.host_name}</p>
                                    </div>
                                </div>

                                <div className="d-flex">
                                    <div className="yellow-bg-table font-18-bold">여행 일정</div>
                                    <div className="profile-table-td-input align-items-center">
                                        <p className="mb-0 ">{appliedHosting?.host_date.slice(0, 10).replace(/-/g, '.')} ({moment(appliedHosting?.host_date).format('dddd')}) {appliedHosting?.start_time.slice(0, 5)} - {appliedHosting?.end_time.slice(0, 5)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Col className="textarea-border"></Col>

                    </div>



                    <div className="">
                        <div className="d-flex border-tabel-b1">

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
                                ButtonStyle="border-button font-22-bold w-213px"
                                onClick={gotoAppList} />

                            <Buttons
                                type="submit"
                                children="저장"
                                ButtonStyle="modal-pink-button font-22-bold w-213px"
                                onClick={saveAppList} />



                            <Buttons
                                type="submit"
                                children="삭제"
                                ButtonStyle="border-button font-22-bold w-213px"
                                onClick={deleteAppList} />


                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default AppliedHostingHistory
