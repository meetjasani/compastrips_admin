import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router'
import Buttons from '../../component/Buttons/Buttons'
import { ApiGet } from '../../helper/API/ApiData'

const ItineraryMngDBReg = () => {

    // states
    const [courseData, setCourseData] = useState<any>({
        id: "",
        region: "",
        category: "",
        name: "",
        image: [],
        period: "",
        summary: "",
        address: "",
        website: "",
        mobile: "",
        transportation: "",
    })

    // helper funtions
    const { id }: any = useParams();

    const history = useHistory();

    const BacktoItineryDBList = () => {
        history.push('/Itinerary-Mng-db')
    }

    // useEffects
    useEffect(() => {
        ApiGet(`itinerary/tourcourse/${id}`).then((res: any) => {
            const data = {
                id: res.data.id,
                region: res.data.region_ko,
                category: res.data.category_ko,
                name: res.data.name_ko,
                image: res.data.image,
                period: res.data.opening_date == null || res.data.closing_date == null ? `-` : `${moment(res.data.opening_date).format("YYYY.MM.DD")} - ${moment(res.data.closing_date).format("YYYY.MM.DD")}`,
                summary: res.data.summary_ko,
                address: res.data.address_ko,
                website: res.data.website,
                mobile: res.data.mobile,
                transportation: res.data.n_p_transportation_ko,
            }

            setCourseData(data)
        })
            .catch((error) => {
                console.log(error);
            })
    }, [])

    return (
        <>
            <div className="col-12 p-0">
                <div className="bg-navigation">
                    <h2 className="text-white">여행 코스 DB 관리</h2>
                </div>
            </div>
            <div className="creator-table set-select set-line-height dbitinerary">
                <div className="center-box">
                    <div>

                        <div className="">


                            <div className="border-tabel-b1">
                                <div>

                                    <div className="d-flex">
                                        <div className=" yellow-bg-table font-18-bold">고유번호</div>
                                        <div className="profile-table-td-input align-items-center">
                                            <p className="mb-0 ">{courseData.id}</p>
                                        </div>
                                    </div>

                                    <div className="d-flex">
                                        <div className=" yellow-bg-table font-18-bold">지역</div>
                                        <div className="profile-table-td-input align-items-center">
                                            <p className="mb-0 ">{courseData.region}</p>
                                        </div>
                                    </div>

                                    <div className="d-flex">
                                        <div className=" yellow-bg-table font-18-bold">카테고리</div>
                                        <div className="profile-table-td-input align-items-center">
                                            <p className="mb-0 ">{courseData.category}</p>
                                        </div>
                                    </div>

                                    <div className="d-flex">
                                        <div className=" yellow-bg-table font-18-bold">이름</div>
                                        <div className="profile-table-td-input align-items-center">
                                            <p className="mb-0 ">{courseData.name}</p>
                                        </div>
                                    </div>


                                    <div className="d-flex">
                                        <div className=" yellow-bg-table font-18-bold">사진</div>
                                        <div className="profile-table-td-input align-items-center">
                                            <div className="upload-pic  d-custom-flex p-3 ">
                                                {
                                                    courseData.image.map((x: any) => {
                                                        return (
                                                            <div><img src={x} alt="" /></div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </div>
                                    </div>

                                    <div className="d-flex">
                                        <div className=" yellow-bg-table font-18-bold">기간</div>
                                        <div className="profile-table-td-input align-items-center">
                                            <p className="mb-0 ">{courseData.period}</p>
                                        </div>
                                    </div>

                                    <div className="d-flex">
                                        <div className="yellow-bg-table font-18-bold">개요</div>
                                        <div className="profile-table-td-input align-items-center py-4 px-2">
                                            <div className="surmary-tour pl-3">
                                                {courseData.summary}
                                            </div>
                                        </div>
                                    </div>


                                    <div className="d-flex">
                                        <div className=" yellow-bg-table font-18-bold">주소</div>
                                        <div className="profile-table-td-input align-items-center">
                                            <p className="mb-0 ">{courseData.address}</p>
                                        </div>
                                    </div>


                                    <div className="d-flex">
                                        <div className=" yellow-bg-table font-18-bold">홈페이지</div>
                                        <div className="profile-table-td-input align-items-center">
                                            <p className="mb-0 ">{courseData.website}</p>
                                        </div>
                                    </div>

                                    <div className="d-flex">
                                        <div className=" yellow-bg-table font-18-bold">전화번호</div>
                                        <div className="profile-table-td-input align-items-center">
                                            <p className="mb-0 ">{courseData.mobile}</p>
                                        </div>
                                    </div>

                                    <div className="d-flex">
                                        <div className=" yellow-bg-table font-18-bold">가까운 대중교통</div>
                                        <div className="profile-table-td-input align-items-center">
                                            <p className="mb-0 ">{courseData.transportation}</p>
                                        </div>
                                    </div>


                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="px-110 w-100">
                        <div className="text-center">
                            <Buttons
                                type="submit"
                                children="목록으로"
                                ButtonStyle="border-button font-22-bold"
                                onClick={BacktoItineryDBList} />

                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default ItineraryMngDBReg


