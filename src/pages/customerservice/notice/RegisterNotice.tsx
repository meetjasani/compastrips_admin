import React, { useEffect, useState } from 'react'
import { Form } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router';
import Buttons from '../../../component/Buttons/Buttons';
import InputField from '../../../component/InputField/InputField';
import Swal from 'sweetalert2';
import { ApiDelete, ApiGet, ApiPost, ApiPut } from '../../../helper/API/ApiData';
import { Button, Modal } from 'react-bootstrap'


function RegisterNotice() {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // variables and useStates
    const history = useHistory();

    const { id }: any = useParams();
    const [notice, setNotice] = useState<any>({
        title: "",
        content: "",
        language: ""
    })

    const [isSaveDisabled, setIsSaveDisabled] = useState<boolean>(true)
    const [isChanged, setIsChanged] = useState<boolean>(false)

    // helper functions
    const backtoNotice = () => {
        if (!isChanged || (notice?.title === "" && notice?.content === "")) {
            history.push('/notice')
            return;
        }

        Swal.fire({
            title: '안내',
            html: "<span className='font-25-normal'>입력된 내용이 있습니다. 목록으로 이동하면 입력한 내용이 저장되지 않습니다. </span>",
            showClass: {
                popup: 'animated fadeInDown faster',
                icon: 'animated heartBeat delay-1s'
            },
            hideClass: {
                popup: 'animated fadeOutUp faster',
            },
            showCancelButton: true,
            confirmButtonText: '확인',
            cancelButtonText: '취소',
            reverseButtons: true,
            showCloseButton: true

        }).then(async (result: { isConfirmed: any; }) => {
            if (result.isConfirmed) {
                history.push('/notice')
            }
        })
    }

    const noticeSave = async () => {
        await ApiPost(`admin/notice`, notice)

        Swal.fire({
            title: '게시물 등록완료',
            text: "게시물이 등록되었습니다!",
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
            .then(() => {
                history.push('/notice')
            })
    }

    const postDeletedBtn = () => {
        Swal.fire({
            title: '게시물 삭제',
            text: "이 게시물을 삭제하시겠습니까?",
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
            showCloseButton: true

        }).then(async (result: { isConfirmed: any; }) => {
            if (result.isConfirmed) {
                await ApiDelete(`general/notice/${id}`)
                Swal.fire({
                    title: '게시물 삭제',
                    text: "게시물이 삭제되었습니다!",
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
                    .then(() => {
                        backtoNotice();
                    })
            }
        })
    }

    const postModifyBtn = async () => {
        await ApiPut(`general/notice/${id}`, notice)
        Swal.fire({
            title: '게시물 수정 완료',
            text: "게시물이 수정되었습니다!",
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
            .then(() => {
                backtoNotice();
            })
    }

    const getNotice = () => {
        ApiGet(`general/notice/${id}`).then((res: any) => {
            setNotice({
                title: res.data.title,
                content: res.data.content,
                language: res.data.language
            })
        })
            .catch((error) => {
                console.log(error);
            })
    }

    // useEffects
    useEffect(() => {
        id && getNotice()
    }, [])

    useEffect(() => {
        if (!notice?.title || !notice?.content || !notice?.language) {
            setIsSaveDisabled(true)
        } else {
            setIsSaveDisabled(false)
        }
    }, [notice])

    return (
        <>
            <div className="col-12 p-0">
                <div className="bg-navigation">
                    <h2 className="text-white">공지사항 등록하기</h2>
                </div>
            </div>
            <div className="creator-table set-select set-line-height">
                <div className="center-box">
                    <div className="">
                        <Form>
                            <div className="">
                                <div>
                                    <div className="d-flex">
                                        <div className="pl-0">
                                            <h4 className=" font-25-bold mb-25">{id ? '관리하기' : '등록하기'}</h4>
                                        </div>
                                        <div className="flot_fon_bold ml-auto">
                                            <h5 className=" font-25-bold"> <span className="span-color-pink"> * </span>  필수 입력 정보입니다.</h5>
                                        </div>
                                    </div>
                                </div>
                                <div className="border-tabel-b1">
                                    <div>
                                        <div className="d-flex">
                                            <div className="yellow-bg-table font-18-bold"> <span> 제목 <span className="span-color-pink"> * </span> </span>  </div>
                                            <div className="profile-table-td-input">
                                                <div className="py-3">
                                                    <InputField
                                                        name="title"
                                                        value={notice?.title}
                                                        lablestyleClass=""
                                                        InputstyleClass="mb-0 manage-datepicker"
                                                        onChange={(e: any) => {
                                                            setIsChanged(true)
                                                            setNotice({
                                                                ...notice,
                                                                title: e.target.value
                                                            })
                                                        }}
                                                        label=""
                                                        placeholder=""
                                                        // placeholder="내용을 입력해 주세요."
                                                        type="text"
                                                        fromrowStyleclass=""
                                                    />
                                                </div>
                                            </div>
                                        </div>


                                        <div className="d-flex">
                                            <div className="yellow-bg-table font-18-bold"><span> 내용  <span className="span-color-pink"> * </span> </span></div>
                                            <div className="profile-table-td-input">
                                                <div className="py-3">
                                                    <InputField
                                                        name="information"
                                                        value={notice?.content}
                                                        lablestyleClass=""
                                                        InputstyleClass="mb-0 manage-datepicker"
                                                        onChange={(e: any) => {
                                                            setIsChanged(true)
                                                            setNotice({
                                                                ...notice,
                                                                content: e.target.value
                                                            })
                                                        }}
                                                        label=""
                                                        placeholder=""
                                                        // placeholder="내용을 입력해 주세요."
                                                        type="textarea"
                                                        fromrowStyleclass=""
                                                    />
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
                                                            checked={notice.language == "ko" ? true : false}
                                                            onChange={(e) => setNotice({
                                                                ...notice, language: e.target.value
                                                            })} />
                                                        <label htmlFor="test3">한국어</label>
                                                    </div>
                                                    {console.log(notice.language)}
                                                    <div className="ml-4">
                                                        <input
                                                            type="radio"
                                                            id="test4"
                                                            name="radio-group"
                                                            value="en"
                                                            checked={notice.language == "en" ? true : false}
                                                            onChange={(e) => setNotice({
                                                                ...notice, language: e.target.value
                                                            })} />
                                                        <label htmlFor="test4">영어</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Form>

                        <div className="px-110">
                            <div className="text-center">
                                <Buttons
                                    type="button"
                                    children="목록으로"
                                    ButtonStyle="border-button font-22-bold w-245px"
                                    // onClick={backtoNotice}
                                    onClick={handleShow}
                                />

                                {
                                    id ?
                                        <Buttons
                                            type="submit"
                                            children="수정하기"
                                            ButtonStyle="modal-pink-button font-22-bold w-245px"
                                            onClick={postModifyBtn} />
                                        :
                                        <Buttons
                                            type="submit"
                                            children="저장하기"
                                            ButtonStyle="modal-pink-button w-245px font-22-bold"
                                            onClick={noticeSave}
                                            disabled={isSaveDisabled}
                                        />
                                }

                                {id && <Buttons
                                    type="submit"
                                    children="삭제하기"
                                    ButtonStyle="modal-black-button modal-pink-button font-22-bold w-245px"
                                    onClick={postDeletedBtn} />
                                }
                            </div>
                        </div>
                    </div>
                </div>


                {/* <========  Notice Modal  ========> */}

                <div className='register-notice-modal'>
                    <Modal
                        show={show}
                        onHide={handleClose}
                        backdrop="static"
                        keyboard={false}
                        centered
                    >
                        <Modal.Header closeButton className='register-header'>
                            <Modal.Title className='modal-title'>안내</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <span className='font-25-normal'>입력된 내용이 있습니다. 목록으로 이동하면 입력한 내용이 저장되지 않습니다. </span>


                        </Modal.Body>
                        <Modal.Footer>
                            <div>
                                <Button variant="secondary" className='register-notice-btn' onClick={handleClose}>
                                    취소
                                </Button>
                                <Button variant="primary" className='register-notice-cancle'>확인</Button>
                            </div>
                        </Modal.Footer>
                    </Modal>
                </div>



            </div>
        </>
    )
}

export default RegisterNotice
