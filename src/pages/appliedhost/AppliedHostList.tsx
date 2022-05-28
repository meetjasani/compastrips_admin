import React from "react";
import { useHistory } from 'react-router-dom'
import Buttons from "../../component/Buttons/Buttons";
import RemotePagination from "../../component/RemotePagination/RemotePagination";
import { appliedHosting } from "./AppliedHost";

interface Props {
    data: appliedHosting[];
    getAppliedHosting: (page: any, sizePerPage: any) => void;
    totalSize?: number;
}

const AppliedHostList: React.FC<Props> = ({ data, getAppliedHosting, totalSize }) => {


    const history = useHistory();


    const RegisterFaq = (row: any) => {
        history.push(`/applied-Hosting-History/${row.id}`);
    }


    const linkFollow = (cell: any, row: any, rowIndex: any, formatExtraData: any) => {
        return (
            <Buttons
                type="submit"
                children="관리"
                ButtonStyle="rounded-0 bg-custom-black"
                onClick={() => RegisterFaq(row)}
            />
        );
    }


    const DateFollow = (cell: any, row: any, rowIndex: any, formatExtraData: any) => {
        var [application_date, accepted_date] = row.application_date.split(',');

        return (
            <div className="const-date">
                <p> {application_date.slice(0, 10)} {application_date.slice(11, 16)}/ </p>
                <p> {accepted_date !== "null" ? accepted_date.slice(0, 10) + " " + accepted_date.slice(11, 16) : "-"} </p>
            </div>
        );
    }

    const handleTableChange = (pagenumber: number, sizeperpage: number) => {
        getAppliedHosting(pagenumber, sizeperpage)
    }

    const columns = [
        {
            dataField: "no_id",
            text: "No",

        },
        {
            dataField: "name",
            text: "이름",

        },
        {
            dataField: "nick_name",
            text: "닉네임",

        },
        {
            dataField: "nationality",
            text: "국적",

        },
        {
            dataField: "gender",
            text: "성별",

        },
        {
            dataField: "age_group",
            text: "연령대",

        },
        {
            dataField: "tour_title",
            text: "여행 제목",

        },
        {
            dataField: "host",
            text: "호스트",

        },
        {
            dataField: "acceptance_status",
            text: "승인 상태",

        },
        {
            dataField: "application_date",
            text: "신청일 / 승인일",
            formatter: DateFollow,

        },
        {
            dataField: "Manage",
            text: "관리",
            formatter: linkFollow,

        },
    ];


    return (
        <>
            <div className="total-results d-flex">
                <div><h5 className="font-27-bold">총 <span className="span-color-pink"> {totalSize} </span> 개</h5></div>
            </div>

            <div className="App text-center applied-host-table">
                <RemotePagination
                    data={data}
                    columns={columns}
                    totalSize={totalSize ?? 0}
                    onTableChange={(page, sizePerPage) => handleTableChange(page, sizePerPage)}
                    pagesizedropdownflag
                />
                
            </div>

        </>
    );
}
export default AppliedHostList