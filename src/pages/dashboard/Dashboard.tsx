import React from 'react'
import { Container, Row } from 'react-bootstrap'
import "./dashboard.css"

import TotalUserCount from '../../component/Tables/TotalUserCount'
import ReHostItinerary from '../../component/Tables/ReHostItinerary'
import ReAppliedHost from '../../component/Tables/ReAppliedHost'
import ReReviews from '../../component/Tables/ReReviews'
import ReItineraries from '../../component/Tables/ReItineraries'

function Dashboard() {
    return (
        <>
            <div className="col-12 p-0">
                <div className="bg-navigation">
                    <h2 className="text-white">대시보드</h2>
                </div>
            </div>

            <Container fluid>
                <Row className="">
                    <TotalUserCount/>
                </Row>
            </Container>
               
            <Container fluid className="">
                <Row className="all-sort-table">
                    <ReHostItinerary />
                    <ReAppliedHost />
                    <ReReviews />
                    <ReItineraries/>
                </Row>
            </Container> 

               
            
        </>
    )
}

export default Dashboard
