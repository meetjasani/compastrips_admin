import React, { useEffect, useState } from 'react'
import { Container, Row } from 'react-bootstrap'
import { ApiGet } from '../../helper/API/ApiData'

function TotalUserCount() {

    const [data, setData] = useState({
        allUser: 0,
        hostedItineraries: 0,
        hostingUsers: 0,
        totalItinerary: 0,
        totalTourcourse: 0,
    })

    useEffect(() => {
        ApiGet('admin/number')
            .then((res: any) => {
                setData(res.data) 
            })
    }, [])

    return (
        <>
            <Container fluid >
                <Row className="total-itinery-details">
                    <div className="h-35">
                        <h4 className="font-27-bold">Total</h4>
                    </div>
                    <div className="overflow-table mt-19">
                        <table className="total-count-table table-title-kor ">
                            <tr className="font-18-bold">
                                <th>전체 회원</th>
                                <th>호스팅 중인 회원</th>
                                <th>호스팅 중인 여행 일정</th>
                                <th>전체 여행 일정</th>
                                <th>전체 여행 DB </th>
                            </tr>
                            <tr className="font-16-bold">
                                <td className="w-231">{data.allUser}</td>
                                <td className="w-273">{data.hostedItineraries}</td>
                                <td className="w-294">{data.hostingUsers}</td>
                                <td className="w-320">{data.totalItinerary}</td>
                                <td className="w-281">{data.totalTourcourse}</td>
                            </tr>
                        </table>
                    </div>
                </Row>
            </Container>


        </>
    )
}

export default TotalUserCount
