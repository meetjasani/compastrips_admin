import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { useHistory, useParams } from "react-router";
import Buttons from "../../../component/Buttons/Buttons";
import InputField from "../../../component/InputField/InputField";
import Swal from "sweetalert2";
import { ApiDelete, ApiGet, ApiPost, ApiPut } from "../../../helper/API/ApiData";
import { faLanguage } from "@fortawesome/free-solid-svg-icons";

function RegisterFaq() {

  // variables and states
  const history = useHistory();

  var { id }: any = useParams();

  const [FAQData, setFAQData] = useState<any>({
    question: "",
    answer: "",
    language: ""
  });

  const [isSaveDisabled, setIsSaveDisabled] = useState<boolean>(true)
  const [isChanged, setIsChanged] = useState<boolean>(false)
  const getFAQ = () => {
    ApiGet(`general/faq/${id}`)
      .then((res: any) => {
        setFAQData({
          question: res.data.title,
          answer: res.data.content,
          language: res.data.language
        });
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  const backtoFaq = () => {

    if (!isChanged || (FAQData.question === "" && FAQData.answer === "")) {
      history.push('/faq')
      return;
    }

    Swal.fire({
      title: "안내",
      html: "<span class='font-25-normal'>입력된 내용이 있습니다. 목록으로 이동하면 입력한 내용이 저장되지 않습니다. </span>",
      showClass: {
        popup: 'animated fadeInDown faster',
        icon: 'animated heartBeat delay-1s'
      },
      hideClass: {
        popup: 'animated fadeOutUp faster',
      },
      showCancelButton: true,
      confirmButtonText: "확인",
      cancelButtonText: "취소",
      reverseButtons: true,
      showCloseButton: true,
    }).then(async (result: { isConfirmed: any }) => {
      if (result.isConfirmed) {
        history.push("/faq");
      }
    });
  };

  const faqSave = async () => {
    await ApiPost(`admin/faq`, FAQData)
    Swal.fire({
      title: "게시물 등록완료",
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
      showCloseButton: true,
    })
      .then(() => {
        history.push("/faq");
      })
  };

  const faqModifyBtn = async () => {
    await ApiPut(`general/faq/${id}`, FAQData)
    await Swal.fire({
      title: "게시물 수정 완료",
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
      showCloseButton: true,
    });
    history.push("/faq");
  };

  const faqDeletedBtn = () => {
    Swal.fire({
      title: "게시물 삭제",
      text: "이 게시물을 삭제하시겠습니까?",
      showClass: {
        popup: 'animated fadeInDown faster',
        icon: 'animated heartBeat delay-1s'
      },
      hideClass: {
        popup: 'animated fadeOutUp faster',
      },
      showCancelButton: true,
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
      reverseButtons: true,
      showCloseButton: true,
    }).then(async (result: { isConfirmed: any }) => {
      if (result.isConfirmed) {
        await ApiDelete(`general/faq/${id}`)
        await Swal.fire({
          title: "게시물 삭제",
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
          showCloseButton: true,
        });
        backtoFaq()
      }
    });
  };

  // useEffects
  useEffect(() => {
    id && getFAQ();
  }, []);

  useEffect(() => {
    if (FAQData.question === "" || FAQData.answer === "" || FAQData.language === "") {
      setIsSaveDisabled(true)
    } else {
      setIsSaveDisabled(false)
    }
  }, [FAQData]);

  return (
    <>
      <div className="col-12 p-0">
        <div className="bg-navigation">
          <h2 className="text-white">자주 묻는 질문</h2>
        </div>
      </div>
      <div className="creator-table set-select set-line-height">
        <div className="center-box">
          <div className="">
            <Form>
              <div className="">
                <div>
                  <div className="d-flex">
                    <div className="">
                      <h4 className=" font-25-bold mb-25">{id ? '관리하기' : '등록하기'}</h4>
                    </div>
                    <div className="flot_fon_bold ml-auto">
                      <h5 className=" font-25-bold">* 필수 입력 정보입니다.</h5>
                    </div>
                  </div>
                </div>
                <div className="mt-2 mb-5 border-tabel-b1">
                  <div>
                    <div className="d-flex">
                      <div className="yellow-bg-table font-18-bold">
                        제목
                      </div>
                      <div className="profile-table-td-input">
                        <div className="py-3">
                          <InputField
                            name="title"
                            value={FAQData?.question}
                            lablestyleClass=""
                            InputstyleClass="mb-0 manage-datepicker"
                            onChange={(e: any) => {
                              setIsChanged(true)
                              setFAQData({
                                ...FAQData,
                                question: e.target.value
                              })
                            }}
                            label=""
                            placeholder=""
                            // placeholder="호스트가 되려면 어떻게 해야하나요?"
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
                            value={FAQData?.answer}
                            lablestyleClass=""
                            InputstyleClass="mb-0 manage-datepicker"
                            onChange={(e: any) => {
                              setIsChanged(true)
                              setFAQData({
                                ...FAQData,
                                answer: e.target.value
                              })
                            }}
                            label=""
                            placeholder=""
                            // placeholder="[답변]"
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
                              checked={FAQData.language == "ko" ? true : false}
                              onChange={(e) => setFAQData({ ...FAQData, language: e.target.value })} />
                            <label htmlFor="test3">한국어</label>
                          </div>
                          <div className="ml-4">
                            <input
                              type="radio"
                              id="test4"
                              name="radio-group"
                              value="en"
                              checked={FAQData.language == "en" ? true : false}
                              onChange={(e) => setFAQData({ ...FAQData, language: e.target.value })} />
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
                  onClick={backtoFaq}
                />

                {id ?
                  <Buttons
                    type="button"
                    children="수정하기"
                    ButtonStyle="modal-pink-button font-22-bold w-245px"
                    onClick={faqModifyBtn}
                  />
                  :
                  <Buttons
                    type="button"
                    children="저장하기"
                    ButtonStyle="modal-pink-button w-245px font-22-bold"
                    onClick={faqSave}
                    disabled={isSaveDisabled}
                  />
                }


                {id && <Buttons
                  type="button"
                  children="삭제하기"
                  ButtonStyle="modal-black-button modal-pink-button font-22-bold w-245px"
                  onClick={faqDeletedBtn}
                />
                }
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default RegisterFaq;
