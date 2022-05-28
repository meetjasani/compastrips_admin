import React, { useEffect, useState } from 'react'

import { useHistory } from 'react-router'
import { ApiGet } from '../../helper/API/ApiData'
import Buttons from '../Buttons/Buttons'

function ReReviews() {
    interface LatestSet {
        Name: string,
        NickName: string,
        TourTitle: string,
        StarRating: number,
        RegDate: Date,
        Id: string,
    }

    const [tableData, setTableData] = useState<LatestSet[]>([])
    const history = useHistory();


    useEffect(() => {
        ApiGet('admin/reviews?flag=recent')
            .then((res: any) => {
                console.log(res);

                setTableData(res.data.map((x: any) => {
                    return {
                        Name: x.user.first_name + " " + x.user.last_name,
                        NickName: x.user.user_name,
                        TourTitle: x.hosting.itinerary.title,
                        StarRating: x.star,
                        RegDate: x.hosting.created_at.slice(0, 10) + " " + x.hosting.created_at.slice(11, 16),

                        Id: x.id
                    }
                }).slice(0, 5))
            })
    }, [])

    const viewMore = () => {
        // console.log('Latest settlement pending')
        history.push('/review-mang')
    }

    return (
        <>
            <div className="single-direct-table bottom-direct-table">
                <div className="align-items-center d-flex">
                    <div>
                        <h5 className="font-27-bold text-left">최근 등록 리뷰</h5>
                    </div>
                    <div className="ml-auto">
                        <Buttons type="" ButtonStyle="dash-bg-pink" onClick={() => { viewMore() }}> 더보기 </Buttons>
                    </div>
                </div>
                <div className="p-0">
                    <div className="overflow-table">
                        <table className="dashtable mt-3 custom-table-border">
                            <tr className="font-18-bold">
                                <th>이름</th>
                                <th>닉네임</th>
                                <th>여행 일정 제목</th>
                                <th>별점</th>
                                <th>등록 일시</th>
                            </tr>

                            {(tableData && tableData.length > 0) && tableData.map(item => {
                                return (
                                    <tr className="font-16-bold" key={item.Id}>
                                        <td className="w-86">{item.Name}</td>
                                        <td className="w-112">{item.NickName}</td>
                                        <td className="w-207">{item.TourTitle}</td>
                                        <td className="w-96">{item.StarRating}</td>
                                        <td className="w-140">{item.RegDate}</td>
                                    </tr>
                                )
                            }
                            )
                            }
                        </table>

                    </div>
                </div>
            </div>
        </>
    )
}

export default ReReviews
