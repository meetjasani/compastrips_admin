import React from "react";
import { useHistory } from 'react-router-dom'
import Buttons from "../../../component/Buttons/Buttons";
import RemotePagination from "../../../component/RemotePagination/RemotePagination";
import { notice } from "./Notice";

interface Props {
    data: notice[];
    getNotice: (page: any, sizePerPage: any) => void;
    totalSize?: number;
    ltineraryRegBtn?: any;
}

const NoticeList: React.FC<Props> = ({ data, getNotice, totalSize }) => {


    const history = useHistory();


    const RegisterNotice = (row: any) => {
        console.log("row", row);
        history.push(`/edit-notice/${row.id}`);
    }

    function priceFormatter(cell: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined, row: any) {

        return (
            <strong style={{ color: '#B931B8' }}>{cell}</strong>
        );
    }


    const linkFollow = (cell: any, row: any, rowIndex: any, formatExtraData: any) => {
        return (
            <Buttons
                type="submit"
                children="관리"
                ButtonStyle="rounded-0 bg-custom-black w-120px h-49"
                onClick={() => RegisterNotice(row)}
            />
        );
    }

    const language = (row: any) => {
        return <span className="language-mt">{row === "en" ? "영어" : "한국어"}</span>;
    }

    const gotoRegisterNotice = () => {
        history.push('register-notice')
    }

    const handleTableChange = (pagenumber: number, sizeperpage: number) => {
        getNotice(pagenumber, sizeperpage)
    }

    const columns = [
        {
            dataField: "no_id",
            text: "No",
        },
        {
            dataField: "title",
            text: "제목",
            formatter: priceFormatter,
        },
        {
            dataField: "views",
            text: "조회수",
        },
        {
            dataField: "registered_date",
            text: "작성일",
        },
        {
            dataField: "language",
            text: "언어",
            formatter: language,
        },
        {
            dataField: "Manage",
            text: "관리",
            formatter: linkFollow,
        },
    ];

    return (
        <>
            <div className="total-results  d-flex">
                <div><h5 className="font-27-bold">총 <span className="span-color-pink"> {totalSize} </span> 개</h5></div>

                <Buttons
                    type="submit"
                    children="등록"
                    ButtonStyle="Register-button ml-auto "
                    onClick={() => { gotoRegisterNotice() }}
                />

            </div>

            <div className="App text-center faq-table">

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
export default NoticeList