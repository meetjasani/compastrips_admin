import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router';
import { ApiGet } from '../../helper/API/ApiData';
import Buttons from '../Buttons/Buttons'

function ReItineraries() {

    interface LatestSet {
        Country: string,
        Region: string,
        TourTitle: string,
        RegDate: Date,
        Id: string,
    }

    const [tableData, setTableData] = useState<LatestSet[]>([])
    const history = useHistory();


    useEffect(() => {
        ApiGet('admin/itinerary')
            .then((res: any) => {
                setTableData(res.data.map((x: any) => {
                    return {
                        Country: x.country,
                        Region: x.region,
                        TourTitle: x.title,
                        RegDate: x.created_at.slice(0, 10) + " " + x.created_at.slice(11, 16),
                        Id: x.id,
                    }
                }).slice(0, 5))
            })
    }, [])




    const viewMore = () => {
        // console.log('Latest settlement pending')
        history.push('/itinerary-management')

    }

    return (
        <>
            <div className=" single-direct-table bottom-direct-table">
                <div className="align-items-center d-flex">
                    <div>
                        <h5 className="font-27-bold text-left">최근 등록된 일정</h5>
                    </div>
                    <div className="ml-auto">
                        <Buttons type="" ButtonStyle="dash-bg-pink" onClick={() => { viewMore() }}> 더보기 </Buttons>
                    </div>
                </div>
                <div className="p-0">
                    <div className="overflow-table">
                        <table className="dashtable mt-3 custom-table-border">
                            <tr className="font-18-bold">
                                <th>국가</th>
                                <th>지역</th>
                                <th>여행 제목</th>
                                <th>등록 일시</th>
                            </tr>

                            {tableData && tableData.map(item => {
                                return (
                                    <tr className="font-16-bold" key={item.Id}>
                                        <td className="w-96">{item.Country}</td>
                                        <td className="w-130">{item.Region}</td>
                                        <td className="w-235">{item.TourTitle}</td>
                                        <td className="w-200">{item.RegDate}</td>

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

export default ReItineraries
