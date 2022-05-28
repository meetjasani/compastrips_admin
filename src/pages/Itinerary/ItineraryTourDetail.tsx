
import moment from "moment";
import React from "react";
import { Row, Col, Modal } from 'react-bootstrap'

interface Props {
    cards: any,
    flag: boolean,
    hideItineraryTourDetail: () => void
}

const ItineraryTourDetail: React.FC<Props> = ({ cards, flag, hideItineraryTourDetail }) => {

    const setDate = (startDate: any, endDate: any) => {
        let date = "-";
        if (!startDate && !endDate) {
            date = "-";
        }
        else if (startDate && !endDate) {
            date = `${moment(startDate).format("YYYY.MM.DD")}`;
        }
        else {
            date = `${moment(startDate).format("YYYY.MM.DD")} - ${moment(endDate).format("YYYY.MM.DD")}`;
        }

        return date;
    }

    return (
        <Modal show={flag} onHide={() => { hideItineraryTourDetail() }}
            dialogClassName="modal-80w singleitmodal"
            aria-labelledby="example-custom-modal-styling-title"

        >
            <Modal.Header closeButton className="p-0 mb-42">
                <Modal.Title id="">
                    <h6 className="font-30-bold">여행 코스 상세</h6>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="itinery_details_modal p-0">
                <Col className="overflow-table border-tabel-b1">
                    <Row className="">
                        <div className="d-flex">
                            <div className="yellow-bg-table font-18-bold">지역</div>
                            <div className="profile-table-td-input align-items-center">
                                <p className="mb-0 ">{cards?.region}</p>
                            </div>
                        </div>

                        <div className="d-flex">
                            <div className="yellow-bg-table font-18-bold">카테고리</div>
                            <div className="profile-table-td-input align-items-center">
                                <p className="mb-0 ">{cards?.category}</p>
                            </div>
                        </div>

                        <div className="d-flex">
                            <div className="yellow-bg-table font-18-bold">이름</div>
                            <div className="profile-table-td-input align-items-center">
                                <p className="mb-0 ">{cards?.name}</p>
                            </div>
                        </div>

                        <div className="d-flex">
                            <div className="yellow-bg-table font-18-bold">사진</div>
                            <div className="profile-table-td-input align-items-center py-4">
                                <div className="upload-pic">
                                    {
                                        cards?.image.map((image: any, i: any) => {
                                            return <img src={image} key={i} alt="" />
                                        })
                                    }
                                </div>
                            </div>
                        </div>

                        <div className="d-flex">
                            <div className="yellow-bg-table font-18-bold">기간</div>
                            <div className="profile-table-td-input align-items-center">
                                <p className="mb-0 ">{setDate(cards?.opening_date, cards?.closing_date)}</p>
                            </div>
                        </div>

                        <div className="d-flex">
                            <div className="yellow-bg-table font-18-bold">개요</div>
                            <div className="profile-table-td-input align-items-center py-4 px-2">
                                <div className="surmary-tour">
                                    {cards?.summary}
                                </div>
                            </div>
                        </div>

                        <div className="d-flex">
                            <div className=" yellow-bg-table font-18-bold">주소</div>
                            <div className="profile-table-td-input align-items-center">
                                <p className="mb-0 ">{cards?.address}</p>
                            </div>
                        </div>

                        <div className="d-flex">
                            <div className=" yellow-bg-table font-18-bold">홈페이지</div>
                            <div className="profile-table-td-input align-items-center">
                                <p className="mb-0 ">{cards?.website}</p>
                            </div>
                        </div>

                        <div className="d-flex">
                            <div className=" yellow-bg-table font-18-bold">전화번호</div>
                            <div className="profile-table-td-input align-items-center">
                                <p className="mb-0 ">{cards?.website}</p>
                            </div>
                        </div>

                        <div className="d-flex">
                            <div className="yellow-bg-table font-18-bold">가까운 대중교통</div>
                            <div className="profile-table-td-input align-items-center">
                                <p className="mb-0 ">{cards?.n_p_transportation} </p>
                            </div>
                        </div>

                    </Row>
                </Col>
            </Modal.Body>
        </Modal>
    )

}
export default ItineraryTourDetail;