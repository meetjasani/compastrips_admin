import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { ApiGet } from '../../helper/API/ApiData'
import Buttons from '../Buttons/Buttons'

function ReAppliedHost() {

    // const LatestSet = [
    //     {
    //         Name: "이재영",
    //         NickName: "jaeyojae",
    //         TourTitle: "경국사에서 템플스테이",
    //         RegDate: "YYYY-MM-DD HH:MM",
            
    //     },

    //     {
    //         Name: "윤정한",
    //         NickName: "hanihae",
    //         TourTitle: "경국사에서 템플스테이",
    //         RegDate: "YYYY-MM-DD HH:MM",
    //     },
    // ];
    interface LatestSet {
        Name: string,
        NickName: string,
        TourTitle: string,
        RegDate: Date,
        Id:string,
    }

    const [tableData, setTableData] = useState<LatestSet[]>([])
    const history = useHistory();

    useEffect(() => {
        ApiGet('admin/appliedParticipant')
        .then((res:any)=> {
            console.log("ress", res.data);            
            setTableData(res.data.map((x: any) => {
                return {
                    Name: x.user.first_name+" "+x.user.last_name ,
                    NickName: x.user.user_name,
                    TourTitle: x.hosting.itinerary.title,
                    RegDate: x.requested_at.slice(0, 10) + " " + x.requested_at.slice(11, 16),
                    Id:x.id
                }
            }).slice(0,5))
        })
    }, [])

    const viewMore = () => {
        history.push('/applied-host')
    }
   
    return (
        <>
        <div className="single-direct-table">
            <div className="align-items-center d-flex">
                <div>
                    <h5 className="font-27-bold text-left">최근 여행 참석 신청</h5>
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
                        <th>여행 제목</th>
                        <th>등록 일시</th>
                    </tr>

                    {tableData && tableData.map(item => {
                        return (
                            <tr className="font-16-bold" key={item.Id}>
                                <td className="w-96">{item.Name}</td>
                                <td className="w-130">{item.NickName}</td>
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

export default ReAppliedHost

