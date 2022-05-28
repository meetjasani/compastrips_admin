import moment from "moment";
import React from "react";
import { useHistory } from 'react-router-dom'
import Buttons from "../../component/Buttons/Buttons";
import RemotePagination from "../../component/RemotePagination/RemotePagination";
import { hostedItinerary } from "./HostedItinery";

interface Props {
    data: hostedItinerary[];
    getItineraries: (page: any, sizePerPage: any) => void;
    totalSize?: number;
}

const HostedItineryList: React.FC<Props> = ({ data, getItineraries, totalSize }) => {

    // variabels and states
    const history = useHistory();
    
    // helper functions
    const HostedItineryList = (id: any) => {
        history.push(`/hosted-itinerary-details/${id}`);
    }


    const linkFollow = (cell: any, row: any, rowIndex: any, formatExtraData: any) => {
        return (
            <Buttons
                type="submit"
                children="관리"
                ButtonStyle="rounded-0 bg-custom-black"
                onClick={() => HostedItineryList(row.id)}
            />
        );
    }


    const DateFollow = (cell: any, row: any, rowIndex: any, formatExtraData: any) => {
        return (
            <div className="const-date">
                <p>{row.host_date[0].replace(/-/g, '.')} ({moment(row.host_date[0]).format('dddd')})</p>
                <p>{row.host_date[1].slice(0, 5)} {row.host_date[2].slice(0, 5)}</p>
            </div>
        );
    }

    const handleTableChange = (pagenumber: number, sizeperpage: number) => {
        getItineraries(pagenumber, sizeperpage)
    }

    const columns = [
        {
            dataField: "no_id",
            text: "No",
        },
        {
            dataField: "country",
            text: "국가",
        },
        {
            dataField: "region",
            text: "지역",
        },
        {
            dataField: "tour_title",
            text: "여행제목",
        },
        {
            dataField: "nickname",
            text: "닉네임",
        },
        {
            dataField: "host_date",
            text: "여행 일정",
            formatter: DateFollow,
        },
        {
            dataField: "vacancies",
            text: "잔여인원",
        },
        {
            dataField: "status",
            text: "진행 상태",
        },
        {
            dataField: "disclosure",
            text: "공개 상태",
        },
        {
            dataField: "registration_date",
            text: "등록일",
        },
        {
            dataField: "Manage",
            text: "작성일",
            formatter: linkFollow,
        },
    ];

    return (
        <>
            <div className="total-results d-flex">
                <div><h5 className="font-27-bold"> 총 <span className="span-color-pink"> {totalSize} </span> 개</h5></div>

                {/* <Buttons
                    type="submit"
                    children="등록"
                    ButtonStyle="Register-button ml-auto"
                    onClick={()=>{}}
                /> */}

            </div>

            <div className="App text-center host-itinerary-table">
                <RemotePagination
                    data={data}
                    columns={columns}
                    totalSize={totalSize ?? 0}
                    onTableChange={(page, sizePerPage) => handleTableChange(page, sizePerPage)}
                    pagesizedropdownflag
                />
                {/* <BootstrapTable
                    bootstrap4
                    keyField="id"
                    data={data}
                    columns={columns}
                    pagination={paginationFactory(options)}
                /> */}
            </div>
        </>
    );
}


export default HostedItineryList
